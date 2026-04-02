import { google } from "googleapis";
import { NextResponse } from "next/server";

const propertyId = process.env.GA4_PROPERTY_ID;

function getPrivateKey() {
  const raw = process.env.GA4_PRIVATE_KEY || "";
  // Handle both literal \n strings and already-real newlines
  if (raw.includes("\\n")) {
    return raw.replace(/\\n/g, "\n");
  }
  return raw;
}

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GA4_SERVICE_ACCOUNT_EMAIL,
      private_key: getPrivateKey(),
    },
    scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
  });
}

export async function GET(request: Request) {
  if (!propertyId || !process.env.GA4_PRIVATE_KEY) {
    return NextResponse.json(
      { error: "GA4 credentials not configured" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") || "30", 10);

  const auth = getAuth();
  const analytics = google.analyticsdata({ version: "v1beta", auth });
  const property = `properties/${propertyId}`;

  const startDate = `${days}daysAgo`;
  const endDate = "today";

  try {
    const [overview, topPages, trafficSources, devices, countries, dailyTrend] =
      await Promise.all([
        // Overview metrics
        analytics.properties.runReport({
          property,
          requestBody: {
            dateRanges: [{ startDate, endDate }],
            metrics: [
              { name: "sessions" },
              { name: "totalUsers" },
              { name: "screenPageViews" },
              { name: "averageSessionDuration" },
              { name: "bounceRate" },
              { name: "engagedSessions" },
            ],
          },
        }),

        // Top pages
        analytics.properties.runReport({
          property,
          requestBody: {
            dateRanges: [{ startDate, endDate }],
            dimensions: [{ name: "pagePath" }],
            metrics: [
              { name: "screenPageViews" },
              { name: "totalUsers" },
              { name: "averageSessionDuration" },
            ],
            orderBys: [
              { metric: { metricName: "screenPageViews" }, desc: true },
            ],
            limit: "10",
          },
        }),

        // Traffic sources
        analytics.properties.runReport({
          property,
          requestBody: {
            dateRanges: [{ startDate, endDate }],
            dimensions: [{ name: "sessionDefaultChannelGroup" }],
            metrics: [{ name: "sessions" }, { name: "totalUsers" }],
            orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
            limit: "10",
          },
        }),

        // Devices
        analytics.properties.runReport({
          property,
          requestBody: {
            dateRanges: [{ startDate, endDate }],
            dimensions: [{ name: "deviceCategory" }],
            metrics: [{ name: "sessions" }, { name: "totalUsers" }],
            orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
          },
        }),

        // Countries
        analytics.properties.runReport({
          property,
          requestBody: {
            dateRanges: [{ startDate, endDate }],
            dimensions: [{ name: "country" }],
            metrics: [{ name: "sessions" }, { name: "totalUsers" }],
            orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
            limit: "10",
          },
        }),

        // Daily trend
        analytics.properties.runReport({
          property,
          requestBody: {
            dateRanges: [{ startDate, endDate }],
            dimensions: [{ name: "date" }],
            metrics: [
              { name: "sessions" },
              { name: "totalUsers" },
              { name: "screenPageViews" },
            ],
            orderBys: [{ dimension: { dimensionName: "date" }, desc: false }],
          },
        }),
      ]);

    function parseRows(
      report: typeof overview,
      dimKeys: string[],
      metricKeys: string[]
    ) {
      return (report.data?.rows || []).map((row) => {
        const obj: Record<string, string> = {};
        dimKeys.forEach((key, i) => {
          obj[key] = row.dimensionValues?.[i]?.value || "";
        });
        metricKeys.forEach((key, i) => {
          obj[key] = row.metricValues?.[i]?.value || "0";
        });
        return obj;
      });
    }

    const overviewRow = overview.data?.rows?.[0];
    const overviewData = {
      sessions: overviewRow?.metricValues?.[0]?.value || "0",
      users: overviewRow?.metricValues?.[1]?.value || "0",
      pageViews: overviewRow?.metricValues?.[2]?.value || "0",
      avgSessionDuration: overviewRow?.metricValues?.[3]?.value || "0",
      bounceRate: overviewRow?.metricValues?.[4]?.value || "0",
      engagedSessions: overviewRow?.metricValues?.[5]?.value || "0",
    };

    return NextResponse.json({
      overview: overviewData,
      topPages: parseRows(topPages, ["pagePath"], [
        "pageViews",
        "users",
        "avgSessionDuration",
      ]),
      trafficSources: parseRows(trafficSources, ["channel"], [
        "sessions",
        "users",
      ]),
      devices: parseRows(devices, ["device"], ["sessions", "users"]),
      countries: parseRows(countries, ["country"], ["sessions", "users"]),
      dailyTrend: parseRows(dailyTrend, ["date"], [
        "sessions",
        "users",
        "pageViews",
      ]),
    });
  } catch (err) {
    console.error("GA4 API error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
