/**
 * Custom slide types for the assessment deck.
 * These are editable slides that get stored on the project.
 */

export type DeckSlideType =
  | "competitive-analysis"
  | "site-baselines"
  | "integrations-table"
  | "screenshot-audit"
  | "style-guide-preview"
  | "content-recommendations"
  | "custom-bullets"
  | "custom-two-column";

export interface DeckSlide {
  id: string;
  type: DeckSlideType;
  title: string;
  order: number;
  data: DeckSlideData;
}

export type DeckSlideData =
  | CompetitiveAnalysisData
  | SiteBaselinesData
  | IntegrationsTableData
  | ScreenshotAuditData
  | ContentRecommendationsData
  | CustomBulletsData
  | CustomTwoColumnData;

// --- Competitive Analysis (multi-column comparison) ---
export interface CompetitiveAnalysisData {
  type: "competitive-analysis";
  columns: {
    name: string;
    isClient: boolean;
    items: string[];
  }[];
}

// --- Site Baselines (metrics table with narrative) ---
export interface SiteBaselinesData {
  type: "site-baselines";
  narrative: string;
  footnotes: string;
  metrics: {
    label: string;
    values: { company: string; value: string; highlight?: boolean }[];
  }[];
  companies: { name: string; isClient: boolean }[];
}

// --- Platform Integrations (categorized table) ---
export interface IntegrationsTableData {
  type: "integrations-table";
  rows: {
    category: string;
    function: string;
    currentPlatform: string;
    recommendation: string;
  }[];
}

// --- Screenshot Audit (annotated screenshots) ---
export interface ScreenshotAuditData {
  type: "screenshot-audit";
  screenshots: {
    imageUrl: string;
    caption: string;
    callouts: { text: string; position?: string }[];
  }[];
}

// --- Content Recommendations (two cards) ---
export interface ContentRecommendationsData {
  type: "content-recommendations";
  leftCard: { title: string; sections: { heading: string; items: string[] }[] };
  rightCard: { title: string; items: string[] };
}

// --- Custom Bullets (simple bullet list slide) ---
export interface CustomBulletsData {
  type: "custom-bullets";
  subtitle: string;
  items: string[];
}

// --- Custom Two Column (left text + right text) ---
export interface CustomTwoColumnData {
  type: "custom-two-column";
  leftTitle: string;
  leftItems: string[];
  rightTitle: string;
  rightItems: string[];
}

export function createDeckSlide(type: DeckSlideType, title: string, order: number): DeckSlide {
  const id = crypto.randomUUID();
  switch (type) {
    case "competitive-analysis":
      return { id, type, title, order, data: { type: "competitive-analysis", columns: [{ name: "Client", isClient: true, items: [""] }, { name: "Competitor 1", isClient: false, items: [""] }] } };
    case "site-baselines":
      return { id, type, title, order, data: { type: "site-baselines", narrative: "", footnotes: "", metrics: [], companies: [{ name: "Client", isClient: true }] } };
    case "integrations-table":
      return { id, type, title, order, data: { type: "integrations-table", rows: [{ category: "", function: "", currentPlatform: "", recommendation: "" }] } };
    case "screenshot-audit":
      return { id, type, title, order, data: { type: "screenshot-audit", screenshots: [] } };
    case "content-recommendations":
      return { id, type, title, order, data: { type: "content-recommendations", leftCard: { title: "Existing Content to Migrate", sections: [{ heading: "", items: [""] }] }, rightCard: { title: "Roadmap", items: [""] } } };
    case "custom-bullets":
      return { id, type, title, order, data: { type: "custom-bullets", subtitle: "", items: [""] } };
    case "custom-two-column":
      return { id, type, title, order, data: { type: "custom-two-column", leftTitle: "", leftItems: [""], rightTitle: "", rightItems: [""] } };
    default:
      return { id, type, title, order, data: { type: "custom-bullets", subtitle: "", items: [""] } };
  }
}

export const deckSlideTemplates: { type: DeckSlideType; label: string; description: string }[] = [
  { type: "competitive-analysis", label: "Competitive Analysis", description: "Multi-column comparison table (client vs competitors)" },
  { type: "site-baselines", label: "Site Baselines", description: "Metrics comparison with narrative (traffic, keywords, speed)" },
  { type: "integrations-table", label: "Platform Integrations", description: "Categorized tech stack table with recommendations" },
  { type: "screenshot-audit", label: "Page Audit (Screenshots)", description: "Annotated screenshots with callout notes" },
  { type: "content-recommendations", label: "Content Recommendations", description: "Two-card layout: existing content + roadmap" },
  { type: "custom-bullets", label: "Bullet Points", description: "Simple slide with title and bullet list" },
  { type: "custom-two-column", label: "Two Columns", description: "Split layout with two titled lists" },
];
