"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Plus,
  Trash2,
  Eye,
  ChevronDown,
  Settings2,
  LayoutGrid,
  Monitor,
  PanelLeft,
  Type,
  Image as ImageIcon,
  X,
  Paintbrush,
  StickyNote,
  Bookmark,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContentTheme } from "@/data/types";
import { WireframeBlockId } from "@/data/wireframe-types";
import { WireframeBlock, wireframeBlockMeta } from "@/components/wireframe-blocks";
import { allPages } from "@/data/pages";
import { StyleGuide, defaultStyleGuide, StyleGuidePanel } from "./style-guide";
import { StyledPreview } from "./styled-preview";
import { ImageUpload } from "./image-upload";
import { SaveAsTemplateDialog, TemplateLibrary } from "./page-template-library";

// --- Content item types per block category ---

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  /** Extra field: stat value, step number, quote, etc. */
  extra: string;
}

function emptyItem(): ContentItem {
  return { id: crypto.randomUUID(), title: "", description: "", imageUrl: "", extra: "" };
}

export interface SectionContent {
  heading: string;
  subheading: string;
  body: string;
  ctaText: string;
  backgroundImageUrl: string;
  items: ContentItem[];
}

const emptySectionContent: SectionContent = {
  heading: "",
  subheading: "",
  body: "",
  ctaText: "",
  backgroundImageUrl: "",
  items: [],
};

/** What the item fields mean for each block category */
function itemFieldLabels(blockId: WireframeBlockId): {
  titleLabel: string;
  descLabel: string;
  extraLabel: string | null;
  imageLabel: string | null;
  noun: string;
} {
  const cat = wireframeBlockMeta[blockId]?.category || "";
  switch (cat) {
    case "Cards":
      return { titleLabel: "Card title", descLabel: "Card description", extraLabel: null, imageLabel: "Image URL", noun: "Card" };
    case "Lists":
      if (blockId === "numbered-steps")
        return { titleLabel: "Step title", descLabel: "Step description", extraLabel: "Step number", imageLabel: null, noun: "Step" };
      if (blockId === "icon-list")
        return { titleLabel: "Item title", descLabel: "Item description", extraLabel: "Icon name", imageLabel: null, noun: "Item" };
      return { titleLabel: "Item title", descLabel: "Item content", extraLabel: null, imageLabel: null, noun: "Item" };
    case "Timeline":
      return { titleLabel: "Milestone title", descLabel: "Description", extraLabel: "Date / year", imageLabel: null, noun: "Milestone" };
    case "Tabs":
      return { titleLabel: "Tab label", descLabel: "Tab content", extraLabel: null, imageLabel: null, noun: "Tab" };
    case "Carousel":
      return { titleLabel: "Slide title", descLabel: "Slide description", extraLabel: null, imageLabel: "Image URL", noun: "Slide" };
    case "Testimonials":
      return { titleLabel: "Person name", descLabel: "Title / company", extraLabel: "Quote", imageLabel: "Photo URL", noun: "Testimonial" };
    case "Logos":
      return { titleLabel: "Company name", descLabel: "", extraLabel: null, imageLabel: "Logo URL", noun: "Logo" };
    case "Stats":
      return { titleLabel: "Label", descLabel: "", extraLabel: "Value", imageLabel: null, noun: "Stat" };
    case "Team":
      return { titleLabel: "Name", descLabel: "Role / title", extraLabel: "Bio", imageLabel: "Photo URL", noun: "Member" };
    case "Forms":
      return { titleLabel: "Field label", descLabel: "Placeholder", extraLabel: "Field type", imageLabel: null, noun: "Field" };
    case "Misc":
      if (blockId === "faq-accordion" || blockId === "accordion-list")
        return { titleLabel: "Question", descLabel: "Answer", extraLabel: null, imageLabel: null, noun: "FAQ" };
      if (blockId === "comparison-table")
        return { titleLabel: "Feature", descLabel: "Plan A", extraLabel: "Plan B", imageLabel: null, noun: "Row" };
      if (blockId === "badge-display")
        return { titleLabel: "Badge label", descLabel: "", extraLabel: null, imageLabel: "Badge image URL", noun: "Badge" };
      if (blockId === "filter-grid")
        return { titleLabel: "Item title", descLabel: "Category", extraLabel: null, imageLabel: "Image URL", noun: "Item" };
      return { titleLabel: "Title", descLabel: "Description", extraLabel: null, imageLabel: null, noun: "Item" };
    case "Media":
      return { titleLabel: "Caption", descLabel: "Description", extraLabel: null, imageLabel: "Media URL", noun: "Media" };
    case "Maps":
      return { titleLabel: "Location name", descLabel: "Address", extraLabel: "Phone", imageLabel: null, noun: "Location" };
    default:
      return { titleLabel: "Title", descLabel: "Description", extraLabel: null, imageLabel: null, noun: "Item" };
  }
}

/** Does this block type benefit from repeatable items? */
function blockSupportsItems(blockId: WireframeBlockId): boolean {
  const cat = wireframeBlockMeta[blockId]?.category || "";
  return [
    "Cards", "Lists", "Timeline", "Tabs", "Carousel",
    "Testimonials", "Logos", "Stats", "Team", "Forms", "Media", "Maps", "Misc",
  ].includes(cat);
}

/** Suggested default item count for a block type */
function defaultItemCount(blockId: WireframeBlockId): number {
  const cat = wireframeBlockMeta[blockId]?.category || "";
  if (cat === "Stats") return 4;
  if (cat === "Logos") return 6;
  if (blockId.includes("4-col")) return 4;
  if (blockId.includes("2-col")) return 2;
  return 3;
}

