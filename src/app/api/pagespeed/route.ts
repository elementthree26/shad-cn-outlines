import { NextRequest } from "next/server";

/**
 * Proxy for Google PageSpeed Insights API.
 * Free, no API key required for moderate usage.
 * Docs: https://developers.google.com/speed/docs/insights/v5/get-started
 */

export interface PageSpeedResult {
  url: string;
  strategy: "mobile" | "desktop";
  fetchedAt: string;
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  coreWebVitals: {
    lcp: { value: number; unit: string; rating: string };
    fid: { value: number; unit: string; rating: string };
    cls: { value: number; unit: string; rating: string };
    inp: { value: number; unit: string; rating: string };
    fcp: { value: number; unit: string; rating: string };
    ttfb: { value: number; unit: string; rating: string };
  };
  opportunities: { title: string; description: string; savings: string }[];
  diagnostics: { title: string; description: string }[];
}

function getRating(score: number): string {
  if (score >= 0.9) return "good";
  if (score >= 0.5) return "needs-improvement";
  return "poor";
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  const strategy = request.nextUrl.searchParams.get("strategy") || "mobile";

  if (!url) {
    return Response.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO`;

    const res = await fetch(apiUrl, { next: { revalidate: 3600 } }); // cache 1 hour
    if (!res.ok) {
      const err = await res.text();
      return Response.json({ error: `PageSpeed API error: ${res.status}` }, { status: 502 });
    }

    const data = await res.json();

    const lighthouse = data.lighthouseResult;
    const categories = lighthouse?.categories || {};
    const audits = lighthouse?.audits || {};

    // Extract Core Web Vitals
    const lcp = audits["largest-contentful-paint"];
    const fid = audits["max-potential-fid"];
    const cls = audits["cumulative-layout-shift"];
    const inp = audits["interaction-to-next-paint"] || audits["experimental-interaction-to-next-paint"];
    const fcp = audits["first-contentful-paint"];
    const ttfb = audits["server-response-time"];

    // Extract opportunities
    const opportunities = Object.values(audits)
      .filter((a: any) => a.details?.type === "opportunity" && a.score !== null && a.score < 0.9)
      .map((a: any) => ({
        title: a.title,
        description: a.description,
        savings: a.details?.overallSavingsMs ? `${Math.round(a.details.overallSavingsMs)}ms` : "",
      }))
      .slice(0, 10);

    // Extract diagnostics
    const diagnostics = Object.values(audits)
      .filter((a: any) => a.details?.type === "table" && a.score !== null && a.score < 0.9)
      .map((a: any) => ({
        title: a.title,
        description: a.description || "",
      }))
      .slice(0, 8);

    const result: PageSpeedResult = {
      url,
      strategy: strategy as "mobile" | "desktop",
      fetchedAt: new Date().toISOString(),
      scores: {
        performance: Math.round((categories.performance?.score || 0) * 100),
        accessibility: Math.round((categories.accessibility?.score || 0) * 100),
        bestPractices: Math.round((categories["best-practices"]?.score || 0) * 100),
        seo: Math.round((categories.seo?.score || 0) * 100),
      },
      coreWebVitals: {
        lcp: {
          value: lcp?.numericValue || 0,
          unit: "ms",
          rating: getRating(lcp?.score || 0),
        },
        fid: {
          value: fid?.numericValue || 0,
          unit: "ms",
          rating: getRating(fid?.score || 0),
        },
        cls: {
          value: cls?.numericValue || 0,
          unit: "",
          rating: getRating(cls?.score || 0),
        },
        inp: {
          value: inp?.numericValue || 0,
          unit: "ms",
          rating: getRating(inp?.score || 0),
        },
        fcp: {
          value: fcp?.numericValue || 0,
          unit: "ms",
          rating: getRating(fcp?.score || 0),
        },
        ttfb: {
          value: ttfb?.numericValue || 0,
          unit: "ms",
          rating: getRating(ttfb?.score || 0),
        },
      },
      opportunities,
      diagnostics,
    };

    return Response.json(result);
  } catch (err) {
    return Response.json({ error: "Failed to fetch PageSpeed data" }, { status: 502 });
  }
}
