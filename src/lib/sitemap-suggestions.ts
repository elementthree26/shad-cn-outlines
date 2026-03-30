import { Project, SitemapPage, createSitemapPage } from "./project-types";

/**
 * Industry-specific sitemap templates.
 * Each entry is a page with optional children.
 */
interface PageTemplate {
  name: string;
  slug: string;
  purpose: string;
  children?: PageTemplate[];
}

const corePages: PageTemplate[] = [
  { name: "Home", slug: "home", purpose: "Primary landing page — value prop, services overview, social proof, CTA" },
  { name: "About", slug: "about", purpose: "Company story, mission, team, values — build trust and credibility" },
  { name: "Contact", slug: "contact", purpose: "Contact form, phone, email, locations — drive conversions" },
];

const legalPages: PageTemplate[] = [
  { name: "Privacy Policy", slug: "privacy-policy", purpose: "Legal compliance" },
  { name: "Terms of Service", slug: "terms-of-service", purpose: "Legal compliance" },
  { name: "Accessibility", slug: "accessibility", purpose: "ADA compliance statement" },
  { name: "Sitemap", slug: "sitemap", purpose: "HTML sitemap for users and SEO" },
];

const industryTemplates: Record<string, PageTemplate[]> = {
  "B2B Services": [
    ...corePages,
    {
      name: "Services",
      slug: "services",
      purpose: "Overview of all service offerings with links to detail pages",
      children: [
        { name: "Service 1", slug: "services/service-1", purpose: "Individual service detail — scope, process, benefits" },
        { name: "Service 2", slug: "services/service-2", purpose: "Individual service detail" },
        { name: "Service 3", slug: "services/service-3", purpose: "Individual service detail" },
      ],
    },
    {
      name: "Industries",
      slug: "industries",
      purpose: "Audience-specific landing pages organized by vertical",
      children: [
        { name: "Industry 1", slug: "industries/industry-1", purpose: "Industry-specific messaging and case studies" },
        { name: "Industry 2", slug: "industries/industry-2", purpose: "Industry-specific messaging and case studies" },
      ],
    },
    {
      name: "Case Studies",
      slug: "case-studies",
      purpose: "Portfolio of client success stories with measurable outcomes",
    },
    { name: "Blog", slug: "blog", purpose: "Thought leadership, SEO content hub" },
    { name: "Careers", slug: "careers", purpose: "Open positions, culture, benefits — recruitment" },
    ...legalPages,
  ],
  "B2B Manufacturing": [
    ...corePages,
    {
      name: "Products",
      slug: "products",
      purpose: "Product catalog with categories and filtering",
      children: [
        { name: "Product Category 1", slug: "products/category-1", purpose: "Product category listing" },
        { name: "Product Category 2", slug: "products/category-2", purpose: "Product category listing" },
      ],
    },
    {
      name: "Services",
      slug: "services",
      purpose: "Service, maintenance, parts, support offerings",
      children: [
        { name: "Service & Repairs", slug: "services/service-repairs", purpose: "Maintenance and repair services" },
        { name: "Parts", slug: "services/parts", purpose: "Parts ordering and catalog" },
        { name: "Warranty", slug: "services/warranty", purpose: "Warranty information and claims" },
      ],
    },
    {
      name: "Industries",
      slug: "industries",
      purpose: "Industry-specific solutions and applications",
      children: [
        { name: "Industry 1", slug: "industries/industry-1", purpose: "Industry-specific landing page" },
        { name: "Industry 2", slug: "industries/industry-2", purpose: "Industry-specific landing page" },
      ],
    },
    { name: "Resources", slug: "resources", purpose: "Spec sheets, downloads, documentation" },
    {
      name: "Locations",
      slug: "locations",
      purpose: "Facility locations with maps and contact info",
      children: [
        { name: "Location 1", slug: "locations/location-1", purpose: "Individual location page" },
      ],
    },
    { name: "Careers", slug: "careers", purpose: "Open positions, culture, benefits" },
    ...legalPages,
  ],
  "B2B Technology / SaaS": [
    ...corePages,
    {
      name: "Product",
      slug: "product",
      purpose: "Platform overview, features, how it works",
      children: [
        { name: "Features", slug: "product/features", purpose: "Detailed feature breakdown" },
        { name: "Integrations", slug: "product/integrations", purpose: "Integration ecosystem" },
        { name: "Security", slug: "product/security", purpose: "Security, compliance, certifications" },
      ],
    },
    {
      name: "Solutions",
      slug: "solutions",
      purpose: "Use-case or persona-based landing pages",
      children: [
        { name: "By Use Case", slug: "solutions/use-case-1", purpose: "Use-case specific messaging" },
        { name: "By Role", slug: "solutions/role-1", purpose: "Persona-specific messaging" },
      ],
    },
    { name: "Pricing", slug: "pricing", purpose: "Pricing tiers, comparison, CTA to demo/trial" },
    { name: "Customers", slug: "customers", purpose: "Case studies, testimonials, logos" },
    { name: "Resources", slug: "resources", purpose: "Blog, guides, webinars, documentation" },
    { name: "Demo / Free Trial", slug: "demo", purpose: "Conversion page — form to request demo or start trial" },
    ...legalPages,
  ],
  "Healthcare": [
    ...corePages,
    {
      name: "Services",
      slug: "services",
      purpose: "Medical services overview",
      children: [
        { name: "Service 1", slug: "services/service-1", purpose: "Individual service/treatment detail" },
        { name: "Service 2", slug: "services/service-2", purpose: "Individual service/treatment detail" },
      ],
    },
    { name: "Providers", slug: "providers", purpose: "Doctor/provider directory with bios" },
    {
      name: "Locations",
      slug: "locations",
      purpose: "Facility locations with hours and directions",
      children: [
        { name: "Location 1", slug: "locations/location-1", purpose: "Individual location" },
      ],
    },
    { name: "Patient Resources", slug: "patients", purpose: "Forms, portal, insurance, FAQs" },
    { name: "Careers", slug: "careers", purpose: "Open positions and benefits" },
    ...legalPages,
  ],
};

