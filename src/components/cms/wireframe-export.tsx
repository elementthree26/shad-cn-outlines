"use client";

import { useState } from "react";
import { Printer, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Project, SitemapPage, getPagesBySprint } from "@/lib/project-types";
import { WireframeBlock, wireframeBlockMeta } from "@/components/wireframe-blocks";

/**
 * Print-optimized wireframe export — replicates the Miro content outline layout:
 * - Page strategy brief card at the top
 * - Each section: wireframe left, notes/content right
 */
function WireframeExportDocument({
  page,
  project,
  onClose,
}: {
  page: SitemapPage;
  project: Project;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-white overflow-auto print:static print:overflow-visible">
      {/* Toolbar — hidden in print */}
      <div className="sticky top-0 z-10 bg-card border-b px-6 py-3 flex items-center justify-between print:hidden">
        <h2 className="text-sm font-bold">Content Outline: {page.name}</h2>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5" /> Print / Save PDF
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 print:px-0 print:max-w-none print:py-4">
        {/* ===== Page Strategy Brief Card ===== */}
        <div className="rounded-xl border-2 border-gray-300 p-6 mb-8 break-inside-avoid print:border print:rounded-lg">
          <h1 className="text-2xl font-bold mb-4">{page.name}</h1>

          {page.audiences.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Audience(s)</p>
              <ul className="text-sm space-y-1 ml-4">
                {page.audiences.map((a, i) => (
                  <li key={i} className="list-disc">{a}</li>
                ))}
              </ul>
            </div>
          )}

          {page.referenceUrls.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Resources</p>
              <ul className="text-sm space-y-0.5 ml-4">
                {page.referenceUrls.map((u, i) => (
                  <li key={i} className="list-disc font-mono text-xs text-blue-700 break-all">{u}</li>
                ))}
              </ul>
            </div>
          )}

          {page.pageGoal && (
            <div className="mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Goal of page</p>
              <p className="text-sm">{page.pageGoal}</p>
            </div>
          )}

          {page.notes && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Notes</p>
              <p className="text-sm whitespace-pre-wrap">{page.notes}</p>
            </div>
          )}
        </div>

        {/* ===== Section-by-section: wireframe left, notes right ===== */}
        <div className="space-y-6">
          {page.sections.map((section, idx) => {
            const meta = wireframeBlockMeta[section.selectedBlockId];
            const c = section.content;
            const hasContent = c.heading || c.subheading || c.body || c.ctaText || c.items.length > 0;
            const hasNotes = section.directionNotes;

            return (
              <div key={section.instanceId} className="flex gap-6 break-inside-avoid">
                {/* Left: wireframe */}
                <div className="w-[340px] flex-shrink-0">
                  <div className="rounded-lg border bg-gray-50 p-3">
                    <WireframeBlock
                      blockId={section.selectedBlockId}
                      className="w-full h-auto text-gray-400"
                    />
                  </div>
                  {/* Section label under wireframe */}
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-xs font-semibold text-gray-600">{section.themeName}</p>
                    <Badge variant="outline" className="text-[9px] px-1 py-0">
                      {meta?.label}
                    </Badge>
                  </div>
                </div>

                {/* Right: notes & content */}
                <div className="flex-1 min-w-0">
                  {/* Direction notes */}
                  {hasNotes && (
                    <div className="mb-3">
                      <ul className="text-sm space-y-1">
                        {section.directionNotes.split("\n").filter(Boolean).map((line, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-gray-400 mt-1 text-xs">•</span>
                            <span>{line.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Content fields */}
                  {hasContent && (
                    <div className="space-y-1.5 text-sm">
                      {c.heading && (
                        <div className="flex items-start gap-2">
                          <span className="text-gray-400 text-xs font-medium w-20 flex-shrink-0 mt-0.5">Heading:</span>
                          <span>{c.heading}</span>
                        </div>
                      )}
                      {c.subheading && (
                        <div className="flex items-start gap-2">
                          <span className="text-gray-400 text-xs font-medium w-20 flex-shrink-0 mt-0.5">Subhead:</span>
                          <span>{c.subheading}</span>
                        </div>
                      )}
                      {c.body && (
                        <div className="flex items-start gap-2">
                          <span className="text-gray-400 text-xs font-medium w-20 flex-shrink-0 mt-0.5">Copy:</span>
                          <span className="whitespace-pre-wrap">{c.body}</span>
                        </div>
                      )}
                      {c.ctaText && (
                        <div className="flex items-start gap-2">
                          <span className="text-gray-400 text-xs font-medium w-20 flex-shrink-0 mt-0.5">CTA:</span>
                          <span>{c.ctaText}</span>
                        </div>
                      )}

                      {/* Items as nested bullets */}
                      {c.items.length > 0 && (
                        <div className="mt-2">
                          <span className="text-gray-400 text-xs font-medium">Items:</span>
                          <ul className="ml-4 mt-1 space-y-1">
                            {c.items.map((item, i) => (
                              <li key={item.id} className="text-sm">
                                <span className="font-medium">{item.title || `Item ${i + 1}`}</span>
                                {item.description && (
                                  <ul className="ml-4 mt-0.5">
                                    <li className="text-gray-600 list-disc">{item.description}</li>
                                  </ul>
                                )}
                                {item.extra && (
                                  <ul className="ml-4">
                                    <li className="text-gray-500 list-disc text-xs">{item.extra}</li>
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {!hasContent && !hasNotes && (
                    <p className="text-sm text-gray-400 italic">No content or notes yet</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-10 pt-4 border-t text-center text-[10px] text-gray-400 print:mt-6">
          <p>{project.clientName} — {page.name} Content Outline • {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}

/** Renders a single page's sections as content outline (reusable) */
function PageOutline({ page, project }: { page: SitemapPage; project: Project }) {
  return (
    <div className="break-before-page">
      {/* Page strategy brief */}
      <div className="rounded-xl border-2 border-gray-300 p-6 mb-6 break-inside-avoid print:border print:rounded-lg">
        <h2 className="text-xl font-bold mb-3">{page.name}</h2>
        {page.audiences.length > 0 && (
          <div className="mb-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Audiences</p>
            <ul className="text-xs space-y-0.5 ml-3">
              {page.audiences.map((a, i) => <li key={i} className="list-disc">{a}</li>)}
            </ul>
          </div>
        )}
        {page.pageGoal && (
          <div className="mb-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Goal</p>
            <p className="text-xs">{page.pageGoal}</p>
          </div>
        )}
        {page.referenceUrls.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">References</p>
            <ul className="text-xs space-y-0.5 ml-3">
              {page.referenceUrls.map((u, i) => <li key={i} className="list-disc font-mono text-[10px] text-blue-700 break-all">{u}</li>)}
            </ul>
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {page.sections.map((section) => {
          const meta = wireframeBlockMeta[section.selectedBlockId];
          const c = section.content;
          return (
            <div key={section.instanceId} className="flex gap-4 break-inside-avoid">
              <div className="w-[240px] flex-shrink-0">
                <div className="rounded border bg-gray-50 p-2">
                  <WireframeBlock blockId={section.selectedBlockId} className="w-full h-auto text-gray-400" />
                </div>
                <p className="text-[10px] font-medium text-gray-500 mt-1">{section.themeName}</p>
              </div>
              <div className="flex-1 min-w-0 text-xs space-y-1">
                {section.directionNotes && (
                  <ul className="space-y-0.5">
                    {section.directionNotes.split("\n").filter(Boolean).map((line, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-gray-400 text-[10px] mt-0.5">•</span>
                        <span>{line.trim()}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {c.heading && <p><span className="text-gray-400">H:</span> {c.heading}</p>}
                {c.subheading && <p><span className="text-gray-400">Sub:</span> {c.subheading}</p>}
                {c.body && <p><span className="text-gray-400">Copy:</span> {c.body}</p>}
                {c.ctaText && <p><span className="text-gray-400">CTA:</span> {c.ctaText}</p>}
                {c.items.length > 0 && (
                  <ul className="ml-2 space-y-0.5">
                    {c.items.map((item, i) => (
                      <li key={item.id}>
                        <span className="font-medium">{item.title || `Item ${i+1}`}</span>
                        {item.description && <span className="text-gray-500"> — {item.description}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Full project content outlines export - all pages grouped by sprint */
function FullProjectExportDocument({ project, onClose }: { project: Project; onClose: () => void }) {
  const sprintMap = getPagesBySprint(project.sitemap);
  const sprints = [...sprintMap.keys()].sort((a, b) => a - b);

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-auto print:static print:overflow-visible">
      <div className="sticky top-0 z-10 bg-card border-b px-6 py-3 flex items-center justify-between print:hidden">
        <h2 className="text-sm font-bold">Content Outlines — {project.clientName}</h2>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5" /> Print / Save PDF
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 print:px-0 print:max-w-none print:py-4">
        {/* Cover */}
        <div className="text-center mb-10 print:mb-6">
          {project.logoUrl && <img src={project.logoUrl} alt="" className="h-10 mx-auto mb-3 object-contain" />}
          <h1 className="text-2xl font-bold">Content Outlines</h1>
          <p className="text-sm text-gray-500">{project.clientName} • {new Date().toLocaleDateString()}</p>
          <p className="text-xs text-gray-400 mt-1">{project.sitemap.length} pages across {sprints.length} sprint{sprints.length !== 1 ? "s" : ""}</p>
        </div>

        {/* Sprint-by-sprint */}
        {sprints.map((sprint) => {
          const pages = sprintMap.get(sprint) || [];
          const pagesWithSections = pages.filter((p) => p.sections.length > 0);
          return (
            <div key={sprint} className="mb-12">
              <div className="flex items-center gap-3 mb-6 border-b pb-2">
                <Badge className="bg-amber-100 text-amber-800 border-amber-300">Sprint {sprint}</Badge>
                <span className="text-sm text-gray-500">
                  {pages.length} pages • {pagesWithSections.length} with wireframes
                </span>
              </div>
              <div className="space-y-10">
                {pagesWithSections.map((page) => (
                  <PageOutline key={page.id} page={page} project={project} />
                ))}
                {pages.filter((p) => p.sections.length === 0).length > 0 && (
                  <div className="text-xs text-gray-400 italic">
                    Pages without wireframes: {pages.filter((p) => p.sections.length === 0).map((p) => p.name).join(", ")}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WireframeExportButton({ page, project }: { page: SitemapPage; project: Project }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setShow(true)} disabled={page.sections.length === 0}>
        <Printer className="h-3.5 w-3.5" /> Content Outline
      </Button>
      {show && <WireframeExportDocument page={page} project={project} onClose={() => setShow(false)} />}
    </>
  );
}

export function FullProjectExportButton({ project }: { project: Project }) {
  const [show, setShow] = useState(false);
  const pagesWithSections = project.sitemap.filter((p) => p.sections.length > 0).length;
  return (
    <>
      <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setShow(true)} disabled={pagesWithSections === 0}>
        <Printer className="h-3.5 w-3.5" /> All Outlines
      </Button>
      {show && <FullProjectExportDocument project={project} onClose={() => setShow(false)} />}
    </>
  );
}
