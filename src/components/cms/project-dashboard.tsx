"use client";

import { useState } from "react";
import {
  FileText,
  Plus,
  ExternalLink,
  Globe,
  Paintbrush,
  MessageSquare,
  Settings2,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project, SitemapPage, createSitemapPage } from "@/lib/project-types";
import { StyleGuidePanel } from "@/components/cms/style-guide";

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30";

interface ProjectDashboardProps {
  project: Project;
  onUpdate: (project: Project) => void;
  onNavigateToPage: (pageId: string) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildTree(pages: SitemapPage[]): (SitemapPage & { children: SitemapPage[] })[] {
  const roots: (SitemapPage & { children: SitemapPage[] })[] = [];
  const childMap = new Map<string | null, SitemapPage[]>();

  for (const page of [...pages].sort((a, b) => a.order - b.order)) {
    const key = page.parentId ?? "__root__";
    if (!childMap.has(key)) childMap.set(key, []);
    childMap.get(key)!.push(page);
  }

  for (const root of childMap.get("__root__") ?? []) {
    roots.push({
      ...root,
      children: (childMap.get(root.id) ?? []).sort((a, b) => a.order - b.order),
    });
  }

  return roots;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ColorSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="size-6 shrink-0 rounded-md border border-border"
        style={{ backgroundColor: color }}
      />
      <div className="min-w-0">
        <p className="truncate text-xs font-medium">{label}</p>
        <p className="text-[10px] text-muted-foreground">{color}</p>
      </div>
    </div>
  );
}

