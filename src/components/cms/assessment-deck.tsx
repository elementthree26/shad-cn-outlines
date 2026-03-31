"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, X, Maximize2, Minimize2, Pencil } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Project, phaseDefinitions, getPagesBySprint } from "@/lib/project-types";
import { PageSpeedSnapshot, MetricValue } from "@/lib/audit-types";
import {
  DeckSlide,
  CompetitiveAnalysisData,
  SiteBaselinesData,
  IntegrationsTableData,
  ScreenshotAuditData,
  ContentRecommendationsData,
  CustomBulletsData,
  CustomTwoColumnData,
} from "@/lib/deck-types";
import { generateDeckSlidesFromDiscovery } from "@/lib/discovery-parser";

// ============================================================
// E3-style presentation deck — dark theme, scroll-snap slides
// ============================================================

interface Slide {
  id: string;
  type: "title" | "overview" | "data" | "list" | "comparison" | "sitemap" | "timeline" | "closing";
  render: () => React.ReactNode;
}

/** Shared slide wrapper */
function SlideFrame({
  children,
  bg = "dark",
  label,
  slideNum,
  total,
}: {
  children: React.ReactNode;
  bg?: "dark" | "light" | "accent";
  label?: string;
  slideNum?: number;
  total?: number;
}) {
  const bgClass =
    bg === "dark" ? "bg-[#1f1915] text-[#faf9f6]"
    : bg === "light" ? "bg-[#faf9f6] text-[#1f1915]"
    : "bg-[#2e4545] text-[#faf9f6]";

  return (
    <div className={`min-h-screen snap-start flex flex-col justify-center relative ${bgClass}`}
      style={{ padding: "clamp(24px, 5vw, 80px) clamp(24px, 5vw, 120px)" }}
    >
      {label && (
        <p className="absolute top-8 left-8 text-xs font-semibold tracking-[0.84px] uppercase opacity-40">
          // {label} //
        </p>
      )}
      {slideNum && total && (
        <p className="absolute bottom-8 right-8 text-xs font-mono opacity-20">
          {String(slideNum).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
      )}
      <div className="max-w-6xl mx-auto w-full">{children}</div>
    </div>
  );
}

/** Lime accent bar */
function LimeBar() {
  return <div className="h-[3px] w-16 bg-[#d1f44c] mb-6" />;
}

/** Stat number display */
function StatNumber({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-black text-[clamp(48px,8vw,96px)] leading-none tracking-[-3px]">{value}</p>
      <p className="text-sm opacity-60 mt-2">{label}</p>
    </div>
  );
}

/** Phase card matching E3 style */
function PhaseCard({ number, name, timing, role }: { number: string; name: string; timing: string; role: string }) {
  const roleColors: Record<string, string> = {
    "Humans Lead": "bg-[#d1f44c] text-[#1f1915]",
    "Humans Approve": "bg-[#2e4545] text-[#faf9f6]",
    "Humans Supervise": "bg-[#333] text-[#faf9f6]",
    "Humans Verify": "bg-[#333] text-[#faf9f6]",
    "Continuous": "bg-[#d1f44c] text-[#1f1915]",
  };

  return (
    <div className="rounded-lg p-5 bg-white/5 border-t-[3px] border-[#d1f44c] hover:-translate-y-1 transition-transform">
      <p className="text-[48px] font-black opacity-20 leading-none mb-2">{number}</p>
      <h3 className="text-sm font-bold mb-1">{name}</h3>
      <p className="text-xs opacity-50 mb-3">{timing}</p>
      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${roleColors[role] || "bg-white/10"}`}>
        {role}
      </span>
    </div>
  );
}

/** Comparison bar for old vs new */
function ComparisonBar({ label, oldVal, newVal, maxWeeks = 16 }: { label: string; oldVal: string; newVal: string; maxWeeks?: number }) {
  const oldNum = parseInt(oldVal) || 0;
  const newNum = parseInt(newVal) || 0;
  const oldPct = Math.min((oldNum / maxWeeks) * 100, 100);
  const newPct = Math.min((newNum / maxWeeks) * 100, 100);

  return (
    <div className="mb-4">
      <p className="text-xs font-semibold mb-2">{label}</p>
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="text-[10px] opacity-40 w-16">Traditional</span>
          <div className="flex-1 h-6 rounded bg-white/5 overflow-hidden">
            <div className="h-full bg-white/10 rounded flex items-center px-2" style={{ width: `${oldPct}%` }}>
              <span className="text-[10px] font-mono">{oldVal}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] opacity-40 w-16">AI-Adapted</span>
          <div className="flex-1 h-6 rounded bg-white/5 overflow-hidden">
            <div className="h-full bg-[#d1f44c] rounded flex items-center px-2" style={{ width: `${newPct}%` }}>
              <span className="text-[10px] font-mono text-[#1f1915]">{newVal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Bullet list with lime squares */
function LimeBullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="w-2 h-2 bg-[#d1f44c] rounded-sm mt-1.5 flex-shrink-0" />
          <span className="text-sm opacity-80">{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ============================================================
// DECK GENERATOR — builds slides from project data
// ============================================================

// ============================================================
// CUSTOM SLIDE RENDERERS
// ============================================================

function renderCustomSlide(slide: DeckSlide, project: Project, slides: Slide[]): React.ReactNode {
  const d = slide.data;
  const idx = slides.findIndex((s) => s.id === `custom-${slide.id}`);
  const total = slides.length;

  switch (d.type) {
    case "competitive-analysis":
      return (
        <SlideFrame bg="light" label={slide.title} slideNum={idx + 1} total={total}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-extrabold text-[clamp(28px,4vw,48px)] leading-tight tracking-[-1.5px] text-[#1f1915]">{slide.title}</h2>
            </div>
            <p className="text-xs font-bold tracking-wider text-[#1f1915]/30">ELEMENT THREE</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  {d.columns.map((col, i) => (
                    <th key={i} className={`text-left p-3 text-xs font-bold uppercase tracking-wider ${col.isClient ? "bg-[#333] text-white" : i % 2 === 0 ? "bg-[#d1f44c]/30 text-[#1f1915]" : "bg-gray-100 text-[#1f1915]"}`}>
                      {col.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {d.columns.map((col, i) => (
                    <td key={i} className="p-3 align-top border-t border-gray-200">
                      <ul className="space-y-1.5">
                        {col.items.filter(Boolean).map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-xs">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#333] flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </SlideFrame>
      );

    case "site-baselines":
      return (
        <SlideFrame bg="light" label={slide.title} slideNum={idx + 1} total={total}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-extrabold text-[clamp(28px,4vw,48px)] leading-tight tracking-[-1.5px] text-[#1f1915]">{slide.title}</h2>
            <p className="text-xs font-bold tracking-wider text-[#1f1915]/30">ELEMENT THREE</p>
          </div>
          <div className="grid grid-cols-[1fr_2fr] gap-8">
            {d.narrative && (
              <p className="text-sm text-[#1f1915]/70 leading-relaxed">{d.narrative}</p>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-3 bg-[#d1f44c]/40 text-xs font-bold uppercase">Metric</th>
                    {d.companies.map((c, i) => (
                      <th key={i} className={`text-center p-3 text-xs font-bold uppercase ${c.isClient ? "bg-[#d1f44c]/40" : "bg-gray-100"}`}>{c.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {d.metrics.map((m, i) => (
                    <tr key={i} className="border-t border-gray-200">
                      <td className="p-3 text-xs font-medium">{m.label}</td>
                      {m.values.map((v, j) => (
                        <td key={j} className={`p-3 text-center font-bold ${v.highlight ? "text-lg" : ""}`}>{v.value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {d.footnotes && <p className="text-[10px] text-[#1f1915]/40 mt-3 italic">{d.footnotes}</p>}
            </div>
          </div>
        </SlideFrame>
      );

    case "integrations-table":
      // Group rows by category for the colored left column
      const grouped = new Map<string, typeof d.rows>();
      for (const row of d.rows) {
        if (!grouped.has(row.category)) grouped.set(row.category, []);
        grouped.get(row.category)!.push(row);
      }
      const catColors = ["bg-[#d4c96a]/30", "bg-[#8e8eb8]/30", "bg-[#c9889a]/30", "bg-[#88b8a0]/30"];

      return (
        <SlideFrame bg="light" label={slide.title} slideNum={idx + 1} total={total}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-extrabold text-[clamp(28px,4vw,48px)] leading-tight tracking-[-1.5px] text-[#1f1915]">{slide.title}</h2>
              <p className="text-sm text-[#1f1915]/50">{project.clientName}</p>
            </div>
            <p className="text-xs font-bold tracking-wider text-[#1f1915]/30">ELEMENT THREE</p>
          </div>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#333] text-white">
                <th className="text-left p-3 text-xs font-bold uppercase">Category</th>
                <th className="text-left p-3 text-xs font-bold uppercase">Function</th>
                <th className="text-left p-3 text-xs font-bold uppercase">Current Platform</th>
                <th className="text-left p-3 text-xs font-bold uppercase">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {[...grouped.entries()].map(([cat, rows], ci) => (
                rows.map((row, ri) => (
                  <tr key={`${ci}-${ri}`} className={`border-t border-gray-200 ${catColors[ci % catColors.length]}`}>
                    {ri === 0 && <td rowSpan={rows.length} className="p-3 text-xs font-bold align-top">{cat}</td>}
                    <td className="p-3 text-xs">{row.function}</td>
                    <td className="p-3 text-xs">{row.currentPlatform}</td>
                    <td className="p-3 text-xs font-medium">{row.recommendation}</td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </SlideFrame>
      );

    case "screenshot-audit":
      return (
        <SlideFrame bg="light" label={slide.title} slideNum={idx + 1} total={total}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-extrabold text-[clamp(28px,4vw,48px)] leading-tight tracking-[-1.5px] text-[#1f1915]">{slide.title}</h2>
            <p className="text-xs font-bold tracking-wider text-[#1f1915]/30 rotate-90 origin-right">ELEMENT THREE</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {d.screenshots.map((ss, i) => (
              <div key={i} className="relative">
                {ss.imageUrl && <img src={ss.imageUrl} alt={ss.caption} className="w-full rounded-lg border shadow-sm" />}
                {ss.caption && <p className="text-xs font-medium mt-2">{ss.caption}</p>}
                {ss.callouts.map((c, j) => (
                  <div key={j} className="mt-1 inline-block mr-2 rounded bg-gray-100 border px-2 py-1 text-[10px] text-[#1f1915]/70 shadow-sm">
                    {c.text}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </SlideFrame>
      );

    case "content-recommendations":
      return (
        <SlideFrame bg="light" label={slide.title} slideNum={idx + 1} total={total}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-extrabold text-[clamp(28px,4vw,48px)] leading-tight tracking-[-1.5px] text-[#1f1915]">{slide.title}</h2>
            <p className="text-xs font-bold tracking-wider text-[#1f1915]/30">ELEMENT THREE</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-lg bg-[#2e4545] text-white p-6">
              <h3 className="font-bold mb-4">{d.leftCard.title}</h3>
              {d.leftCard.sections.map((sec, i) => (
                <div key={i} className="mb-4">
                  {sec.heading && <p className="font-semibold text-sm mb-2">{sec.heading}</p>}
                  <ul className="space-y-1.5">
                    {sec.items.filter(Boolean).map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs opacity-90">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="rounded-lg bg-gray-100 text-[#1f1915] p-6">
              <h3 className="font-bold mb-4">{d.rightCard.title}</h3>
              <ul className="space-y-1.5">
                {d.rightCard.items.filter(Boolean).map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1f1915]/40 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SlideFrame>
      );

    case "custom-bullets":
      return (
        <SlideFrame bg="dark" label={slide.title} slideNum={idx + 1} total={total}>
          <LimeBar />
          <h2 className="font-extrabold text-[clamp(32px,5vw,56px)] leading-tight tracking-[-1.5px] mb-4">{slide.title}</h2>
          {d.subtitle && <p className="text-lg opacity-60 mb-8">{d.subtitle}</p>}
          <LimeBullets items={d.items.filter(Boolean)} />
        </SlideFrame>
      );

    case "custom-two-column":
      return (
        <SlideFrame bg="dark" label={slide.title} slideNum={idx + 1} total={total}>
          <LimeBar />
          <h2 className="font-extrabold text-[clamp(32px,5vw,56px)] leading-tight tracking-[-1.5px] mb-8">{slide.title}</h2>
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider opacity-50 mb-4">{d.leftTitle}</h3>
              <LimeBullets items={d.leftItems.filter(Boolean)} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider opacity-50 mb-4">{d.rightTitle}</h3>
              <LimeBullets items={d.rightItems.filter(Boolean)} />
            </div>
          </div>
        </SlideFrame>
      );

    default:
      return <SlideFrame bg="dark"><p>Unknown slide type</p></SlideFrame>;
  }
}

function generateSlides(project: Project): Slide[] {
  const slides: Slide[] = [];
  const sprintMap = getPagesBySprint(project.sitemap);
  const sprintNums = [...sprintMap.keys()].sort();
  let num = 0;
  const total = () => slides.length;

  // 1. TITLE SLIDE
  slides.push({
    id: "title",
    type: "title",
    render: () => (
      <SlideFrame bg="dark" slideNum={1} total={total()}>
        <div className="text-center">
          {project.logoUrl && (
            <img src={project.logoUrl} alt="" className="h-12 mx-auto mb-8 object-contain invert brightness-200" />
          )}
          <h1 className="font-black text-[clamp(40px,7vw,80px)] leading-[0.95] tracking-[-2px] uppercase mb-6">
            Website<br />Assessment
          </h1>
          <p className="text-lg opacity-60 max-w-xl mx-auto">
            {project.clientName}
          </p>
          <p className="text-sm opacity-30 mt-4">
            {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
      </SlideFrame>
    ),
  });

  // 2. EXECUTIVE SUMMARY
  if (project.clientGoals.length > 0 || project.valuePropositions.length > 0) {
    slides.push({
      id: "executive-summary",
      type: "overview",
      render: () => (
        <SlideFrame bg="dark" label="Executive Summary" slideNum={slides.indexOf(slides.find((s) => s.id === "executive-summary")!) + 1} total={total()}>
          <LimeBar />
          <h2 className="font-extrabold text-[clamp(32px,5vw,56px)] leading-tight tracking-[-1.5px] mb-8">
            Project Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {project.clientGoals.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider opacity-50 mb-4">Client Goals</h3>
                <LimeBullets items={project.clientGoals} />
              </div>
            )}
            {project.targetAudiences.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider opacity-50 mb-4">Target Audiences</h3>
                <LimeBullets items={project.targetAudiences} />
              </div>
            )}
          </div>
        </SlideFrame>
      ),
    });
  }

  // 3. STRATEGIC POSITIONING
  if (project.valuePropositions.length > 0 || project.differentiators.length > 0) {
    slides.push({
      id: "positioning",
      type: "list",
      render: () => (
        <SlideFrame bg="accent" label="Strategic Positioning" slideNum={slides.indexOf(slides.find((s) => s.id === "positioning")!) + 1} total={total()}>
          <LimeBar />
          <h2 className="font-extrabold text-[clamp(32px,5vw,56px)] leading-tight tracking-[-1.5px] mb-8">
            Positioning & Differentiation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {project.valuePropositions.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider opacity-50 mb-4">Value Propositions</h3>
                <LimeBullets items={project.valuePropositions} />
              </div>
            )}
            {project.differentiators.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider opacity-50 mb-4">Key Differentiators</h3>
                <LimeBullets items={project.differentiators} />
              </div>
            )}
          </div>
          {project.competitorUrls.length > 0 && (
            <div className="mt-10">
              <h3 className="text-sm font-bold uppercase tracking-wider opacity-50 mb-4">Competitive References</h3>
              <div className="flex flex-wrap gap-3">
                {project.competitorUrls.map((url, i) => (
                  <span key={i} className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-mono opacity-70">
                    {url.replace(/https?:\/\//, "").replace(/\/$/, "")}
                  </span>
                ))}
              </div>
            </div>
          )}
        </SlideFrame>
      ),
    });
  }

  // 4. DISCOVERY NOTES → parsed into structured slides
  if (project.discoveryNotes) {
    const parsedSlides = generateDeckSlidesFromDiscovery(project.discoveryNotes);
    for (const parsedSlide of parsedSlides) {
      slides.push({
        id: `discovery-${parsedSlide.id}`,
        type: "data",
        render: () => renderCustomSlide(parsedSlide, project, slides),
      });
    }
  }

  // 5. CONTENT INVENTORY
  if (project.existingContent || project.contentToCreate) {
    slides.push({
      id: "content",
      type: "data",
      render: () => (
        <SlideFrame bg="light" label="Content Audit" slideNum={slides.indexOf(slides.find((s) => s.id === "content")!) + 1} total={total()}>
          <div className="mb-6"><div className="h-[3px] w-16 bg-[#2e4545]" /></div>
          <h2 className="font-extrabold text-[clamp(32px,5vw,56px)] leading-tight tracking-[-1.5px] mb-8 text-[#1f1915]">
            Content Inventory
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {project.existingContent && (
              <div className="rounded-lg border border-[#1f1915]/10 p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#2e4545] mb-3">Existing Content</h3>
                <p className="text-sm text-[#1f1915]/70 whitespace-pre-wrap">{project.existingContent}</p>
              </div>
            )}
            {project.contentToCreate && (
              <div className="rounded-lg border border-[#1f1915]/10 p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#2e4545] mb-3">To Create</h3>
                <p className="text-sm text-[#1f1915]/70 whitespace-pre-wrap">{project.contentToCreate}</p>
              </div>
            )}
            {project.contentOwnership && (
              <div className="rounded-lg border border-[#1f1915]/10 p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#2e4545] mb-3">Ownership</h3>
                <p className="text-sm text-[#1f1915]/70 whitespace-pre-wrap">{project.contentOwnership}</p>
              </div>
            )}
          </div>
        </SlideFrame>
      ),
    });
  }

  // 5b. PERFORMANCE AUDIT (PageSpeed)
  const ps = project.audit?.pagespeed;
  if (ps?.mobile || ps?.desktop) {
    const data = ps.mobile || ps.desktop!;
    const formatMs = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}s` : `${Math.round(v)}ms`;
    const cwvColor = (r: string) => r === "good" ? "text-[#d1f44c]" : r === "needs-improvement" ? "text-amber-400" : "text-red-400";

    slides.push({
      id: "performance",
      type: "data",
      render: () => (
        <SlideFrame bg="dark" label="Performance Audit" slideNum={slides.indexOf(slides.find((s) => s.id === "performance")!) + 1} total={total()}>
          <LimeBar />
          <h2 className="font-extrabold text-[clamp(32px,5vw,56px)] leading-tight tracking-[-1.5px] mb-8">
            Site Performance
          </h2>
          {/* Scores */}
          <div className="flex justify-around mb-12">
            {([
              ["Performance", data.scores.performance],
              ["Accessibility", data.scores.accessibility],
              ["Best Practices", data.scores.bestPractices],
              ["SEO", data.scores.seo],
            ] as [string, number][]).map(([label, score]) => (
              <div key={label} className="text-center">
                <p className={`font-black text-[clamp(48px,8vw,80px)] leading-none tracking-[-3px] ${score >= 90 ? "text-[#d1f44c]" : score >= 50 ? "text-amber-400" : "text-red-400"}`}>
                  {score}
                </p>
                <p className="text-xs opacity-50 mt-2">{label}</p>
              </div>
            ))}
          </div>
          {/* Core Web Vitals */}
          <div className="grid grid-cols-3 gap-6">
            {([
              ["LCP", data.coreWebVitals.lcp, "< 2.5s"],
              ["INP", data.coreWebVitals.inp, "< 200ms"],
              ["CLS", data.coreWebVitals.cls, "< 0.1"],
            ] as [string, MetricValue, string][]).map(([label, metric, target]) => (
              <div key={label} className="rounded-lg bg-white/5 p-5 border-t-[3px] border-[#d1f44c]">
                <p className="text-xs font-bold uppercase tracking-wider opacity-50 mb-2">{label}</p>
                <p className={`text-3xl font-black ${cwvColor(metric.rating)}`}>
                  {metric.unit === "ms" ? formatMs(metric.value) : metric.value.toFixed(3)}
                </p>
                <p className="text-xs opacity-40 mt-1">Target: {target}</p>
              </div>
            ))}
          </div>
          {/* Opportunities */}
          {data.opportunities.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-bold uppercase tracking-wider opacity-50 mb-3">Top Opportunities</h3>
              <div className="grid grid-cols-2 gap-3">
                {data.opportunities.slice(0, 6).map((opp, i) => (
                  <div key={i} className="flex items-start gap-2 rounded bg-white/5 p-3">
                    <span className="text-[#d1f44c] text-xs mt-0.5">⚡</span>
                    <div>
                      <p className="text-xs font-medium">{opp.title}</p>
                      {opp.savings && <p className="text-[10px] opacity-40">Save {opp.savings}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SlideFrame>
      ),
    });
  }

  // 6. PROPOSED SITEMAP
  if (project.sitemap.length > 0) {
    slides.push({
      id: "sitemap",
      type: "sitemap",
      render: () => (
        <SlideFrame bg="dark" label="Information Architecture" slideNum={slides.indexOf(slides.find((s) => s.id === "sitemap")!) + 1} total={total()}>
          <LimeBar />
          <h2 className="font-extrabold text-[clamp(32px,5vw,56px)] leading-tight tracking-[-1.5px] mb-8">
            Proposed Sitemap
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {sprintNums.map((sprint) => {
              const pages = sprintMap.get(sprint) || [];
              return (
                <div key={sprint} className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#d1f44c] mb-2">
                    Sprint {sprint}
                  </p>
                  {pages.map((page) => (
                    <div key={page.id} className="rounded bg-white/5 px-3 py-2 border-l-2 border-[#d1f44c]">
                      <p className="text-xs font-semibold">{page.name}</p>
                      <p className="text-[10px] opacity-40 font-mono">/{page.slug}</p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
          <p className="text-xs opacity-30 mt-6">{project.sitemap.length} pages across {sprintNums.length} sprints</p>
        </SlideFrame>
      ),
    });
  }

  // 7. TECHNICAL REQUIREMENTS
  if (project.integrations.length > 0 || project.cmsPlatform !== "TBD") {
    slides.push({
      id: "technical",
      type: "data",
      render: () => (
        <SlideFrame bg="dark" label="Technical" slideNum={slides.indexOf(slides.find((s) => s.id === "technical")!) + 1} total={total()}>
          <LimeBar />
          <h2 className="font-extrabold text-[clamp(32px,5vw,56px)] leading-tight tracking-[-1.5px] mb-8">
            Technical Requirements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider opacity-50 mb-4">Platform</h3>
              <p className="text-3xl font-bold">{project.cmsPlatform}</p>
              {project.hostingNotes && <p className="text-sm opacity-50 mt-2">{project.hostingNotes}</p>}
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider opacity-50 mb-4">Integrations</h3>
              <div className="flex flex-wrap gap-2">
                {project.integrations.map((intg) => (
                  <span key={intg.id} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium">
                    {intg.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SlideFrame>
      ),
    });
  }

  // 8. TIMELINE — E3 PROCESS
  slides.push({
    id: "process",
    type: "timeline",
    render: () => (
      <SlideFrame bg="dark" label="Process & Timeline" slideNum={slides.indexOf(slides.find((s) => s.id === "process")!) + 1} total={total()}>
        <LimeBar />
        <h2 className="font-extrabold text-[clamp(32px,5vw,56px)] leading-tight tracking-[-1.5px] mb-8">
          7-Phase Process
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {phaseDefinitions.map((phase, i) => (
            <PhaseCard
              key={phase.id}
              number={String(i + 1).padStart(2, "0")}
              name={phase.shortName}
              timing={phase.timing}
              role={phase.humanRole}
            />
          ))}
        </div>
      </SlideFrame>
    ),
  });

  // 9. TIMELINE COMPARISON
  slides.push({
    id: "comparison",
    type: "comparison",
    render: () => (
      <SlideFrame bg="dark" label="Timeline" slideNum={slides.indexOf(slides.find((s) => s.id === "comparison")!) + 1} total={total()}>
        <LimeBar />
        <h2 className="font-extrabold text-[clamp(32px,5vw,56px)] leading-tight tracking-[-1.5px] mb-8">
          Timeline Comparison
        </h2>
        <div className="max-w-3xl">
          <ComparisonBar label="Assessment & Strategic Alignment" oldVal="6 wk" newVal="3 wk" />
          <ComparisonBar label="Information Architecture" oldVal="12 wk" newVal="2 wk" />
          <ComparisonBar label="Messaging & UI Design" oldVal="14 wk" newVal="3 wk" />
          <ComparisonBar label="Platform Development" oldVal="10 wk" newVal="2 wk" />
          <ComparisonBar label="QA & Launch" oldVal="4 wk" newVal="2 wk" />
        </div>
        <div className="flex items-center gap-8 mt-10">
          <StatNumber value="~70%" label="faster delivery" />
          <StatNumber value="8-14" label="total weeks" />
        </div>
      </SlideFrame>
    ),
  });

  // CUSTOM DECK SLIDES
  for (const deckSlide of (project.deckSlides || [])) {
    slides.push({
      id: `custom-${deckSlide.id}`,
      type: "data",
      render: () => renderCustomSlide(deckSlide, project, slides),
    });
  }

  // STYLE GUIDE SLIDE (auto-generated from project style guide)
  const sg = project.styleGuide;
  if (sg && sg.primaryColor !== "#171717") {
    slides.push({
      id: "style-guide",
      type: "data",
      render: () => (
        <SlideFrame bg="light" label="Style Guide" slideNum={slides.indexOf(slides.find((s) => s.id === "style-guide")!) + 1} total={total()}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="mb-4"><div className="h-[3px] w-16 bg-[#2e4545]" /></div>
              <h2 className="font-extrabold text-[clamp(32px,5vw,56px)] leading-tight tracking-[-1.5px] text-[#1f1915]">
                Website Style Guide
              </h2>
              <p className="text-sm text-[#1f1915]/50">{project.clientName}</p>
            </div>
            <p className="text-xs font-bold tracking-wider text-[#1f1915]/30">ELEMENT THREE</p>
          </div>
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h3 className="text-sm font-bold text-[#1f1915] mb-4">Colors</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { color: sg.primaryColor, name: "Primary" },
                  { color: sg.accentColor, name: "Accent" },
                  { color: sg.secondaryColor, name: "Secondary" },
                  { color: sg.backgroundColor, name: "Background" },
                  { color: sg.mutedColor, name: "Muted" },
                  { color: sg.borderColor, name: "Border" },
                ].map((c) => (
                  <div key={c.name} className="text-center">
                    <div className="w-14 h-14 rounded-full border-2 border-[#1f1915]/10 mb-1.5" style={{ backgroundColor: c.color }} />
                    <p className="text-[9px] font-mono text-[#1f1915]/40">{c.color}</p>
                    <p className="text-[10px] font-medium text-[#1f1915]/70">{c.name}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <h3 className="text-sm font-bold text-[#1f1915] mb-2">Typography</h3>
                <p className="text-xs text-[#1f1915]/60">Headings: <span className="font-semibold">{sg.headingFont}</span></p>
                <p className="text-xs text-[#1f1915]/60">Body: <span className="font-semibold">{sg.bodyFont}</span></p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1f1915] mb-4">Button Styles</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-[#1f1915]/50 mb-2">Primary</p>
                  <div className="flex gap-2">
                    <span className="inline-block rounded px-4 py-2 text-xs font-medium" style={{ backgroundColor: sg.primaryColor, color: sg.primaryForeground, borderRadius: sg.buttonStyle === "pill" ? "9999px" : `${sg.buttonRadius}px` }}>
                      Contact Us
                    </span>
                    <span className="inline-block rounded px-4 py-2 text-xs font-medium opacity-60" style={{ backgroundColor: sg.primaryColor, color: sg.primaryForeground, borderRadius: sg.buttonStyle === "pill" ? "9999px" : `${sg.buttonRadius}px` }}>
                      Hover
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[#1f1915]/50 mb-2">Outline</p>
                  <div className="flex gap-2">
                    <span className="inline-block rounded border-2 px-4 py-2 text-xs font-medium" style={{ borderColor: sg.primaryColor, color: sg.primaryColor, borderRadius: sg.buttonStyle === "pill" ? "9999px" : `${sg.buttonRadius}px` }}>
                      Learn More
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-sm font-bold text-[#1f1915] mb-2">Shape</h3>
                <p className="text-xs text-[#1f1915]/60">Border radius: {sg.borderRadius}px</p>
                <p className="text-xs text-[#1f1915]/60">Button style: {sg.buttonStyle}</p>
                <p className="text-xs text-[#1f1915]/60">Card shadow: {sg.cardShadow}</p>
              </div>
            </div>
          </div>
        </SlideFrame>
      ),
    });
  }

  // CLOSING
  slides.push({
    id: "closing",
    type: "closing",
    render: () => (
      <SlideFrame bg="accent" slideNum={slides.indexOf(slides.find((s) => s.id === "closing")!) + 1} total={total()}>
        <div className="text-center">
          <h2 className="font-black text-[clamp(36px,6vw,72px)] leading-[0.95] tracking-[-2px] uppercase mb-6">
            Human-Led Strategy.<br />
            AI-Powered Execution.<br />
            <span className="text-[#d1f44c]">Continuous Optimization.</span>
          </h2>
          <p className="text-lg opacity-60 mt-8 max-w-lg mx-auto">
            Let&rsquo;s build something exceptional for {project.clientName}.
          </p>
        </div>
      </SlideFrame>
    ),
  });

  return slides;
}

// ============================================================
// DECK VIEWER
// ============================================================

export function AssessmentDeck({ project, editUrl }: { project: Project; editUrl?: string }) {
  const slides = generateSlides(project);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Escape") {
        setFullscreen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [slides.length]);

  // Scroll to current slide
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const slideEl = container.children[currentSlide] as HTMLElement;
    if (slideEl) slideEl.scrollIntoView({ behavior: "smooth" });
  }, [currentSlide]);

  const toggleFullscreen = () => {
    if (!fullscreen) {
      containerRef.current?.parentElement?.requestFullscreen?.();
      setFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
  };

  return (
    <div className="relative">
      {/* Navigation */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`rounded-full transition-all ${
              i === currentSlide ? "w-2.5 h-2.5 bg-[#d1f44c]" : "w-2 h-2 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-black/60 backdrop-blur px-4 py-2">
        <Button size="icon-xs" variant="ghost" onClick={() => setCurrentSlide((p) => Math.max(p - 1, 0))} className="text-white/60 hover:text-white">
          <ChevronUp className="h-4 w-4" />
        </Button>
        <span className="text-xs font-mono text-white/40 w-12 text-center">
          {currentSlide + 1} / {slides.length}
        </span>
        <Button size="icon-xs" variant="ghost" onClick={() => setCurrentSlide((p) => Math.min(p + 1, slides.length - 1))} className="text-white/60 hover:text-white">
          <ChevronDown className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-white/10" />
        <Button size="icon-xs" variant="ghost" onClick={toggleFullscreen} className="text-white/60 hover:text-white">
          {fullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
        </Button>
        {editUrl && (
          <>
            <div className="w-px h-4 bg-white/10" />
            <Link href={editUrl}>
              <Button size="icon-xs" variant="ghost" className="text-white/60 hover:text-white">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </>
        )}
      </div>

      {/* Slides */}
      <div
        ref={containerRef}
        className="snap-y snap-mandatory h-screen overflow-y-auto scroll-smooth"
      >
        {slides.map((slide) => (
          <div key={slide.id}>{slide.render()}</div>
        ))}
      </div>
    </div>
  );
}
