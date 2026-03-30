"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Project,
  createProject,
  createSitemapPage,
  industryOptions,
  cmsPlatformOptions,
  commonIntegrations,
  integrationCategories,
  SitemapPage,
  Integration,
} from "@/lib/project-types";
import { saveProject } from "@/lib/project-store";
import { SitemapScraper } from "./sitemap-scraper";
import { VisualSitemap } from "./visual-sitemap";
import { generateSuggestedSitemap } from "@/lib/sitemap-suggestions";

const STEP_LABELS = [
  "Project Setup",
  "Discovery & Positioning",
  "Content Inventory",
  "Technical",
  "Sitemap",
];

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30";
const textareaClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 resize-none";
const selectClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ---------------------------------------------------------------------------
// Reusable: editable string list
// ---------------------------------------------------------------------------
function StringListEditor({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setDraft("");
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          className={inputClass}
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button variant="outline" size="sm" onClick={add}>
          Add
        </Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <Badge key={i} variant="secondary" className="gap-1 pr-1">
              {item}
              <button
                className="ml-1 text-muted-foreground hover:text-destructive"
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              >
                &times;
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step indicator
// ---------------------------------------------------------------------------
function StepIndicator({
  current,
  onGoTo,
}: {
  current: number;
  onGoTo: (step: number) => void;
}) {
  return (
    <nav className="flex items-center gap-1">
      {STEP_LABELS.map((label, i) => {
        const isActive = i === current;
        const isDone = i < current;
        return (
          <button
            key={i}
            onClick={() => onGoTo(i)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : isDone
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                isActive
                  ? "bg-primary-foreground text-primary"
                  : isDone
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {isDone ? "\u2713" : i + 1}
            </span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Sitemap tree renderer
// ---------------------------------------------------------------------------
function SitemapTree({
  pages,
  parentId,
  depth,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  pages: SitemapPage[];
  parentId: string | null;
  depth: number;
  onRemove: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}) {
  const children = pages
    .filter((p) => p.parentId === parentId)
    .sort((a, b) => a.order - b.order);

  if (children.length === 0) return null;

  return (
    <ul className={depth > 0 ? "ml-5 border-l border-border pl-3" : ""}>
      {children.map((page) => (
        <li key={page.id} className="py-1">
          <div className="flex items-center gap-2 group">
            <span className="text-sm font-medium">{page.name}</span>
            <span className="text-xs text-muted-foreground">/{page.slug}</span>
            {page.purpose && (
              <span className="text-xs text-muted-foreground/70 italic hidden sm:inline">
                — {page.purpose}
              </span>
            )}
            <div className="ml-auto flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon-xs" onClick={() => onMoveUp(page.id)}>
                &uarr;
              </Button>
              <Button variant="ghost" size="icon-xs" onClick={() => onMoveDown(page.id)}>
                &darr;
              </Button>
              <Button variant="ghost" size="icon-xs" onClick={() => onRemove(page.id)}>
                &times;
              </Button>
            </div>
          </div>
          <SitemapTree
            pages={pages}
            parentId={page.id}
            depth={depth + 1}
            onRemove={onRemove}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
          />
        </li>
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// Main Wizard
// ---------------------------------------------------------------------------
export function ProjectWizard({
  onComplete,
}: {
  onComplete: (projectId: string) => void;
}) {
  const [step, setStep] = useState(0);
  const [project, setProject] = useState<Project>(() => createProject());

  // Convenience updater
  const patch = useCallback(
    (partial: Partial<Project>) =>
      setProject((prev) => ({ ...prev, ...partial })),
    [],
  );

  // Navigation
  const canNext = step < STEP_LABELS.length - 1;
  const canBack = step > 0;
  const isLast = step === STEP_LABELS.length - 1;

  const goTo = (s: number) => {
    if (s >= 0 && s < STEP_LABELS.length) setStep(s);
  };

  const handleCreate = () => {
    const saved = saveProject(project);
    onComplete(saved.id);
  };

  // ---- Sitemap helpers ----
  const [newPageName, setNewPageName] = useState("");
  const [newPagePurpose, setNewPagePurpose] = useState("");
  const [newPageParent, setNewPageParent] = useState<string | null>(null);

  const addPage = () => {
    const name = newPageName.trim();
    if (!name) return;
    const siblings = project.sitemap.filter(
      (p) => p.parentId === newPageParent,
    );
    const page = createSitemapPage({
      name,
      slug: slugify(name),
      purpose: newPagePurpose.trim(),
      parentId: newPageParent,
      order: siblings.length,
    });
    patch({ sitemap: [...project.sitemap, page] });
    setNewPageName("");
    setNewPagePurpose("");
  };

  const removePage = (id: string) => {
    // Also remove children recursively
    const idsToRemove = new Set<string>();
    const collect = (parentId: string) => {
      idsToRemove.add(parentId);
      project.sitemap
        .filter((p) => p.parentId === parentId)
        .forEach((p) => collect(p.id));
    };
    collect(id);
    patch({ sitemap: project.sitemap.filter((p) => !idsToRemove.has(p.id)) });
  };

  const movePage = (id: string, direction: -1 | 1) => {
    const page = project.sitemap.find((p) => p.id === id);
    if (!page) return;
    const siblings = project.sitemap
      .filter((p) => p.parentId === page.parentId)
      .sort((a, b) => a.order - b.order);
    const idx = siblings.findIndex((p) => p.id === id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= siblings.length) return;
    const updated = project.sitemap.map((p) => {
      if (p.id === siblings[idx].id) return { ...p, order: siblings[swapIdx].order };
      if (p.id === siblings[swapIdx].id) return { ...p, order: siblings[idx].order };
      return p;
    });
    patch({ sitemap: updated });
  };

  // ---- Integration helpers ----
  const [customIntName, setCustomIntName] = useState("");
  const [customIntCategory, setCustomIntCategory] = useState(
    integrationCategories[0].value,
  );

  const toggleIntegration = (name: string, category: string) => {
    const exists = project.integrations.find((i) => i.name === name);
    if (exists) {
      patch({
        integrations: project.integrations.filter((i) => i.name !== name),
      });
    } else {
      const newInt: Integration = {
        id: crypto.randomUUID(),
        name,
        category: category as Integration["category"],
        notes: "",
      };
      patch({ integrations: [...project.integrations, newInt] });
    }
  };

  const addCustomIntegration = () => {
    const name = customIntName.trim();
    if (!name) return;
    if (project.integrations.find((i) => i.name === name)) return;
    const newInt: Integration = {
      id: crypto.randomUUID(),
      name,
      category: customIntCategory,
      notes: "",
    };
    patch({ integrations: [...project.integrations, newInt] });
    setCustomIntName("");
  };

  // =====================================================================
  // RENDER STEPS
  // =====================================================================

  const renderStep = () => {
    switch (step) {
      // ---------------------------------------------------------------
      // STEP 1: Project Setup
      // ---------------------------------------------------------------
      case 0:
        return (
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Client Name <span className="text-destructive">*</span>
              </label>
              <input
                className={inputClass}
                placeholder="Acme Corp"
                value={project.clientName}
                onChange={(e) => patch({ clientName: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Industry</label>
              <select
                className={selectClass}
                value={project.industry}
                onChange={(e) => patch({ industry: e.target.value })}
              >
                <option value="">Select an industry...</option>
                {industryOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Target Audiences
              </label>
              <StringListEditor
                items={project.targetAudiences}
                onChange={(items) => patch({ targetAudiences: items })}
                placeholder="e.g. CTOs at mid-market SaaS companies"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Client Goals
              </label>
              <StringListEditor
                items={project.clientGoals}
                onChange={(items) => patch({ clientGoals: items })}
                placeholder="e.g. Increase demo requests by 30%"
              />
            </div>
          </div>
        );

      // ---------------------------------------------------------------
      // STEP 2: Discovery & Positioning
      // ---------------------------------------------------------------
      case 1:
        return (
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Discovery Notes
              </label>
              <textarea
                className={textareaClass}
                rows={6}
                placeholder="Paste raw meeting notes, brief, or key takeaways"
                value={project.discoveryNotes}
                onChange={(e) => patch({ discoveryNotes: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Value Propositions
              </label>
              <StringListEditor
                items={project.valuePropositions}
                onChange={(items) => patch({ valuePropositions: items })}
                placeholder="e.g. Only platform with real-time compliance monitoring"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Key Differentiators
              </label>
              <StringListEditor
                items={project.differentiators}
                onChange={(items) => patch({ differentiators: items })}
                placeholder="e.g. 24/7 white-glove support"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Competitor URLs
              </label>
              <StringListEditor
                items={project.competitorUrls}
                onChange={(items) => patch({ competitorUrls: items })}
                placeholder="https://competitor.com"
              />
            </div>
          </div>
        );

      // ---------------------------------------------------------------
      // STEP 3: Content Inventory
      // ---------------------------------------------------------------
      case 2:
        return (
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Existing Content
              </label>
              <textarea
                className={textareaClass}
                rows={5}
                placeholder="What content exists today?"
                value={project.existingContent}
                onChange={(e) => patch({ existingContent: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Content to Create
              </label>
              <textarea
                className={textareaClass}
                rows={5}
                placeholder="What needs to be written/shot/designed?"
                value={project.contentToCreate}
                onChange={(e) => patch({ contentToCreate: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Content Ownership
              </label>
              <textarea
                className={textareaClass}
                rows={5}
                placeholder="Who provides what?"
                value={project.contentOwnership}
                onChange={(e) => patch({ contentOwnership: e.target.value })}
              />
            </div>
          </div>
        );

      // ---------------------------------------------------------------
      // STEP 4: Technical
      // ---------------------------------------------------------------
      case 3:
        return (
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                CMS Platform
              </label>
              <select
                className={selectClass}
                value={project.cmsPlatform}
                onChange={(e) => patch({ cmsPlatform: e.target.value })}
              >
                {cmsPlatformOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Integrations
              </label>
              <p className="mb-2 text-xs text-muted-foreground">
                Click to toggle common integrations
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {commonIntegrations.map((ci) => {
                  const active = project.integrations.some(
                    (i) => i.name === ci.name,
                  );
                  return (
                    <button
                      key={ci.name}
                      onClick={() => toggleIntegration(ci.name, ci.category)}
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {ci.name}
                    </button>
                  );
                })}
              </div>

              <p className="mb-1.5 text-xs text-muted-foreground">
                Add a custom integration
              </p>
              <div className="flex gap-2">
                <input
                  className={inputClass}
                  placeholder="Integration name"
                  value={customIntName}
                  onChange={(e) => setCustomIntName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomIntegration();
                    }
                  }}
                />
                <select
                  className={selectClass + " max-w-[160px]"}
                  value={customIntCategory}
                  onChange={(e) =>
                    setCustomIntCategory(
                      e.target.value as Integration["category"],
                    )
                  }
                >
                  {integrationCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <Button variant="outline" size="sm" onClick={addCustomIntegration}>
                  Add
                </Button>
              </div>

              {project.integrations.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.integrations.map((integ) => (
                    <Badge key={integ.id} variant="secondary" className="gap-1 pr-1">
                      {integ.name}
                      <span className="text-[10px] text-muted-foreground">
                        ({integrationCategories.find((c) => c.value === integ.category)?.label ?? integ.category})
                      </span>
                      <button
                        className="ml-1 text-muted-foreground hover:text-destructive"
                        onClick={() =>
                          patch({
                            integrations: project.integrations.filter(
                              (i) => i.id !== integ.id,
                            ),
                          })
                        }
                      >
                        &times;
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Hosting Notes
              </label>
              <textarea
                className={textareaClass}
                rows={3}
                placeholder="Current hosting, CDN, or deployment preferences..."
                value={project.hostingNotes}
                onChange={(e) => patch({ hostingNotes: e.target.value })}
              />
            </div>
          </div>
        );

      // ---------------------------------------------------------------
      // STEP 5: Sitemap
      // ---------------------------------------------------------------
      case 4:
        return (
          <div className="space-y-5">
            {/* Sitemap Scraper */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">Import from existing site</label>
              <p className="text-xs text-muted-foreground mb-2">
                Paste the current website URL to auto-discover pages from navigation
              </p>
              <SitemapScraper
                onImport={(pages) => {
                  setProject((prev) => ({
                    ...prev,
                    sitemap: [...prev.sitemap, ...pages],
                  }));
                }}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="bg-background px-2 text-xs text-muted-foreground">or add manually</span></div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Add Page</label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto_auto]">
                <input
                  className={inputClass}
                  placeholder="Page name"
                  value={newPageName}
                  onChange={(e) => setNewPageName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPage();
                    }
                  }}
                />
                <input
                  className={inputClass}
                  placeholder="Purpose (optional)"
                  value={newPagePurpose}
                  onChange={(e) => setNewPagePurpose(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPage();
                    }
                  }}
                />
                <select
                  className={selectClass}
                  value={newPageParent ?? ""}
                  onChange={(e) =>
                    setNewPageParent(e.target.value || null)
                  }
                >
                  <option value="">Top-level (no parent)</option>
                  {project.sitemap.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <Button variant="outline" size="sm" onClick={addPage}>
                  Add Page
                </Button>
              </div>
              {newPageName.trim() && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Slug: <span className="font-mono">/{slugify(newPageName)}</span>
                </p>
              )}
            </div>

            {project.sitemap.length > 0 ? (
              <>
                {/* Visual sitemap */}
                <div className="rounded-md border border-border p-4 bg-muted/20 overflow-x-auto">
                  <VisualSitemap
                    pages={project.sitemap}
                    onChange={(pages) => setProject((prev) => ({ ...prev, sitemap: pages }))}
                    onSuggest={() => {
                      const suggested = generateSuggestedSitemap(project);
                      setProject((prev) => ({ ...prev, sitemap: suggested }));
                    }}
                    editable
                  />
                </div>

                {/* List fallback */}
                <details className="group">
                  <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground flex items-center gap-1">
                    <span className="group-open:hidden">Show list view</span>
                    <span className="hidden group-open:inline">Hide list view</span>
                  </summary>
                  <div className="rounded-md border border-border p-3 mt-2">
                    <SitemapTree
                      pages={project.sitemap}
                      parentId={null}
                      depth={0}
                      onRemove={removePage}
                      onMoveUp={(id) => movePage(id, -1)}
                      onMoveDown={(id) => movePage(id, 1)}
                    />
                  </div>
                </details>
              </>
            ) : (
              <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No pages yet. Scan a site above or add pages manually.
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // =====================================================================
  // LAYOUT
  // =====================================================================
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <StepIndicator current={step} onGoTo={goTo} />

      <Card className="p-0">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-base font-semibold">
            Step {step + 1}: {STEP_LABELS[step]}
          </h2>
        </div>
        <div className="px-5 py-5">{renderStep()}</div>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => goTo(step - 1)}
          disabled={!canBack}
        >
          Back
        </Button>

        <div className="flex gap-2">
          {canNext && (
            <Button onClick={() => goTo(step + 1)}>
              Next
            </Button>
          )}
          {isLast && (
            <Button
              onClick={handleCreate}
              disabled={!project.clientName.trim()}
            >
              Create Project
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
