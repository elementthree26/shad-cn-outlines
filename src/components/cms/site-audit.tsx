"use client";

import { useState } from "react";
import { Loader2, Globe, Zap, Eye, Shield, Search, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/lib/project-types";
import { SiteAudit, PageSpeedSnapshot, MetricValue } from "@/lib/audit-types";

function scoreColor(score: number): string {
  if (score >= 90) return "text-green-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
}

function scoreBg(score: number): string {
  if (score >= 90) return "bg-green-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-500";
}

function ratingBadge(rating: string): string {
  if (rating === "good") return "bg-green-100 text-green-800 border-green-300";
  if (rating === "needs-improvement") return "bg-amber-100 text-amber-800 border-amber-300";
  return "bg-red-100 text-red-800 border-red-300";
}

function formatMetric(m: MetricValue): string {
  if (m.unit === "ms") return `${Math.round(m.value)}ms`;
  if (m.unit === "") return m.value.toFixed(3);
  return `${m.value}${m.unit}`;
}

function ScoreCircle({ score, label, size = "lg" }: { score: number; label: string; size?: "sm" | "lg" }) {
  const s = size === "lg" ? "h-20 w-20" : "h-12 w-12";
  const textSize = size === "lg" ? "text-2xl" : "text-sm";
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`${s} rounded-full border-4 ${score >= 90 ? "border-green-500" : score >= 50 ? "border-amber-500" : "border-red-500"} flex items-center justify-center`}>
        <span className={`${textSize} font-bold ${scoreColor(score)}`}>{score}</span>
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function MetricRow({ label, metric, target }: { label: string; metric: MetricValue; target?: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50">
      <span className="text-xs font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono font-bold">{formatMetric(metric)}</span>
        <Badge variant="outline" className={`text-[9px] ${ratingBadge(metric.rating)}`}>
          {metric.rating === "good" ? "Good" : metric.rating === "needs-improvement" ? "Needs Work" : "Poor"}
        </Badge>
        {target && <span className="text-[10px] text-muted-foreground">target: {target}</span>}
      </div>
    </div>
  );
}

function PageSpeedResults({ data, strategy }: { data: PageSpeedSnapshot; strategy: string }) {
  const [showOpportunities, setShowOpportunities] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Badge variant="outline" className="text-xs">{strategy}</Badge>
        <span className="text-[10px] text-muted-foreground">
          {new Date(data.fetchedAt).toLocaleString()}
        </span>
      </div>

      {/* Scores */}
      <div className="flex justify-around">
        <ScoreCircle score={data.scores.performance} label="Performance" />
        <ScoreCircle score={data.scores.accessibility} label="Accessibility" />
        <ScoreCircle score={data.scores.bestPractices} label="Best Practices" />
        <ScoreCircle score={data.scores.seo} label="SEO" />
      </div>

      {/* Core Web Vitals */}
      <div className="rounded-lg border p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Core Web Vitals</h4>
        <MetricRow label="Largest Contentful Paint (LCP)" metric={data.coreWebVitals.lcp} target="< 2.5s" />
        <MetricRow label="Interaction to Next Paint (INP)" metric={data.coreWebVitals.inp} target="< 200ms" />
        <MetricRow label="Cumulative Layout Shift (CLS)" metric={data.coreWebVitals.cls} target="< 0.1" />
        <MetricRow label="First Contentful Paint (FCP)" metric={data.coreWebVitals.fcp} target="< 1.8s" />
        <MetricRow label="Time to First Byte (TTFB)" metric={data.coreWebVitals.ttfb} target="< 800ms" />
      </div>

      {/* Opportunities */}
      {data.opportunities.length > 0 && (
        <div>
          <button
            onClick={() => setShowOpportunities(!showOpportunities)}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            {showOpportunities ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            {data.opportunities.length} Opportunities
          </button>
          {showOpportunities && (
            <div className="mt-2 space-y-1.5">
              {data.opportunities.map((opp, i) => (
                <div key={i} className="flex items-start gap-2 rounded border p-2">
                  <Zap className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium">{opp.title}</p>
                    {opp.savings && <Badge variant="secondary" className="text-[9px] mt-0.5">Save {opp.savings}</Badge>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function SiteAuditPanel({
  project,
  onUpdate,
}: {
  project: Project;
  onUpdate: (project: Project) => void;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audit = project.audit || { lastRunAt: null, pagespeed: { mobile: null, desktop: null }, ga4: null, searchConsole: null };

  const runPageSpeed = async (strategy: "mobile" | "desktop") => {
    const url = project.currentSiteUrl;
    if (!url) {
      setError("Set the current site URL in project setup first.");
      return;
    }
    setLoading(strategy);
    setError(null);
    try {
      const res = await fetch(`/api/pagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const newAudit: SiteAudit = {
        ...audit,
        lastRunAt: new Date().toISOString(),
        pagespeed: {
          ...audit.pagespeed,
          [strategy]: data,
        },
      };
      onUpdate({ ...project, audit: newAudit });
    } catch {
      setError(`Failed to run ${strategy} audit. Check the URL.`);
    } finally {
      setLoading(null);
    }
  };

  const runBoth = async () => {
    await runPageSpeed("mobile");
    await runPageSpeed("desktop");
  };

  return (
    <div className="space-y-4">
      {/* Run audit */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 flex-1 rounded-md border bg-muted/30 px-3 py-1.5">
          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-mono truncate">{project.currentSiteUrl || "No URL set"}</span>
        </div>
        <Button
          size="sm"
          onClick={runBoth}
          disabled={!project.currentSiteUrl || loading !== null}
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Zap className="h-3.5 w-3.5 mr-1" />}
          Run Audit
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}

      {/* Results */}
      {audit.pagespeed.mobile && (
        <PageSpeedResults data={audit.pagespeed.mobile} strategy="Mobile" />
      )}
      {audit.pagespeed.desktop && (
        <div className="mt-6">
          <PageSpeedResults data={audit.pagespeed.desktop} strategy="Desktop" />
        </div>
      )}

      {!audit.pagespeed.mobile && !audit.pagespeed.desktop && (
        <div className="text-center py-8 text-muted-foreground">
          <Search className="h-8 w-8 mx-auto mb-2 opacity-20" />
          <p className="text-sm">No audit data yet</p>
          <p className="text-xs mt-1">Enter a URL and run the audit to see performance scores, Core Web Vitals, and optimization opportunities.</p>
        </div>
      )}

      {/* Future integrations placeholder */}
      <div className="rounded-lg border border-dashed p-4 text-center">
        <p className="text-xs text-muted-foreground">
          <strong>Coming soon:</strong> Google Analytics 4, Search Console, SEMrush integration
        </p>
        <p className="text-[10px] text-muted-foreground/60 mt-1">
          Connect via OAuth to auto-pull traffic data, keyword rankings, and indexing status
        </p>
      </div>
    </div>
  );
}
