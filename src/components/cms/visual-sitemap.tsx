"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SitemapPage, createSitemapPage } from "@/lib/project-types";

// ============================================================
// Visual Sitemap — Miro-style tree layout
// ============================================================

interface VisualSitemapProps {
  pages: SitemapPage[];
  onChange: (pages: SitemapPage[]) => void;
  onPageClick?: (pageId: string) => void;
  /** Label like "Current Sitemap" or "Proposed Sitemap" */
  label?: string;
  /** Whether editing is enabled */
  editable?: boolean;
  /** Callback to generate a suggested sitemap */
  onSuggest?: () => void;
}

function getChildren(pages: SitemapPage[], parentId: string | null): SitemapPage[] {
  return pages
    .filter((p) => p.parentId === parentId)
    .sort((a, b) => a.order - b.order);
}

function getPageDepth(pages: SitemapPage[], pageId: string): number {
  let depth = 0;
  let current = pages.find((p) => p.id === pageId);
  while (current?.parentId) {
    depth++;
    current = pages.find((p) => p.id === current!.parentId);
  }
  return depth;
}

// -- Page card in the visual sitemap --
function SitemapCard({
  page,
  pages,
  onPageClick,
  onRemove,
  onUpdate,
  editable,
  isTopLevel,
}: {
  page: SitemapPage;
  pages: SitemapPage[];
  onPageClick?: (id: string) => void;
  onRemove?: (id: string) => void;
  onUpdate?: (id: string, patch: Partial<SitemapPage>) => void;
  editable?: boolean;
  isTopLevel?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(page.name);
  const children = getChildren(pages, page.id);
  const sectionCount = page.sections?.length || 0;

  const saveEdit = () => {
    if (editName.trim() && onUpdate) {
      onUpdate(page.id, {
        name: editName.trim(),
        slug: editName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      });
    }
    setEditing(false);
  };

  return (
    <div className="flex flex-col items-center">
      {/* The card itself */}
      <div
        className={`
          relative group rounded border-2 bg-card px-3 py-2 min-w-[140px] max-w-[180px] text-center
          transition-all cursor-pointer hover:shadow-md
          ${isTopLevel
            ? "border-amber-400 bg-amber-50/50 shadow-sm"
            : "border-amber-300/70 bg-white hover:border-amber-400"
          }
        `}
        onClick={() => onPageClick?.(page.id)}
      >
        {editing ? (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditing(false); }}
              className="w-full text-xs font-medium bg-transparent border-b border-primary outline-none text-center"
              autoFocus
            />
            <button onClick={saveEdit} className="text-green-600"><Check className="h-3 w-3" /></button>
            <button onClick={() => setEditing(false)} className="text-muted-foreground"><X className="h-3 w-3" /></button>
          </div>
        ) : (
          <p className="text-xs font-medium leading-tight truncate">{page.name}</p>
        )}

        {page.purpose && (
          <p className="text-[9px] text-muted-foreground mt-0.5 truncate">{page.purpose}</p>
        )}

        {/* Status icons */}
        <div className="flex items-center justify-center gap-1 mt-1">
          {sectionCount > 0 && (
            <Badge variant="secondary" className="text-[8px] px-1 py-0 h-3.5">
              {sectionCount}s
            </Badge>
          )}
          {/* Completion indicators */}
          {page.pageGoal && (
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400" title="Has page goal" />
          )}
          {page.seoTitle && (
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400" title="Has SEO" />
          )}
          {editable && onUpdate ? (
            <select
              value={page.sprint || 1}
              onChange={(e) => { e.stopPropagation(); onUpdate(page.id, { sprint: Number(e.target.value) }); }}
              onClick={(e) => e.stopPropagation()}
              className="text-[8px] bg-transparent border rounded px-0.5 py-0 h-3.5 outline-none cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <option value={1}>S1</option>
              <option value={2}>S2</option>
              <option value={3}>S3</option>
              <option value={4}>S4</option>
            </select>
          ) : (
            page.sprint && page.sprint > 1 && (
              <Badge variant="outline" className="text-[8px] px-1 py-0 h-3.5">
                S{page.sprint}
              </Badge>
            )
          )}
        </div>

        {/* Edit/delete on hover */}
        {editable && !editing && (
          <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
            <button
              onClick={(e) => { e.stopPropagation(); setEditing(true); setEditName(page.name); }}
              className="rounded-full bg-card border shadow-sm p-0.5 hover:bg-muted"
            >
              <Edit3 className="h-2.5 w-2.5 text-muted-foreground" />
            </button>
            {onRemove && (
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(page.id); }}
                className="rounded-full bg-card border shadow-sm p-0.5 hover:bg-destructive/10"
              >
                <Trash2 className="h-2.5 w-2.5 text-destructive" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Children */}
      {children.length > 0 && (
        <>
          {/* Vertical connector line */}
          <div className="w-px h-4 bg-amber-300/60" />
          {/* Horizontal connector + children */}
          <div className="relative flex gap-2">
            {/* Horizontal line spanning all children */}
            {children.length > 1 && (
              <div
                className="absolute top-0 h-px bg-amber-300/60"
                style={{
                  left: "50%",
                  width: `calc(100% - 140px)`,
                  transform: "translateX(-50%)",
                }}
              />
            )}
            {children.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                {/* Vertical line from horizontal connector to child */}
                <div className="w-px h-4 bg-amber-300/60" />
                <SitemapCard
                  page={child}
                  pages={pages}
                  onPageClick={onPageClick}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  editable={editable}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// -- Add page inline form --
function AddPageInline({
  pages,
  parentId,
  onAdd,
}: {
  pages: SitemapPage[];
  parentId: string | null;
  onAdd: (page: SitemapPage) => void;
}) {
  const [name, setName] = useState("");

  const handleAdd = () => {
    if (!name.trim()) return;
    const page = createSitemapPage({
      name: name.trim(),
      slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      parentId,
      order: pages.filter((p) => p.parentId === parentId).length,
      sprint: 1,
    });
    onAdd(page);
    setName("");
  };

  return (
    <div className="flex items-center gap-1">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
        placeholder="Page name"
        className="rounded border border-dashed border-amber-300 bg-transparent px-2 py-1 text-xs outline-none focus:border-amber-500 w-28 text-center"
      />
      <button
        onClick={handleAdd}
        disabled={!name.trim()}
        className="rounded border border-dashed border-amber-300 p-1 hover:bg-amber-50 text-amber-600 disabled:opacity-30"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}

// ============================================================
// Main visual sitemap component
// ============================================================

export function VisualSitemap({
  pages,
  onChange,
  onPageClick,
  label,
  editable = true,
  onSuggest,
}: VisualSitemapProps) {
  const topLevelPages = getChildren(pages, null);

  // Find the home page (first top-level, or one named "Home")
  const homePage = topLevelPages.find(
    (p) => p.slug === "home" || p.name.toLowerCase() === "home"
  );
  const navPages = topLevelPages.filter((p) => p.id !== homePage?.id);

  // Footer / legal pages (convention: pages with slug containing "privacy", "terms", "sitemap", "accessibility")
  const footerSlugs = ["privacy", "terms", "sitemap", "accessibility", "legal", "cookie"];
  const footerPages = pages.filter((p) =>
    footerSlugs.some((s) => p.slug.includes(s) || p.name.toLowerCase().includes(s))
  );
  const footerIds = new Set(footerPages.map((p) => p.id));
  const mainNavPages = navPages.filter((p) => !footerIds.has(p.id));

  const handleRemove = (id: string) => {
    // Remove page and all descendants
    const toRemove = new Set<string>();
    const collect = (parentId: string) => {
      toRemove.add(parentId);
      pages.filter((p) => p.parentId === parentId).forEach((p) => collect(p.id));
    };
    collect(id);
    onChange(pages.filter((p) => !toRemove.has(p.id)));
  };

  const handleUpdate = (id: string, patch: Partial<SitemapPage>) => {
    onChange(pages.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const handleAddPage = (page: SitemapPage) => {
    onChange([...pages, page]);
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        {label ? (
          <h3 className="text-sm font-bold text-foreground">{label}</h3>
        ) : <div />}
        <div className="flex items-center gap-2 flex-shrink-0">
          {onSuggest && (
            <Button size="xs" variant="outline" className="gap-1" onClick={onSuggest}>
              <Sparkles className="h-3 w-3" /> Suggest Sitemap
            </Button>
          )}
          {editable && pages.length > 0 && (
            <Button
              size="xs"
              variant="ghost"
              className="gap-1 text-destructive hover:text-destructive"
              onClick={() => { if (confirm("Clear all pages?")) onChange([]); }}
            >
              <RotateCcw className="h-3 w-3" /> Clear
            </Button>
          )}
          <span className="text-xs text-muted-foreground">{pages.length} pages</span>
        </div>
      </div>

      <div className="inline-flex flex-col items-center min-w-full py-4">
        {/* Home page at top */}
        {homePage ? (
          <SitemapCard
            page={homePage}
            pages={pages}
            onPageClick={onPageClick}
            onRemove={editable ? handleRemove : undefined}
            onUpdate={editable ? handleUpdate : undefined}
            editable={editable}
            isTopLevel
          />
        ) : (
          editable && (
            <div className="mb-2">
              <AddPageInline
                pages={pages}
                parentId={null}
                onAdd={(p) => handleAddPage({ ...p, name: p.name || "Home", slug: "home" })}
              />
            </div>
          )
        )}

        {/* Connector from home to nav */}
        {(mainNavPages.length > 0 || editable) && (
          <div className="w-px h-6 bg-amber-300/60" />
        )}

        {/* Top-level nav columns */}
        <div className="relative flex gap-4 items-start">
          {/* Horizontal line across all columns */}
          {mainNavPages.length > 1 && (
            <div
              className="absolute top-0 h-px bg-amber-300/60"
              style={{
                left: "50%",
                width: `calc(100% - 140px)`,
                transform: "translateX(-50%)",
              }}
            />
          )}

          {mainNavPages.map((page) => (
            <div key={page.id} className="flex flex-col items-center">
              <div className="w-px h-4 bg-amber-300/60" />
              <SitemapCard
                page={page}
                pages={pages}
                onPageClick={onPageClick}
                onRemove={editable ? handleRemove : undefined}
                onUpdate={editable ? handleUpdate : undefined}
                editable={editable}
                isTopLevel
              />
              {/* Add child button */}
              {editable && (
                <div className="mt-2">
                  <AddPageInline pages={pages} parentId={page.id} onAdd={handleAddPage} />
                </div>
              )}
            </div>
          ))}

          {/* Add new top-level section */}
          {editable && (
            <div className="flex flex-col items-center">
              <div className="w-px h-4 bg-transparent" />
              <AddPageInline pages={pages} parentId={null} onAdd={handleAddPage} />
            </div>
          )}
        </div>

        {/* Footer / Legal section */}
        {(footerPages.length > 0 || editable) && (
          <div className="mt-8 w-full">
            <div className="border-t border-dashed border-border pt-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3 text-center">
                Legal / Footer
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {footerPages.map((page) => (
                  <div
                    key={page.id}
                    className="group relative rounded border border-amber-300/50 bg-amber-50/30 px-3 py-1.5 text-xs cursor-pointer hover:border-amber-400 hover:shadow-sm transition-all"
                    onClick={() => onPageClick?.(page.id)}
                  >
                    {page.name}
                    {editable && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemove(page.id); }}
                        className="absolute -top-1.5 -right-1.5 opacity-0 group-hover:opacity-100 rounded-full bg-card border shadow-sm p-0.5 hover:bg-destructive/10"
                      >
                        <X className="h-2 w-2 text-destructive" />
                      </button>
                    )}
                  </div>
                ))}
                {editable && (
                  <AddPageInline pages={pages} parentId={null} onAdd={(p) => {
                    handleAddPage({ ...p, slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") });
                  }} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
