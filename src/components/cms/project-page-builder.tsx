"use client";

import { useState, useRef } from "react";
import {
  MessageSquare,
  X,
  Search,
  Users,
  Target,
  Link2,
  FileText,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StyleGuide } from "./style-guide";
import {
  Project,
  SitemapPage,
  PageSection,
} from "@/lib/project-types";
import {
  BuilderSection,
  PageBuilder as StandalonePageBuilder,
} from "./page-builder";
import { saveProject } from "@/lib/project-store";

const inputCls =
  "w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/30";

/**
 * Project-scoped page builder.
 * Adds discovery context, SEO editing, page strategy brief above the builder.
 */
export function ProjectPageBuilder({
  project,
  page,
  onSave,
}: {
  project: Project;
  page: SitemapPage;
  onSave: (sections: PageSection[]) => void;
}) {
  const [showContext, setShowContext] = useState(false);
  const [contextTab, setContextTab] = useState<"notes" | "seo" | "brief">("notes");

  // SEO + Brief fields are saved directly to the project's sitemap page
  const updatePageField = (patch: Partial<SitemapPage>) => {
    const updatedSitemap = project.sitemap.map((pg) =>
      pg.id === page.id ? { ...pg, ...patch } : pg
    );
    saveProject({ ...project, sitemap: updatedSitemap });
  };

  const hasContext = !!(project.discoveryNotes || page.notes || page.pageGoal || page.audiences.length > 0);

  return (
    <div className="flex flex-col flex-1">
      {/* Context bar */}
      {showContext && (
        <div className="border-b bg-muted/20 px-6 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1 rounded-lg bg-muted p-0.5">
              {(["notes", "brief", "seo"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setContextTab(tab)}
                  className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                    contextTab === tab
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "notes" ? "Discovery" : tab === "brief" ? "Page Brief" : "SEO"}
                </button>
              ))}
            </div>
            <button onClick={() => setShowContext(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Discovery Notes Tab */}
          {contextTab === "notes" && (
            <div className="grid grid-cols-3 gap-4 text-xs">
              {project.discoveryNotes && (
                <div>
                  <p className="font-medium text-foreground mb-1">Meeting Notes</p>
                  <p className="text-muted-foreground whitespace-pre-wrap line-clamp-6">{project.discoveryNotes}</p>
                </div>
              )}
              {project.valuePropositions.length > 0 && (
                <div>
                  <p className="font-medium text-foreground mb-1">Value Props</p>
                  <ul className="text-muted-foreground space-y-0.5">
                    {project.valuePropositions.map((v, i) => <li key={i}>• {v}</li>)}
                  </ul>
                </div>
              )}
              {project.differentiators.length > 0 && (
                <div>
                  <p className="font-medium text-foreground mb-1">Differentiators</p>
                  <ul className="text-muted-foreground space-y-0.5">
                    {project.differentiators.map((d, i) => <li key={i}>• {d}</li>)}
                  </ul>
                </div>
              )}
              {page.notes && (
                <div className="col-span-3 rounded border bg-card p-2">
                  <p className="font-medium text-foreground mb-0.5">Page Notes</p>
                  <p className="text-muted-foreground">{page.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Page Brief Tab */}
          {contextTab === "brief" && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1 font-medium text-muted-foreground mb-1">
                    <Users className="h-3 w-3" /> Audiences
                  </label>
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={2}
                    placeholder="Who is this page for? (one per line)"
                    value={(page.audiences || []).join("\n")}
                    onChange={(e) =>
                      updatePageField({ audiences: e.target.value.split("\n").filter(Boolean) })
                    }
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1 font-medium text-muted-foreground mb-1">
                    <Target className="h-3 w-3" /> Page Goal
                  </label>
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={2}
                    placeholder="What should visitors do on this page?"
                    value={page.pageGoal || ""}
                    onChange={(e) => updatePageField({ pageGoal: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1 font-medium text-muted-foreground mb-1">
                    <Link2 className="h-3 w-3" /> Reference URLs
                  </label>
                  <textarea
                    className={`${inputCls} resize-none font-mono`}
                    rows={2}
                    placeholder="Reference URLs (one per line)"
                    value={(page.referenceUrls || []).join("\n")}
                    onChange={(e) =>
                      updatePageField({ referenceUrls: e.target.value.split("\n").filter(Boolean) })
                    }
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1 font-medium text-muted-foreground mb-1">
                    <FileText className="h-3 w-3" /> Content Notes
                  </label>
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={2}
                    placeholder="What content/assets exist or are needed for this page?"
                    value={page.contentNotes || ""}
                    onChange={(e) => updatePageField({ contentNotes: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {contextTab === "seo" && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="flex items-center gap-1 font-medium text-muted-foreground mb-1">
                  <Search className="h-3 w-3" /> Title Tag
                  <span className="ml-auto text-[10px] text-muted-foreground/60">
                    {(page.seoTitle || "").length}/60
                  </span>
                </label>
                <input
                  className={inputCls}
                  placeholder={`${page.name} | ${project.clientName}`}
                  value={page.seoTitle || ""}
                  onChange={(e) => updatePageField({ seoTitle: e.target.value })}
                  maxLength={70}
                />
              </div>
              <div>
                <label className="flex items-center gap-1 font-medium text-muted-foreground mb-1">
                  Meta Description
                  <span className="ml-auto text-[10px] text-muted-foreground/60">
                    {(page.seoDescription || "").length}/160
                  </span>
                </label>
                <textarea
                  className={`${inputCls} resize-none`}
                  rows={2}
                  placeholder={page.purpose || "Describe this page for search engines..."}
                  value={page.seoDescription || ""}
                  onChange={(e) => updatePageField({ seoDescription: e.target.value })}
                  maxLength={170}
                />
              </div>
              <div>
                <label className="flex items-center gap-1 font-medium text-muted-foreground mb-1">
                  OG Image URL
                </label>
                <input
                  className={`${inputCls} font-mono`}
                  placeholder="https://..."
                  value={page.ogImageUrl || ""}
                  onChange={(e) => updatePageField({ ogImageUrl: e.target.value })}
                />
              </div>
              {/* Preview */}
              <div className="rounded-lg border bg-card p-3">
                <p className="text-[10px] text-muted-foreground mb-1.5">Search Preview</p>
                <p className="text-sm text-blue-700 font-medium leading-tight">
                  {page.seoTitle || `${page.name} | ${project.clientName}`}
                </p>
                <p className="text-[11px] text-green-700 font-mono">
                  {project.currentSiteUrl || "https://example.com"}/{page.slug}
                </p>
                <p className="text-[11px] text-muted-foreground line-clamp-2">
                  {page.seoDescription || page.purpose || "No description set"}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Collapsed bar */}
      {!showContext && (
        <div className="border-b bg-card px-6 py-1.5 flex items-center gap-3">
          <button
            onClick={() => { setShowContext(true); setContextTab("notes"); }}
            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
          >
            <MessageSquare className="h-3 w-3" /> Discovery
          </button>
          <span className="text-border">|</span>
          <button
            onClick={() => { setShowContext(true); setContextTab("brief"); }}
            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
          >
            <Target className="h-3 w-3" /> Page Brief
            {page.pageGoal && <Badge variant="secondary" className="text-[8px] px-1 py-0 h-3">set</Badge>}
          </button>
          <span className="text-border">|</span>
          <button
            onClick={() => { setShowContext(true); setContextTab("seo"); }}
            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
          >
            <Search className="h-3 w-3" /> SEO
            {page.seoTitle && <Badge variant="secondary" className="text-[8px] px-1 py-0 h-3">set</Badge>}
          </button>
        </div>
      )}

      <StandalonePageBuilder
        initialSections={page.sections as BuilderSection[]}
        initialStyleGuide={project.styleGuide}
        onSectionsChange={onSave}
      />
    </div>
  );
}
