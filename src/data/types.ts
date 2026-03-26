export type FrequencyTier = "high" | "medium" | "low";

export type WireframeBlockId =
  // Hero variants
  | "hero-fullwidth-image"
  | "hero-split"
  | "hero-carousel"
  | "hero-animated"
  | "hero-minimal-text"
  | "hero-video"
  | "hero-breadcrumb"
  // Content / Text sections
  | "text-centered"
  | "text-split-image"
  | "text-fullwidth"
  | "text-blockquote"
  // Icon / Feature grids
  | "icon-row"
  | "icon-grid-3"
  | "icon-grid-4"
  | "icon-list"
  // Stats
  | "stats-bar"
  | "stats-callout"
  // Card layouts
  | "card-grid-3"
  | "card-grid-4"
  | "card-carousel"
  | "card-featured-plus"
  | "card-image-hover"
  // Tabs
  | "tab-interface"
  | "tab-category"
  // Testimonials / Social proof
  | "testimonial-carousel"
  | "testimonial-cards"
  | "testimonial-video"
  | "testimonial-quote"
  // Logo displays
  | "logo-bar"
  | "logo-grid"
  | "logo-marquee"
  // CTA sections
  | "cta-banner-fullwidth"
  | "cta-split"
  | "cta-form-embed"
  | "cta-simple"
  // Forms
  | "form-simple"
  | "form-multi-step"
  | "form-tabbed"
  | "form-quote-request"
  | "form-scheduler"
  | "form-selector-combo"
  // Timeline / Process
  | "timeline-vertical"
  | "timeline-horizontal"
  | "steps-numbered"
  | "steps-icon"
  | "process-diagram"
  // Accordion / FAQ
  | "accordion-simple"
  | "accordion-categorized"
  // Lists
  | "list-compact"
  | "list-numbered"
  | "list-simple"
  // Team / People
  | "team-grid"
  | "team-carousel"
  | "team-modal"
  | "team-simple"
  | "team-featured"
  // Map / Location
  | "map-interactive"
  | "map-contact-overlay"
  | "map-coverage"
  | "map-multi-pin"
  // Job listings
  | "jobs-filterable"
  | "jobs-accordion"
  | "jobs-cards"
  | "jobs-ats-embed"
  | "jobs-list"
  // Media
  | "video-embed"
  | "video-modal"
  | "video-background"
  | "photo-gallery"
  // Badges / Seals
  | "badge-seal-display"
  | "comparison-table"
  // Contact
  | "contact-card"
  | "contact-grid"
  | "contact-tabs"
  // Misc
  | "infographic"
  | "diagram-interactive"
  | "faq-searchable"
  | "zipcode-lookup"
  | "region-coverage"
  | "star-rating";

export interface ComponentOption {
  name: string;
  wireframeId: WireframeBlockId;
}

export interface ContentTheme {
  id: string;
  name: string;
  frequencyTier: FrequencyTier;
  componentOptions: ComponentOption[];
  considerations: string[];
  clientDiscoveryQuestions: string[];
  informationAndAssets: string[];
  industryNotes: string[];
  /** Optional screenshot/preview image paths for recommended modules */
  modulePreviewImages?: string[];
}

export interface PageTemplate {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  contentThemes: ContentTheme[];
  contentArchitecture?: string[];
  generalNotes?: string[];
}
