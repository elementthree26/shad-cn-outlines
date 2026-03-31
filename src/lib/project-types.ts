import { WireframeBlockId } from "@/data/wireframe-types";
import { StyleGuide, defaultStyleGuide } from "@/components/cms/style-guide";
import { SiteAudit, createEmptyAudit } from "@/lib/audit-types";

// ============================================================
// PROJECT
// ============================================================

export interface Project {
  id: string;
  createdAt: string;
  updatedAt: string;

  // --- 1. Project Setup ---
  clientName: string;
  industry: string;
  targetAudiences: string[];
  clientGoals: string[];

  // --- 2. Brand & Style ---
  styleGuide: StyleGuide;
  logoUrl: string;

  // --- 3. Discovery ---
  discoveryNotes: string;
  valuePropositions: string[];
  differentiators: string[];
  competitorUrls: string[];
  currentSiteUrl: string;

  // --- 4. Content Inventory ---
  existingContent: string;
  contentToCreate: string;
  contentOwnership: string;

  // --- 5. Technical Requirements ---
  cmsPlatform: string;
  integrations: Integration[];
  hostingNotes: string;

  // --- 6. Sitemap & Pages ---
  sitemap: SitemapPage[];

  // --- 7. Phases & Process ---
  phases: ProjectPhase[];

  // --- 8. Redirect Map (old → new) ---
  redirects: RedirectEntry[];

  // --- 9. Site Audit Data ---
  audit: SiteAudit;
}

export interface Integration {
  id: string;
  name: string;
  category: IntegrationCategory;
  notes: string;
}

export type IntegrationCategory =
  | "crm"
  | "forms"
  | "analytics"
  | "maps"
  | "chat"
  | "scheduling"
  | "social"
  | "job-board"
  | "reviews"
  | "ecommerce"
  | "email"
  | "other";

export const integrationCategories: { value: IntegrationCategory; label: string }[] = [
  { value: "crm", label: "CRM" },
  { value: "forms", label: "Forms" },
  { value: "analytics", label: "Analytics" },
  { value: "maps", label: "Maps" },
  { value: "chat", label: "Live Chat" },
  { value: "scheduling", label: "Scheduling" },
  { value: "social", label: "Social Media" },
  { value: "job-board", label: "Job Board" },
  { value: "reviews", label: "Reviews" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "email", label: "Email Marketing" },
  { value: "other", label: "Other" },
];

// ============================================================
// PHASES (E3 7-Phase Process)
// ============================================================

export type PhaseStatus = "not-started" | "in-progress" | "review" | "approved";

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  notes: string;
}

export interface ProjectPhase {
  id: PhaseId;
  status: PhaseStatus;
  notes: string;
  gateApproved: boolean;
  gateApprovedDate: string | null;
  checklist: ChecklistItem[];
}

export type PhaseId =
  | "assessment"
  | "information-architecture"
  | "messaging-ui"
  | "development"
  | "qa-seo"
  | "launch"
  | "maintain";

