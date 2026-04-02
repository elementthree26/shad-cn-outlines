"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Maximize2, Minimize2, Pencil } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Project, phaseDefinitions, getPagesBySprint } from "@/lib/project-types";
import { MetricValue } from "@/lib/audit-types";
import {
  DeckSlide,
  CompetitiveAnalysisData,
  IntegrationsTableData,
  ScreenshotAuditData,
  ContentRecommendationsData,
  CustomBulletsData,
  CustomTwoColumnData,
} from "@/lib/deck-types";
import { generateDeckSlidesFromDiscovery } from "@/lib/discovery-parser";
import { AnalyticsUpload, summarizeCSV } from "@/lib/csv-parser";

// ============================================================
// E3-style assessment deck — white bg, teal dividers
// ============================================================

interface Slide { id: string; render: () => React.ReactNode }

// --- Slide frames ---
function ContentSlide({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen snap-start flex flex-col justify-center relative bg-white text-[#1f1915]" style={{ padding: "clamp(40px,5vw,80px) clamp(40px,5vw,100px)" }}>
      <p className="absolute top-10 right-10 text-[11px] font-bold tracking-[1px] text-[#1f1915]/30">ELEMENT THREE</p>
      <div className="max-w-6xl mx-auto w-full">{children}</div>
    </div>
  );
}
function SectionDivider({ label, title }: { label?: string; title: string }) {
  return (
    <div className="min-h-screen snap-start flex flex-col justify-end relative bg-[#2e4545]" style={{ padding: "clamp(40px,5vw,80px)" }}>
      {label && <p className="text-[#d1f44c] text-sm font-semibold tracking-wider uppercase mb-3">{label}</p>}
      <h1 className="text-white font-black text-[clamp(48px,8vw,90px)] leading-[0.9] tracking-[-2px] uppercase">{title}</h1>
    </div>
  );
}
function LightDivider({ subtitle, title }: { subtitle?: string; title: string }) {
  return (
    <div className="min-h-screen snap-start flex flex-col items-center justify-center bg-[#f0f0f0]">
      <div className="rounded-2xl bg-white/80 px-16 py-20 text-center">
        {subtitle && <p className="text-[#8B6914] text-sm font-semibold tracking-wider uppercase mb-3">{subtitle}</p>}
        <h1 className="font-black text-[clamp(36px,6vw,64px)] leading-[0.95] tracking-[-2px] text-[#1f1915]">{title}</h1>
      </div>
    </div>
  );
}
function LimeSlide({ text }: { text: string }) {
  return (
    <div className="min-h-screen snap-start flex flex-col justify-end relative bg-[#d1f44c]" style={{ padding: "clamp(40px,5vw,80px)" }}>
      <h1 className="font-black text-[clamp(48px,8vw,90px)] leading-[0.9] tracking-[-2px] uppercase text-[#1f1915]">{text}</h1>
    </div>
  );
}

// --- Shared components ---
function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="font-extrabold text-[clamp(28px,4vw,44px)] leading-tight tracking-[-1px] text-[#1f1915] mb-6">{children}</h2>;
}
function Sub({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-[#1f1915]/50 mb-6">{children}</p>;
}
function NumberedItem({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4 mb-5">
      <span className="text-[#8B6914] font-black text-[28px] leading-none w-10 flex-shrink-0">{num}</span>
      <div><p className="font-bold text-sm mb-1">{title}</p><p className="text-xs text-[#1f1915]/60 leading-relaxed">{desc}</p></div>
    </div>
  );
}
function ThreeCards({ items }: { items: { label: string; text: string }[] }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {items.map((it, i) => (
        <div key={i}>
          <div className="inline-block rounded border border-[#1f1915]/20 px-3 py-1 text-[10px] font-bold mb-3">{it.label}</div>
          <p className="text-xs text-[#1f1915]/60 leading-relaxed">{it.text}</p>
        </div>
      ))}
    </div>
  );
}
function FourCols({ items }: { items: { label: string; color: string; bullets: string[] }[] }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {items.map((it, i) => (
        <div key={i}>
          <div className={`rounded px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white mb-3 ${it.color}`}>{it.label}</div>
          <ul className="space-y-1">{it.bullets.map((b, j) => <li key={j} className="text-[11px] text-[#1f1915]/60 flex items-start gap-1.5"><span className="mt-1.5 w-1 h-1 rounded-full bg-[#1f1915]/25 flex-shrink-0" />{b}</li>)}</ul>
        </div>
      ))}
    </div>
  );
}
function TwoCards({ left, right }: { left: { title: string; items: string[] }; right: { title: string; items: string[] } }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="rounded-lg bg-[#2e4545] text-white p-7">
        <h3 className="font-bold text-sm mb-4">{left.title}</h3>
        <ul className="space-y-1.5">{left.items.filter(Boolean).map((b, i) => <li key={i} className="text-[11px] flex items-start gap-2 opacity-90"><span className="text-[#d1f44c] flex-shrink-0">•</span>{b}</li>)}</ul>
      </div>
      <div className="rounded-lg bg-[#f4f5f5] p-7">
        <h3 className="font-bold text-sm mb-4">{right.title}</h3>
        <ul className="space-y-1.5">{right.items.filter(Boolean).map((b, i) => <li key={i} className="text-[11px] text-[#1f1915]/60 flex items-start gap-2"><span className="text-[#2e4545] flex-shrink-0">•</span>{b}</li>)}</ul>
      </div>
    </div>
  );
}