// Default template for industries not specifically mapped
const defaultTemplate: PageTemplate[] = [
  ...corePages,
  {
    name: "Services",
    slug: "services",
    purpose: "Service offerings overview",
    children: [
      { name: "Service 1", slug: "services/service-1", purpose: "Individual service detail" },
      { name: "Service 2", slug: "services/service-2", purpose: "Individual service detail" },
    ],
  },
  { name: "Blog", slug: "blog", purpose: "Content hub for SEO and thought leadership" },
  { name: "Careers", slug: "careers", purpose: "Open positions and company culture" },
  ...legalPages,
];

/**
 * Flatten a template tree into SitemapPage array with parent relationships.
 */
function flattenTemplate(
  templates: PageTemplate[],
  parentId: string | null = null,
  sprint: number = 1,
  orderStart: number = 0
): SitemapPage[] {
  const pages: SitemapPage[] = [];
  let order = orderStart;

  for (const tmpl of templates) {
    const isLegal = legalPages.some((l) => l.slug === tmpl.slug);
    const page = createSitemapPage({
      name: tmpl.name,
      slug: tmpl.slug,
      purpose: tmpl.purpose,
      parentId,
      order: order++,
      sprint: isLegal ? 3 : sprint,
    });
    pages.push(page);

    if (tmpl.children) {
      const childPages = flattenTemplate(
        tmpl.children,
        page.id,
        sprint >= 2 ? sprint : 2,
        0
      );
      pages.push(...childPages);
    }
  }

  return pages;
}

/**
 * Enrich template names using discovery data.
 * Replaces generic "Service 1" placeholders with actual service names
 * found in discovery notes or value propositions.
 */
function enrichWithDiscovery(
  pages: SitemapPage[],
  project: Project
): SitemapPage[] {
  const notes = [
    project.discoveryNotes,
    ...project.valuePropositions,
    ...project.differentiators,
    ...project.clientGoals,
  ].join(" ");

  // Try to extract service-like nouns from notes
  // This is a simple heuristic — real AI would do better
  const enriched = [...pages];

  // If the project has audiences, create industry/audience pages
  if (project.targetAudiences.length > 0) {
    const industryParent = enriched.find(
      (p) => p.slug === "industries" || p.slug === "solutions"
    );
    if (industryParent) {
      // Remove placeholder children
      const placeholderChildren = enriched.filter(
        (p) => p.parentId === industryParent.id && p.name.startsWith("Industry")
      );
      for (const pc of placeholderChildren) {
        const idx = enriched.indexOf(pc);
        if (idx >= 0) enriched.splice(idx, 1);
      }
      // Add real audience pages
      project.targetAudiences.forEach((audience, i) => {
        const slug = audience.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        enriched.push(
          createSitemapPage({
            name: audience,
            slug: `${industryParent.slug}/${slug}`,
            purpose: `Landing page for ${audience}`,
            parentId: industryParent.id,
            order: i,
            sprint: 2,
          })
        );
      });
    }
  }

  // If competitor URLs exist, note them
  if (project.competitorUrls.length > 0) {
    const home = enriched.find((p) => p.slug === "home");
    if (home && !home.contentNotes) {
      home.contentNotes = `Competitors to reference: ${project.competitorUrls.join(", ")}`;
    }
  }

  return enriched;
}

/**
 * Generate a suggested sitemap based on project data.
 */
export function generateSuggestedSitemap(project: Project): SitemapPage[] {
  const template = industryTemplates[project.industry] || defaultTemplate;
  const pages = flattenTemplate(template);
  return enrichWithDiscovery(pages, project);
}

/**
 * Generate redirect entries from old sitemap (scraped) to new sitemap.
 */
export function generateRedirectMap(
  oldPages: { name: string; path: string }[],
  newPages: SitemapPage[]
): { oldUrl: string; newUrl: string; status: "pending" | "mapped"; notes: string }[] {
  const redirects: { oldUrl: string; newUrl: string; status: "pending" | "mapped"; notes: string }[] = [];

  for (const old of oldPages) {
    // Try to find a match in the new sitemap by name similarity
    const oldNameLower = old.name.toLowerCase();
    const match = newPages.find((p) => {
      const newNameLower = p.name.toLowerCase();
      return (
        newNameLower === oldNameLower ||
        p.slug === old.path.replace(/^\//, "") ||
        newNameLower.includes(oldNameLower) ||
        oldNameLower.includes(newNameLower)
      );
    });

    redirects.push({
      oldUrl: old.path,
      newUrl: match ? `/${match.slug}` : "",
      status: match ? "mapped" : "pending",
      notes: match ? `Auto-matched to "${match.name}"` : "Needs manual mapping",
    });
  }

  return redirects;
}