export const phaseDefinitions: {
  id: PhaseId;
  name: string;
  shortName: string;
  humanRole: string;
  gate: string;
  defaultChecklist: string[];
  timing: string;
}[] = [
  {
    id: "assessment",
    name: "Assessment & Strategic Alignment",
    shortName: "Assessment",
    humanRole: "Humans Lead",
    gate: "Signed project brief",
    timing: "2–4 weeks",
    defaultChecklist: [
      "Stakeholder workshop completed",
      "Site inventory / crawl completed",
      "Content audit scored by traffic & quality",
      "Conversion audit — friction points identified",
      "SEO baseline — Core Web Vitals captured",
      "Competitive analysis completed",
      "Project brief drafted",
      "Project brief signed by client",
    ],
  },
  {
    id: "information-architecture",
    name: "Information Architecture",
    shortName: "IA",
    humanRole: "Humans Approve",
    gate: "Approved sitemap and functional spec",
    timing: "1–2 weeks",
    defaultChecklist: [
      "Current sitemap analyzed",
      "New sitemap proposed",
      "Topic clusters defined",
      "URL hierarchy finalized",
      "Redirect map completed (old → new)",
      "Content — keep / kill / create decisions made",
      "Sitemap approved by client",
    ],
  },
  {
    id: "messaging-ui",
    name: "Messaging & UI Design",
    shortName: "Messaging & UI",
    humanRole: "Humans Lead",
    gate: "Approved design system and copy in Storybook",
    timing: "2–4 weeks",
    defaultChecklist: [
      "Creative direction established",
      "Brand voice & messaging hierarchy defined",
      "Design system extracted / created",
      "Wireframes completed for all pages",
      "Copy drafted for all sections",
      "Component variations documented in Storybook",
      "Client stakeholder approval",
    ],
  },
  {
    id: "development",
    name: "Platform Development",
    shortName: "Development",
    humanRole: "Humans Supervise",
    gate: "Full Storybook walkthrough approved",
    timing: "1–2 weeks",
    defaultChecklist: [
      "React components built pixel-perfect",
      "CMS wired and content populated",
      "Routing and navigation working",
      "Metadata / OG tags configured",
      "Schema markup implemented",
      "Analytics integration (GA4/GTM)",
      "Forms connected to CRM",
      "Storybook walkthrough with client",
    ],
  },
  {
    id: "qa-seo",
    name: "QA & SEO",
    shortName: "QA & SEO",
    humanRole: "Humans Verify",
    gate: "Written approval from authority",
    timing: "1–2 weeks",
    defaultChecklist: [
      "Visual QA — all pages reviewed",
      "Mobile responsive QA",
      "Cross-browser testing",
      "SEO compliance verified",
      "Redirects verified (all old URLs → new)",
      "LCP < 2.5s",
      "INP < 200ms",
      "CLS < 0.1",
      "Lighthouse accessibility score 95+",
      "Forms tested end-to-end",
      "Written client sign-off",
    ],
  },
  {
    id: "launch",
    name: "Launch",
    shortName: "Launch",
    humanRole: "Humans Approve",
    gate: "Site live",
    timing: "1 day",
    defaultChecklist: [
      "DNS cutover completed",
      "SSL certificate verified",
      "Smoke testing on production",
      "Redirects verified on production",
      "Analytics tracking confirmed",
      "Search Console submitted",
      "30-day code warranty communicated",
    ],
  },
  {
    id: "maintain",
    name: "Maintain & Optimize",
    shortName: "Optimize",
    humanRole: "Continuous",
    gate: "Ongoing",
    timing: "Ongoing",
    defaultChecklist: [
      "CRO audit scheduled",
      "Content update process documented",
      "SEO monitoring active",
      "Performance monitoring active",
    ],
  },
];

export function createDefaultPhases(): ProjectPhase[] {
  return phaseDefinitions.map((def) => ({
    id: def.id,
    status: "not-started",
    notes: "",
    gateApproved: false,
    gateApprovedDate: null,
    checklist: def.defaultChecklist.map((label) => ({
      id: crypto.randomUUID(),
      label,
      checked: false,
      notes: "",
    })),
  }));
}

// ============================================================
// REDIRECT MAP
// ============================================================

export interface RedirectEntry {
  id: string;
  oldUrl: string;
  newUrl: string;
  status: "pending" | "mapped" | "verified";
  notes: string;
}

// ============================================================
// SITEMAP
// ============================================================

export interface SitemapPage {
  id: string;
  slug: string;
  name: string;
  purpose: string;
  parentId: string | null;
  order: number;
  /** Sprint / phase assignment */
  sprint: number;
  /** Page-specific notes from discovery */
  notes: string;

  // --- Page Strategy Brief (like the Miro card at the top) ---
  /** Who is this page for? */
  audiences: string[];
  /** What should visitors do / what's the page goal? */
  pageGoal: string;
  /** Reference URLs (current site, competitors, inspiration) */
  referenceUrls: string[];
  /** What content/assets exist or are needed */
  contentNotes: string;

  // --- SEO Metadata ---
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;

  /** The built page layout */
  sections: PageSection[];
}

