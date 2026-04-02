/**
 * Google OAuth + GA4 integration utilities.
 *
 * Setup:
 * 1. Create a Google Cloud project at console.cloud.google.com
 * 2. Enable "Google Analytics Data API" (GA4)
 * 3. Enable "Google Search Console API" (optional)
 * 4. Create OAuth 2.0 credentials (Web application)
 * 5. Set redirect URI to: {your-domain}/api/auth/google/callback
 * 6. Add these env vars:
 *    GOOGLE_CLIENT_ID=your-client-id
 *    GOOGLE_CLIENT_SECRET=your-client-secret
 *    NEXT_PUBLIC_APP_URL=https://your-domain.com
 */

const SCOPES = [
  "https://www.googleapis.com/auth/analytics.readonly",
  "https://www.googleapis.com/auth/webmasters.readonly",
].join(" ");

export function getGoogleAuthUrl(state?: string): string {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/google/callback`;

  if (!clientId) throw new Error("GOOGLE_CLIENT_ID not set");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPES,
    access_type: "offline",
    prompt: "consent",
    ...(state ? { state } : {}),
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export async function exchangeCodeForTokens(code: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/google/callback`,
      grant_type: "authorization_code",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Token exchange failed: ${err}`);
  }

  return res.json();
}

export async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string;
  expires_in: number;
}> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) throw new Error("Token refresh failed");
  return res.json();
}

/** Fetch GA4 property list for the authenticated user */
export async function listGA4Properties(accessToken: string): Promise<
  { name: string; displayName: string; propertyId: string }[]
> {
  const res = await fetch(
    "https://analyticsadmin.googleapis.com/v1beta/accountSummaries",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) throw new Error("Failed to list GA4 accounts");
  const data = await res.json();

  const properties: { name: string; displayName: string; propertyId: string }[] = [];
  for (const account of data.accountSummaries || []) {
    for (const prop of account.propertySummaries || []) {
      properties.push({
        name: prop.property,
        displayName: prop.displayName,
        propertyId: prop.property.replace("properties/", ""),
      });
    }
  }
  return properties;
}

/** Fetch GA4 report data */
export async function fetchGA4Report(
  accessToken: string,
  propertyId: string,
  dateRange: { startDate: string; endDate: string } = { startDate: "90daysAgo", endDate: "today" }
): Promise<{
  totalSessions: number;
  totalUsers: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: { path: string; sessions: number; bounceRate: number }[];
  trafficSources: { source: string; sessions: number; percentage: number }[];
}> {
  const body = {
    dateRanges: [dateRange],
    metrics: [
      { name: "sessions" },
      { name: "totalUsers" },
      { name: "bounceRate" },
      { name: "averageSessionDuration" },
    ],
    dimensions: [],
  };

  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) throw new Error("GA4 report failed");
  const data = await res.json();
  const row = data.rows?.[0]?.metricValues || [];

  const totalSessions = parseInt(row[0]?.value || "0");
  const totalUsers = parseInt(row[1]?.value || "0");
  const bounceRate = parseFloat(row[2]?.value || "0");
  const avgSessionDuration = parseFloat(row[3]?.value || "0");

  // Top pages
  const pagesRes = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        dateRanges: [dateRange],
        metrics: [{ name: "sessions" }, { name: "bounceRate" }],
        dimensions: [{ name: "pagePath" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 20,
      }),
    }
  );

  const pagesData = pagesRes.ok ? await pagesRes.json() : { rows: [] };
  const topPages = (pagesData.rows || []).map((r: any) => ({
    path: r.dimensionValues[0].value,
    sessions: parseInt(r.metricValues[0].value),
    bounceRate: parseFloat(r.metricValues[1].value),
  }));

  // Traffic sources
  const sourcesRes = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        dateRanges: [dateRange],
        metrics: [{ name: "sessions" }],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 10,
      }),
    }
  );

  const sourcesData = sourcesRes.ok ? await sourcesRes.json() : { rows: [] };
  const trafficSources = (sourcesData.rows || []).map((r: any) => ({
    source: r.dimensionValues[0].value,
    sessions: parseInt(r.metricValues[0].value),
    percentage: totalSessions > 0 ? (parseInt(r.metricValues[0].value) / totalSessions) * 100 : 0,
  }));

  return { totalSessions, totalUsers, bounceRate, avgSessionDuration, topPages, trafficSources };
}
