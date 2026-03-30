"use client";

import { useState } from "react";
import { Code, FileText, Copy, Check, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Project,
  SitemapPage,
  PageSection,
  SectionContent,
  ContentItem,
} from "@/lib/project-types";
import { wireframeBlockMeta } from "@/components/wireframe-blocks";

// ============================================================
// CODE EXPORT — generates React/Next.js component code
// ============================================================

function sectionToJsx(section: PageSection, indent: string = "      "): string {
  const { content, selectedBlockId, themeName, directionNotes } = section;
  const meta = wireframeBlockMeta[selectedBlockId];
  const cat = meta?.category || "Section";
  const hasContent =
    content.heading || content.subheading || content.body || content.ctaText || content.items.length > 0;

  const lines: string[] = [];
  lines.push(`${indent}{/* ${themeName} — ${meta?.label || selectedBlockId} */}`);

  if (directionNotes) {
    const noteLines = directionNotes.split("\n");
    noteLines.forEach((n) => lines.push(`${indent}{/* NOTE: ${n.trim()} */}`));
  }

  lines.push(`${indent}<section className="py-16 px-6">`);

  if (content.heading) {
    lines.push(`${indent}  <div className="max-w-6xl mx-auto">`);
    lines.push(`${indent}    <h2 className="text-3xl font-bold mb-4">${escHtml(content.heading)}</h2>`);
    if (content.subheading) {
      lines.push(`${indent}    <p className="text-lg text-muted-foreground mb-8">${escHtml(content.subheading)}</p>`);
    }
  } else {
    lines.push(`${indent}  <div className="max-w-6xl mx-auto">`);
  }

  if (content.body) {
    lines.push(`${indent}    <p className="text-muted-foreground mb-6">${escHtml(content.body)}</p>`);
  }

  // Items
  if (content.items.length > 0) {
    if (cat === "Cards") {
      const cols = selectedBlockId.includes("4-col") ? 4 : selectedBlockId.includes("2-col") ? 2 : 3;
      lines.push(`${indent}    <div className="grid grid-cols-${cols} gap-6">`);
      content.items.forEach((item) => {
        lines.push(`${indent}      <div className="rounded-lg border p-6">`);
        if (item.imageUrl) lines.push(`${indent}        <img src="${escHtml(item.imageUrl)}" alt="${escHtml(item.title)}" className="w-full h-40 object-cover rounded mb-4" />`);
        if (item.title) lines.push(`${indent}        <h3 className="font-semibold mb-2">${escHtml(item.title)}</h3>`);
        if (item.description) lines.push(`${indent}        <p className="text-sm text-muted-foreground">${escHtml(item.description)}</p>`);
        lines.push(`${indent}      </div>`);
      });
      lines.push(`${indent}    </div>`);
    } else if (cat === "Stats") {
      lines.push(`${indent}    <div className="grid grid-cols-4 gap-8 text-center">`);
      content.items.forEach((item) => {
        lines.push(`${indent}      <div>`);
        lines.push(`${indent}        <p className="text-4xl font-bold">${escHtml(item.extra)}</p>`);
        lines.push(`${indent}        <p className="text-sm text-muted-foreground mt-1">${escHtml(item.title)}</p>`);
        lines.push(`${indent}      </div>`);
      });
      lines.push(`${indent}    </div>`);
    } else if (cat === "Testimonials") {
      lines.push(`${indent}    <div className="grid grid-cols-${Math.min(content.items.length, 3)} gap-6">`);
      content.items.forEach((item) => {
        lines.push(`${indent}      <blockquote className="rounded-lg border p-6">`);
        if (item.extra) lines.push(`${indent}        <p className="text-sm italic mb-4">"${escHtml(item.extra)}"</p>`);
        lines.push(`${indent}        <footer className="flex items-center gap-3">`);
        if (item.imageUrl) lines.push(`${indent}          <img src="${escHtml(item.imageUrl)}" alt="" className="w-8 h-8 rounded-full" />`);
        lines.push(`${indent}          <div>`);
        if (item.title) lines.push(`${indent}            <p className="font-medium text-sm">${escHtml(item.title)}</p>`);
        if (item.description) lines.push(`${indent}            <p className="text-xs text-muted-foreground">${escHtml(item.description)}</p>`);
        lines.push(`${indent}          </div>`);
        lines.push(`${indent}        </footer>`);
        lines.push(`${indent}      </blockquote>`);
      });
      lines.push(`${indent}    </div>`);
    } else if (cat === "Team") {
      lines.push(`${indent}    <div className="grid grid-cols-3 gap-8">`);
      content.items.forEach((item) => {
        lines.push(`${indent}      <div className="text-center">`);
        if (item.imageUrl) lines.push(`${indent}        <img src="${escHtml(item.imageUrl)}" alt="${escHtml(item.title)}" className="w-24 h-24 rounded-full mx-auto mb-3 object-cover" />`);
        if (item.title) lines.push(`${indent}        <p className="font-semibold">${escHtml(item.title)}</p>`);
        if (item.description) lines.push(`${indent}        <p className="text-sm text-muted-foreground">${escHtml(item.description)}</p>`);
        lines.push(`${indent}      </div>`);
      });
      lines.push(`${indent}    </div>`);
    } else {
      // Generic list
      lines.push(`${indent}    <div className="space-y-4">`);
      content.items.forEach((item, i) => {
        lines.push(`${indent}      <div className="flex items-start gap-4">`);
        lines.push(`${indent}        <span className="text-sm font-mono text-muted-foreground">${String(i + 1).padStart(2, "0")}</span>`);
        lines.push(`${indent}        <div>`);
        if (item.title) lines.push(`${indent}          <p className="font-medium">${escHtml(item.title)}</p>`);
        if (item.description) lines.push(`${indent}          <p className="text-sm text-muted-foreground">${escHtml(item.description)}</p>`);
        lines.push(`${indent}        </div>`);
        lines.push(`${indent}      </div>`);
      });
      lines.push(`${indent}    </div>`);
    }
  }

  if (content.ctaText) {
    lines.push(`${indent}    <div className="mt-8">`);
    lines.push(`${indent}      <Button>${escHtml(content.ctaText)}</Button>`);
    lines.push(`${indent}    </div>`);
  }

  lines.push(`${indent}  </div>`);
  lines.push(`${indent}</section>`);

  return lines.join("\n");
}

function escHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function generatePageCode(page: SitemapPage, project: Project): string {
  const lines: string[] = [];

  lines.push(`import { Button } from "@/components/ui/button";`);
  lines.push(``);
  lines.push(`export const metadata = {`);
  lines.push(`  title: "${escHtml(page.seoTitle || page.name)}",`);
  lines.push(`  description: "${escHtml(page.seoDescription || page.purpose)}",`);
  if (page.ogImageUrl) {
    lines.push(`  openGraph: {`);
    lines.push(`    images: ["${escHtml(page.ogImageUrl)}"],`);
    lines.push(`  },`);
  }
  lines.push(`};`);
  lines.push(``);
  lines.push(`export default function ${toPascalCase(page.name)}Page() {`);
  lines.push(`  return (`);
  lines.push(`    <main>`);

  for (const section of page.sections) {
    lines.push(sectionToJsx(section));
    lines.push(``);
  }

  lines.push(`    </main>`);
  lines.push(`  );`);
  lines.push(`}`);

  return lines.join("\n");
}

function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");
}

// ============================================================
// CONTENT EXPORT — generates markdown for writers
// ============================================================

export function generatePageContent(page: SitemapPage, project: Project): string {
  const lines: string[] = [];

  lines.push(`# ${page.name}`);
  lines.push(``);
  lines.push(`**Slug:** /${page.slug}`);
  if (page.purpose) lines.push(`**Purpose:** ${page.purpose}`);
  if (page.pageGoal) lines.push(`**Page Goal:** ${page.pageGoal}`);
  lines.push(``);

  if (page.seoTitle || page.seoDescription) {
    lines.push(`## SEO`);
    if (page.seoTitle) lines.push(`- **Title Tag:** ${page.seoTitle}`);
    if (page.seoDescription) lines.push(`- **Meta Description:** ${page.seoDescription}`);
    lines.push(``);
  }

  if (page.audiences.length > 0) {
    lines.push(`## Audiences`);
    page.audiences.forEach((a) => lines.push(`- ${a}`));
    lines.push(``);
  }

  if (page.referenceUrls.length > 0) {
    lines.push(`## Reference URLs`);
    page.referenceUrls.forEach((u) => lines.push(`- ${u}`));
    lines.push(``);
  }

  lines.push(`---`);
  lines.push(``);

  for (const section of page.sections) {
    const meta = wireframeBlockMeta[section.selectedBlockId];
    lines.push(`## ${section.themeName}`);
    lines.push(`*Component: ${meta?.label || section.selectedBlockId}*`);
    lines.push(``);

    if (section.directionNotes) {
      lines.push(`> **Direction:** ${section.directionNotes}`);
      lines.push(``);
    }

    const c = section.content;
    if (c.heading) lines.push(`**Heading:** ${c.heading}`);
    if (c.subheading) lines.push(`**Subheading:** ${c.subheading}`);
    if (c.body) {
      lines.push(``);
      lines.push(c.body);
    }
    if (c.ctaText) lines.push(`**CTA:** ${c.ctaText}`);
    lines.push(``);

    if (c.items.length > 0) {
      const cat = meta?.category || "";
      c.items.forEach((item, i) => {
        lines.push(`### ${item.title || `Item ${i + 1}`}`);
        if (item.description) lines.push(item.description);
        if (item.extra) lines.push(`*${item.extra}*`);
        lines.push(``);
      });
    }

    lines.push(`---`);
    lines.push(``);
  }

  if (page.contentNotes) {
    lines.push(`## Content Notes`);
    lines.push(page.contentNotes);
    lines.push(``);
  }

  return lines.join("\n");
}

