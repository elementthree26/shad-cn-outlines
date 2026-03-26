"use client";

import { WireframeBlockId } from "@/data/types";

interface WireframeBlockProps {
  className?: string;
}

// Shared wrapper for all wireframe SVGs
function WireframeSvg({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Page outline */}
      <rect
        x="0.5"
        y="0.5"
        width="399"
        height="259"
        rx="3"
        stroke="currentColor"
        strokeOpacity="0.15"
        fill="currentColor"
        fillOpacity="0.02"
      />
      {children}
    </svg>
  );
}

// ─── Hero variants ──────────────────────────────────────

function HeroFullwidthImage({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      {/* Full-width image placeholder */}
      <rect x="16" y="16" width="368" height="140" rx="4" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.15" />
      {/* Image icon */}
      <rect x="170" y="55" width="60" height="45" rx="3" fill="currentColor" fillOpacity="0.1" />
      <circle cx="185" cy="70" r="6" fill="currentColor" fillOpacity="0.15" />
      <path d="M173 95 L190 78 L205 90 L215 82 L227 95Z" fill="currentColor" fillOpacity="0.12" />
      {/* Headline */}
      <rect x="100" y="175" width="200" height="12" rx="2" fill="currentColor" fillOpacity="0.15" />
      {/* Subhead */}
      <rect x="130" y="195" width="140" height="8" rx="2" fill="currentColor" fillOpacity="0.08" />
      {/* CTA button */}
      <rect x="160" y="218" width="80" height="24" rx="4" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.2" />
      <rect x="175" y="227" width="50" height="6" rx="1" fill="currentColor" fillOpacity="0.15" />
    </WireframeSvg>
  );
}

// ─── Registry ───────────────────────────────────────────

const wireframeRegistry: Record<WireframeBlockId, React.FC<WireframeBlockProps>> = {
  "hero-fullwidth-image": HeroFullwidthImage,
  // Remaining blocks use a placeholder for now
  "hero-split": Placeholder,
  "hero-carousel": Placeholder,
  "hero-animated": Placeholder,
  "hero-minimal-text": Placeholder,
  "hero-video": Placeholder,
  "hero-breadcrumb": Placeholder,
  "text-centered": Placeholder,
  "text-split-image": Placeholder,
  "text-fullwidth": Placeholder,
  "text-blockquote": Placeholder,
  "icon-row": Placeholder,
  "icon-grid-3": Placeholder,
  "icon-grid-4": Placeholder,
  "icon-list": Placeholder,
  "stats-bar": Placeholder,
  "stats-callout": Placeholder,
  "card-grid-3": Placeholder,
  "card-grid-4": Placeholder,
  "card-carousel": Placeholder,
  "card-featured-plus": Placeholder,
  "card-image-hover": Placeholder,
  "tab-interface": Placeholder,
  "tab-category": Placeholder,
  "testimonial-carousel": Placeholder,
  "testimonial-cards": Placeholder,
  "testimonial-video": Placeholder,
  "testimonial-quote": Placeholder,
  "logo-bar": Placeholder,
  "logo-grid": Placeholder,
  "logo-marquee": Placeholder,
  "cta-banner-fullwidth": Placeholder,
  "cta-split": Placeholder,
  "cta-form-embed": Placeholder,
  "cta-simple": Placeholder,
  "form-simple": Placeholder,
  "form-multi-step": Placeholder,
  "form-tabbed": Placeholder,
  "form-quote-request": Placeholder,
  "form-scheduler": Placeholder,
  "form-selector-combo": Placeholder,
  "timeline-vertical": Placeholder,
  "timeline-horizontal": Placeholder,
  "steps-numbered": Placeholder,
  "steps-icon": Placeholder,
  "process-diagram": Placeholder,
  "accordion-simple": Placeholder,
  "accordion-categorized": Placeholder,
  "list-compact": Placeholder,
  "list-numbered": Placeholder,
  "list-simple": Placeholder,
  "team-grid": Placeholder,
  "team-carousel": Placeholder,
  "team-modal": Placeholder,
  "team-simple": Placeholder,
  "team-featured": Placeholder,
  "map-interactive": Placeholder,
  "map-contact-overlay": Placeholder,
  "map-coverage": Placeholder,
  "map-multi-pin": Placeholder,
  "jobs-filterable": Placeholder,
  "jobs-accordion": Placeholder,
  "jobs-cards": Placeholder,
  "jobs-ats-embed": Placeholder,
  "jobs-list": Placeholder,
  "video-embed": Placeholder,
  "video-modal": Placeholder,
  "video-background": Placeholder,
  "photo-gallery": Placeholder,
  "badge-seal-display": Placeholder,
  "comparison-table": Placeholder,
  "contact-card": Placeholder,
  "contact-grid": Placeholder,
  "contact-tabs": Placeholder,
  "infographic": Placeholder,
  "diagram-interactive": Placeholder,
  "faq-searchable": Placeholder,
  "zipcode-lookup": Placeholder,
  "region-coverage": Placeholder,
  "star-rating": Placeholder,
};

function Placeholder({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="16" y="16" width="368" height="228" rx="4" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4 4" />
      <rect x="140" y="115" width="120" height="10" rx="2" fill="currentColor" fillOpacity="0.08" />
      <rect x="165" y="133" width="70" height="8" rx="2" fill="currentColor" fillOpacity="0.06" />
    </WireframeSvg>
  );
}

export function WireframeBlock({
  blockId,
  className,
}: {
  blockId: WireframeBlockId;
  className?: string;
}) {
  const Component = wireframeRegistry[blockId];
  return <Component className={className} />;
}
