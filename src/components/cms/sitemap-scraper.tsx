"use client";

import { useState } from "react";
import { Globe, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SitemapPage, createSitemapPage } from "@/lib/project-types";

/**
 * Scrapes a website URL to extract its sitemap / navigation links.
 * Uses a simple fetch + parse approach - gets the HTML and extracts
 * internal links from nav elements and common patterns.
 */
async function scrapeNavLinks(url: string): Promise<{ name: string; path: string }[]> {
  try {
    const cleanUrl = url.replace(/\/$/, "");
    const origin = new URL(cleanUrl).origin;

    const res = await fetch(`/api/scrape-sitemap?url=${encodeURIComponent(cleanUrl)}`);
    if (res.ok) {
      return await res.json();
    }

    // Fallback: try fetching directly (will work if CORS allows)
    const html = await fetch(cleanUrl).then((r) => r.text());
    return parseLinksFromHtml(html, origin);
  } catch {
    return [];
  }
}

function parseLinksFromHtml(html: string, origin: string): { name: string; path: string }[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const links: { name: string; path: string }[] = [];
  const seen = new Set<string>();

  // Look for nav links first
  const navLinks = doc.querySelectorAll("nav a, header a, .menu a, .nav a, [role='navigation'] a");
  const allLinks = navLinks.length > 0 ? navLinks : doc.querySelectorAll("a");

  allLinks.forEach((a) => {
    const href = a.getAttribute("href");
    if (!href) return;

    let path = "";
    try {
      if (href.startsWith("/")) {
        path = href;
      } else if (href.startsWith(origin)) {
        path = new URL(href).pathname;
      } else {
        return; // external link
      }
    } catch {
      return;
    }

    // Clean path
    path = path.replace(/\/$/, "") || "/";

    // Skip anchors, assets, etc.
    if (path.includes("#") || path.includes("?") || path.match(/\.(jpg|png|gif|css|js|pdf|svg)/i)) return;
    if (seen.has(path)) return;
    seen.add(path);

    const text = (a.textContent || "").trim().replace(/\s+/g, " ");
    if (!text || text.length > 60) return;

    links.push({ name: text, path });
  });

  return links;
}

function linksToSitemapPages(links: { name: string; path: string }[]): SitemapPage[] {
  return links
    .filter((l) => l.path !== "/")
    .map((l, i) => {
      const slug = l.path.replace(/^\//, "").replace(/\//g, "-") || l.name.toLowerCase().replace(/\s+/g, "-");
      // Detect parent based on path depth
      const pathParts = l.path.split("/").filter(Boolean);
      return createSitemapPage({
        name: l.name,
        slug,
        order: i,
        purpose: "",
        sprint: 1,
      });
    });
}

export function SitemapScraper({
  onImport,
}: {
  onImport: (pages: SitemapPage[]) => void;
}) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewLinks, setPreviewLinks] = useState<{ name: string; path: string }[] | null>(null);

  const handleScrape = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setPreviewLinks(null);

    try {
      const links = await scrapeNavLinks(url);
      if (links.length === 0) {
        setError("No navigation links found. You can add pages manually below.");
      } else {
        setPreviewLinks(links);
      }
    } catch {
      setError("Could not fetch the site. You can add pages manually.");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    if (!previewLinks) return;
    const pages = linksToSitemapPages(previewLinks);
    onImport(pages);
    setPreviewLinks(null);
    setUrl("");
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex items-center gap-1.5 flex-1 rounded-md border border-border bg-background px-2.5 py-1.5">
          <Globe className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <input
            type="url"
            placeholder="https://currentsite.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleScrape()}
            className="flex-1 text-sm bg-transparent outline-none"
          />
        </div>
        <Button size="sm" onClick={handleScrape} disabled={!url || loading}>
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Scan"}
        </Button>
      </div>

      {error && <p className="text-xs text-muted-foreground">{error}</p>}

      {previewLinks && (
        <div className="rounded-lg border bg-card p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium">
              Found {previewLinks.length} pages
            </p>
            <Button size="xs" onClick={handleImport}>
              Import All
            </Button>
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {previewLinks.map((link, i) => (
              <div key={i} className="flex items-center gap-2 text-xs py-1">
                <span className="text-muted-foreground font-mono w-32 truncate">{link.path}</span>
                <span className="truncate">{link.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
