/**
 * Parse CSV data from GA4, Search Console, SEMrush exports.
 * Auto-detects the format and extracts structured data.
 */

export interface ParsedCSV {
  headers: string[];
  rows: string[][];
  source: "ga4" | "search-console" | "semrush" | "pagespeed" | "unknown";
  title: string;
}

export interface AnalyticsUpload {
  id: string;
  type: "csv" | "screenshot";
  name: string;
  uploadedAt: string;
  /** For CSVs: parsed data */
  csv?: ParsedCSV;
  /** For screenshots: data URL */
  imageUrl?: string;
  /** Caption / annotation for the slide */
  caption: string;
  /** Whether to include in the deck */
  includeInDeck: boolean;
}

export function parseCSV(text: string, filename: string): ParsedCSV {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return { headers: [], rows: [], source: "unknown", title: filename };

  // Handle common CSV quirks: BOM, quoted fields
  const clean = lines[0].startsWith("\ufeff") ? lines[0].slice(1) : lines[0];
  lines[0] = clean;

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') { inQuotes = !inQuotes; }
      else if (char === "," && !inQuotes) { result.push(current.trim()); current = ""; }
      else { current += char; }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).filter((l) => l.trim()).map(parseLine);

  // Auto-detect source
  const headerStr = headers.join(" ").toLowerCase();
  let source: ParsedCSV["source"] = "unknown";
  let title = filename.replace(/\.csv$/i, "");

  if (headerStr.includes("sessions") && headerStr.includes("users")) {
    source = "ga4";
    title = "Google Analytics 4 Data";
  } else if (headerStr.includes("clicks") && headerStr.includes("impressions") && headerStr.includes("ctr")) {
    source = "search-console";
    title = "Search Console Data";
  } else if (headerStr.includes("keyword") && (headerStr.includes("position") || headerStr.includes("volume"))) {
    source = "semrush";
    title = "SEMrush Keyword Data";
  } else if (headerStr.includes("performance") || headerStr.includes("lcp") || headerStr.includes("cls")) {
    source = "pagespeed";
    title = "Performance Data";
  }

  return { headers, rows, source, title };
}

/** Convert parsed CSV to a simple summary for display */
export function summarizeCSV(csv: ParsedCSV): {
  keyMetrics: { label: string; value: string }[];
  topRows: { label: string; value: string }[];
} {
  const keyMetrics: { label: string; value: string }[] = [];
  const topRows: { label: string; value: string }[] = [];

  if (csv.source === "ga4") {
    // Try to extract totals from the data
    const sessionsIdx = csv.headers.findIndex((h) => h.toLowerCase().includes("session"));
    const usersIdx = csv.headers.findIndex((h) => h.toLowerCase().includes("user"));
    const bounceIdx = csv.headers.findIndex((h) => h.toLowerCase().includes("bounce"));
    const pageIdx = csv.headers.findIndex((h) => h.toLowerCase().match(/page|path|url|title/));

    if (sessionsIdx >= 0) {
      const total = csv.rows.reduce((s, r) => s + (parseInt(r[sessionsIdx]) || 0), 0);
      keyMetrics.push({ label: "Total Sessions", value: total.toLocaleString() });
    }
    if (usersIdx >= 0) {
      const total = csv.rows.reduce((s, r) => s + (parseInt(r[usersIdx]) || 0), 0);
      keyMetrics.push({ label: "Total Users", value: total.toLocaleString() });
    }
    if (bounceIdx >= 0 && csv.rows.length > 0) {
      const avg = csv.rows.reduce((s, r) => s + (parseFloat(r[bounceIdx]) || 0), 0) / csv.rows.length;
      keyMetrics.push({ label: "Avg Bounce Rate", value: `${avg.toFixed(1)}%` });
    }

    // Top pages
    if (pageIdx >= 0 && sessionsIdx >= 0) {
      const sorted = [...csv.rows].sort((a, b) => (parseInt(b[sessionsIdx]) || 0) - (parseInt(a[sessionsIdx]) || 0));
      sorted.slice(0, 10).forEach((r) => {
        topRows.push({ label: r[pageIdx], value: r[sessionsIdx] });
      });
    }
  } else if (csv.source === "search-console") {
    const queryIdx = csv.headers.findIndex((h) => h.toLowerCase().includes("query") || h.toLowerCase().includes("keyword"));
    const clicksIdx = csv.headers.findIndex((h) => h.toLowerCase().includes("click"));
    const impressIdx = csv.headers.findIndex((h) => h.toLowerCase().includes("impress"));
    const posIdx = csv.headers.findIndex((h) => h.toLowerCase().includes("position"));

    if (clicksIdx >= 0) {
      const total = csv.rows.reduce((s, r) => s + (parseInt(r[clicksIdx]) || 0), 0);
      keyMetrics.push({ label: "Total Clicks", value: total.toLocaleString() });
    }
    if (impressIdx >= 0) {
      const total = csv.rows.reduce((s, r) => s + (parseInt(r[impressIdx]) || 0), 0);
      keyMetrics.push({ label: "Total Impressions", value: total.toLocaleString() });
    }

    if (queryIdx >= 0 && clicksIdx >= 0) {
      const sorted = [...csv.rows].sort((a, b) => (parseInt(b[clicksIdx]) || 0) - (parseInt(a[clicksIdx]) || 0));
      sorted.slice(0, 10).forEach((r) => {
        topRows.push({ label: r[queryIdx], value: `${r[clicksIdx]} clicks` });
      });
    }
  } else if (csv.source === "semrush") {
    const kwIdx = csv.headers.findIndex((h) => h.toLowerCase().includes("keyword"));
    const posIdx = csv.headers.findIndex((h) => h.toLowerCase().includes("position"));
    const volIdx = csv.headers.findIndex((h) => h.toLowerCase().includes("volume"));

    keyMetrics.push({ label: "Keywords Tracked", value: String(csv.rows.length) });

    if (kwIdx >= 0) {
      csv.rows.slice(0, 10).forEach((r) => {
        const parts = [];
        if (posIdx >= 0) parts.push(`#${r[posIdx]}`);
        if (volIdx >= 0) parts.push(`vol: ${r[volIdx]}`);
        topRows.push({ label: r[kwIdx], value: parts.join(" · ") });
      });
    }
  } else {
    // Generic: show first few rows
    csv.rows.slice(0, 8).forEach((r) => {
      topRows.push({ label: r[0] || "", value: r.slice(1).join(" | ") });
    });
  }

  return { keyMetrics, topRows };
}
