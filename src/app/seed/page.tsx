"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createProject, createSitemapPage, createDefaultPhases } from "@/lib/project-types";
import { defaultStyleGuide } from "@/components/cms/style-guide";
import { saveProject } from "@/lib/project-store";
import { createDeckSlide } from "@/lib/deck-types";

/**
 * Generates a fully populated sample project for demo purposes.
 */
function generateSampleProject() {
  // --- Sitemap pages ---
  const home = createSitemapPage({ name: "Home", slug: "home", purpose: "Primary landing page — hero, value prop, inventory preview, services, testimonials, CTA", sprint: 1, pageGoal: "Introduce The Bus Center, guide visitors to inventory or services", audiences: ["Fleet buyers", "First-time buyers", "Service customers"], seoTitle: "The Bus Center | Commercial Buses for Every Need", seoDescription: "Trusted commercial bus dealer with 50+ years of experience. Browse new and used buses, get service, parts, and financing." });
  const inventory = createSitemapPage({ name: "Inventory", slug: "inventory", purpose: "Unified searchable inventory with filters", sprint: 1, parentId: null, pageGoal: "Help buyers find the right bus quickly with filters and specs" });
  const services = createSitemapPage({ name: "Service & Parts", slug: "service-parts", purpose: "Service scheduling, parts ordering, warranty info", sprint: 1 });
  const financing = createSitemapPage({ name: "Financing & Leasing", slug: "financing", purpose: "Financing options, leasing programs, trade-in info", sprint: 1 });
  const about = createSitemapPage({ name: "About The Bus Center", slug: "about", purpose: "Company story, 50+ year history, team, values", sprint: 1 });
  const contact = createSitemapPage({ name: "Contact", slug: "contact", purpose: "Multi-location contact forms, maps, phone numbers", sprint: 1 });
  const careers = createSitemapPage({ name: "Careers", slug: "careers", purpose: "Open positions, culture, benefits", sprint: 2 });
  const industries = createSitemapPage({ name: "Industries Served", slug: "industries", purpose: "Industry-specific landing pages", sprint: 2 });
  const locations = createSitemapPage({ name: "Locations", slug: "locations", purpose: "Individual location pages with maps", sprint: 2 });
  const blog = createSitemapPage({ name: "News & Resources", slug: "news", purpose: "Blog content, buyer guides, industry news", sprint: 2 });
  const privacy = createSitemapPage({ name: "Privacy Policy", slug: "privacy-policy", purpose: "Legal compliance", sprint: 3 });
  const terms = createSitemapPage({ name: "Terms of Service", slug: "terms", purpose: "Legal compliance", sprint: 3 });
  const accessibility = createSitemapPage({ name: "Accessibility", slug: "accessibility", purpose: "ADA compliance", sprint: 3 });

  // Child pages
  const schoolBuses = createSitemapPage({ name: "School Buses", slug: "inventory/school-buses", purpose: "Filtered inventory for school districts", sprint: 2, parentId: inventory.id });
  const shuttles = createSitemapPage({ name: "Shuttle Buses", slug: "inventory/shuttles", purpose: "Filtered inventory for shuttle services", sprint: 2, parentId: inventory.id });
  const vans = createSitemapPage({ name: "Vans", slug: "inventory/vans", purpose: "Filtered inventory for van buyers", sprint: 2, parentId: inventory.id });
  const churches = createSitemapPage({ name: "Churches", slug: "industries/churches", purpose: "Industry page for church transportation", sprint: 2, parentId: industries.id });
  const seniorLiving = createSitemapPage({ name: "Senior Living", slug: "industries/senior-living", purpose: "Industry page for assisted living facilities", sprint: 2, parentId: industries.id });
  const alabama = createSitemapPage({ name: "Alabama", slug: "locations/alabama", purpose: "Location page for Alabama dealership", sprint: 2, parentId: locations.id });
  const georgia = createSitemapPage({ name: "Georgia", slug: "locations/georgia", purpose: "Location page for Georgia dealership", sprint: 2, parentId: locations.id });

  // --- Fake GA4 CSV ---
  const ga4Csv = `Page path,Sessions,Users,Bounce Rate,Avg. Session Duration
/,8420,6231,42.3,145
/inventory,5892,4103,38.7,210
/inventory/school-buses,2341,1876,35.2,195
/service-parts,1823,1456,44.1,120
/financing,1567,1234,41.8,165
/about,1102,892,52.3,95
/contact,987,876,28.4,85
/inventory/shuttles,876,654,36.9,180
/careers,543,432,48.2,110
/industries,432,321,45.6,130
/locations/alabama,321,267,39.1,95
/locations/georgia,298,245,41.2,88
/news,276,198,55.3,140
/inventory/vans,234,189,37.8,175`;

  const searchConsoleCsv = `Query,Clicks,Impressions,CTR,Position
commercial buses for sale,342,8920,3.8,8.2
school bus dealer,287,6543,4.4,6.1
used buses near me,234,12340,1.9,12.4
shuttle bus for sale,198,5432,3.6,9.3
bus dealer michigan,176,3210,5.5,4.8
church bus for sale,154,4567,3.4,7.9
bus financing options,143,3890,3.7,11.2
wheelchair accessible bus,132,2345,5.6,5.4
commercial bus service,121,2890,4.2,8.7
bus parts dealer,98,1987,4.9,6.3`;

  const semrushCsv = `Keyword,Position,Search Volume,Traffic,URL
commercial buses for sale,8,2400,342,/inventory
school bus dealer near me,6,1900,287,/inventory/school-buses
used shuttle bus,12,3100,234,/inventory/shuttles
bus financing,11,1800,143,/financing
bus service center,9,1200,121,/service-parts
church bus,8,2200,154,/industries/churches
wheelchair bus,5,980,132,/inventory
bus dealer michigan,5,890,176,/
bus parts,6,1500,98,/service-parts
commercial vehicle leasing,14,1100,87,/financing`;

  // Parse CSVs into analytics uploads
  const analyticsUploads = [
    {
      id: crypto.randomUUID(),
      type: "csv" as const,
      name: "GA4-Traffic-Report-90days.csv",
      uploadedAt: new Date().toISOString(),
      csv: { headers: ["Page path", "Sessions", "Users", "Bounce Rate", "Avg. Session Duration"], rows: ga4Csv.split("\n").slice(1).map((l) => l.split(",")), source: "ga4" as const, title: "Google Analytics 4 — Traffic by Page" },
      caption: "Website Traffic by Page (Last 90 Days)",
      includeInDeck: true,
    },
    {
      id: crypto.randomUUID(),
      type: "csv" as const,
      name: "SearchConsole-Queries.csv",
      uploadedAt: new Date().toISOString(),
      csv: { headers: ["Query", "Clicks", "Impressions", "CTR", "Position"], rows: searchConsoleCsv.split("\n").slice(1).map((l) => l.split(",")), source: "search-console" as const, title: "Search Console — Top Queries" },
      caption: "Organic Search Performance (Last 90 Days)",
      includeInDeck: true,
    },
    {
      id: crypto.randomUUID(),
      type: "csv" as const,
      name: "SEMrush-Keywords.csv",
      uploadedAt: new Date().toISOString(),
      csv: { headers: ["Keyword", "Position", "Search Volume", "Traffic", "URL"], rows: semrushCsv.split("\n").slice(1).map((l) => l.split(",")), source: "semrush" as const, title: "SEMrush — Organic Keyword Rankings" },
      caption: "Keyword Rankings & Organic Visibility",
      includeInDeck: true,
    },
  ];

  // --- Custom deck slides ---
  const compSlide = createDeckSlide("competitive-analysis", "Site Usability & Navigation", 0);
  (compSlide.data as any).columns = [
    { name: "The Bus Center", isClient: true, items: ["No crosslinks to major sections", "Inventory nav dropdown is long and uncategorized", "No site search", "Forms buried below the fold"] },
    { name: "Model 1", isClient: false, items: ["Shop by vehicle category and industry on homepage", "Clear cross-links for parts, services, financing", "On-site search in utility nav", "Prominent CTAs on inventory cards"] },
    { name: "Master's Transportation", isClient: false, items: ["Advanced on-site search with pre-selected options", "Recently viewed and favorited vehicles", "Phone number and location search in utility nav", "Clean card-based inventory with key specs"] },
  ];

  const integrationsSlide = createDeckSlide("integrations-table", "Platform Integrations & Tech Stack", 1);
  (integrationsSlide.data as any).rows = [
    { category: "DNS & Hosting", function: "Hosting / Server", currentPlatform: "LiteSpeed, Google Cloud, Cloudflare", recommendation: "Keep current setup" },
    { category: "DNS & Hosting", function: "SSL & Certificates", currentPlatform: "SSL by Default, HSTS", recommendation: "No change needed" },
    { category: "Website Technical", function: "CMS & Front-End", currentPlatform: "WordPress 6.5 (Custom WP theme)", recommendation: "Rebuild on WordPress with modern theme" },
    { category: "Website Technical", function: "Plugins", currentPlatform: "WPBakery, Slider Revolution, Yoast SEO, Gravity Forms", recommendation: "Reduce plugin count, replace WPBakery" },
    { category: "Marketing & Sales", function: "Automation & CRM", currentPlatform: "SharpSpring → transitioning to HubSpot", recommendation: "HubSpot" },
    { category: "Marketing & Sales", function: "Ads & Retargeting", currentPlatform: "Google Ads, Facebook Pixel, Perfect Audience", recommendation: "Consolidate tracking" },
    { category: "Analytics", function: "Analytics & Tagging", currentPlatform: "GA4, GTM, Google Optimize 360", recommendation: "Clean GTM implementation" },
  ];

  const project = createProject({
    clientName: "The Bus Center",
    industry: "B2B Manufacturing",
    targetAudiences: [
      "Retail & 'Onesie-Twosie' Buyers — churches, daycares, small orgs buying their first bus",
      "School Districts — transportation directors working with territory-based sales reps",
      "Government & Municipal Buyers — city buses, DOT contracts, public sector",
      "Fleet & Commercial Buyers — hospitals, assisted living, large fleet operators",
      "Service & Parts Customers — current owners looking for maintenance and parts",
      "Sales Team (Internal) — need reliable inventory and spec reference tool",
      "Prospective Employees — exploring job opportunities and company culture",
    ],
    clientGoals: [
      "Consolidate inventories into unified, searchable database with modern UX",
      "Improve form UX and lead capture on key pages",
      "Present professional, trustworthy user experience that builds buyer confidence",
      "Improve SEO performance to capture more organic traffic from bus shoppers",
    ],
    currentSiteUrl: "https://thebuscenter.com",
    competitorUrls: [
      "https://model1.com",
      "https://masterstransportation.com",
      "https://tesco-bus.com",
    ],
    discoveryNotes: `COMPANY OVERVIEW
The Bus Center is a trusted, multi-location commercial bus dealer with over 50 years of history. It is a subsidiary of Hoekstra Companies, a 98-year-old, 4th-generation Michigan family business. Hoekstra Transportation (the Michigan-based predecessor) has been consolidated under The Bus Center brand.

The business is modeled after and compared to Model 1 — a best-in-class national commercial vehicle dealer — but distinguishes itself through relationships, approachability, and a family-owned culture. Mark Hoekstra (owner) is known for personal involvement with customers and employees alike.

---

BRAND POSITIONING
Tagline direction: Transportation expertise with deep roots.
Positioning: A trusted regional provider with broad inventory, quick turnaround, and dependable delivery.
Brand personality: Practical, trustworthy, knowledgeable, customer-first.
Mission: "To deliver an outstanding product & service, with an unmatched customer experience."

---

KEY CHALLENGES
The current sites lack the organization and features needed to effectively function as sales tools. With basic inventory tools and missing details (i.e., floor plans) and poorly-structured educational content, the sites don't serve the audiences who need them most and don't present the companies as the professional, service-oriented consultants they are.

---

THE VISION
Unify The Bus Center's website to combine both companies' inventories with clean, professional vehicle displays featuring improved filtering and CRO-focused design. Build a technology architecture that enables richer content management control, which will be manual at launch but will enable possible future integrations and could be scalable for other subsidiaries' sites.`,

    valuePropositions: [
      "50+ years of commercial bus expertise across multiple locations",
      "Broad inventory spanning school buses, shuttles, vans, coaches, and wheelchair accessible vehicles",
      "Full-service dealer: sales, service, parts, financing, and customization under one roof",
      "Family-owned culture with personal, relationship-driven service",
    ],
    differentiators: [
      "Multi-location regional presence (Michigan + Southern US)",
      "Part of 98-year-old Hoekstra Companies family of businesses",
      "Owner personally involved in customer and employee relationships",
      "Quick turnaround and dependable delivery vs. national competitors",
    ],
    existingContent: "Available inventory with specs and images\nVehicle category pages & guides\nIndustry guides (lift and shift)\nService, maintenance, repairs, and parts info\nFinancing options and warranty info\nCompany history and partnership info\nBlog content with News tag",
    contentToCreate: "Inventory floor plans (if assets exist)\nNew forms for quotes, service, parts\nImproved location pages with maps\nCustomer and employee testimonials\nCommon FAQs for service and vehicle pages\nCareer info (benefits, values, culture)\nXML sitemap",
    contentOwnership: "E3 writes all new copy\nClient provides: inventory data, photos, floor plans\nClient reviews and approves all content\nBlog migration handled by E3",
    cmsPlatform: "WordPress",
    hostingNotes: "Current hosting on LiteSpeed/Google Cloud is solid. No need to migrate hosting. Ongoing maintenance via development partner recommended.",
    integrations: [
      { id: "1", name: "HubSpot", category: "crm" as const, notes: "Forms + lead routing" },
      { id: "2", name: "Google Analytics 4", category: "analytics" as const, notes: "Fresh implementation" },
      { id: "3", name: "Google Tag Manager", category: "analytics" as const, notes: "Clean container" },
      { id: "4", name: "Google Search Console", category: "analytics" as const, notes: "" },
      { id: "5", name: "Google Maps", category: "maps" as const, notes: "Location pages" },
      { id: "6", name: "Gravity Forms", category: "forms" as const, notes: "Contact + quote forms" },
      { id: "7", name: "Yoast SEO", category: "analytics" as const, notes: "SEO plugin" },
    ],
    styleGuide: {
      ...defaultStyleGuide,
      primaryColor: "#1a3a5c",
      primaryForeground: "#ffffff",
      secondaryColor: "#f0f4f8",
      secondaryForeground: "#1a3a5c",
      accentColor: "#c8a951",
      accentForeground: "#1a3a5c",
      backgroundColor: "#ffffff",
      foregroundColor: "#1a1a1a",
      mutedColor: "#f5f5f5",
      mutedForeground: "#6b7280",
      cardColor: "#ffffff",
      cardForeground: "#1a1a1a",
      borderColor: "#e5e5e5",
      headingFont: "'Sofia Sans SemiCondensed', sans-serif",
      bodyFont: "'Sofia Sans', sans-serif",
      headingWeight: "900",
      baseSize: "16",
      borderRadius: "4",
      buttonRadius: "4",
      sectionPadding: "40",
      buttonStyle: "filled",
      cardShadow: "sm",
      cardBorder: true,
    },
    sitemap: [home, inventory, schoolBuses, shuttles, vans, services, financing, industries, churches, seniorLiving, about, locations, alabama, georgia, contact, careers, blog, privacy, terms, accessibility],
    deckSlides: [compSlide, integrationsSlide],
    analyticsUploads,
    audit: {
      lastRunAt: new Date().toISOString(),
      pagespeed: {
        mobile: {
          url: "https://thebuscenter.com",
          fetchedAt: new Date().toISOString(),
          scores: { performance: 42, accessibility: 78, bestPractices: 67, seo: 82 },
          coreWebVitals: {
            lcp: { value: 6700, unit: "ms", rating: "poor" as const },
            fid: { value: 180, unit: "ms", rating: "needs-improvement" as const },
            cls: { value: 0.24, unit: "", rating: "poor" as const },
            inp: { value: 320, unit: "ms", rating: "poor" as const },
            fcp: { value: 3200, unit: "ms", rating: "poor" as const },
            ttfb: { value: 1800, unit: "ms", rating: "needs-improvement" as const },
          },
          opportunities: [
            { title: "Reduce unused JavaScript", description: "", savings: "2,400ms" },
            { title: "Properly size images", description: "", savings: "1,800ms" },
            { title: "Eliminate render-blocking resources", description: "", savings: "1,200ms" },
            { title: "Serve images in next-gen formats", description: "", savings: "900ms" },
          ],
          diagnostics: [],
        },
        desktop: {
          url: "https://thebuscenter.com",
          fetchedAt: new Date().toISOString(),
          scores: { performance: 68, accessibility: 82, bestPractices: 75, seo: 88 },
          coreWebVitals: {
            lcp: { value: 2100, unit: "ms", rating: "good" as const },
            fid: { value: 45, unit: "ms", rating: "good" as const },
            cls: { value: 0.08, unit: "", rating: "good" as const },
            inp: { value: 120, unit: "ms", rating: "good" as const },
            fcp: { value: 1400, unit: "ms", rating: "good" as const },
            ttfb: { value: 680, unit: "ms", rating: "good" as const },
          },
          opportunities: [
            { title: "Reduce unused JavaScript", description: "", savings: "800ms" },
            { title: "Minify CSS", description: "", savings: "200ms" },
          ],
          diagnostics: [],
        },
      },
      ga4: null,
      searchConsole: null,
    },
  });

  return project;
}

export default function SeedPage() {
  const router = useRouter();
  const [created, setCreated] = useState(false);
  const [projectId, setProjectId] = useState("");

  const handleCreate = () => {
    const project = generateSampleProject();
    const saved = saveProject(project);
    setProjectId(saved.id);
    setCreated(true);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md">
        {!created ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Create Sample Project</h1>
            <p className="text-sm text-muted-foreground mb-6">
              This will create a fully populated demo project for "The Bus Center" with fake analytics data, PageSpeed scores, competitor analysis, sitemap, and discovery notes.
            </p>
            <Button size="lg" onClick={handleCreate}>
              Generate Sample Project
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4 text-green-600">Sample Project Created</h1>
            <p className="text-sm text-muted-foreground mb-6">
              The Bus Center project has been created with 20 pages, 3 CSV datasets, PageSpeed data, and a full discovery brief.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => router.push(`/projects/${projectId}`)}>
                Open Dashboard
              </Button>
              <Button variant="outline" onClick={() => router.push(`/projects/${projectId}/deck`)}>
                View Deck
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
