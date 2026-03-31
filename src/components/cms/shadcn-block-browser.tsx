"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Code, Copy, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WireframeBlockId } from "@/data/wireframe-types";
import { WireframeBlock, wireframeBlockMeta } from "@/components/wireframe-blocks";
import { getBlockCategories, ShadcnBlock } from "@/lib/shadcn-block-registry";

/** Map shadcnblocks categories to wireframe block IDs for the quick-add */
const categoryToWireframe: Record<string, WireframeBlockId> = {
  Hero: "hero-centered",
  Features: "cards-3-col",
  CTA: "cta-full-width",
  FAQ: "faq-accordion",
  Testimonials: "testimonials-cards",
  Team: "team-grid",
  Stats: "stats-bar",
  Logos: "logos-grid",
  Pricing: "cards-3-col",
  Contact: "form-simple",
  Footer: "text-full-width",
  Navbar: "text-full-width",
  Blog: "cards-3-col",
  Gallery: "gallery-grid",
  Services: "cards-icon-grid",
  About: "text-split-image-right",
  Careers: "cards-3-col",
  "Case Studies": "cards-2-col",
  Timeline: "timeline-vertical",
  Banner: "cta-full-width",
  Lists: "icon-list",
  Comparison: "comparison-table",
  Auth: "form-simple",
  Content: "text-full-width",
  Changelog: "timeline-vertical",
  Community: "cards-3-col",
};

const categoryEmoji: Record<string, string> = {
  Hero: "🏔",
  Features: "⚡",
  CTA: "🎯",
  FAQ: "❓",
  Testimonials: "💬",
  Team: "👥",
  Stats: "📊",
  Logos: "🏢",
  Pricing: "💰",
  Contact: "📬",
  Footer: "📎",
  Navbar: "🧭",
  Blog: "📝",
  Gallery: "🖼",
  Services: "⚙️",
  About: "ℹ️",
  Careers: "💼",
  "Case Studies": "📋",
  Timeline: "⏱",
  Banner: "🚩",
  Lists: "📋",
  Comparison: "⚖️",
  Auth: "🔐",
  Content: "📄",
  Changelog: "📑",
  Community: "🤝",
};

function BlockCodePreview({ blockId }: { blockId: string }) {
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/block-code?id=${blockId}`)
      .then((r) => r.json())
      .then((d) => setCode(d.code))
      .catch(() => setCode("// Could not load code"));
  }, [blockId]);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!code) return <div className="py-4 text-center text-xs text-muted-foreground">Loading...</div>;

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 rounded bg-card/80 border px-2 py-1 text-[10px] flex items-center gap-1 hover:bg-card z-10"
      >
        {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="rounded-lg bg-muted/30 border p-3 text-[10px] font-mono leading-relaxed overflow-x-auto max-h-64 overflow-y-auto whitespace-pre">
        {code}
      </pre>
    </div>
  );
}

export function ShadcnBlockBrowser({
  onAddBlock,
}: {
  onAddBlock: (blockId: WireframeBlockId) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<ShadcnBlock | null>(null);
  const categories = getBlockCategories();

  // View: individual block detail
  if (selectedBlock) {
    const wireframeId = categoryToWireframe[selectedBlock.category] || "text-full-width";
    return (
      <div className="space-y-3">
        <button
          onClick={() => setSelectedBlock(null)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="h-3 w-3" /> Back to {selectedBlock.category}
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold">{selectedBlock.component}</h3>
            <p className="text-[10px] text-muted-foreground">
              {selectedBlock.lineCount} lines • {selectedBlock.propCount} props
            </p>
          </div>
          <Button
            size="xs"
            onClick={() => onAddBlock(wireframeId)}
          >
            <Plus className="h-3 w-3 mr-1" /> Add to Page
          </Button>
        </div>

        {selectedBlock.shadcnComponents.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selectedBlock.shadcnComponents.map((c) => (
              <Badge key={c} variant="secondary" className="text-[9px]">
                {c}
              </Badge>
            ))}
          </div>
        )}

        <BlockCodePreview blockId={selectedBlock.id} />
      </div>
    );
  }

  // View: blocks within a category
  if (selectedCategory) {
    const cat = categories.find((c) => c.category === selectedCategory);
    if (!cat) return null;

    return (
      <div className="space-y-3">
        <button
          onClick={() => setSelectedCategory(null)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="h-3 w-3" /> All Categories
        </button>

        <div className="flex items-center gap-2">
          <span className="text-lg">{categoryEmoji[selectedCategory] || "📦"}</span>
          <div>
            <h3 className="text-sm font-bold">{selectedCategory}</h3>
            <p className="text-[10px] text-muted-foreground">{cat.count} blocks</p>
          </div>
        </div>

        <div className="space-y-2">
          {cat.blocks.map((block) => {
            const wireframeId = categoryToWireframe[block.category] || "text-full-width";
            return (
              <div
                key={block.id}
                className="rounded-lg border p-3 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold">{block.component}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-muted-foreground">
                        {block.lineCount} lines
                      </span>
                      {block.shadcnComponents.length > 0 && (
                        <div className="flex gap-0.5">
                          {block.shadcnComponents.slice(0, 3).map((c) => (
                            <Badge key={c} variant="outline" className="text-[8px] px-1 py-0">
                              {c}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => setSelectedBlock(block)}
                    >
                      <Code className="h-3 w-3" />
                    </Button>
                    <Button
                      size="xs"
                      onClick={() => onAddBlock(wireframeId)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {/* Wireframe preview */}
                <div className="rounded bg-muted/20 p-1.5">
                  <WireframeBlock
                    blockId={wireframeId}
                    className="w-full h-auto text-muted-foreground/30"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // View: category list
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
        shadcnblocks Component Library — {categories.reduce((s, c) => s + c.count, 0)} blocks
      </p>
      {categories.map((cat) => {
        const wireframeId = categoryToWireframe[cat.category] || "text-full-width";
        return (
          <button
            key={cat.category}
            onClick={() => setSelectedCategory(cat.category)}
            className="w-full flex items-center gap-3 rounded-lg border border-border p-3 text-left transition-all hover:border-primary/50 hover:bg-primary/5"
          >
            <span className="text-xl w-8 text-center">
              {categoryEmoji[cat.category] || "📦"}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{cat.category}</p>
              <p className="text-[10px] text-muted-foreground">
                {cat.count} block{cat.count !== 1 ? "s" : ""}
                {cat.blocks[0]?.shadcnComponents.length > 0 && (
                  <> • uses {[...new Set(cat.blocks.flatMap((b) => b.shadcnComponents))].slice(0, 3).join(", ")}</>
                )}
              </p>
            </div>
            <div className="flex gap-0.5 flex-shrink-0">
              {cat.blocks.slice(0, 2).map((b) => (
                <div key={b.id} className="w-10 h-6 rounded bg-muted/30 p-0.5">
                  <WireframeBlock blockId={wireframeId} className="w-full h-full text-muted-foreground/20" />
                </div>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
