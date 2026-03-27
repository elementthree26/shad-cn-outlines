"use client";

import { useState, useCallback } from "react";
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
  ChevronRight,
  Settings2,
  LayoutGrid,
  Monitor,
  PanelLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export interface BuilderSection {
  instanceId: string;
  themeId: string;
  themeName: string;
  selectedBlockId: WireframeBlockId;
  availableBlocks: { name: string; wireframeId: WireframeBlockId }[];
}

function createSectionFromTheme(theme: ContentTheme): BuilderSection {
  return {
    instanceId: `${theme.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    themeId: theme.id,
    themeName: theme.name,
    selectedBlockId: theme.componentOptions[0]?.wireframeId || "hero-centered",
    availableBlocks: theme.componentOptions,
  };
}

function SortableSection({
  section,
  onRemove,
  onChangeBlock,
  isSelected,
  onSelect,
}: {
  section: BuilderSection;
  onRemove: (id: string) => void;
  onChangeBlock: (id: string, blockId: WireframeBlockId) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const [showOptions, setShowOptions] = useState(false);
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
                  setShowOptions(!showOptions);
                }}
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
                  onRemove(section.instanceId);
                }}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>
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

function LivePreview({ sections }: { sections: BuilderSection[] }) {
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
      {sections.map((section) => {
        const meta = wireframeBlockMeta[section.selectedBlockId];
        return (
          <div key={section.instanceId} className="group relative">
            <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <Badge variant="default" className="text-xs shadow-sm">
                {section.themeName}
              </Badge>
            </div>
            <div className="border-b border-dashed border-border/50">
              <WireframeBlock
                blockId={section.selectedBlockId}
                className="w-full h-auto text-muted-foreground/40"
              />
            </div>
          </div>
        );
      })}
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

export function PageBuilder() {
  const [sections, setSections] = useState<BuilderSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);

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

  const loadTemplate = useCallback((slug: string) => {
    const page = allPages.find((p) => p.slug === slug);
    if (!page) return;
    setSections(page.contentThemes.map(createSectionFromTheme));
  }, []);

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

        <ScrollArea className="flex-1">
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
        </ScrollArea>

        {/* Add section panel */}
        <div className="border-t">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  className="w-full rounded-none h-12 gap-2"
                />
              }
            >
              <Plus className="h-4 w-4" />
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
        </div>
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

        <ScrollArea className="flex-1">
          {showPreview ? (
            <div className="max-w-4xl mx-auto p-6">
              <LivePreview sections={sections} />
            </div>
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
        </ScrollArea>
      </div>
    </div>
  );
}