// ============================================================
// Full project content export
// ============================================================

export function generateFullContentExport(project: Project): string {
  const lines: string[] = [];

  lines.push(`# ${project.clientName} — Content Document`);
  lines.push(`*Generated ${new Date().toLocaleDateString()}*`);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);

  for (const page of project.sitemap) {
    lines.push(generatePageContent(page, project));
    lines.push(``);
  }

  return lines.join("\n");
}

// ============================================================
// UI Components
// ============================================================

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button size="xs" variant="ghost" className="gap-1" onClick={handleCopy}>
      {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

function downloadFile(filename: string, content: string, type: string = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportPanel({
  project,
  page,
  onClose,
}: {
  project: Project;
  page: SitemapPage;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"code" | "content">("code");
  const code = generatePageCode(page, project);
  const content = generatePageContent(page, project);

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-auto">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-card border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold">{page.name} — Export</h2>
          <div className="flex gap-1 rounded-lg bg-muted p-0.5">
            <button
              onClick={() => setTab("code")}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                tab === "code" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Code className="h-3 w-3 inline mr-1" /> Code
            </button>
            <button
              onClick={() => setTab("content")}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                tab === "content" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="h-3 w-3 inline mr-1" /> Content
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={tab === "code" ? code : content} />
          <Button
            size="xs"
            variant="outline"
            className="gap-1"
            onClick={() => {
              if (tab === "code") {
                downloadFile(`${page.slug}.tsx`, code, "text/typescript");
              } else {
                downloadFile(`${page.slug}-content.md`, content, "text/markdown");
              }
            }}
          >
            <Download className="h-3 w-3" />
            {tab === "code" ? ".tsx" : ".md"}
          </Button>
          <Button
            size="xs"
            variant="ghost"
            className="gap-1"
            onClick={() => {
              const full = generateFullContentExport(project);
              downloadFile(`${project.clientName || "project"}-all-content.md`, full, "text/markdown");
            }}
          >
            <Download className="h-3 w-3" /> All Pages
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Code/content display */}
      <div className="max-w-5xl mx-auto p-6">
        <pre className="rounded-lg bg-muted/30 border p-6 text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">
          {tab === "code" ? code : content}
        </pre>
      </div>
    </div>
  );
}
