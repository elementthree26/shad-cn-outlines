"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Search, X, FileText, Layers, StickyNote, Target, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Project, SitemapPage } from "@/lib/project-types";
import { wireframeBlockMeta } from "@/components/wireframe-blocks";

interface SearchResult {
  type: "page" | "section" | "item" | "note" | "redirect" | "discovery";
  pageId?: string;
  pageName: string;
  sectionName?: string;
  field: string;
  match: string;
  context: string;
}

function searchProject(project: Project, query: string): SearchResult[] {
  if (!query.trim() || query.length < 2) return [];
  const q = query.toLowerCase();
  const results: SearchResult[] = [];
  const MAX = 50;

  const addResult = (r: SearchResult) => {
    if (results.length < MAX) results.push(r);
  };

  // Search discovery notes
  if (project.discoveryNotes.toLowerCase().includes(q)) {
    const idx = project.discoveryNotes.toLowerCase().indexOf(q);
    addResult({
      type: "discovery",
      pageName: "Project",
      field: "Discovery Notes",
      match: query,
      context: project.discoveryNotes.slice(Math.max(0, idx - 40), idx + query.length + 40),
    });
  }

  // Search value props / differentiators
  for (const vp of project.valuePropositions) {
    if (vp.toLowerCase().includes(q)) {
      addResult({ type: "discovery", pageName: "Project", field: "Value Proposition", match: query, context: vp });
    }
  }
  for (const d of project.differentiators) {
    if (d.toLowerCase().includes(q)) {
      addResult({ type: "discovery", pageName: "Project", field: "Differentiator", match: query, context: d });
    }
  }

  // Search pages
  for (const page of project.sitemap) {
    if (page.name.toLowerCase().includes(q) || page.slug.toLowerCase().includes(q)) {
      addResult({ type: "page", pageId: page.id, pageName: page.name, field: "Page Name", match: query, context: `/${page.slug} — ${page.purpose}` });
    }
    if (page.purpose.toLowerCase().includes(q)) {
      addResult({ type: "page", pageId: page.id, pageName: page.name, field: "Purpose", match: query, context: page.purpose });
    }
    if (page.pageGoal?.toLowerCase().includes(q)) {
      addResult({ type: "page", pageId: page.id, pageName: page.name, field: "Page Goal", match: query, context: page.pageGoal });
    }
    if (page.notes?.toLowerCase().includes(q)) {
      addResult({ type: "note", pageId: page.id, pageName: page.name, field: "Page Notes", match: query, context: page.notes });
    }
    if (page.seoTitle?.toLowerCase().includes(q)) {
      addResult({ type: "page", pageId: page.id, pageName: page.name, field: "SEO Title", match: query, context: page.seoTitle });
    }
    if (page.seoDescription?.toLowerCase().includes(q)) {
      addResult({ type: "page", pageId: page.id, pageName: page.name, field: "SEO Description", match: query, context: page.seoDescription });
    }

    // Search sections
    for (const section of page.sections) {
      if (section.themeName.toLowerCase().includes(q)) {
        addResult({ type: "section", pageId: page.id, pageName: page.name, sectionName: section.themeName, field: "Section Name", match: query, context: section.themeName });
      }
      if (section.directionNotes?.toLowerCase().includes(q)) {
        addResult({ type: "note", pageId: page.id, pageName: page.name, sectionName: section.themeName, field: "Direction Notes", match: query, context: section.directionNotes });
      }

      const c = section.content;
      for (const [key, val] of Object.entries({ heading: c.heading, subheading: c.subheading, body: c.body, ctaText: c.ctaText })) {
        if (val && val.toLowerCase().includes(q)) {
          addResult({ type: "section", pageId: page.id, pageName: page.name, sectionName: section.themeName, field: key, match: query, context: val });
        }
      }

      // Search items
      for (const item of c.items) {
        for (const [key, val] of Object.entries({ title: item.title, description: item.description, extra: item.extra })) {
          if (val && val.toLowerCase().includes(q)) {
            addResult({ type: "item", pageId: page.id, pageName: page.name, sectionName: section.themeName, field: `Item: ${item.title || "untitled"} → ${key}`, match: query, context: val });
          }
        }
      }
    }
  }

  // Search redirects
  for (const r of project.redirects || []) {
    if (r.oldUrl.toLowerCase().includes(q) || r.newUrl.toLowerCase().includes(q)) {
      addResult({ type: "redirect", pageName: "Redirects", field: "Redirect", match: query, context: `${r.oldUrl} → ${r.newUrl}` });
    }
  }

  return results;
}

const typeIcons = {
  page: FileText,
  section: Layers,
  item: Hash,
  note: StickyNote,
  redirect: Target,
  discovery: Search,
};

const typeColors = {
  page: "bg-blue-100 text-blue-800",
  section: "bg-purple-100 text-purple-800",
  item: "bg-green-100 text-green-800",
  note: "bg-amber-100 text-amber-800",
  redirect: "bg-red-100 text-red-800",
  discovery: "bg-cyan-100 text-cyan-800",
};

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export function ProjectSearch({
  project,
  onNavigateToPage,
}: {
  project: Project;
  onNavigateToPage: (pageId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const results = searchProject(project, query);

  // Keyboard shortcut: Cmd+K or Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  if (!open) {
    return (
      <button
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
        className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted transition-colors"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search project...</span>
        <kbd className="ml-2 rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono border">⌘K</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40" onClick={() => { setOpen(false); setQuery(""); }}>
      <div
        className="mx-auto mt-[15vh] w-full max-w-xl rounded-xl bg-card border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages, sections, content, notes, redirects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono border text-muted-foreground">esc</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {query.length < 2 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Type at least 2 characters to search
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="py-1">
              <div className="px-4 py-1.5">
                <span className="text-[10px] text-muted-foreground">{results.length} result{results.length !== 1 ? "s" : ""}</span>
              </div>
              {results.map((result, i) => {
                const Icon = typeIcons[result.type];
                return (
                  <button
                    key={i}
                    className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-muted/50 text-left transition-colors"
                    onClick={() => {
                      if (result.pageId) {
                        onNavigateToPage(result.pageId);
                      }
                      setOpen(false);
                      setQuery("");
                    }}
                  >
                    <Icon className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-medium">{result.pageName}</span>
                        {result.sectionName && (
                          <>
                            <span className="text-muted-foreground/40">›</span>
                            <span className="text-xs text-muted-foreground">{result.sectionName}</span>
                          </>
                        )}
                        <Badge className={`text-[8px] px-1 py-0 h-3.5 ${typeColors[result.type]}`}>
                          {result.field}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {highlightMatch(result.context, query)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
