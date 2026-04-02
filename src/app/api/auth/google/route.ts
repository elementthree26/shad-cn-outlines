import { NextRequest } from "next/server";
import { getGoogleAuthUrl } from "@/lib/google-auth";

/** Initiates Google OAuth flow — redirects to Google consent screen */
export async function GET(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get("projectId") || "";

  try {
    const url = getGoogleAuthUrl(projectId);
    return Response.redirect(url);
  } catch (err) {
    return Response.json(
      { error: "Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET env vars." },
      { status: 500 }
    );
  }
}