// --- Input component helper ---

const inputCls = "w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30";

function TextInput({ value, onChange, placeholder, className = "" }: {
  value: string; onChange: (v: string) => void; placeholder: string; className?: string;
}) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputCls} ${className}`}
    />
  );
}

// --- BuilderSection ---

export interface BuilderSection {
  instanceId: string;
  themeId: string;
  themeName: string;
  selectedBlockId: WireframeBlockId;
  availableBlocks: { name: string; wireframeId: WireframeBlockId }[];
  content: SectionContent;
  /** Content direction notes shown alongside the wireframe */
  directionNotes: string;
}

function createSectionFromTheme(theme: ContentTheme): BuilderSection {
  return {
    instanceId: `${theme.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    themeId: theme.id,
    themeName: theme.name,
    selectedBlockId: theme.componentOptions[0]?.wireframeId || "hero-centered",
    availableBlocks: theme.componentOptions,
    content: { ...emptySectionContent, items: [] },
    directionNotes: "",
  };
}

// --- Content editor panel ---

function ContentEditor({
  section,
  onUpdate,
}: {
  section: BuilderSection;
  onUpdate: (id: string, patch: Partial<SectionContent>) => void;
}) {
  const { content, selectedBlockId, instanceId } = section;
  const supportsItems = blockSupportsItems(selectedBlockId);
  const labels = itemFieldLabels(selectedBlockId);

  const updateField = (field: keyof SectionContent, value: string) =>
    onUpdate(instanceId, { [field]: value });

  const updateItem = (itemId: string, patch: Partial<ContentItem>) => {
    onUpdate(instanceId, {
      items: content.items.map((it) =>
        it.id === itemId ? { ...it, ...patch } : it
      ),
    });
  };

  const addItem = () => {
    onUpdate(instanceId, { items: [...content.items, emptyItem()] });
  };

  const removeItem = (itemId: string) => {
    onUpdate(instanceId, { items: content.items.filter((it) => it.id !== itemId) });
  };

  const seedItems = () => {
    const count = defaultItemCount(selectedBlockId);
    const newItems = Array.from({ length: count }, () => emptyItem());
    onUpdate(instanceId, { items: [...content.items, ...newItems] });
  };

  return (
    <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
      {/* Section-level fields */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-1.5">Section content</p>
        <div className="space-y-1.5">
          <TextInput value={content.heading} onChange={(v) => updateField("heading", v)} placeholder="Heading" />
          <TextInput value={content.subheading} onChange={(v) => updateField("subheading", v)} placeholder="Subheading" />
          <textarea
            placeholder="Body text"
            value={content.body}
            onChange={(e) => updateField("body", e.target.value)}
            rows={2}
            className={`${inputCls} resize-none`}
          />
          <TextInput value={content.ctaText} onChange={(v) => updateField("ctaText", v)} placeholder="Button / CTA text" />
          <ImageUpload
            value={content.backgroundImageUrl}
            onChange={(v) => updateField("backgroundImageUrl", v)}
            placeholder="Background / section image"
            compact
          />
        </div>
      </div>

      {/* Repeatable items */}
      {supportsItems && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-medium text-muted-foreground">
              {labels.noun}s ({content.items.length})
            </p>
            <div className="flex items-center gap-1">
              {content.items.length === 0 && (
                <button
                  onClick={seedItems}
                  className="text-xs text-primary hover:underline"
                >
                  Add {defaultItemCount(selectedBlockId)}
                </button>
              )}
              <button
                onClick={addItem}
                className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Plus className="h-3 w-3" /> Add
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {content.items.map((item, idx) => (
              <div key={item.id} className="rounded-md border border-border p-2 space-y-1.5 bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {labels.noun} {idx + 1}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground/50 hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <TextInput
                  value={item.title}
                  onChange={(v) => updateItem(item.id, { title: v })}
                  placeholder={labels.titleLabel}
                />
                {labels.descLabel && (
                  <TextInput
                    value={item.description}
                    onChange={(v) => updateItem(item.id, { description: v })}
                    placeholder={labels.descLabel}
                  />
                )}
                {labels.extraLabel && (
                  <TextInput
                    value={item.extra}
                    onChange={(v) => updateItem(item.id, { extra: v })}
                    placeholder={labels.extraLabel}
                  />
                )}
                {labels.imageLabel && (
                  <ImageUpload
                    value={item.imageUrl}
                    onChange={(v) => updateItem(item.id, { imageUrl: v })}
                    placeholder={labels.imageLabel}
                    compact
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SortableSection({
  section,
  onRemove,
  onChangeBlock,
  onUpdateContent,
  onUpdateNotes,
  onDuplicate,
  isSelected,
  onSelect,
}: {
  section: BuilderSection;
  onRemove: (id: string) => void;
  onChangeBlock: (id: string, blockId: WireframeBlockId) => void;
  onUpdateContent: (id: string, patch: Partial<SectionContent>) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onDuplicate: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.instanceId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const meta = wireframeBlockMeta[section.selectedBlockId];

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className={`transition-all cursor-pointer ${
          isDragging ? "shadow-xl ring-2 ring-primary/30" : ""
        } ${isSelected ? "ring-2 ring-primary" : ""}`}
        onClick={() => onSelect(section.instanceId)}
      >
        <CardHeader className="py-3 px-4">
          <div className="flex items-center gap-2">
            <button
              className="cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground transition-colors touch-none"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm">{section.themeName}</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {meta?.category || "block"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {meta?.label || section.selectedBlockId}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowContent(!showContent);
                  if (!showContent) { setShowOptions(false); setShowNotes(false); }
                }}
                title="Edit content"
              >
                <Type className={`h-3.5 w-3.5 ${(section.content.heading || section.content.items.length > 0) ? "text-primary" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotes(!showNotes);
                  if (!showNotes) { setShowContent(false); setShowOptions(false); }
                }}
                title="Direction notes"
              >
                <StickyNote className={`h-3.5 w-3.5 ${section.directionNotes ? "text-amber-500" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowOptions(!showOptions);
                  if (!showOptions) { setShowContent(false); setShowNotes(false); }
                }}
                title="Change variant"
              >
                {showOptions ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <Settings2 className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(section.instanceId);
                }}
                title="Duplicate section"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(section.instanceId);
                }}
                className="text-destructive hover:text-destructive"
                title="Remove section"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        {showContent && (
          <CardContent className="pt-0 pb-3 px-4 border-t">
            <div className="mt-2">
              <ContentEditor section={section} onUpdate={onUpdateContent} />
            </div>
          </CardContent>
        )}
        {showNotes && (
          <CardContent className="pt-0 pb-3 px-4 border-t" onClick={(e) => e.stopPropagation()}>
            <p className="text-xs font-medium text-muted-foreground mb-1.5 mt-2 flex items-center gap-1">
              <StickyNote className="h-3 w-3" /> Content Direction Notes
            </p>
            <textarea
              placeholder="Notes for this section: content direction, what copy to write, where CTAs link, client feedback, etc."
              value={section.directionNotes}
              onChange={(e) => onUpdateNotes(section.instanceId, e.target.value)}
              rows={4}
              className={`${inputCls} resize-none text-xs`}
            />
          </CardContent>
        )}
        {showOptions && (
          <CardContent className="pt-0 pb-3 px-4 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-2 mt-2">
              Component variant:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {section.availableBlocks.map((block) => (
                <button
                  key={block.wireframeId}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChangeBlock(section.instanceId, block.wireframeId);
                  }}
                  className={`rounded-lg border p-2 text-left transition-all hover:border-primary/50 ${
                    section.selectedBlockId === block.wireframeId
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border"
                  }`}
                >
                  <div className="mb-1.5 rounded bg-muted/50 p-1">
                    <WireframeBlock
                      blockId={block.wireframeId}
                      className="w-full h-auto text-muted-foreground/60"
                    />
                  </div>
                  <p className="text-xs font-medium truncate">{block.name}</p>
                </button>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

function hasContent(content: SectionContent): boolean {
  return !!(content.heading || content.subheading || content.body || content.ctaText || content.items.length > 0 || content.backgroundImageUrl);
}

function ImageOrPlaceholder({ url, alt, className }: { url?: string; alt?: string; className: string }) {
  if (url) {
    return <img src={url} alt={alt || ""} className={`${className} object-cover`} />;
  }
  return (
    <div className={`${className} bg-muted/30 flex items-center justify-center`}>
      <ImageIcon className="h-5 w-5 text-muted-foreground/30" />
    </div>
  );
}

function SectionHeading({ content, centered = false }: { content: SectionContent; centered?: boolean }) {
  return (
    <>
      {content.heading && (
        <h3 className={`text-lg font-bold text-foreground mb-1 ${centered ? "text-center" : ""}`}>
          {content.heading}
        </h3>
      )}
      {content.subheading && (
        <p className={`text-sm text-muted-foreground mb-4 ${centered ? "text-center max-w-md mx-auto" : ""}`}>
          {content.subheading}
        </p>
      )}
    </>
  );
}

function SectionPreview({ section }: { section: BuilderSection }) {
  const { content, selectedBlockId } = section;
  const cat = wireframeBlockMeta[selectedBlockId]?.category || "";
  const has = hasContent(content);

  if (!has) {
    return (
      <WireframeBlock
        blockId={selectedBlockId}
        className="w-full h-auto text-muted-foreground/40"
      />
    );
  }

  const isSplit = selectedBlockId.includes("split") || selectedBlockId.includes("image-right") || selectedBlockId.includes("image-left");
  const isCentered = selectedBlockId.includes("centered") || selectedBlockId.includes("full-width");
  const items = content.items;

  // ====== HERO ======
  if (cat === "Hero") {
    const bgStyle = content.backgroundImageUrl
      ? { backgroundImage: `url(${content.backgroundImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
      : {};
    return (
      <div className={`relative ${isSplit ? "flex items-center gap-8" : ""}`} style={bgStyle}>
        {content.backgroundImageUrl && <div className="absolute inset-0 bg-background/70" />}
        <div className={`relative ${isSplit ? "flex-1 py-12 px-8" : "py-16 px-8"} ${isCentered && !isSplit ? "text-center" : ""}`}>
          {content.heading && (
            <h2 className={`text-2xl font-bold tracking-tight text-foreground mb-2 ${isCentered && !isSplit ? "mx-auto max-w-lg" : "max-w-md"}`}>
              {content.heading}
            </h2>
          )}
          {content.subheading && (
            <p className={`text-base text-muted-foreground mb-4 ${isCentered && !isSplit ? "mx-auto max-w-md" : "max-w-sm"}`}>
              {content.subheading}
            </p>
          )}
          {content.body && (
            <p className={`text-sm text-muted-foreground/80 mb-5 ${isCentered && !isSplit ? "mx-auto max-w-md" : "max-w-sm"}`}>
              {content.body}
            </p>
          )}
          {content.ctaText && (
            <div className={isCentered && !isSplit ? "flex justify-center" : ""}>
              <span className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                {content.ctaText}
              </span>
            </div>
          )}
        </div>
        {isSplit && (
          <div className="relative flex-1 m-4">
            <ImageOrPlaceholder url={content.backgroundImageUrl} className="rounded-lg aspect-[4/3] w-full" />
          </div>
        )}
      </div>
    );
  }

  // ====== CTA ======
  if (cat === "CTA") {
    return (
      <div className={`py-12 px-8 bg-muted/20 rounded-lg ${isCentered ? "text-center" : isSplit ? "flex items-center gap-8" : ""}`}>
        <div className={isSplit ? "flex-1" : ""}>
          {content.heading && (
            <h3 className={`text-xl font-bold text-foreground mb-2 ${isCentered ? "mx-auto max-w-lg" : "max-w-md"}`}>{content.heading}</h3>
          )}
          {content.subheading && (
            <p className={`text-sm text-muted-foreground mb-4 ${isCentered ? "mx-auto max-w-md" : "max-w-sm"}`}>{content.subheading}</p>
          )}
          {content.ctaText && (
            <div className={isCentered ? "flex justify-center" : ""}>
              <span className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">{content.ctaText}</span>
            </div>
          )}
        </div>
        {selectedBlockId === "cta-with-form" && (
          <div className="flex-1 border rounded-lg p-6 bg-card">
            <div className="space-y-3">
              {items.length > 0 ? items.map((item) => (
                <div key={item.id}>
                  <label className="text-xs text-muted-foreground mb-1 block">{item.title || "Field"}</label>
                  <div className="h-8 rounded border bg-muted/30" />
                </div>
              )) : (
                <>
                  <div className="h-8 rounded border bg-muted/30" />
                  <div className="h-8 rounded border bg-muted/30" />
                </>
              )}
              <span className="block w-full rounded-lg bg-primary py-2 text-center text-sm font-medium text-primary-foreground">
                {content.ctaText || "Submit"}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ====== CARDS ======
  if (cat === "Cards") {
    const cols = selectedBlockId.includes("4-col") ? 4 : selectedBlockId.includes("2-col") ? 2 : 3;
    const isIcon = selectedBlockId.includes("icon");
    const hasItemContent = items.some((it) => it.title || it.description);
    const displayItems = hasItemContent ? items : Array.from({ length: cols }, (_, i) => ({ id: String(i), title: "", description: "", imageUrl: "", extra: "" }));

    return (
      <div className="py-8 px-8">
        <SectionHeading content={content} centered />
        <div className={`grid gap-4 ${cols === 4 ? "grid-cols-4" : cols === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
          {displayItems.map((item, i) => (
            <div key={item.id} className="rounded-lg border bg-card p-4">
              {isIcon ? (
                <div className="h-10 w-10 rounded-full bg-primary/10 mb-3 flex items-center justify-center">
                  <span className="text-xs text-primary font-bold">{item.title?.charAt(0) || (i + 1)}</span>
                </div>
              ) : (
                <ImageOrPlaceholder url={item.imageUrl} className="w-full h-24 rounded mb-3" alt={item.title} />
              )}
              {item.title ? (
                <p className="text-sm font-medium mb-1">{item.title}</p>
              ) : (
                <div className="h-3 rounded bg-muted/40 mb-2 w-3/4" />
              )}
              {item.description ? (
                <p className="text-xs text-muted-foreground">{item.description}</p>
              ) : (
                <div className="h-2 rounded bg-muted/20 w-full" />
              )}
            </div>
          ))}
        </div>
        {content.body && <p className="text-xs text-muted-foreground mt-4 text-center">{content.body}</p>}
      </div>
    );
  }

  // ====== LISTS / ACCORDIONS / FAQ ======
  if (cat === "Lists" || selectedBlockId === "faq-accordion") {
    const isSteps = selectedBlockId === "numbered-steps";
    return (
      <div className="py-8 px-8">
        <SectionHeading content={content} />
        <div className="space-y-2">
          {items.length > 0 ? items.map((item, i) => (
            <div key={item.id} className="rounded-lg border bg-card p-4">
              <div className="flex items-start gap-3">
                {isSteps && (
                  <span className="flex-shrink-0 h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {item.extra || i + 1}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.title || `Item ${i + 1}`}</p>
                  {item.description && <p className="text-xs text-muted-foreground mt-1">{item.description}</p>}
                </div>
              </div>
            </div>
          )) : (
            Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-3">
                  {isSteps && <span className="flex-shrink-0 h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{i + 1}</span>}
                  <div className="h-3 rounded bg-muted/40 w-2/3" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // ====== TIMELINE ======
  if (cat === "Timeline") {
    const isHorizontal = selectedBlockId === "timeline-horizontal";
    return (
      <div className="py-8 px-8">
        <SectionHeading content={content} centered />
        {isHorizontal ? (
          <div className="flex items-start gap-6 overflow-x-auto pb-2">
            {(items.length > 0 ? items : Array.from({ length: 3 }, () => ({ id: "", title: "", description: "", extra: "", imageUrl: "" }))).map((item, i) => (
              <div key={item.id || i} className="flex-shrink-0 w-40 text-center">
                <div className="h-3 w-3 rounded-full bg-primary mx-auto mb-2" />
                <p className="text-xs font-medium text-primary mb-1">{item.extra || `${2020 + i}`}</p>
                <p className="text-sm font-medium">{item.title || `Milestone ${i + 1}`}</p>
                {item.description && <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="relative pl-8 space-y-6">
            <div className="absolute left-3 top-1 bottom-1 w-px bg-border" />
            {(items.length > 0 ? items : Array.from({ length: 3 }, () => ({ id: "", title: "", description: "", extra: "", imageUrl: "" }))).map((item, i) => (
              <div key={item.id || i} className="relative">
                <div className="absolute -left-5 top-1 h-3 w-3 rounded-full bg-primary" />
                <p className="text-xs font-medium text-primary mb-0.5">{item.extra || `${2020 + i}`}</p>
                <p className="text-sm font-medium">{item.title || `Milestone ${i + 1}`}</p>
                {item.description && <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ====== TABS ======
  if (cat === "Tabs") {
    const isVertical = selectedBlockId === "tabs-vertical";
    const displayItems = items.length > 0 ? items : [
      { id: "1", title: "Tab 1", description: "Tab content goes here.", extra: "", imageUrl: "" },
      { id: "2", title: "Tab 2", description: "", extra: "", imageUrl: "" },
      { id: "3", title: "Tab 3", description: "", extra: "", imageUrl: "" },
    ];
    return (
      <div className="py-8 px-8">
        <SectionHeading content={content} />
        <div className={isVertical ? "flex gap-4" : ""}>
          <div className={`flex ${isVertical ? "flex-col gap-1" : "gap-1 border-b mb-4"}`}>
            {displayItems.map((item, i) => (
              <span key={item.id} className={`px-3 py-1.5 text-xs font-medium rounded-t ${i === 0 ? "bg-card border border-b-0 text-foreground" : "text-muted-foreground"}`}>
                {item.title || `Tab ${i + 1}`}
              </span>
            ))}
          </div>
          <div className="flex-1 rounded-b border p-4 bg-card">
            <p className="text-sm text-muted-foreground">
              {displayItems[0]?.description || "Tab content goes here."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ====== TESTIMONIALS ======
  if (cat === "Testimonials") {
    const isVideo = selectedBlockId === "testimonials-video";
    return (
      <div className="py-8 px-8">
        <SectionHeading content={content} centered />
        {items.length > 0 ? (
          <div className={`grid gap-4 ${items.length === 1 ? "grid-cols-1 max-w-lg mx-auto" : items.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
            {items.map((item) => (
              <div key={item.id} className="rounded-lg border bg-card p-5">
                {item.extra && <p className="text-sm text-muted-foreground italic mb-3">&ldquo;{item.extra}&rdquo;</p>}
                <div className="flex items-center gap-3 mt-auto">
                  {isVideo ? (
                    <ImageOrPlaceholder url={item.imageUrl} className="h-10 w-10 rounded-full flex-shrink-0" alt={item.title} />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                      {item.title?.charAt(0) || "?"}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-lg mx-auto rounded-lg border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground italic">&ldquo;Add testimonials using the content editor.&rdquo;</p>
          </div>
        )}
      </div>
    );
  }

  // ====== STATS ======
  if (cat === "Stats") {
    return (
      <div className="py-8 px-8 bg-muted/20 rounded-lg">
        <SectionHeading content={content} centered />
        <div className={`grid gap-6 ${items.length === 4 ? "grid-cols-4" : items.length === 2 ? "grid-cols-2" : "grid-cols-3"} text-center`}>
          {(items.length > 0 ? items : Array.from({ length: 4 }, () => ({ id: "", title: "", description: "", extra: "", imageUrl: "" }))).map((item, i) => (
            <div key={item.id || i}>
              <p className="text-2xl font-bold text-foreground">{item.extra || "—"}</p>
              <p className="text-sm text-muted-foreground mt-1">{item.title || `Stat ${i + 1}`}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ====== TEAM ======
  if (cat === "Team") {
    const isFeatured = selectedBlockId === "team-featured";
    if (isFeatured && items.length > 0) {
      const person = items[0];
      return (
        <div className="py-8 px-8 flex items-center gap-8">
          <ImageOrPlaceholder url={person.imageUrl} className="w-48 h-48 rounded-lg flex-shrink-0" alt={person.title} />
          <div>
            <p className="text-xl font-bold">{person.title || "Team Member"}</p>
            {person.description && <p className="text-sm text-primary mb-2">{person.description}</p>}
            {person.extra && <p className="text-sm text-muted-foreground">{person.extra}</p>}
          </div>
        </div>
      );
    }
    return (
      <div className="py-8 px-8">
        <SectionHeading content={content} centered />
        <div className={`grid gap-6 ${items.length === 4 ? "grid-cols-4" : "grid-cols-3"}`}>
          {(items.length > 0 ? items : Array.from({ length: 3 }, () => ({ id: "", title: "", description: "", extra: "", imageUrl: "" }))).map((item, i) => (
            <div key={item.id || i} className="text-center">
              <ImageOrPlaceholder url={item.imageUrl} className="w-24 h-24 rounded-full mx-auto mb-3" alt={item.title} />
              <p className="text-sm font-medium">{item.title || `Member ${i + 1}`}</p>
              {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ====== LOGOS ======
  if (cat === "Logos") {
    return (
      <div className="py-8 px-8">
        <SectionHeading content={content} centered />
        <div className="flex flex-wrap items-center justify-center gap-6">
          {(items.length > 0 ? items : Array.from({ length: 6 }, () => ({ id: "", title: "", description: "", extra: "", imageUrl: "" }))).map((item, i) => (
            <div key={item.id || i} className="flex items-center justify-center">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title || `Logo ${i + 1}`} className="h-10 max-w-[120px] object-contain" />
              ) : (
                <div className="h-10 w-24 rounded bg-muted/40 flex items-center justify-center">
                  <span className="text-[10px] text-muted-foreground/50">{item.title || `Logo ${i + 1}`}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ====== MAPS ======
  if (cat === "Maps") {
    return (
      <div className="py-8 px-8">
        <SectionHeading content={content} />
        <div className="rounded-lg bg-muted/20 border h-48 flex items-center justify-center mb-4">
          <span className="text-sm text-muted-foreground/40">Map placeholder</span>
        </div>
        {items.length > 0 && (
          <div className="grid gap-3 grid-cols-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-lg border bg-card p-3">
                <p className="text-sm font-medium">{item.title}</p>
                {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                {item.extra && <p className="text-xs text-muted-foreground">{item.extra}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ====== FORMS ======
  if (cat === "Forms") {
    return (
      <div className="py-8 px-8">
        <SectionHeading content={content} />
        <div className={`max-w-md ${isCentered ? "mx-auto" : ""}`}>
          <div className="rounded-lg border bg-card p-6 space-y-3">
            {items.length > 0 ? items.map((item) => (
              <div key={item.id}>
                <label className="text-xs font-medium text-foreground mb-1 block">{item.title || "Field"}</label>
                {item.extra === "textarea" ? (
                  <div className="h-16 rounded border bg-muted/20" />
                ) : (
                  <div className="h-9 rounded border bg-muted/20 flex items-center px-2.5">
                    <span className="text-xs text-muted-foreground/40">{item.description || ""}</span>
                  </div>
                )}
              </div>
            )) : (
              <>
                <div className="h-9 rounded border bg-muted/20" />
                <div className="h-9 rounded border bg-muted/20" />
                <div className="h-16 rounded border bg-muted/20" />
              </>
            )}
            <span className="block w-full rounded-lg bg-primary py-2 text-center text-sm font-medium text-primary-foreground">
              {content.ctaText || "Submit"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ====== MEDIA ======
  if (cat === "Media") {
    return (
      <div className="py-8 px-8">
        <SectionHeading content={content} centered />
        {items.length > 0 ? (
          <div className={`grid gap-3 ${items.length <= 2 ? "grid-cols-2" : "grid-cols-3"}`}>
            {items.map((item) => (
              <div key={item.id} className="rounded-lg overflow-hidden border">
                <ImageOrPlaceholder url={item.imageUrl} className="w-full aspect-video" alt={item.title} />
                {item.title && <p className="text-xs text-muted-foreground p-2">{item.title}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden max-w-2xl mx-auto">
            <ImageOrPlaceholder url={content.backgroundImageUrl} className="w-full aspect-video" />
          </div>
        )}
      </div>
    );
  }

  // ====== COMPARISON TABLE (Misc) ======
  if (selectedBlockId === "comparison-table" && items.length > 0) {
    return (
      <div className="py-8 px-8">
        <SectionHeading content={content} centered />
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left p-3 font-medium">Feature</th>
                <th className="text-left p-3 font-medium">Plan A</th>
                <th className="text-left p-3 font-medium">Plan B</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3">{item.title}</td>
                  <td className="p-3 text-muted-foreground">{item.description}</td>
                  <td className="p-3 text-muted-foreground">{item.extra}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ====== SPLIT TEXT + IMAGE ======
  if (isSplit) {
    const imgRight = selectedBlockId.includes("image-right") || selectedBlockId.includes("split");
    return (
      <div className={`flex items-center gap-8 py-8 px-8 ${imgRight ? "" : "flex-row-reverse"}`}>
        <div className="flex-1">
          {content.heading && <h3 className="text-lg font-bold text-foreground mb-2">{content.heading}</h3>}
          {content.subheading && <p className="text-sm text-muted-foreground mb-3">{content.subheading}</p>}
          {content.body && <p className="text-sm text-muted-foreground/80 mb-4">{content.body}</p>}
          {content.ctaText && (
            <span className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">{content.ctaText}</span>
          )}
        </div>
        <div className="flex-1">
          <ImageOrPlaceholder url={content.backgroundImageUrl} className="rounded-lg aspect-[4/3] w-full" />
        </div>
      </div>
    );
  }

  // ====== DEFAULT / GENERIC ======
  return (
    <div className={`py-8 px-8 ${isCentered ? "text-center" : ""}`}>
      {content.heading && (
        <h3 className={`text-lg font-bold text-foreground mb-2 ${isCentered ? "mx-auto max-w-lg" : ""}`}>{content.heading}</h3>
      )}
      {content.subheading && (
        <p className={`text-sm text-muted-foreground mb-3 ${isCentered ? "mx-auto max-w-md" : ""}`}>{content.subheading}</p>
      )}
      {content.body && (
        <p className={`text-sm text-muted-foreground/80 mb-4 ${isCentered ? "mx-auto max-w-md" : "max-w-prose"}`}>{content.body}</p>
      )}
      {items.length > 0 && (
        <div className="space-y-2 mt-4">
          {items.map((item, i) => (
            <div key={item.id} className="flex items-start gap-3 rounded border bg-card p-3">
              <span className="text-xs font-mono text-muted-foreground/50 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
      {content.ctaText && (
        <div className={`mt-4 ${isCentered ? "flex justify-center" : ""}`}>
          <span className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">{content.ctaText}</span>
        </div>
      )}
    </div>
  );
}

function LivePreview({ sections, showAnnotations = false }: { sections: BuilderSection[]; showAnnotations?: boolean }) {
  if (sections.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <Monitor className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Add sections to see a live preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {sections.map((section) => (
        <div key={section.instanceId} className="group relative">
          <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <Badge variant="default" className="text-xs shadow-sm">
              {section.themeName}
            </Badge>
          </div>
          <div className={`border-b border-dashed border-border/50 ${showAnnotations && section.directionNotes ? "flex" : ""}`}>
            <div className={showAnnotations && section.directionNotes ? "flex-1 min-w-0" : ""}>
              <SectionPreview section={section} />
            </div>
            {showAnnotations && section.directionNotes && (
              <div className="w-72 flex-shrink-0 border-l border-dashed border-border/50 p-4 bg-amber-50/50">
                <div className="flex items-center gap-1.5 mb-2">
                  <StickyNote className="h-3.5 w-3.5 text-amber-600" />
                  <span className="text-xs font-semibold text-amber-800">{section.themeName}</span>
                </div>
                <p className="text-xs text-amber-900/70 whitespace-pre-wrap leading-relaxed">
                  {section.directionNotes}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ThemeLibrary({
  onAdd,
}: {
  onAdd: (theme: ContentTheme) => void;
}) {
  const [selectedPage, setSelectedPage] = useState(allPages[0]?.slug || "");
  const page = allPages.find((p) => p.slug === selectedPage);

  const categories = wireframeBlockMeta
    ? [...new Set(Object.values(wireframeBlockMeta).map((m) => m.category))]
    : [];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">
          Add from page template:
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {allPages.map((p) => (
            <button
              key={p.slug}
              onClick={() => setSelectedPage(p.slug)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                selectedPage === p.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {page && (
        <div className="space-y-1.5">
          {page.contentThemes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onAdd(theme)}
              className="w-full flex items-center gap-2.5 rounded-lg border border-border p-2.5 text-left transition-all hover:border-primary/50 hover:bg-primary/5"
            >
              <Plus className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{theme.name}</p>
                <p className="text-xs text-muted-foreground">
                  {theme.componentOptions.length} variants
                </p>
              </div>
              <Badge
                variant="outline"
                className={`text-xs ${
                  theme.frequencyTier === "high"
                    ? "border-green-300 text-green-700"
                    : theme.frequencyTier === "medium"
                    ? "border-yellow-300 text-yellow-700"
                    : "border-gray-300 text-gray-500"
                }`}
              >
                {theme.frequencyTier}
              </Badge>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface PageBuilderProps {
  initialSections?: BuilderSection[];
  initialStyleGuide?: StyleGuide;
  onSectionsChange?: (sections: BuilderSection[]) => void;
}

export function PageBuilder(props: PageBuilderProps = {}) {
  const { initialSections, initialStyleGuide, onSectionsChange } = props;
  const [sections, setSections] = useState<BuilderSection[]>(initialSections || []);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [styleGuide, setStyleGuide] = useState<StyleGuide>(initialStyleGuide || { ...defaultStyleGuide });
  const [showStyleGuide, setShowStyleGuide] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);

  // Notify parent of section changes for auto-save
  const sectionsRef = useRef(sections);
  sectionsRef.current = sections;
  useEffect(() => {
    if (onSectionsChange && sections !== (initialSections || [])) {
      const timeout = setTimeout(() => onSectionsChange(sectionsRef.current), 500);
      return () => clearTimeout(timeout);
    }
  }, [sections, onSectionsChange, initialSections]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((s) => s.instanceId === active.id);
        const newIndex = items.findIndex((s) => s.instanceId === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  const addSection = useCallback((theme: ContentTheme) => {
    setSections((prev) => [...prev, createSectionFromTheme(theme)]);
  }, []);

  const removeSection = useCallback((id: string) => {
    setSections((prev) => prev.filter((s) => s.instanceId !== id));
    setSelectedSection((prev) => (prev === id ? null : prev));
  }, []);

  const changeBlock = useCallback(
    (id: string, blockId: WireframeBlockId) => {
      setSections((prev) =>
        prev.map((s) =>
          s.instanceId === id ? { ...s, selectedBlockId: blockId } : s
        )
      );
    },
    []
  );

  const updateContent = useCallback(
    (id: string, patch: Partial<SectionContent>) => {
      setSections((prev) =>
        prev.map((s) =>
          s.instanceId === id
            ? { ...s, content: { ...s.content, ...patch } }
            : s
        )
      );
    },
    []
  );

  const updateNotes = useCallback(
    (id: string, notes: string) => {
      setSections((prev) =>
        prev.map((s) =>
          s.instanceId === id ? { ...s, directionNotes: notes } : s
        )
      );
    },
    []
  );

  const loadTemplate = useCallback((slug: string) => {
    const page = allPages.find((p) => p.slug === slug);
    if (!page) return;
    setSections(page.contentThemes.map(createSectionFromTheme));
  }, []);

  const duplicateSection = useCallback((id: string) => {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.instanceId === id);
      if (idx < 0) return prev;
      const source = prev[idx];
      const dup: BuilderSection = {
        ...source,
        instanceId: `${source.themeId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        content: { ...source.content, items: source.content.items.map((it) => ({ ...it, id: crypto.randomUUID() })) },
      };
      const next = [...prev];
      next.splice(idx + 1, 0, dup);
      return next;
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        // Trigger save via onSectionsChange
        if (onSectionsChange) onSectionsChange(sections);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [sections, onSectionsChange]);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Left panel - Section list */}
      <div className="w-80 flex-shrink-0 border-r bg-card flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold flex items-center gap-1.5">
              <LayoutGrid className="h-4 w-4" />
              Sections
            </h2>
            <Badge variant="secondary" className="text-xs">
              {sections.length}
            </Badge>
          </div>

          {/* Quick template load */}
          <div className="flex flex-wrap gap-1">
            {allPages.map((p) => (
              <button
                key={p.slug}
                onClick={() => loadTemplate(p.slug)}
                className="rounded px-2 py-0.5 text-xs bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                title={`Load ${p.name} template`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-3 space-y-2">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sections.map((s) => s.instanceId)}
                strategy={verticalListSortingStrategy}
              >
                {sections.map((section) => (
                  <SortableSection
                    key={section.instanceId}
                    section={section}
                    onRemove={removeSection}
                    onChangeBlock={changeBlock}
                    onUpdateContent={updateContent}
                    onUpdateNotes={updateNotes}
                    onDuplicate={duplicateSection}
                    isSelected={selectedSection === section.instanceId}
                    onSelect={setSelectedSection}
                  />
                ))}
              </SortableContext>
            </DndContext>

            {sections.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <LayoutGrid className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No sections yet</p>
                <p className="text-xs mt-1">
                  Add sections from the library below
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t flex">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  className="flex-1 rounded-none h-10 gap-1.5 text-xs"
                />
              }
            >
              <Plus className="h-3.5 w-3.5" />
              Add Section
            </SheetTrigger>
            <SheetContent side="left" className="w-[360px] sm:max-w-[360px]">
              <SheetHeader>
                <SheetTitle>Content Library</SheetTitle>
              </SheetHeader>
              <ScrollArea className="flex-1 -mx-4 px-4">
                <ThemeLibrary onAdd={addSection} />
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <div className="w-px bg-border" />
          <Button
            variant="ghost"
            className="flex-1 rounded-none h-10 gap-1.5 text-xs"
            onClick={() => setShowTemplateLibrary(true)}
          >
            <Bookmark className="h-3.5 w-3.5" />
            Templates
          </Button>
          {sections.length > 0 && (
            <>
              <div className="w-px bg-border" />
              <Button
                variant="ghost"
                className="rounded-none h-10 gap-1.5 text-xs px-3"
                onClick={() => setShowSaveTemplate(true)}
              >
                <Bookmark className="h-3.5 w-3.5 text-primary" />
                Save
              </Button>
            </>
          )}
        </div>

        {/* Template dialogs */}
        {showSaveTemplate && (
          <SaveAsTemplateDialog
            sections={sections}
            onClose={() => setShowSaveTemplate(false)}
          />
        )}
        {showTemplateLibrary && (
          <TemplateLibrary
            onApply={(templateSections) => {
              setSections(templateSections as BuilderSection[]);
              setShowTemplateLibrary(false);
            }}
            onClose={() => setShowTemplateLibrary(false)}
          />
        )}
      </div>

      {/* Right panel - Preview */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-4 py-2 border-b bg-card">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Page Preview</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant={showAnnotations ? "default" : "ghost"}
              size="xs"
              onClick={() => setShowAnnotations(!showAnnotations)}
              className="gap-1"
            >
              <StickyNote className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Notes</span>
            </Button>
            <Button
              variant={showStyleGuide ? "default" : "ghost"}
              size="xs"
              onClick={() => setShowStyleGuide(!showStyleGuide)}
              className="gap-1"
            >
              <Paintbrush className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Style</span>
            </Button>
            <div className="w-px h-4 bg-border mx-1" />
            <Button
              variant={showPreview ? "default" : "ghost"}
              size="xs"
              onClick={() => setShowPreview(true)}
            >
              <Monitor className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={!showPreview ? "default" : "ghost"}
              size="xs"
              onClick={() => setShowPreview(false)}
            >
              <PanelLeft className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Style Guide side panel */}
          {showStyleGuide && (
            <div className="w-64 flex-shrink-0 border-r bg-card overflow-y-auto p-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold flex items-center gap-1.5">
                  <Paintbrush className="h-3.5 w-3.5" /> Style Guide
                </h3>
                <button onClick={() => setShowStyleGuide(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <StyleGuidePanel styleGuide={styleGuide} onChange={setStyleGuide} />
            </div>
          )}

          {/* Preview content */}
          <div className="flex-1 overflow-y-auto">
          {showPreview ? (
            <StyledPreview styleGuide={styleGuide}>
              <div className="max-w-4xl mx-auto p-6">
                <LivePreview sections={sections} showAnnotations={showAnnotations} />
              </div>
            </StyledPreview>
          ) : (
            <div className="p-6">
              <h3 className="text-sm font-semibold mb-4">Section Details</h3>
              <div className="space-y-3">
                {sections.map((section, index) => (
                  <div
                    key={section.instanceId}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <span className="text-xs font-mono text-muted-foreground w-6">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{section.themeName}</p>
                      <p className="text-xs text-muted-foreground">
                        {wireframeBlockMeta[section.selectedBlockId]?.label}
                      </p>
                    </div>
                    <div className="w-24 h-14 rounded bg-muted/50 p-1">
                      <WireframeBlock
                        blockId={section.selectedBlockId}
                        className="w-full h-full text-muted-foreground/50"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
