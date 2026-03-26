/** Wireframe block IDs mapped to SVG wireframe renderers */
export type WireframeBlockId =
  // Heroes
  | "hero-image-right"
  | "hero-centered"
  | "hero-split"
  | "hero-video-bg"
  | "hero-minimal"
  // Text sections
  | "text-full-width"
  | "text-split-image-right"
  | "text-split-image-left"
  | "text-icon-block"
  | "text-blockquote"
  // Card grids
  | "cards-3-col"
  | "cards-4-col"
  | "cards-2-col"
  | "cards-icon-grid"
  | "cards-image-cards"
  // Lists & accordions
  | "accordion-list"
  | "numbered-steps"
  | "icon-list"
  // Timelines
  | "timeline-vertical"
  | "timeline-horizontal"
  | "milestone-cards"
  // Tabs
  | "tabs-horizontal"
  | "tabs-vertical"
  // Carousels
  | "carousel-cards"
  | "carousel-testimonials"
  | "carousel-logos"
  // CTAs
  | "cta-full-width"
  | "cta-split"
  | "cta-with-form"
  // Testimonials
  | "testimonials-quotes"
  | "testimonials-cards"
  | "testimonials-video"
  // Logo bars
  | "logos-grid"
  | "logos-marquee"
  // Maps
  | "map-full"
  | "map-with-sidebar"
  | "map-with-cards"
  // Forms
  | "form-simple"
  | "form-multi-step"
  | "form-with-info"
  // Stats
  | "stats-bar"
  | "stats-grid"
  // Team
  | "team-grid"
  | "team-carousel"
  | "team-featured"
  // Media
  | "video-embed"
  | "video-modal"
  | "gallery-grid"
  // Misc
  | "diagram-interactive"
  | "comparison-table"
  | "badge-display"
  | "filter-grid"
  | "faq-accordion";

export interface ComponentOption {
  /** Display name using shadcn block naming */
  name: string;
  /** Which wireframe to render */
  wireframeId: WireframeBlockId;
}