export interface PageSection {
  instanceId: string;
  themeId: string;
  themeName: string;
  selectedBlockId: WireframeBlockId;
  availableBlocks: { name: string; wireframeId: WireframeBlockId }[];
  content: SectionContent;
  /** Content direction notes shown alongside the wireframe (like Miro annotations) */
  directionNotes: string;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  extra: string;
}

export interface SectionContent {
  heading: string;
  subheading: string;
  body: string;
  ctaText: string;
  backgroundImageUrl: string;
  items: ContentItem[];
}

// ============================================================
// INDUSTRY PRESETS
// ============================================================

export const industryOptions = [
  "B2B Services",
  "B2B Manufacturing",
  "B2B Technology / SaaS",
  "B2B2X (Multi-audience)",
  "Healthcare",
  "Financial Services",
  "Legal",
  "Real Estate",
  "Construction / Trades",
  "Education",
  "Nonprofit",
  "Restaurant / Hospitality",
  "Retail / E-commerce",
  "Other",
];

export const cmsPlatformOptions = [
  "WordPress",
  "Webflow",
  "Next.js (Headless)",
  "HubSpot CMS",
  "Drupal",
  "Squarespace",
  "Shopify",
  "Custom",
  "TBD",
];

export const commonIntegrations: { name: string; category: IntegrationCategory }[] = [
  { name: "HubSpot", category: "crm" },
  { name: "Salesforce", category: "crm" },
  { name: "Google Analytics 4", category: "analytics" },
  { name: "Google Tag Manager", category: "analytics" },
  { name: "Hotjar / Clarity", category: "analytics" },
  { name: "Google Maps", category: "maps" },
  { name: "Gravity Forms", category: "forms" },
  { name: "HubSpot Forms", category: "forms" },
  { name: "Typeform", category: "forms" },
  { name: "Calendly", category: "scheduling" },
  { name: "Intercom", category: "chat" },
  { name: "Drift", category: "chat" },
  { name: "Mailchimp", category: "email" },
  { name: "Constant Contact", category: "email" },
  { name: "Instagram Feed", category: "social" },
  { name: "Greenhouse", category: "job-board" },
  { name: "Google Reviews", category: "reviews" },
  { name: "Clutch", category: "reviews" },
];

// ============================================================
// FACTORY
// ============================================================

export function createProject(partial?: Partial<Project>): Project {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    clientName: "",
    industry: "",
    targetAudiences: [],
    clientGoals: [],
    styleGuide: { ...defaultStyleGuide },
    logoUrl: "",
    discoveryNotes: "",
    valuePropositions: [],
    differentiators: [],
    competitorUrls: [],
    currentSiteUrl: "",
    existingContent: "",
    contentToCreate: "",
    contentOwnership: "",
    cmsPlatform: "TBD",
    integrations: [],
    hostingNotes: "",
    sitemap: [],
    phases: createDefaultPhases(),
    redirects: [],
    audit: createEmptyAudit(),
    ...partial,
  };
}

export function createSitemapPage(partial?: Partial<SitemapPage>): SitemapPage {
  return {
    id: crypto.randomUUID(),
    slug: "",
    name: "",
    purpose: "",
    parentId: null,
    order: 0,
    sprint: 1,
    notes: "",
    audiences: [],
    pageGoal: "",
    referenceUrls: [],
    contentNotes: "",
    seoTitle: "",
    seoDescription: "",
    ogImageUrl: "",
    sections: [],
    ...partial,
  };
}

// ============================================================
// SPRINT HELPERS
// ============================================================

export const defaultSprints = [
  { number: 1, name: "Sprint 1: Core Pages" },
  { number: 2, name: "Sprint 2: Secondary Pages" },
  { number: 3, name: "Sprint 3: Specialty Pages" },
];

export function getSprintsFromSitemap(pages: SitemapPage[]): number[] {
  const sprints = [...new Set(pages.map((p) => p.sprint || 1))];
  return sprints.sort((a, b) => a - b);
}

export function getPagesBySprint(pages: SitemapPage[]): Map<number, SitemapPage[]> {
  const map = new Map<number, SitemapPage[]>();
  for (const page of pages) {
    const s = page.sprint || 1;
    if (!map.has(s)) map.set(s, []);
    map.get(s)!.push(page);
  }
  return map;
}
