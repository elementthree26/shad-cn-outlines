"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Project, phaseDefinitions, getPagesBySprint } from "@/lib/project-types";
import { PageSpeedSnapshot, MetricValue } from "@/lib/audit-types";

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

  // 4. DISCOVERY NOTES
  if (project.discoveryNotes) {
    slides.push({
      id: "discovery",
      type: "list",
      render: () => (
        <SlideFrame bg="dark" label="Discovery Findings" slideNum={slides.indexOf(slides.find((s) => s.id === "discovery")!) + 1} total={total()}>
          <LimeBar />
          <h2 className="font-extrabold text-[clamp(32px,5vw,56px)] leading-tight tracking-[-1.5px] mb-8">
            Discovery Findings
          </h2>
          <p className="text-sm opacity-70 whitespace-pre-wrap leading-relaxed max-w-3xl">
            {project.discoveryNotes}
          </p>
        </SlideFrame>
      ),
    });
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

  // 10. CLOSING
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

export function AssessmentDeck({ project }: { project: Project }) {
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