// --- Custom slide renderer ---
function renderCustomSlide(slide: DeckSlide): React.ReactNode {
  const d = slide.data;
  switch (d.type) {
    case "competitive-analysis": {
      const da = d as CompetitiveAnalysisData;
      return (<ContentSlide><H2>{slide.title}</H2>
        <table className="w-full text-xs border-collapse"><thead><tr>
          {da.columns.map((col, i) => <th key={i} className={`text-left p-3 font-bold uppercase tracking-wider ${col.isClient ? "bg-[#333] text-white" : "bg-gray-100"}`}>{col.name}</th>)}
        </tr></thead><tbody><tr>
          {da.columns.map((col, i) => <td key={i} className="p-3 align-top border-t"><ul className="space-y-1">{col.items.filter(Boolean).map((it, j) => <li key={j} className="flex items-start gap-1.5"><span className="mt-1.5 w-1 h-1 rounded-full bg-[#333] flex-shrink-0" />{it}</li>)}</ul></td>)}
        </tr></tbody></table>
      </ContentSlide>);
    }
    case "integrations-table": {
      const da = d as IntegrationsTableData;
      const catColors = ["bg-[#d4c96a]/30", "bg-[#8e8eb8]/30", "bg-[#c9889a]/30", "bg-[#88b8a0]/30"];
      const grouped = new Map<string, typeof da.rows>();
      for (const row of da.rows) { if (!grouped.has(row.category)) grouped.set(row.category, []); grouped.get(row.category)!.push(row); }
      return (<ContentSlide><H2>{slide.title}</H2>
        <table className="w-full text-xs border-collapse"><thead><tr className="bg-[#333] text-white">
          <th className="text-left p-2.5 font-bold uppercase text-[10px]">Category</th><th className="text-left p-2.5 font-bold uppercase text-[10px]">Function</th>
          <th className="text-left p-2.5 font-bold uppercase text-[10px]">Current Platform</th><th className="text-left p-2.5 font-bold uppercase text-[10px]">Recommendation</th>
        </tr></thead><tbody>
          {[...grouped.entries()].map(([cat, rows], ci) => rows.map((row, ri) => (
            <tr key={`${ci}-${ri}`} className={`border-t ${catColors[ci % catColors.length]}`}>
              {ri === 0 && <td rowSpan={rows.length} className="p-2.5 font-bold align-top">{cat}</td>}
              <td className="p-2.5">{row.function}</td><td className="p-2.5">{row.currentPlatform}</td><td className="p-2.5 font-medium">{row.recommendation}</td>
            </tr>
          )))}
        </tbody></table>
      </ContentSlide>);
    }
    case "screenshot-audit": {
      const da = d as ScreenshotAuditData;
      return (<ContentSlide><H2>{slide.title}</H2>
        <div className="grid grid-cols-2 gap-6">{da.screenshots.map((ss, i) => (
          <div key={i}>{ss.imageUrl && <img src={ss.imageUrl} alt={ss.caption} className="w-full rounded-lg border shadow-sm" />}
            {ss.caption && <p className="text-xs font-medium mt-2">{ss.caption}</p>}
            {ss.callouts.map((c, j) => <span key={j} className="inline-block mt-1 mr-1 rounded bg-gray-100 border px-2 py-0.5 text-[10px]">{c.text}</span>)}
          </div>
        ))}</div>
      </ContentSlide>);
    }
    case "content-recommendations": {
      const da = d as ContentRecommendationsData;
      return (<ContentSlide><H2>{slide.title}</H2>
        <TwoCards
          left={{ title: da.leftCard.title, items: da.leftCard.sections.flatMap((s) => s.items) }}
          right={{ title: da.rightCard.title, items: da.rightCard.items }}
        />
      </ContentSlide>);
    }
    case "custom-bullets": {
      const da = d as CustomBulletsData;
      return (<ContentSlide><H2>{slide.title}</H2>
        {da.subtitle && <Sub>{da.subtitle}</Sub>}
        <ul className="space-y-2">{da.items.filter(Boolean).map((b, i) => <li key={i} className="text-sm text-[#1f1915]/70 flex items-start gap-2"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#1f1915]/25 flex-shrink-0" />{b}</li>)}</ul>
      </ContentSlide>);
    }
    case "custom-two-column": {
      const da = d as CustomTwoColumnData;
      return (<ContentSlide><H2>{slide.title}</H2>
        <div className="grid grid-cols-2 gap-10">
          <div><h3 className="text-xs font-bold uppercase tracking-wider text-[#1f1915]/40 mb-3">{da.leftTitle}</h3>
            <ul className="space-y-1.5">{da.leftItems.filter(Boolean).map((b, i) => <li key={i} className="text-xs text-[#1f1915]/60 flex items-start gap-2"><span className="mt-1.5 w-1 h-1 rounded-full bg-[#1f1915]/25 flex-shrink-0" />{b}</li>)}</ul>
          </div>
          <div><h3 className="text-xs font-bold uppercase tracking-wider text-[#1f1915]/40 mb-3">{da.rightTitle}</h3>
            <ul className="space-y-1.5">{da.rightItems.filter(Boolean).map((b, i) => <li key={i} className="text-xs text-[#1f1915]/60 flex items-start gap-2"><span className="mt-1.5 w-1 h-1 rounded-full bg-[#1f1915]/25 flex-shrink-0" />{b}</li>)}</ul>
          </div>
        </div>
      </ContentSlide>);
    }
    default:
      return <ContentSlide><p className="text-sm text-[#1f1915]/40">Unknown slide type</p></ContentSlide>;
  }
}

// ============================================================
// SLIDE GENERATION
// ============================================================

function generateSlides(project: Project): Slide[] {
  const slides: Slide[] = [];
  const sprintMap = getPagesBySprint(project.sitemap);
  const sprintNums = [...sprintMap.keys()].sort();

  const push = (id: string, render: () => React.ReactNode) => slides.push({ id, render });

  // ─── SECTION: PROJECT OVERVIEW ───
  push("div-overview", () => <SectionDivider label="Day 1" title="Project Overview" />);

  // Project Focus
  if (project.clientGoals.length > 0) {
    push("project-focus", () => (
      <ContentSlide><H2>Project Focus</H2>
        <div className="grid grid-cols-2 gap-10">
          <div>
            <p className="text-sm font-bold text-green-700 underline mb-3">Included</p>
            <p className="text-xs text-[#1f1915]/70 mb-2">Within this project, we will be:</p>
            <ol className="space-y-2">{project.clientGoals.map((g, i) => <li key={i} className="text-xs text-[#1f1915]/70 flex items-start gap-2"><span className="font-bold text-[#1f1915]">{i + 1}.</span>{g}</li>)}</ol>
          </div>
          <div>
            <p className="text-sm font-bold text-[#8B6914] underline mb-3">Not Included</p>
            <p className="text-xs text-[#1f1915]/50 italic">Define exclusions in the deck editor.</p>
          </div>
        </div>
      </ContentSlide>
    ));
  }

  // The Assignment
  push("assignment", () => (
    <ContentSlide>
      <div className="grid grid-cols-2 gap-0">
        <div className="pr-10">
          <H2>The Assignment</H2>
          <p className="text-sm text-[#1f1915]/70 mb-4">Determine the objectives, priorities, and scope of the {project.clientName} website rebuild.</p>
          <p className="text-sm text-[#1f1915]/70 mb-3">At the conclusion of this phase, there will be alignment on:</p>
          <ul className="space-y-1.5">
            {["Core KPIs and performance metrics for the website", "Technology integrations and platforms", "Core functionality to be included", "The plan forward"].map((b, i) => (
              <li key={i} className="text-xs text-[#1f1915]/70 flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1f1915]/30 flex-shrink-0" />{b}</li>
            ))}
          </ul>
        </div>
        <div className="bg-[#eaecec] rounded-lg min-h-[300px] flex items-center justify-center"><span className="text-xs text-[#1f1915]/20">Client Photo</span></div>
      </div>
    </ContentSlide>
  ));

  // ─── SECTION: DISCOVERY SYNTHESIS ───
  push("div-discovery", () => <LightDivider subtitle={project.clientName} title="Discovery Synthesis" />);

  // Research & Discovery Sources
  push("sources", () => (
    <ContentSlide><H2>Research & Discovery Sources</H2>
      <div className="grid grid-cols-3 gap-8">
        <div><h3 className="text-sm font-bold mb-3">Discovery Sessions</h3>
          <ul className="space-y-1 text-xs text-[#1f1915]/60"><li>• Kickoff & Discovery</li><li>• Website Discovery</li><li>• Tech Discovery</li></ul>
        </div>
        <div><h3 className="text-sm font-bold mb-3">Competitive Review</h3>
          <p className="text-xs text-[#1f1915]/60 mb-2">Competitors analyzed:</p>
          <ul className="space-y-1 text-xs text-[#1f1915]/60">{project.competitorUrls.map((u, i) => <li key={i}>• {u.replace(/https?:\/\//, "").replace(/\/$/, "")}</li>)}</ul>
        </div>
        <div><h3 className="text-sm font-bold mb-3">Third-Party Tools</h3>
          <ul className="space-y-1 text-xs text-[#1f1915]/60"><li>• SEMrush</li><li>• PageSpeed Insights</li><li>• BuiltWith (tech stack)</li></ul>
        </div>
      </div>
    </ContentSlide>
  ));

  // Website Audiences
  if (project.targetAudiences.length > 0) {
    push("audiences", () => (
      <ContentSlide><H2>Website Audiences</H2><Sub>{project.clientName}</Sub>
        <div className="grid grid-cols-2 gap-x-10 gap-y-1">
          {project.targetAudiences.map((a, i) => (
            <NumberedItem key={i} num={String(i + 1).padStart(2, "0")} title={a} desc="" />
          ))}
        </div>
      </ContentSlide>
    ));
  }

  // Website Objectives & KPIs
  if (project.clientGoals.length > 0) {
    const colors = ["bg-[#8B6914]", "bg-[#2e4545]", "bg-[#5a7a7a]", "bg-[#88a800]"];
    push("kpis", () => (
      <ContentSlide><H2>Website Objectives & KPIs</H2>
        <FourCols items={project.clientGoals.slice(0, 4).map((g, i) => ({
          label: g.split(" ").slice(0, 2).join(" "),
          color: colors[i % colors.length],
          bullets: [g],
        }))} />
      </ContentSlide>
    ));
  }

  // Parsed discovery slides
  if (project.discoveryNotes) {
    const parsed = generateDeckSlidesFromDiscovery(project.discoveryNotes);
    for (const ps of parsed) {
      push(`disc-${ps.id}`, () => renderCustomSlide(ps));
    }
  }

  // ─── SECTION: CURRENT SITES ASSESSMENT ───
  push("div-assessment", () => <LightDivider subtitle={project.clientName} title="Current Sites Assessment" />);

  // Performance audit
  const ps = project.audit?.pagespeed;
  if (ps?.mobile || ps?.desktop) {
    const data = ps.mobile || ps.desktop!;
    const fmtMs = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}s` : `${Math.round(v)}ms`;
    const scoreColor = (s: number) => s >= 90 ? "text-green-600" : s >= 50 ? "text-amber-600" : "text-red-600";
    push("performance", () => (
      <ContentSlide><H2>Site Baselines</H2><Sub>{project.clientName}</Sub>
        <div className="grid grid-cols-[1fr_2fr] gap-8">
          <p className="text-xs text-[#1f1915]/60 leading-relaxed">
            Performance scores and Core Web Vitals for the current site based on Google PageSpeed Insights data.
          </p>
          <table className="text-xs border-collapse w-full">
            <thead><tr className="bg-[#d1f44c]/30">
              <th className="text-left p-2.5 font-bold uppercase text-[10px]">Metric</th>
              <th className="text-center p-2.5 font-bold uppercase text-[10px]">{project.clientName}</th>
            </tr></thead>
            <tbody>
              {[
                ["Performance Score", String(data.scores.performance)],
                ["Accessibility Score", String(data.scores.accessibility)],
                ["SEO Score", String(data.scores.seo)],
                ["LCP", fmtMs(data.coreWebVitals.lcp.value)],
                ["CLS", data.coreWebVitals.cls.value.toFixed(3)],
                ["TTFB", fmtMs(data.coreWebVitals.ttfb.value)],
              ].map(([label, val], i) => (
                <tr key={i} className="border-t"><td className="p-2.5 font-medium">{label}</td><td className="p-2.5 text-center font-bold">{val}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </ContentSlide>
    ));
  }

  // ─── Analytics uploads as slides ───
  const analyticsUploads: AnalyticsUpload[] = (project as any).analyticsUploads || [];
  const deckUploads = analyticsUploads.filter((u) => u.includeInDeck);
  for (const upload of deckUploads) {
    push(`analytics-${upload.id}`, () => (
      <ContentSlide>
        <H2>{upload.caption || upload.name}</H2>
        {upload.csv && (() => {
          const { keyMetrics, topRows } = summarizeCSV(upload.csv!);
          return (
            <div className="grid grid-cols-[1fr_2fr] gap-8">
              {/* Key metrics */}
              <div className="space-y-3">
                {keyMetrics.map((m, i) => (
                  <div key={i} className="rounded border px-3 py-2.5">
                    <p className="text-2xl font-bold">{m.value}</p>
                    <p className="text-[10px] text-[#1f1915]/50">{m.label}</p>
                  </div>
                ))}
                <p className="text-[10px] text-[#1f1915]/30 italic">
                  Source: {upload.csv!.source === "ga4" ? "Google Analytics 4" : upload.csv!.source === "search-console" ? "Search Console" : upload.csv!.source === "semrush" ? "SEMrush" : "Uploaded data"}
                </p>
              </div>
              {/* Data table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead><tr className="bg-[#d1f44c]/30">
                    {upload.csv!.headers.slice(0, 5).map((h, i) => (
                      <th key={i} className="text-left p-2 font-bold uppercase text-[10px]">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {upload.csv!.rows.slice(0, 15).map((row, ri) => (
                      <tr key={ri} className="border-t">
                        {row.slice(0, 5).map((cell, ci) => (
                          <td key={ci} className={`p-2 ${ci === 0 ? "font-medium" : ""}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {upload.csv!.rows.length > 15 && (
                  <p className="text-[10px] text-[#1f1915]/30 mt-2">Showing 15 of {upload.csv!.rows.length} rows</p>
                )}
              </div>
            </div>
          );
        })()}
        {upload.imageUrl && (
          <div className="mt-4">
            <img src={upload.imageUrl} alt={upload.caption} className="w-full rounded-lg border shadow-sm max-h-[60vh] object-contain" />
          </div>
        )}
      </ContentSlide>
    ));
  }

  // ─── SECTION: TECH STACK ───
  push("div-tech", () => <SectionDivider label="Day 1" title="Tech Stack" />);

  // Technical requirements
  if (project.integrations.length > 0 || project.cmsPlatform !== "TBD") {
    push("tech-reqs", () => (
      <ContentSlide><H2>Technology Requirements</H2>
        <ThreeCards items={[
          { label: "CMS Platform", text: `The recommended platform is ${project.cmsPlatform}. ${project.hostingNotes || ""}` },
          { label: "Integrations", text: project.integrations.map((i) => i.name).join(", ") || "TBD" },
          { label: "Scalability", text: "The platform should be built to accommodate future growth and additional features post-launch." },
        ]} />
      </ContentSlide>
    ));
  }

  // ─── Custom deck slides ───
  for (const ds of (project.deckSlides || [])) {
    push(`custom-${ds.id}`, () => renderCustomSlide(ds));
  }

  // Style Guide
  const sg = project.styleGuide;
  if (sg && sg.primaryColor !== "#171717") {
    push("style-guide", () => (
      <ContentSlide><H2>Website Style Guide</H2><Sub>{project.clientName}</Sub>
        <div className="grid grid-cols-2 gap-10">
          <div>
            <h3 className="text-sm font-bold mb-4">Colors</h3>
            <div className="flex flex-wrap gap-3">
              {[{ c: sg.primaryColor, n: "Primary" }, { c: sg.accentColor, n: "Accent" }, { c: sg.secondaryColor, n: "Secondary" }, { c: sg.backgroundColor, n: "Background" }, { c: sg.mutedColor, n: "Muted" }, { c: sg.borderColor, n: "Border" }].map((x) => (
                <div key={x.n} className="text-center">
                  <div className="w-12 h-12 rounded-full border" style={{ backgroundColor: x.c }} />
                  <p className="text-[8px] font-mono text-[#1f1915]/40 mt-1">{x.c}</p>
                  <p className="text-[9px] font-medium">{x.n}</p>
                </div>
              ))}
            </div>
            <h3 className="text-sm font-bold mt-6 mb-2">Typography</h3>
            <p className="text-xs text-[#1f1915]/60">Headings: {sg.headingFont}</p>
            <p className="text-xs text-[#1f1915]/60">Body: {sg.bodyFont}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold mb-4">Button Styles</h3>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-[#1f1915]/40 mb-1.5">Primary</p>
                <span className="inline-block px-4 py-2 text-xs font-medium" style={{ backgroundColor: sg.primaryColor, color: sg.primaryForeground, borderRadius: sg.buttonStyle === "pill" ? "9999px" : `${sg.buttonRadius}px` }}>Contact Us</span>
              </div>
              <div>
                <p className="text-[10px] text-[#1f1915]/40 mb-1.5">Outline</p>
                <span className="inline-block border-2 px-4 py-2 text-xs font-medium" style={{ borderColor: sg.primaryColor, color: sg.primaryColor, borderRadius: sg.buttonStyle === "pill" ? "9999px" : `${sg.buttonRadius}px` }}>Learn More</span>
              </div>
            </div>
          </div>
        </div>
      </ContentSlide>
    ));
  }

  // Sitemap
  if (project.sitemap.length > 0) {
    push("sitemap", () => (
      <ContentSlide><H2>Sitemap — For Launch</H2><Sub>{project.clientName}</Sub>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {sprintNums.map((sprint) => {
            const pages = sprintMap.get(sprint) || [];
            return (
              <div key={sprint}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#8B6914] mb-2">Sprint {sprint}</p>
                {pages.map((page) => (
                  <div key={page.id} className="rounded bg-[#fffde8] border border-[#d4c96a]/40 px-2.5 py-1.5 mb-1.5">
                    <p className="text-[10px] font-medium">{page.name}</p>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </ContentSlide>
    ));
  }

  // Content Recommendations
  if (project.existingContent || project.contentToCreate) {
    push("content-recs", () => (
      <ContentSlide><H2>Content Recommendations</H2>
        <TwoCards
          left={{ title: "Existing Content to Migrate", items: project.existingContent ? project.existingContent.split("\n").filter(Boolean) : [] }}
          right={{ title: "New Content", items: project.contentToCreate ? project.contentToCreate.split("\n").filter(Boolean) : [] }}
        />
      </ContentSlide>
    ));
  }

  // ─── SECTION: PROJECT PLAN ───
  push("div-plan", () => <SectionDivider label="Day 1" title="Project Plan" />);

  // Process
  push("process", () => (
    <ContentSlide><H2>Web Strategy & Development Process</H2>
      <div className="flex items-center gap-6 mb-8">
        {phaseDefinitions.slice(0, 6).map((p, i) => (
          <div key={p.id} className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: i <= 1 ? "#2e4545" : i <= 3 ? "#5a7a7a" : i === 4 ? "#88b8b8" : "#d1f44c" }} />
            {i < 5 && <div className="w-6 h-px bg-[#1f1915]/10" />}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-6 gap-3">
        {phaseDefinitions.slice(0, 6).map((p) => (
          <div key={p.id}>
            <div className="rounded border border-[#1f1915]/10 px-2 py-1.5 text-[9px] font-bold uppercase tracking-wider text-center mb-2">{p.shortName}</div>
            <p className="text-[9px] text-[#1f1915]/50">{p.timing}</p>
          </div>
        ))}
      </div>
    </ContentSlide>
  ));

  // ─── SECTION: NEXT STEPS ───
  push("div-next", () => <SectionDivider title="Next Steps" />);

  push("next-steps", () => (
    <ContentSlide><H2>Next Steps</H2>
      <div className="grid grid-cols-3 gap-8">
        <div>
          <h3 className="text-sm font-bold mb-4">Next Meetings to Schedule</h3>
          <NumberedItem num="01" title="Wireframe Review" desc="We'll review wireframes of key pages to get your approval on content and module hierarchy." />
          <NumberedItem num="02" title="Bi-Weekly Check-in" desc="Reserve 30 minutes every other week to touch base on progress and upcoming reviews." />
        </div>
        <div>
          <h3 className="text-sm font-bold mb-4">Send to Element Three</h3>
          <NumberedItem num="01" title="CMS Account Access" desc="We'll need credentials to set up a staging environment." />
          <NumberedItem num="02" title="Brand Assets" desc="Logos, fonts, photography, and any existing brand guidelines." />
        </div>
        <div>
          <h3 className="text-sm font-bold mb-4">Upcoming Touchpoints</h3>
          <NumberedItem num="01" title="Content Discovery" desc="We'll help fill in content holes to prepare for copywriting." />
          <NumberedItem num="02" title="Copy Review" desc="You'll review V1 copy. We'll make revisions and review V2 on staging." />
        </div>
      </div>
    </ContentSlide>
  ));

  // Thank you
  push("thanks", () => <LimeSlide text="Thank You" />);

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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); setCurrentSlide((p) => Math.min(p + 1, slides.length - 1)); }
      else if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); setCurrentSlide((p) => Math.max(p - 1, 0)); }
      else if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [slides.length]);

  useEffect(() => {
    const el = containerRef.current?.children[currentSlide] as HTMLElement;
    el?.scrollIntoView({ behavior: "smooth" });
  }, [currentSlide]);

  const toggleFs = () => { if (!fullscreen) { containerRef.current?.parentElement?.requestFullscreen?.(); setFullscreen(true); } else { document.exitFullscreen?.(); setFullscreen(false); } };

  return (
    <div className="relative">
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-1.5">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrentSlide(i)} className={`rounded-full transition-all ${i === currentSlide ? "w-2.5 h-2.5 bg-[#2e4545]" : "w-2 h-2 bg-[#1f1915]/15 hover:bg-[#1f1915]/30"}`} />
        ))}
      </div>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-black/60 backdrop-blur px-4 py-2">
        <Button size="icon-xs" variant="ghost" onClick={() => setCurrentSlide((p) => Math.max(p - 1, 0))} className="text-white/60 hover:text-white"><ChevronUp className="h-4 w-4" /></Button>
        <span className="text-xs font-mono text-white/40 w-12 text-center">{currentSlide + 1} / {slides.length}</span>
        <Button size="icon-xs" variant="ghost" onClick={() => setCurrentSlide((p) => Math.min(p + 1, slides.length - 1))} className="text-white/60 hover:text-white"><ChevronDown className="h-4 w-4" /></Button>
        <div className="w-px h-4 bg-white/10" />
        <Button size="icon-xs" variant="ghost" onClick={toggleFs} className="text-white/60 hover:text-white">{fullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}</Button>
        {editUrl && (<><div className="w-px h-4 bg-white/10" /><Link href={editUrl}><Button size="icon-xs" variant="ghost" className="text-white/60 hover:text-white"><Pencil className="h-3.5 w-3.5" /></Button></Link></>)}
      </div>
      <div ref={containerRef} className="snap-y snap-mandatory h-screen overflow-y-auto scroll-smooth">
        {slides.map((s) => <div key={s.id}>{s.render()}</div>)}
      </div>
    </div>
  );
}
