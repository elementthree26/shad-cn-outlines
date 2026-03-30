"use client";

import { useState } from "react";
import { Printer, X, Copy, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Project, SitemapPage } from "@/lib/project-types";
import { wireframeBlockMeta } from "@/components/wireframe-blocks";

function generateWriterBriefMarkdown(page: SitemapPage, project: Project): string {
  const lines: string[] = [];

  lines.push(`# Content Brief: ${page.name}`);
  lines.push(`**Client:** ${project.clientName}`);
  lines.push(`**Page URL:** /${page.slug}`);
  lines.push(`**Date:** ${new Date().toLocaleDateString()}`);
  lines.push(``);

  lines.push(`## Page Purpose`);
  lines.push(page.purpose || "_Not specified_");
  lines.push(``);

  if (page.pageGoal) {
    lines.push(`## Page Goal`);
    lines.push(page.pageGoal);
    lines.push(``);
  }

  if (page.audiences.length > 0) {
    lines.push(`## Target Audiences`);
    page.audiences.forEach((a) => lines.push(`- ${a}`));
    lines.push(``);
  }

  // Brand voice context
  if (project.valuePropositions.length > 0 || project.differentiators.length > 0) {
    lines.push(`## Brand Context`);
    if (project.valuePropositions.length > 0) {
      lines.push(`### Value Propositions`);
      project.valuePropositions.forEach((v) => lines.push(`- ${v}`));
      lines.push(``);
    }
    if (project.differentiators.length > 0) {
      lines.push(`### Key Differentiators`);
      project.differentiators.forEach((d) => lines.push(`- ${d}`));
      lines.push(``);
    }
  }

  if (page.seoTitle || page.seoDescription) {
    lines.push(`## SEO Requirements`);
    if (page.seoTitle) lines.push(`- **Title Tag:** ${page.seoTitle}`);
    if (page.seoDescription) lines.push(`- **Meta Description:** ${page.seoDescription}`);
    lines.push(``);
  }

  lines.push(`---`);
  lines.push(``);
  lines.push(`## Section-by-Section Copy Needs`);
  lines.push(``);

  page.sections.forEach((section, idx) => {
    const meta = wireframeBlockMeta[section.selectedBlockId];
    const c = section.content;
    const hasExisting = c.heading || c.subheading || c.body || c.ctaText;

    lines.push(`### ${idx + 1}. ${section.themeName}`);
    lines.push(`**Component:** ${meta?.label || section.selectedBlockId} (${meta?.category || "Section"})`);
    lines.push(``);

    if (section.directionNotes) {
      lines.push(`**Direction:**`);
      lines.push(`> ${section.directionNotes.replace(/\n/g, "\n> ")}`);
      lines.push(``);
    }

    // Copy fields needed
    lines.push(`**Copy needed:**`);
    lines.push(``);

    if (c.heading) {
      lines.push(`- **Heading** (existing): ${c.heading}`);
    } else {
      lines.push(`- **Heading**: _Write a compelling headline for this section_`);
    }

    if (c.subheading) {
      lines.push(`- **Subheading** (existing): ${c.subheading}`);
    } else {
      lines.push(`- **Subheading**: _Supporting text under the headline_`);
    }

    if (c.body) {
      lines.push(`- **Body copy** (existing): ${c.body}`);
    } else {
      lines.push(`- **Body copy**: _Main paragraph content_`);
    }

    if (c.ctaText) {
      lines.push(`- **CTA** (existing): ${c.ctaText}`);
    } else {
      lines.push(`- **CTA button text**: _What should the button say?_`);
    }

    lines.push(``);

    // Items
    if (c.items.length > 0) {
      lines.push(`**Items to write (${c.items.length}):**`);
      lines.push(``);
      c.items.forEach((item, i) => {
        lines.push(`${i + 1}. **${item.title || `Item ${i + 1}`}**`);
        if (item.description) lines.push(`   - Description: ${item.description}`);
        if (item.extra) lines.push(`   - Extra: ${item.extra}`);
        if (!item.title) lines.push(`   - _Needs title_`);
        if (!item.description) lines.push(`   - _Needs description_`);
        lines.push(``);
      });
    }

    lines.push(`---`);
    lines.push(``);
  });

  if (page.contentNotes) {
    lines.push(`## Additional Notes`);
    lines.push(page.contentNotes);
    lines.push(``);
  }

  if (page.referenceUrls.length > 0) {
    lines.push(`## Reference URLs`);
    page.referenceUrls.forEach((u) => lines.push(`- ${u}`));
    lines.push(``);
  }

  return lines.join("\n");
}

