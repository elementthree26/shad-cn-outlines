"use client";

import { useState } from "react";
import {
  FileDown,
  Printer,
  X,
  Globe,
  Users,
  Target,
  Lightbulb,
  Award,
  Link2,
  Layers,
  Settings2,
  Plug,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Project, phaseDefinitions, getPagesBySprint } from "@/lib/project-types";

function BriefSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="brief-section mb-6 break-inside-avoid">
      <div className="flex items-center gap-2 mb-2 border-b border-border pb-1.5">
        <Icon className="h-4 w-4 text-primary print:text-black" />
        <h3 className="text-sm font-bold uppercase tracking-wide">{title}</h3>
      </div>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function BulletList({ items, emptyText }: { items: string[]; emptyText?: string }) {
  if (items.length === 0) return <p className="text-muted-foreground italic text-xs">{emptyText || "None specified"}</p>;
  return (
    <ul className="space-y-1 ml-4">
      {items.map((item, i) => (
        <li key={i} className="list-disc text-xs">{item}</li>
      ))}
    </ul>
  );
}

/**
 * Full project brief - designed for print/PDF export.
 * Renders as an overlay that can be printed via window.print().
 */
function BriefDocument({ project, onClose }: { project: Project; onClose: () => void }) {
  const sprintMap = getPagesBySprint(project.sitemap);
  const sprintNumbers = [...sprintMap.keys()].sort((a, b) => a - b);

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-auto print:static print:overflow-visible">
      {/* Toolbar - hidden in print */}
      <div className="sticky top-0 z-10 bg-card border-b px-6 py-3 flex items-center justify-between print:hidden">
        <h2 className="text-sm font-bold">Project Brief Preview</h2>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5" /> Print / Save PDF
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Brief content */}
      <div className="max-w-3xl mx-auto px-8 py-10 print:px-0 print:py-0 print:max-w-none">
        {/* Cover / Header */}
        <div className="mb-10 text-center print:mb-8">
          {project.logoUrl && (
            <img src={project.logoUrl} alt="" className="h-12 mx-auto mb-4 object-contain" />
          )}
          <h1 className="text-2xl font-bold tracking-tight mb-1">
            {project.clientName || "Project"} — Web Project Brief
          </h1>
          <p className="text-sm text-muted-foreground">
            Prepared by Element Three • {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
          {project.industry && (
            <p className="text-xs text-muted-foreground mt-1">Industry: {project.industry}</p>
          )}
        </div>

        {/* --- Project Overview --- */}
        <BriefSection icon={Target} title="Project Overview">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">Client Goals</p>
              <BulletList items={project.clientGoals} />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">Target Audiences</p>
              <BulletList items={project.targetAudiences} />
            </div>
          </div>
        </BriefSection>

        {/* --- Strategic Positioning --- */}
        <BriefSection icon={Lightbulb} title="Strategic Positioning">
          {project.valuePropositions.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Value Propositions</p>
              <BulletList items={project.valuePropositions} />
            </div>
          )}
          {project.differentiators.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Key Differentiators</p>
              <BulletList items={project.differentiators} />
            </div>
          )}
          {project.competitorUrls.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">Competitive References</p>
              <ul className="space-y-0.5 ml-4">
                {project.competitorUrls.map((url, i) => (
                  <li key={i} className="list-disc text-xs font-mono text-primary break-all">{url}</li>
                ))}
              </ul>
            </div>
          )}
        </BriefSection>

        {/* --- Discovery Notes --- */}
        {project.discoveryNotes && (
          <BriefSection icon={FileText} title="Discovery Notes">
            <p className="text-xs whitespace-pre-wrap bg-muted/30 rounded-lg p-4 print:bg-transparent print:p-0">
              {project.discoveryNotes}
            </p>
          </BriefSection>
        )}

        {/* --- Sitemap --- */}
        <BriefSection icon={Layers} title="Proposed Sitemap">
          {sprintNumbers.map((sprint) => {
            const pages = sprintMap.get(sprint) || [];
            return (
              <div key={sprint} className="mb-4">
                <p className="text-xs font-bold text-muted-foreground mb-1.5">
                  Sprint {sprint} ({pages.length} pages)
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                  {pages.map((page) => (
                    <div key={page.id} className="flex items-baseline gap-2 text-xs py-0.5">
                      <span className="font-medium">{page.name}</span>
                      <span className="text-muted-foreground font-mono text-[10px]">/{page.slug}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          <p className="text-[10px] text-muted-foreground mt-2">
            Total: {project.sitemap.length} pages across {sprintNumbers.length} sprint{sprintNumbers.length !== 1 ? "s" : ""}
          </p>
        </BriefSection>

        {/* --- Page Detail --- */}
        {project.sitemap.filter((p) => p.pageGoal || p.audiences.length > 0 || p.sections.length > 0).length > 0 && (
          <BriefSection icon={FileText} title="Page Details">
            <div className="space-y-4">
              {project.sitemap
                .filter((p) => p.pageGoal || p.audiences.length > 0 || p.sections.length > 0)
                .map((page) => (
                  <div key={page.id} className="rounded border p-3 break-inside-avoid">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xs font-bold">{page.name}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">/{page.slug}</span>
                    </div>
                    {page.purpose && <p className="text-[10px] text-muted-foreground mb-1">{page.purpose}</p>}
                    {page.pageGoal && (
                      <p className="text-[10px]"><span className="font-semibold">Goal:</span> {page.pageGoal}</p>
                    )}
                    {page.audiences.length > 0 && (
                      <p className="text-[10px]"><span className="font-semibold">Audiences:</span> {page.audiences.join(", ")}</p>
                    )}
                    {page.sections.length > 0 && (
                      <div className="mt-1.5">
                        <p className="text-[10px] font-semibold mb-0.5">Sections ({page.sections.length}):</p>
                        <div className="flex flex-wrap gap-1">
                          {page.sections.map((s) => (
                            <span key={s.instanceId} className="rounded bg-muted px-1.5 py-0.5 text-[9px]">
                              {s.themeName}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </BriefSection>
        )}

        {/* --- Content Inventory --- */}
        {(project.existingContent || project.contentToCreate || project.contentOwnership) && (
          <BriefSection icon={FileText} title="Content Inventory">
            <div className="grid grid-cols-3 gap-4">
              {project.existingContent && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Existing Content</p>
                  <p className="text-xs whitespace-pre-wrap">{project.existingContent}</p>
                </div>
              )}
              {project.contentToCreate && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Content to Create</p>
                  <p className="text-xs whitespace-pre-wrap">{project.contentToCreate}</p>
                </div>
              )}
              {project.contentOwnership && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Content Ownership</p>
                  <p className="text-xs whitespace-pre-wrap">{project.contentOwnership}</p>
                </div>
              )}
            </div>
          </BriefSection>
        )}

        {/* --- Technical --- */}
        <BriefSection icon={Settings2} title="Technical Requirements">
          <div className="space-y-2">
            <p className="text-xs">
              <span className="font-semibold">CMS Platform:</span> {project.cmsPlatform || "TBD"}
            </p>
            {project.integrations.length > 0 && (
              <div>
                <p className="text-xs font-semibold mb-1">Integrations:</p>
                <div className="flex flex-wrap gap-1">
                  {project.integrations.map((intg) => (
                    <span key={intg.id} className="rounded border px-2 py-0.5 text-[10px]">
                      {intg.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {project.hostingNotes && (
              <p className="text-xs">
                <span className="font-semibold">Hosting:</span> {project.hostingNotes}
              </p>
            )}
            {project.currentSiteUrl && (
              <p className="text-xs">
                <span className="font-semibold">Current Site:</span>{" "}
                <span className="font-mono">{project.currentSiteUrl}</span>
              </p>
            )}
          </div>
        </BriefSection>

        {/* --- Redirect Map Summary --- */}
        {project.redirects.length > 0 && (
          <BriefSection icon={Link2} title="Redirect Map">
            <p className="text-xs text-muted-foreground mb-2">
              {project.redirects.length} redirects — {project.redirects.filter((r) => r.status === "verified").length} verified,{" "}
              {project.redirects.filter((r) => r.status === "mapped").length} mapped,{" "}
              {project.redirects.filter((r) => r.status === "pending").length} pending
            </p>
            <table className="w-full text-[10px] border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1 font-semibold">Old URL</th>
                  <th className="text-left py-1 font-semibold">New URL</th>
                  <th className="text-left py-1 font-semibold w-16">Status</th>
                </tr>
              </thead>
              <tbody>
                {project.redirects.map((r) => (
                  <tr key={r.id} className="border-b border-border/50">
                    <td className="py-0.5 font-mono">{r.oldUrl}</td>
                    <td className="py-0.5 font-mono">{r.newUrl || "—"}</td>
                    <td className="py-0.5">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </BriefSection>
        )}

        {/* --- Timeline --- */}
        <BriefSection icon={Globe} title="Projected Timeline">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-1.5 font-semibold">Phase</th>
                <th className="text-left py-1.5 font-semibold">Timeline</th>
                <th className="text-left py-1.5 font-semibold">Your Role</th>
                <th className="text-left py-1.5 font-semibold">Gate</th>
              </tr>
            </thead>
            <tbody>
              {phaseDefinitions.map((phase) => (
                <tr key={phase.id} className="border-b border-border/50">
                  <td className="py-1.5 font-medium">{phase.name}</td>
                  <td className="py-1.5 text-muted-foreground">{phase.timing}</td>
                  <td className="py-1.5 text-muted-foreground">{phase.humanRole}</td>
                  <td className="py-1.5 text-muted-foreground">{phase.gate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[10px] text-muted-foreground mt-2">
            Estimated total: 8–14 weeks (AI-adapted process)
          </p>
        </BriefSection>

        {/* Footer */}
        <div className="mt-10 pt-4 border-t text-center text-[10px] text-muted-foreground">
          <p>Prepared using the E3 Web Project Platform</p>
          <p>Human-led strategy. AI-powered execution. Continuous optimization.</p>
        </div>
      </div>
    </div>
  );
}

export function ProjectBriefButton({ project }: { project: Project }) {
  const [showBrief, setShowBrief] = useState(false);

  return (
    <>
      <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setShowBrief(true)}>
        <FileDown className="h-3.5 w-3.5" /> Export Brief
      </Button>
      {showBrief && (
        <BriefDocument project={project} onClose={() => setShowBrief(false)} />
      )}
    </>
  );
}