function PageCard({
  page,
  depth,
  onClick,
}: {
  page: SitemapPage;
  depth: number;
  onClick: () => void;
}) {
  const sectionCount = page.sections.length;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 text-left transition-colors hover:border-primary/40 hover:bg-muted/50"
      style={{ marginLeft: depth * 20 }}
    >
      <FileText className="size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium">{page.name || "Untitled"}</span>
          <span className="text-xs text-muted-foreground">/{page.slug || "..."}</span>
        </div>
        {page.purpose && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{page.purpose}</p>
        )}
      </div>
      <Badge variant={sectionCount > 0 ? "secondary" : "outline"}>
        {sectionCount > 0 ? `${sectionCount} section${sectionCount !== 1 ? "s" : ""}` : "Not started"}
      </Badge>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function ProjectDashboard({
  project,
  onUpdate,
  onNavigateToPage,
}: ProjectDashboardProps) {
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(project.clientName);
  const [showStyleEditor, setShowStyleEditor] = useState(false);

  const sg = project.styleGuide;
  const tree = buildTree(project.sitemap);
  const totalPages = project.sitemap.length;
  const pagesWithSections = project.sitemap.filter((p) => p.sections.length > 0).length;

  // --- Handlers ---

  function commitName() {
    setEditingName(false);
    if (nameValue.trim() !== project.clientName) {
      onUpdate({ ...project, clientName: nameValue.trim() });
    }
  }

  function handleAddPage() {
    const newPage = createSitemapPage({
      name: "New Page",
      slug: "new-page",
      order: project.sitemap.length,
    });
    onUpdate({ ...project, sitemap: [...project.sitemap, newPage] });
  }

  function handleStyleGuideChange(updated: typeof sg) {
    onUpdate({ ...project, styleGuide: updated });
  }

  // --- Render ---

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
      {/* ================================================================ */}
      {/* LEFT COLUMN                                                      */}
      {/* ================================================================ */}
      <div className="flex flex-col gap-6">
        {/* --- Header --- */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              {project.logoUrl ? (
                <img
                  src={project.logoUrl}
                  alt={`${project.clientName} logo`}
                  className="size-10 rounded-lg border border-border object-contain"
                />
              ) : (
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Globe className="size-5" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                {editingName ? (
                  <input
                    className={inputClass}
                    autoFocus
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    onBlur={commitName}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitName();
                      if (e.key === "Escape") {
                        setNameValue(project.clientName);
                        setEditingName(false);
                      }
                    }}
                  />
                ) : (
                  <button
                    type="button"
                    className="text-left text-lg font-semibold hover:underline"
                    onClick={() => {
                      setNameValue(project.clientName);
                      setEditingName(true);
                    }}
                  >
                    {project.clientName || "Untitled Project"}
                  </button>
                )}
              </div>

              {project.industry && (
                <Badge variant="secondary">{project.industry}</Badge>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* --- Sitemap / Pages --- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="size-4" />
              Sitemap / Pages
            </CardTitle>
            <CardDescription>
              {totalPages} page{totalPages !== 1 ? "s" : ""} in project
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {tree.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No pages yet. Add your first page below.
              </p>
            )}

            {tree.map((root) => (
              <div key={root.id} className="flex flex-col gap-1.5">
                <PageCard page={root} depth={0} onClick={() => onNavigateToPage(root.id)} />
                {root.children.map((child) => (
                  <PageCard
                    key={child.id}
                    page={child}
                    depth={1}
                    onClick={() => onNavigateToPage(child.id)}
                  />
                ))}
              </div>
            ))}

            <Button variant="outline" size="sm" className="mt-2 self-start" onClick={handleAddPage}>
              <Plus className="size-3.5" data-icon="inline-start" />
              Add Page
            </Button>
          </CardContent>
        </Card>

        {/* --- Content Status --- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-4" />
              Content Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: totalPages > 0 ? `${(pagesWithSections / totalPages) * 100}%` : "0%",
                  }}
                />
              </div>
              <span className="shrink-0 text-sm font-medium text-muted-foreground">
                {pagesWithSections}/{totalPages} pages built
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ================================================================ */}
      {/* RIGHT COLUMN                                                     */}
      {/* ================================================================ */}
      <div className="flex flex-col gap-6">
        {/* --- Style Guide Preview --- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Paintbrush className="size-4" />
              Style Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {!showStyleEditor && (
              <>
                {/* Color swatches */}
                <div className="grid grid-cols-2 gap-3">
                  <ColorSwatch color={sg.primaryColor} label="Primary" />
                  <ColorSwatch color={sg.secondaryColor} label="Secondary" />
                  <ColorSwatch color={sg.accentColor} label="Accent" />
                  <ColorSwatch color={sg.backgroundColor} label="Background" />
                  <ColorSwatch color={sg.foregroundColor} label="Foreground" />
                  <ColorSwatch color={sg.borderColor} label="Border" />
                </div>

                {/* Typography */}
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Heading:</span>{" "}
                    <span className="font-medium">{sg.headingFont}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Body:</span>{" "}
                    <span className="font-medium">{sg.bodyFont}</span>
                  </p>
                </div>

                {/* Shape */}
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">Radius: {sg.borderRadius}px</Badge>
                  <Badge variant="outline">Button: {sg.buttonStyle}</Badge>
                  <Badge variant="outline">Shadow: {sg.cardShadow}</Badge>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="self-start"
                  onClick={() => setShowStyleEditor(true)}
                >
                  <Paintbrush className="size-3.5" data-icon="inline-start" />
                  Edit Style Guide
                </Button>
              </>
            )}

            {showStyleEditor && (
              <div className="flex flex-col gap-3">
                <StyleGuidePanel
                  styleGuide={sg}
                  onChange={handleStyleGuideChange}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="self-start"
                  onClick={() => setShowStyleEditor(false)}
                >
                  Collapse
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* --- Discovery Summary --- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="size-4" />
              Discovery Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {/* Notes (truncated) */}
            {project.discoveryNotes && (
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">Notes</p>
                <p className="line-clamp-4 text-sm">{project.discoveryNotes}</p>
              </div>
            )}

            {/* Value Propositions */}
            {project.valuePropositions.length > 0 && (
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  Value Propositions
                </p>
                <ul className="list-inside list-disc space-y-0.5 text-sm">
                  {project.valuePropositions.map((vp, i) => (
                    <li key={i}>{vp}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Differentiators */}
            {project.differentiators.length > 0 && (
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  Differentiators
                </p>
                <ul className="list-inside list-disc space-y-0.5 text-sm">
                  {project.differentiators.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Competitor URLs */}
            {project.competitorUrls.length > 0 && (
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  Competitors
                </p>
                <ul className="space-y-1 text-sm">
                  {project.competitorUrls.map((url, i) => (
                    <li key={i}>
                      <a
                        href={url.startsWith("http") ? url : `https://${url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <ExternalLink className="size-3" />
                        {url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!project.discoveryNotes &&
              project.valuePropositions.length === 0 &&
              project.differentiators.length === 0 &&
              project.competitorUrls.length === 0 && (
                <p className="text-sm text-muted-foreground">No discovery data yet.</p>
              )}
          </CardContent>
        </Card>

        {/* --- Technical --- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="size-4" />
              Technical
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {/* CMS Platform */}
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">CMS Platform</p>
              <Badge variant="secondary">{project.cmsPlatform || "TBD"}</Badge>
            </div>

            {/* Integrations */}
            {project.integrations.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                  Integrations
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.integrations.map((integration) => (
                    <Badge key={integration.id} variant="outline">
                      {integration.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Hosting Notes */}
            {project.hostingNotes && (
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  Hosting Notes
                </p>
                <p className="text-sm">{project.hostingNotes}</p>
              </div>
            )}

            {!project.cmsPlatform &&
              project.integrations.length === 0 &&
              !project.hostingNotes && (
                <p className="text-sm text-muted-foreground">No technical details yet.</p>
              )}
          </CardContent>
        </Card>

        {/* --- Content Inventory --- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="size-4" />
              Content Inventory
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                Existing Content
              </p>
              <p className="text-sm">
                {project.existingContent || <span className="text-muted-foreground">None noted</span>}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                Content to Create
              </p>
              <p className="text-sm">
                {project.contentToCreate || <span className="text-muted-foreground">None noted</span>}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                Content Ownership
              </p>
              <p className="text-sm">
                {project.contentOwnership || <span className="text-muted-foreground">None noted</span>}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
