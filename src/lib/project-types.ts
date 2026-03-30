import { WireframeBlockId } from "@/data/wireframe-types";
import { StyleGuide, defaultStyleGuide } from "@/components/cms/style-guide";

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
// SITEMAP
// ============================================================

export interface SitemapPage {
  id: string;
  slug: string;
  name: string;
  purpose: string;
  parentId: string | null;
  order: number;
  /** Page-specific notes from discovery */
  notes: string;
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
    existingContent: "",
    contentToCreate: "",
    contentOwnership: "",
    cmsPlatform: "TBD",
    integrations: [],
    hostingNotes: "",
    sitemap: [],
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
    notes: "",
    sections: [],
    ...partial,
  };
}
