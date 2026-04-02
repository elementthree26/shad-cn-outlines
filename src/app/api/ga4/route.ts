import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { listGA4Properties, fetchGA4Report, refreshAccessToken } from "@/lib/google-auth";

/** GET /api/ga4?action=properties — list available GA4 properties */
/** GET /api/ga4?action=report&propertyId=123456 — fetch report data */
export async function GET(request: NextRequest) {
  const action = request.nextUrl.searchParams.get("action") || "properties";
  const propertyId = request.nextUrl.searchParams.get("propertyId");

  const cookieStore = await cookies();
  let accessToken = cookieStore.get("google_access_token")?.value;
  const refreshToken = cookieStore.get("google_refresh_token")?.value;
  const tokenExpiry = cookieStore.get("google_token_expiry")?.value;

  if (!accessToken && !refreshToken) {
    return Response.json({ error: "Not authenticated. Connect Google account first.", needsAuth: true }, { status: 401 });
  }

  // Refresh if expired
  if (refreshToken && tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
    try {
      const newTokens = await refreshAccessToken(refreshToken);
      accessToken = newTokens.access_token;
    } catch {
      return Response.json({ error: "Token expired. Reconnect Google account.", needsAuth: true }, { status: 401 });
    }
  }

  if (!accessToken) {
    return Response.json({ error: "No access token", needsAuth: true }, { status: 401 });
  }

  try {
    if (action === "properties") {
      const properties = await listGA4Properties(accessToken);
      return Response.json({ properties });
    }

    if (action === "report" && propertyId) {
      const startDate = request.nextUrl.searchParams.get("startDate") || "90daysAgo";
      const endDate = request.nextUrl.searchParams.get("endDate") || "today";
      const report = await fetchGA4Report(accessToken, propertyId, { startDate, endDate });
      return Response.json(report);
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return Response.json({ error: "GA4 API error" }, { status: 502 });
  }
}
