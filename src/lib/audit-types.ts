/**
 * Site audit data stored on a project.
 * Populated by automated tools (PageSpeed, future GA4, Search Console).
 */

export interface SiteAudit {
  lastRunAt: string | null;

  // PageSpeed Insights
  pagespeed: {
    mobile: PageSpeedSnapshot | null;
    desktop: PageSpeedSnapshot | null;
  };

  // Placeholder for future integrations
  ga4: GA4Snapshot | null;
  searchConsole: SearchConsoleSnapshot | null;
}

export interface PageSpeedSnapshot {
  url: string;
  fetchedAt: string;
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  coreWebVitals: {
    lcp: MetricValue;
    fid: MetricValue;
    cls: MetricValue;
    inp: MetricValue;
    fcp: MetricValue;
    ttfb: MetricValue;
  };
  opportunities: { title: string; description: string; savings: string }[];
  diagnostics: { title: string; description: string }[];
}

export interface MetricValue {
  value: number;
  unit: string;
  rating: "good" | "needs-improvement" | "poor";
}

// Future: GA4 snapshot
export interface GA4Snapshot {
  fetchedAt: string;
  dateRange: string;
  totalSessions: number;
  totalUsers: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: { path: string; sessions: number; bounceRate: number }[];
  trafficSources: { source: string; sessions: number; percentage: number }[];
  conversionRate: number;
  totalConversions: number;
}

// Future: Search Console snapshot
export interface SearchConsoleSnapshot {
  fetchedAt: string;
  dateRange: string;
  totalClicks: number;
  totalImpressions: number;
  avgCTR: number;
  avgPosition: number;
  topQueries: { query: string; clicks: number; impressions: number; ctr: number; position: number }[];
  topPages: { page: string; clicks: number; impressions: number }[];
  indexedPages: number;
  crawlErrors: number;
}

export function createEmptyAudit(): SiteAudit {
  return {
    lastRunAt: null,
    pagespeed: { mobile: null, desktop: null },
    ga4: null,
    searchConsole: null,
  };
}
