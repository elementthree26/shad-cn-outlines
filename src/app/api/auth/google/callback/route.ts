import { NextRequest } from "next/server";
import { exchangeCodeForTokens } from "@/lib/google-auth";

/**
 * Google OAuth callback — exchanges code for tokens.
 * Stores tokens in a cookie and redirects back to the project.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state"); // projectId
  const error = request.nextUrl.searchParams.get("error");

  if (error || !code) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return Response.redirect(`${appUrl}/projects/${state || ""}?error=auth_failed`);
  }

  try {
    const tokens = await exchangeCodeForTokens(code);

    // Store tokens in an HTTP-only cookie (for server-side use)
    // In production, you'd store these in a database
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const redirectUrl = state ? `${appUrl}/projects/${state}?google=connected` : `${appUrl}/projects?google=connected`;

    const response = Response.redirect(redirectUrl);

    // Set tokens as HTTP-only cookies
    const headers = new Headers(response.headers);
    const cookieOpts = "Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000";
    headers.append("Set-Cookie", `google_access_token=${tokens.access_token}; ${cookieOpts}`);
    headers.append("Set-Cookie", `google_refresh_token=${tokens.refresh_token}; ${cookieOpts}`);
    headers.append("Set-Cookie", `google_token_expiry=${Date.now() + tokens.expires_in * 1000}; ${cookieOpts}`);

    return new Response(null, {
      status: 302,
      headers: {
        ...Object.fromEntries(headers.entries()),
        Location: redirectUrl,
      },
    });
  } catch (err) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return Response.redirect(`${appUrl}/projects/${state || ""}?error=token_exchange_failed`);
  }
}