function WriterBriefDocument({
  page,
  project,
  onClose,
}: {
  page: SitemapPage;
  project: Project;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const markdown = generateWriterBriefMarkdown(page, project);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${page.slug}-writer-brief.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-auto">
      <div className="sticky top-0 z-10 bg-card border-b px-6 py-3 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold">Writer Brief: {page.name}</h2>
          <Badge variant="secondary" className="text-xs">
            {page.sections.length} sections
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1.5" onClick={handleCopy}>
            {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy MD"}
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={handleDownload}>
            <Download className="h-3.5 w-3.5" /> Download
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5" /> Print
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-10 print:px-0 print:max-w-none">
        {/* Render as styled HTML for printing */}
        <div className="mb-8 border-b pb-6">
          <h1 className="text-2xl font-bold mb-2">Content Brief: {page.name}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span><strong>Client:</strong> {project.clientName}</span>
            <span><strong>URL:</strong> /{page.slug}</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Purpose & Goal */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-sm font-bold mb-2">Page Purpose</h2>
            <p className="text-sm">{page.purpose || "Not specified"}</p>
          </div>
          {page.pageGoal && (
            <div>
              <h2 className="text-sm font-bold mb-2">Page Goal</h2>
              <p className="text-sm">{page.pageGoal}</p>
            </div>
          )}
        </div>

        {page.audiences.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold mb-2">Target Audiences</h2>
            <div className="flex gap-2 flex-wrap">
              {page.audiences.map((a, i) => (
                <Badge key={i} variant="outline">{a}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Brand context */}
        {(project.valuePropositions.length > 0 || project.differentiators.length > 0) && (
          <div className="mb-8 rounded-lg bg-muted/30 p-4">
            <h2 className="text-sm font-bold mb-3">Brand Context</h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              {project.valuePropositions.length > 0 && (
                <div>
                  <p className="font-semibold mb-1">Value Propositions</p>
                  <ul className="space-y-0.5 text-muted-foreground">
                    {project.valuePropositions.map((v, i) => <li key={i}>• {v}</li>)}
                  </ul>
                </div>
              )}
              {project.differentiators.length > 0 && (
                <div>
                  <p className="font-semibold mb-1">Key Differentiators</p>
                  <ul className="space-y-0.5 text-muted-foreground">
                    {project.differentiators.map((d, i) => <li key={i}>• {d}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section-by-section */}
        <h2 className="text-lg font-bold mb-4">Section-by-Section Copy Needs</h2>
        <div className="space-y-6">
          {page.sections.map((section, idx) => {
            const meta = wireframeBlockMeta[section.selectedBlockId];
            const c = section.content;
            return (
              <div key={section.instanceId} className="rounded-lg border p-5 break-inside-avoid">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-xs font-mono text-muted-foreground">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-sm font-bold">{section.themeName}</h3>
                  <Badge variant="secondary" className="text-[10px]">
                    {meta?.label || section.selectedBlockId}
                  </Badge>
                </div>

                {section.directionNotes && (
                  <div className="rounded bg-amber-50 border-l-2 border-amber-400 px-3 py-2 mb-3">
                    <p className="text-xs font-semibold text-amber-800 mb-0.5">Direction</p>
                    <p className="text-xs text-amber-900/70 whitespace-pre-wrap">{section.directionNotes}</p>
                  </div>
                )}

                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded border p-2">
                      <p className="font-semibold text-muted-foreground mb-0.5">Heading</p>
                      <p className={c.heading ? "" : "text-muted-foreground italic"}>
                        {c.heading || "Needs headline"}
                      </p>
                    </div>
                    <div className="rounded border p-2">
                      <p className="font-semibold text-muted-foreground mb-0.5">Subheading</p>
                      <p className={c.subheading ? "" : "text-muted-foreground italic"}>
                        {c.subheading || "Needs subheading"}
                      </p>
                    </div>
                  </div>
                  <div className="rounded border p-2">
                    <p className="font-semibold text-muted-foreground mb-0.5">Body Copy</p>
                    <p className={c.body ? "whitespace-pre-wrap" : "text-muted-foreground italic"}>
                      {c.body || "Needs body copy"}
                    </p>
                  </div>
                  {(c.ctaText || true) && (
                    <div className="rounded border p-2">
                      <p className="font-semibold text-muted-foreground mb-0.5">CTA</p>
                      <p className={c.ctaText ? "" : "text-muted-foreground italic"}>
                        {c.ctaText || "Needs CTA text"}
                      </p>
                    </div>
                  )}

                  {c.items.length > 0 && (
                    <div className="mt-2">
                      <p className="font-semibold text-muted-foreground mb-1.5">
                        Items ({c.items.length})
                      </p>
                      <div className="space-y-1.5">
                        {c.items.map((item, i) => (
                          <div key={item.id} className="rounded border p-2 bg-muted/20">
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-mono text-muted-foreground/50 text-[10px]">{i + 1}.</span>
                              <span className={`font-medium ${item.title ? "" : "text-muted-foreground italic"}`}>
                                {item.title || "Needs title"}
                              </span>
                            </div>
                            {item.description ? (
                              <p className="text-muted-foreground ml-4 mt-0.5">{item.description}</p>
                            ) : (
                              <p className="text-muted-foreground italic ml-4 mt-0.5">Needs description</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function WriterBriefButton({
  page,
  project,
}: {
  page: SitemapPage;
  project: Project;
}) {
  const [show, setShow] = useState(false);

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="gap-1.5"
        onClick={() => setShow(true)}
        disabled={page.sections.length === 0}
      >
        <Printer className="h-3.5 w-3.5" /> Writer Brief
      </Button>
      {show && (
        <WriterBriefDocument
          page={page}
          project={project}
          onClose={() => setShow(false)}
        />
      )}
    </>
  );
}
