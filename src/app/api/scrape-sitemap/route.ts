import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return Response.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    if (!res.ok) {
      return Response.json(
        { error: `Failed to fetch: ${res.status}` },
        { status: 502 }
      );
    }

    const html = await res.text();
    const origin = new URL(url).origin;

    const links = extractNavLinks(html, origin);

    return Response.json(links);
  } catch (err) {
    return Response.json(
      { error: "Failed to fetch the URL" },
      { status: 502 }
    );
  }
}

function extractNavLinks(
  html: string,
  origin: string
): { name: string; path: string }[] {
  const links: { name: string; path: string }[] = [];
  const seen = new Set<string>();

  // Match all <a> tags with href - prioritize those inside nav/header
  // We'll do two passes: first nav/header links, then all links as fallback

  // Regex to find <a> tags with href and text content
  const aTagRegex =
    /<a\s[^>]*href=["']([^"'#?]+)["'][^>]*>([\s\S]*?)<\/a>/gi;

  let match;
  while ((match = aTagRegex.exec(html)) !== null) {
    let href = match[1];
    const rawText = match[2];

    // Strip HTML tags from link text
    const text = rawText
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();

    // Skip empty or very long text (probably not a nav link)
    if (!text || text.length > 80 || text.length < 2) continue;

    // Resolve path
    let path = "";
    if (href.startsWith("/")) {
      path = href;
    } else if (href.startsWith(origin)) {
      try {
        path = new URL(href).pathname;
      } catch {
        continue;
      }
    } else if (href.startsWith("http")) {
      continue; // external link
    } else {
      continue;
    }

    // Clean path
    path = path.replace(/\/$/, "") || "/";

    // Skip assets and common non-page paths
    if (
      path.match(
        /\.(jpg|jpeg|png|gif|svg|css|js|pdf|webp|ico|woff|woff2|ttf|eot|mp4|mp3)$/i
      )
    )
      continue;
    if (
      path.match(
        /^\/(wp-content|wp-admin|wp-includes|wp-json|feed|xmlrpc|cart|checkout|my-account)\b/i
      )
    )
      continue;

    if (seen.has(path)) continue;
    seen.add(path);

    links.push({ name: text, path });
  }

  // If we got the homepage only or nothing, return what we have
  // Remove the homepage "/" entry since it's implicit
  return links.filter((l) => l.path !== "/");
}
