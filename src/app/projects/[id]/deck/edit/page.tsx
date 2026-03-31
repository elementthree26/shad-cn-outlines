"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/lib/project-types";
import { getProject, saveProject } from "@/lib/project-store";
import {
  DeckSlide,
  createDeckSlide,
  deckSlideTemplates,
  DeckSlideType,
} from "@/lib/deck-types";
import { ImageUpload } from "@/components/cms/image-upload";

const inputCls =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30";

function StringListEditor({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex gap-1.5">
          <input
            className={inputCls}
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
            placeholder={placeholder}
          />
          <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive px-1">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <button onClick={() => onChange([...items, ""])} className="text-xs text-primary hover:underline">
        + Add item
      </button>
    </div>
  );
}

function SlideEditor({
  slide,
  onUpdate,
  onRemove,
}: {
  slide: DeckSlide;
  onUpdate: (slide: DeckSlide) => void;
  onRemove: () => void;
}) {
  const d = slide.data;
  const update = (patch: Partial<typeof d>) => onUpdate({ ...slide, data: { ...d, ...patch } as any });

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center gap-2">
        <GripVertical className="h-4 w-4 text-muted-foreground/40" />
        <input
          className="flex-1 font-semibold text-sm bg-transparent outline-none border-b border-transparent hover:border-border focus:border-primary"
          value={slide.title}
          onChange={(e) => onUpdate({ ...slide, title: e.target.value })}
        />
        <Badge variant="outline" className="text-[9px]">{slide.type}</Badge>
        <button onClick={onRemove} className="text-muted-foreground hover:text-destructive">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {d.type === "competitive-analysis" && (
        <div className="space-y-3">
          {d.columns.map((col, ci) => (
            <div key={ci} className="rounded border p-3">
              <div className="flex items-center gap-2 mb-2">
                <input
                  className="text-xs font-medium bg-transparent outline-none border-b border-transparent hover:border-border focus:border-primary flex-1"
                  value={col.name}
                  onChange={(e) => {
                    const cols = [...d.columns];
                    cols[ci] = { ...col, name: e.target.value };
                    update({ columns: cols });
                  }}
                  placeholder="Company name"
                />
                <label className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <input type="checkbox" checked={col.isClient} onChange={(e) => {
                    const cols = [...d.columns];
                    cols[ci] = { ...col, isClient: e.target.checked };
                    update({ columns: cols });
                  }} /> Client
                </label>
                <button onClick={() => update({ columns: d.columns.filter((_, j) => j !== ci) })} className="text-muted-foreground hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </div>
              <StringListEditor
                items={col.items}
                onChange={(items) => {
                  const cols = [...d.columns];
                  cols[ci] = { ...col, items };
                  update({ columns: cols });
                }}
                placeholder="Finding / observation"
              />
            </div>
          ))}
          <button onClick={() => update({ columns: [...d.columns, { name: "Competitor", isClient: false, items: [""] }] })} className="text-xs text-primary hover:underline">
            + Add column
          </button>
        </div>
      )}

      {d.type === "site-baselines" && (
        <div className="space-y-3">
          <textarea className={`${inputCls} resize-none`} rows={3} value={d.narrative} onChange={(e) => update({ narrative: e.target.value })} placeholder="Narrative summary..." />
          <div className="text-xs font-medium text-muted-foreground">Companies:</div>
          <div className="flex gap-2 flex-wrap">
            {d.companies.map((c, i) => (
              <div key={i} className="flex items-center gap-1">
                <input className="text-xs border rounded px-2 py-0.5 w-24" value={c.name} onChange={(e) => {
                  const cos = [...d.companies]; cos[i] = { ...c, name: e.target.value }; update({ companies: cos });
                }} />
                <button onClick={() => update({ companies: d.companies.filter((_, j) => j !== i) })} className="text-muted-foreground hover:text-destructive"><X className="h-3 w-3" /></button>
              </div>
            ))}
            <button onClick={() => update({ companies: [...d.companies, { name: "", isClient: false }] })} className="text-xs text-primary">+ Add</button>
          </div>
          <div className="text-xs font-medium text-muted-foreground">Metrics:</div>
          {d.metrics.map((m, mi) => (
            <div key={mi} className="flex gap-2 items-center">
              <input className="text-xs border rounded px-2 py-1 w-40" value={m.label} onChange={(e) => {
                const ms = [...d.metrics]; ms[mi] = { ...m, label: e.target.value }; update({ metrics: ms });
              }} placeholder="Metric name" />
              {m.values.map((v, vi) => (
                <input key={vi} className="text-xs border rounded px-2 py-1 w-16 text-center" value={v.value} onChange={(e) => {
                  const ms = [...d.metrics]; const vs = [...m.values]; vs[vi] = { ...v, value: e.target.value }; ms[mi] = { ...m, values: vs }; update({ metrics: ms });
                }} placeholder="Value" />
              ))}
              <button onClick={() => update({ metrics: d.metrics.filter((_, j) => j !== mi) })} className="text-muted-foreground hover:text-destructive"><X className="h-3 w-3" /></button>
            </div>
          ))}
          <button onClick={() => update({ metrics: [...d.metrics, { label: "", values: d.companies.map((c) => ({ company: c.name, value: "", highlight: c.isClient })) }] })} className="text-xs text-primary">+ Add metric</button>
          <input className={inputCls} value={d.footnotes} onChange={(e) => update({ footnotes: e.target.value })} placeholder="Footnotes (sources, dates)" />
        </div>
      )}

      {d.type === "integrations-table" && (
        <div className="space-y-2">
          {d.rows.map((row, ri) => (
            <div key={ri} className="grid grid-cols-[1fr_1fr_1.5fr_1.5fr_auto] gap-1.5">
              <input className="text-xs border rounded px-2 py-1" value={row.category} onChange={(e) => { const rs = [...d.rows]; rs[ri] = { ...row, category: e.target.value }; update({ rows: rs }); }} placeholder="Category" />
              <input className="text-xs border rounded px-2 py-1" value={row.function} onChange={(e) => { const rs = [...d.rows]; rs[ri] = { ...row, function: e.target.value }; update({ rows: rs }); }} placeholder="Function" />
              <input className="text-xs border rounded px-2 py-1" value={row.currentPlatform} onChange={(e) => { const rs = [...d.rows]; rs[ri] = { ...row, currentPlatform: e.target.value }; update({ rows: rs }); }} placeholder="Current" />
              <input className="text-xs border rounded px-2 py-1" value={row.recommendation} onChange={(e) => { const rs = [...d.rows]; rs[ri] = { ...row, recommendation: e.target.value }; update({ rows: rs }); }} placeholder="Recommendation" />
              <button onClick={() => update({ rows: d.rows.filter((_, j) => j !== ri) })} className="text-muted-foreground hover:text-destructive"><X className="h-3 w-3" /></button>
            </div>
          ))}
          <button onClick={() => update({ rows: [...d.rows, { category: "", function: "", currentPlatform: "", recommendation: "" }] })} className="text-xs text-primary">+ Add row</button>
        </div>
      )}

      {d.type === "screenshot-audit" && (
        <div className="space-y-3">
          {d.screenshots.map((ss, si) => (
            <div key={si} className="rounded border p-3 space-y-2">
              <ImageUpload value={ss.imageUrl} onChange={(url) => { const scs = [...d.screenshots]; scs[si] = { ...ss, imageUrl: url }; update({ screenshots: scs }); }} placeholder="Upload screenshot" />
              <input className={inputCls} value={ss.caption} onChange={(e) => { const scs = [...d.screenshots]; scs[si] = { ...ss, caption: e.target.value }; update({ screenshots: scs }); }} placeholder="Caption" />
              <StringListEditor items={ss.callouts.map((c) => c.text)} onChange={(items) => { const scs = [...d.screenshots]; scs[si] = { ...ss, callouts: items.map((t) => ({ text: t })) }; update({ screenshots: scs }); }} placeholder="Callout note" />
            </div>
          ))}
          <button onClick={() => update({ screenshots: [...d.screenshots, { imageUrl: "", caption: "", callouts: [] }] })} className="text-xs text-primary">+ Add screenshot</button>
        </div>
      )}

      {d.type === "content-recommendations" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <input className={inputCls} value={d.leftCard.title} onChange={(e) => update({ leftCard: { ...d.leftCard, title: e.target.value } })} placeholder="Left card title" />
            {d.leftCard.sections.map((sec, si) => (
              <div key={si} className="rounded border p-2 space-y-1.5">
                <input className="text-xs font-medium bg-transparent outline-none border-b w-full" value={sec.heading} onChange={(e) => { const secs = [...d.leftCard.sections]; secs[si] = { ...sec, heading: e.target.value }; update({ leftCard: { ...d.leftCard, sections: secs } }); }} placeholder="Section heading" />
                <StringListEditor items={sec.items} onChange={(items) => { const secs = [...d.leftCard.sections]; secs[si] = { ...sec, items }; update({ leftCard: { ...d.leftCard, sections: secs } }); }} />
              </div>
            ))}
            <button onClick={() => update({ leftCard: { ...d.leftCard, sections: [...d.leftCard.sections, { heading: "", items: [""] }] } })} className="text-xs text-primary">+ Add section</button>
          </div>
          <div className="space-y-2">
            <input className={inputCls} value={d.rightCard.title} onChange={(e) => update({ rightCard: { ...d.rightCard, title: e.target.value } })} placeholder="Right card title" />
            <StringListEditor items={d.rightCard.items} onChange={(items) => update({ rightCard: { ...d.rightCard, items } })} />
          </div>
        </div>
      )}

      {d.type === "custom-bullets" && (
        <div className="space-y-2">
          <input className={inputCls} value={d.subtitle} onChange={(e) => update({ subtitle: e.target.value })} placeholder="Subtitle" />
          <StringListEditor items={d.items} onChange={(items) => update({ items })} placeholder="Bullet point" />
        </div>
      )}

      {d.type === "custom-two-column" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <input className={inputCls} value={d.leftTitle} onChange={(e) => update({ leftTitle: e.target.value })} placeholder="Left title" />
            <StringListEditor items={d.leftItems} onChange={(items) => update({ leftItems: items })} />
          </div>
          <div className="space-y-2">
            <input className={inputCls} value={d.rightTitle} onChange={(e) => update({ rightTitle: e.target.value })} placeholder="Right title" />
            <StringListEditor items={d.rightItems} onChange={(items) => update({ rightItems: items })} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function DeckEditPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  useEffect(() => {
    const p = getProject(projectId);
    if (!p) { router.push("/projects"); return; }
    setProject(p);
  }, [projectId, router]);

  if (!project) return null;

  const slides = project.deckSlides || [];

  const updateSlide = (updated: DeckSlide) => {
    const newSlides = slides.map((s) => (s.id === updated.id ? updated : s));
    const saved = saveProject({ ...project, deckSlides: newSlides });
    setProject(saved);
  };

  const removeSlide = (id: string) => {
    const saved = saveProject({ ...project, deckSlides: slides.filter((s) => s.id !== id) });
    setProject(saved);
  };

  const addSlide = (type: DeckSlideType, title: string) => {
    const slide = createDeckSlide(type, title, slides.length);
    const saved = saveProject({ ...project, deckSlides: [...slides, slide] });
    setProject(saved);
    setShowAddMenu(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-6 py-3 flex items-center gap-4">
          <Link href={`/projects/${projectId}/deck`}>
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Preview Deck
            </Button>
          </Link>
          <div className="h-5 w-px bg-border" />
          <h1 className="text-sm font-bold">Deck Editor — {project.clientName}</h1>
          <span className="text-xs text-muted-foreground">{slides.length} custom slides</span>
          <div className="ml-auto flex gap-2">
            <Link href={`/projects/${projectId}/deck`}>
              <Button size="sm" variant="outline" className="gap-1.5">
                <Eye className="h-3.5 w-3.5" /> Preview
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-6 space-y-4">
        <div className="rounded-lg bg-muted/30 border p-4 text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1">How it works</p>
          <p>Auto-generated slides (title, summary, discovery, sitemap, timeline, etc.) are created from your project data. Add custom slides here for competitive analysis, site baselines, integrations, screenshots, and content recommendations. All slides render together in the presentation.</p>
        </div>

        {slides.map((slide) => (
          <SlideEditor key={slide.id} slide={slide} onUpdate={updateSlide} onRemove={() => removeSlide(slide.id)} />
        ))}

        {/* Add slide */}
        {showAddMenu ? (
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold">Add a slide</p>
              <button onClick={() => setShowAddMenu(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {deckSlideTemplates.map((tmpl) => (
                <button
                  key={tmpl.type}
                  onClick={() => addSlide(tmpl.type, tmpl.label)}
                  className="rounded-lg border p-3 text-left hover:border-primary/50 hover:bg-primary/5 transition-colors"
                >
                  <p className="text-xs font-semibold">{tmpl.label}</p>
                  <p className="text-[10px] text-muted-foreground">{tmpl.description}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddMenu(true)}
            className="w-full rounded-lg border-2 border-dashed py-4 text-sm text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Custom Slide
          </button>
        )}
      </main>
    </div>
  );
}
