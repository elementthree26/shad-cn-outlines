import { WireframeBlockId } from "@/data/wireframe-types";

export const wireframeBlockMeta: Record<WireframeBlockId, { label: string; category: string }> = {
  "hero-image-right": { label: "Hero with Image Right", category: "Hero" },
  "hero-centered": { label: "Hero Centered", category: "Hero" },
  "hero-split": { label: "Hero Split 50/50", category: "Hero" },
  "hero-video-bg": { label: "Hero Video Background", category: "Hero" },
  "hero-minimal": { label: "Hero Minimal", category: "Hero" },
  "text-full-width": { label: "Full-Width Text", category: "Text" },
  "text-split-image-right": { label: "Text + Image Right", category: "Text" },
  "text-split-image-left": { label: "Text + Image Left", category: "Text" },
  "text-icon-block": { label: "Text with Icon Block", category: "Text" },
  "text-blockquote": { label: "Blockquote", category: "Text" },
  "cards-3-col": { label: "3-Column Cards", category: "Cards" },
  "cards-4-col": { label: "4-Column Cards", category: "Cards" },
  "cards-2-col": { label: "2-Column Cards", category: "Cards" },
  "cards-icon-grid": { label: "Icon Grid", category: "Cards" },
  "cards-image-cards": { label: "Image Cards", category: "Cards" },
  "accordion-list": { label: "Accordion List", category: "Lists" },
  "numbered-steps": { label: "Numbered Steps", category: "Lists" },
  "icon-list": { label: "Icon List", category: "Lists" },
  "timeline-vertical": { label: "Vertical Timeline", category: "Timeline" },
  "timeline-horizontal": { label: "Horizontal Timeline", category: "Timeline" },
  "milestone-cards": { label: "Milestone Cards", category: "Timeline" },
  "tabs-horizontal": { label: "Horizontal Tabs", category: "Tabs" },
  "tabs-vertical": { label: "Vertical Tabs", category: "Tabs" },
  "carousel-cards": { label: "Card Carousel", category: "Carousel" },
  "carousel-testimonials": { label: "Testimonial Carousel", category: "Carousel" },
  "carousel-logos": { label: "Logo Carousel", category: "Carousel" },
  "cta-full-width": { label: "Full-Width CTA", category: "CTA" },
  "cta-split": { label: "Split CTA", category: "CTA" },
  "cta-with-form": { label: "CTA with Form", category: "CTA" },
  "testimonials-quotes": { label: "Quote Testimonials", category: "Testimonials" },
  "testimonials-cards": { label: "Testimonial Cards", category: "Testimonials" },
  "testimonials-video": { label: "Video Testimonials", category: "Testimonials" },
  "logos-grid": { label: "Logo Grid", category: "Logos" },
  "logos-marquee": { label: "Logo Marquee", category: "Logos" },
  "map-full": { label: "Full-Width Map", category: "Maps" },
  "map-with-sidebar": { label: "Map with Sidebar", category: "Maps" },
  "map-with-cards": { label: "Map with Cards", category: "Maps" },
  "form-simple": { label: "Simple Form", category: "Forms" },
  "form-multi-step": { label: "Multi-Step Form", category: "Forms" },
  "form-with-info": { label: "Form with Info", category: "Forms" },
  "stats-bar": { label: "Stats Bar", category: "Stats" },
  "stats-grid": { label: "Stats Grid", category: "Stats" },
  "team-grid": { label: "Team Grid", category: "Team" },
  "team-carousel": { label: "Team Carousel", category: "Team" },
  "team-featured": { label: "Featured Team Member", category: "Team" },
  "video-embed": { label: "Video Embed", category: "Media" },
  "video-modal": { label: "Video Modal", category: "Media" },
  "gallery-grid": { label: "Gallery Grid", category: "Media" },
  "diagram-interactive": { label: "Interactive Diagram", category: "Misc" },
  "comparison-table": { label: "Comparison Table", category: "Misc" },
  "badge-display": { label: "Badge Display", category: "Misc" },
  "filter-grid": { label: "Filter Grid", category: "Misc" },
  "faq-accordion": { label: "FAQ Accordion", category: "Misc" },
};

// Shared SVG helpers
const R = (x: number, y: number, w: number, h: number, rx = 2) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="none" stroke="currentColor" stroke-width="1"/>`;
const RF = (x: number, y: number, w: number, h: number, rx = 2) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="currentColor" opacity="0.08" stroke="currentColor" stroke-width="0.5"/>`;
const L = (x1: number, y1: number, x2: number, y2: number) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="0.7" opacity="0.4"/>`;
const TL = (x: number, y: number, w: number) =>
  `<rect x="${x}" y="${y}" width="${w}" height="2" rx="1" fill="currentColor" opacity="0.3"/>`;
const C = (cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="currentColor" stroke-width="0.7"/>`;
const CF = (cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="currentColor" opacity="0.12" stroke="currentColor" stroke-width="0.5"/>`;
const BTN = (x: number, y: number, w: number, h = 8) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="0.5"/>`;

const wireframeSvgs: Record<WireframeBlockId, string> = {
  // === HEROES ===
  "hero-image-right": `
    ${TL(12, 30, 60)}${TL(12, 36, 80)}${TL(12, 42, 50)}
    ${BTN(12, 52, 30)}
    ${RF(120, 20, 68, 80)}
  `,
  "hero-centered": `
    ${TL(50, 25, 100)}${TL(60, 31, 80)}${TL(70, 37, 60)}
    ${BTN(80, 50, 40)}
  `,
  "hero-split": `
    ${RF(5, 10, 92, 100)}
    ${TL(110, 30, 70)}${TL(110, 36, 60)}${TL(110, 42, 50)}
    ${BTN(110, 55, 30)}
  `,
  "hero-video-bg": `
    ${RF(5, 5, 190, 110)}
    <polygon points="90,45 90,75 110,60" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="0.5"/>
    ${TL(55, 82, 90)}${TL(65, 88, 70)}
    ${BTN(75, 96, 50)}
  `,
  "hero-minimal": `
    ${TL(30, 45, 140)}${TL(50, 53, 100)}
    ${BTN(75, 65, 50)}
  `,

  // === TEXT ===
  "text-full-width": `
    ${TL(20, 20, 160)}${TL(20, 28, 160)}${TL(20, 36, 160)}
    ${TL(20, 44, 140)}${TL(20, 52, 150)}${TL(20, 60, 130)}
    ${TL(20, 68, 160)}${TL(20, 76, 100)}
  `,
  "text-split-image-right": `
    ${TL(12, 25, 70)}${TL(12, 33, 80)}${TL(12, 41, 60)}
    ${TL(12, 49, 75)}${TL(12, 57, 55)}
    ${RF(110, 20, 78, 65)}
  `,
  "text-split-image-left": `
    ${RF(12, 20, 78, 65)}
    ${TL(110, 25, 70)}${TL(110, 33, 80)}${TL(110, 41, 60)}
    ${TL(110, 49, 75)}${TL(110, 57, 55)}
  `,
  "text-icon-block": `
    ${CF(30, 35, 10)}
    ${TL(50, 28, 60)}${TL(50, 36, 50)}${TL(50, 44, 55)}
    ${CF(30, 75, 10)}
    ${TL(50, 68, 60)}${TL(50, 76, 50)}${TL(50, 84, 55)}
  `,
  "text-blockquote": `
    <line x1="30" y1="25" x2="30" y2="85" stroke="currentColor" stroke-width="3" opacity="0.25"/>
    ${TL(40, 35, 130)}${TL(40, 43, 120)}${TL(40, 51, 110)}
    ${TL(40, 65, 60)}
  `,

  // === CARDS ===
  "cards-3-col": `
    ${RF(8, 15, 55, 90)}${TL(14, 65, 40)}${TL(14, 72, 35)}
    ${RF(72, 15, 55, 90)}${TL(78, 65, 40)}${TL(78, 72, 35)}
    ${RF(136, 15, 55, 90)}${TL(142, 65, 40)}${TL(142, 72, 35)}
  `,
  "cards-4-col": `
    ${RF(5, 20, 42, 75)}${TL(10, 58, 30)}${TL(10, 65, 25)}
    ${RF(52, 20, 42, 75)}${TL(57, 58, 30)}${TL(57, 65, 25)}
    ${RF(99, 20, 42, 75)}${TL(104, 58, 30)}${TL(104, 65, 25)}
    ${RF(146, 20, 42, 75)}${TL(151, 58, 30)}${TL(151, 65, 25)}
  `,
  "cards-2-col": `
    ${RF(12, 15, 82, 90)}${TL(20, 65, 60)}${TL(20, 73, 50)}
    ${RF(106, 15, 82, 90)}${TL(114, 65, 60)}${TL(114, 73, 50)}
  `,
  "cards-icon-grid": `
    ${CF(35, 35, 8)}${TL(20, 50, 30)}${TL(22, 57, 26)}
    ${CF(100, 35, 8)}${TL(85, 50, 30)}${TL(87, 57, 26)}
    ${CF(165, 35, 8)}${TL(150, 50, 30)}${TL(152, 57, 26)}
    ${CF(35, 85, 8)}${TL(20, 100, 30)}${TL(22, 107, 26)}
    ${CF(100, 85, 8)}${TL(85, 100, 30)}${TL(87, 107, 26)}
    ${CF(165, 85, 8)}${TL(150, 100, 30)}${TL(152, 107, 26)}
  `,
  "cards-image-cards": `
    ${RF(8, 10, 55, 40)}${TL(14, 58, 40)}${TL(14, 65, 35)}${R(8, 10, 55, 95)}
    ${RF(72, 10, 55, 40)}${TL(78, 58, 40)}${TL(78, 65, 35)}${R(72, 10, 55, 95)}
    ${RF(136, 10, 55, 40)}${TL(142, 58, 40)}${TL(142, 65, 35)}${R(136, 10, 55, 95)}
  `,

  // === LISTS ===
  "accordion-list": `
    ${R(15, 12, 170, 16)}${TL(22, 18, 100)}
    <line x1="175" y1="17" x2="180" y2="22" stroke="currentColor" stroke-width="1" opacity="0.4"/>
    <line x1="185" y1="17" x2="180" y2="22" stroke="currentColor" stroke-width="1" opacity="0.4"/>
    ${R(15, 32, 170, 30)}${TL(22, 38, 100)}
    ${TL(25, 48, 150)}${TL(25, 54, 130)}
    ${R(15, 66, 170, 16)}${TL(22, 72, 110)}
    ${R(15, 86, 170, 16)}${TL(22, 92, 90)}
  `,
  "numbered-steps": `
    ${CF(25, 25, 8)}<text x="25" y="28" text-anchor="middle" fill="currentColor" font-size="8" opacity="0.4">1</text>
    ${TL(42, 22, 100)}${TL(42, 30, 80)}
    ${CF(25, 55, 8)}<text x="25" y="58" text-anchor="middle" fill="currentColor" font-size="8" opacity="0.4">2</text>
    ${TL(42, 52, 100)}${TL(42, 60, 80)}
    ${CF(25, 85, 8)}<text x="25" y="88" text-anchor="middle" fill="currentColor" font-size="8" opacity="0.4">3</text>
    ${TL(42, 82, 100)}${TL(42, 90, 80)}
  `,
  "icon-list": `
    ${CF(25, 25, 6)}${TL(40, 22, 120)}${TL(40, 30, 90)}
    ${CF(25, 48, 6)}${TL(40, 45, 120)}${TL(40, 53, 90)}
    ${CF(25, 71, 6)}${TL(40, 68, 120)}${TL(40, 76, 90)}
    ${CF(25, 94, 6)}${TL(40, 91, 120)}${TL(40, 99, 90)}
  `,

  // === TIMELINES ===
  "timeline-vertical": `
    <line x1="100" y1="10" x2="100" y2="110" stroke="currentColor" stroke-width="1" opacity="0.2"/>
    ${CF(100, 20, 4)}${TL(112, 17, 60)}${TL(112, 24, 45)}
    ${CF(100, 50, 4)}${TL(30, 47, 60)}${TL(30, 54, 45)}
    ${CF(100, 80, 4)}${TL(112, 77, 60)}${TL(112, 84, 45)}
  `,
  "timeline-horizontal": `
    <line x1="15" y1="55" x2="185" y2="55" stroke="currentColor" stroke-width="1" opacity="0.2"/>
    ${CF(40, 55, 4)}${TL(25, 65, 30)}${TL(27, 72, 26)}
    ${CF(100, 55, 4)}${TL(85, 65, 30)}${TL(87, 72, 26)}
    ${CF(160, 55, 4)}${TL(145, 65, 30)}${TL(147, 72, 26)}
    ${TL(27, 40, 26)}${TL(87, 40, 26)}${TL(147, 40, 26)}
  `,
  "milestone-cards": `
    <line x1="15" y1="60" x2="185" y2="60" stroke="currentColor" stroke-width="1" opacity="0.15"/>
    ${CF(40, 60, 5)}${RF(18, 70, 44, 35)}${TL(24, 78, 30)}${TL(24, 85, 25)}
    ${CF(100, 60, 5)}${RF(78, 70, 44, 35)}${TL(84, 78, 30)}${TL(84, 85, 25)}
    ${CF(160, 60, 5)}${RF(138, 70, 44, 35)}${TL(144, 78, 30)}${TL(144, 85, 25)}
    ${TL(25, 50, 30)}${TL(85, 50, 30)}${TL(145, 50, 30)}
  `,

  // === TABS ===
  "tabs-horizontal": `
    ${BTN(15, 15, 40, 10)}${BTN(60, 15, 40, 10)}${BTN(105, 15, 40, 10)}
    <line x1="15" y1="28" x2="185" y2="28" stroke="currentColor" stroke-width="0.5" opacity="0.3"/>
    ${TL(20, 40, 160)}${TL(20, 48, 140)}${TL(20, 56, 150)}
    ${TL(20, 64, 120)}${TL(20, 72, 130)}
  `,
  "tabs-vertical": `
    ${BTN(10, 15, 45, 10)}${BTN(10, 30, 45, 10)}${BTN(10, 45, 45, 10)}
    <line x1="60" y1="10" x2="60" y2="110" stroke="currentColor" stroke-width="0.5" opacity="0.3"/>
    ${TL(70, 20, 110)}${TL(70, 28, 100)}${TL(70, 36, 90)}
    ${TL(70, 50, 110)}${TL(70, 58, 80)}
  `,

  // === CAROUSELS ===
  "carousel-cards": `
    <polygon points="5,60 12,55 12,65" fill="currentColor" opacity="0.2"/>
    ${RF(20, 15, 55, 90)}${TL(26, 65, 40)}${TL(26, 73, 35)}
    ${RF(82, 15, 55, 90)}${TL(88, 65, 40)}${TL(88, 73, 35)}
    ${RF(144, 15, 55, 90)}${TL(150, 65, 40)}${TL(150, 73, 35)}
    <polygon points="195,60 188,55 188,65" fill="currentColor" opacity="0.2"/>
  `,
  "carousel-testimonials": `
    <polygon points="8,60 15,55 15,65" fill="currentColor" opacity="0.2"/>
    <text x="40" y="40" fill="currentColor" font-size="24" opacity="0.15">"</text>
    ${TL(40, 50, 120)}${TL(50, 58, 100)}${TL(45, 66, 110)}
    ${CF(70, 85, 6)}${TL(82, 83, 50)}
    <polygon points="192,60 185,55 185,65" fill="currentColor" opacity="0.2"/>
  `,
  "carousel-logos": `
    <polygon points="5,60 12,55 12,65" fill="currentColor" opacity="0.2"/>
    ${RF(22, 40, 30, 20)}${RF(60, 40, 30, 20)}${RF(98, 40, 30, 20)}
    ${RF(136, 40, 30, 20)}
    <polygon points="195,60 188,55 188,65" fill="currentColor" opacity="0.2"/>
  `,

  // === CTAs ===
  "cta-full-width": `
    ${RF(5, 15, 190, 90)}
    ${TL(50, 40, 100)}${TL(60, 48, 80)}
    ${BTN(70, 62, 60, 12)}
  `,
  "cta-split": `
    ${RF(5, 15, 92, 90)}
    ${TL(15, 40, 70)}${TL(15, 48, 60)}
    ${BTN(15, 62, 40, 10)}
    ${RF(103, 15, 92, 90)}
    ${TL(113, 40, 70)}${TL(113, 48, 60)}
    ${BTN(113, 62, 40, 10)}
  `,
  "cta-with-form": `
    ${TL(15, 30, 70)}${TL(15, 38, 60)}${TL(15, 46, 50)}
    ${R(110, 20, 78, 80)}
    ${RF(118, 30, 62, 10)}${RF(118, 46, 62, 10)}${RF(118, 62, 62, 10)}
    ${BTN(118, 80, 62, 12)}
  `,

  // === TESTIMONIALS ===
  "testimonials-quotes": `
    <text x="30" y="35" fill="currentColor" font-size="20" opacity="0.15">"</text>
    ${TL(30, 42, 140)}${TL(40, 50, 120)}${TL(35, 58, 130)}
    ${CF(60, 80, 6)}${TL(72, 78, 60)}
  `,
  "testimonials-cards": `
    ${R(8, 12, 55, 95)}
    <text x="20" y="30" fill="currentColor" font-size="12" opacity="0.15">"</text>
    ${TL(18, 38, 38)}${TL(18, 45, 32)}${CF(35, 65, 5)}${TL(18, 80, 38)}
    ${R(72, 12, 55, 95)}
    <text x="84" y="30" fill="currentColor" font-size="12" opacity="0.15">"</text>
    ${TL(82, 38, 38)}${TL(82, 45, 32)}${CF(99, 65, 5)}${TL(82, 80, 38)}
    ${R(136, 12, 55, 95)}
    <text x="148" y="30" fill="currentColor" font-size="12" opacity="0.15">"</text>
    ${TL(146, 38, 38)}${TL(146, 45, 32)}${CF(163, 65, 5)}${TL(146, 80, 38)}
  `,
  "testimonials-video": `
    ${RF(15, 15, 80, 60)}
    <polygon points="45,35 45,55 60,45" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="0.5"/>
    ${TL(110, 25, 70)}${TL(110, 33, 60)}${TL(110, 41, 65)}
    ${CF(120, 60, 6)}${TL(132, 58, 40)}
  `,

  // === LOGOS ===
  "logos-grid": `
    ${RF(15, 25, 35, 22)}${RF(58, 25, 35, 22)}${RF(101, 25, 35, 22)}${RF(144, 25, 35, 22)}
    ${RF(15, 65, 35, 22)}${RF(58, 65, 35, 22)}${RF(101, 65, 35, 22)}${RF(144, 65, 35, 22)}
  `,
  "logos-marquee": `
    ${RF(5, 40, 30, 20)}${RF(42, 40, 30, 20)}${RF(79, 40, 30, 20)}
    ${RF(116, 40, 30, 20)}${RF(153, 40, 30, 20)}
    <line x1="0" y1="50" x2="8" y2="50" stroke="currentColor" stroke-width="0.7" opacity="0.15" stroke-dasharray="2 2"/>
    <line x1="190" y1="50" x2="200" y2="50" stroke="currentColor" stroke-width="0.7" opacity="0.15" stroke-dasharray="2 2"/>
  `,

  // === MAPS ===
  "map-full": `
    ${RF(5, 8, 190, 104)}
    ${CF(100, 50, 6)}
    <line x1="100" y1="56" x2="100" y2="65" stroke="currentColor" stroke-width="1" opacity="0.3"/>
    ${TL(60, 90, 80)}
  `,
  "map-with-sidebar": `
    ${RF(5, 8, 125, 104)}
    ${CF(65, 50, 5)}
    ${R(138, 8, 55, 104)}
    ${TL(144, 20, 40)}${TL(144, 30, 35)}
    ${L(138, 42, 193, 42)}
    ${TL(144, 52, 40)}${TL(144, 62, 35)}
    ${L(138, 74, 193, 74)}
    ${TL(144, 84, 40)}
  `,
  "map-with-cards": `
    ${RF(5, 8, 190, 65)}
    ${CF(100, 35, 4)}
    ${RF(8, 80, 55, 30)}${TL(14, 88, 40)}${TL(14, 95, 30)}
    ${RF(72, 80, 55, 30)}${TL(78, 88, 40)}${TL(78, 95, 30)}
    ${RF(136, 80, 55, 30)}${TL(142, 88, 40)}${TL(142, 95, 30)}
  `,

  // === FORMS ===
  "form-simple": `
    ${R(40, 10, 120, 100)}
    ${TL(55, 22, 50)}
    ${RF(55, 34, 90, 10)}${RF(55, 50, 90, 10)}${RF(55, 66, 90, 25)}
    ${BTN(55, 96, 90, 10)}
  `,
  "form-multi-step": `
    ${CF(50, 15, 5)}${CF(100, 15, 5)}${CF(150, 15, 5)}
    <line x1="55" y1="15" x2="95" y2="15" stroke="currentColor" stroke-width="0.7" opacity="0.2"/>
    <line x1="105" y1="15" x2="145" y2="15" stroke="currentColor" stroke-width="0.7" opacity="0.2"/>
    ${R(30, 28, 140, 80)}
    ${RF(45, 40, 110, 10)}${RF(45, 56, 110, 10)}${RF(45, 72, 50, 10)}
    ${BTN(115, 90, 40, 10)}
  `,
  "form-with-info": `
    ${TL(12, 25, 70)}${TL(12, 33, 60)}${TL(12, 41, 65)}
    ${TL(12, 55, 55)}${TL(12, 63, 60)}
    ${R(105, 15, 85, 90)}
    ${RF(115, 28, 65, 10)}${RF(115, 44, 65, 10)}${RF(115, 60, 65, 20)}
    ${BTN(115, 86, 65, 10)}
  `,

  // === STATS ===
  "stats-bar": `
    ${RF(5, 30, 190, 55)}
    <text x="38" y="58" text-anchor="middle" fill="currentColor" font-size="14" opacity="0.2">42</text>
    ${TL(23, 65, 30)}
    <text x="100" y="58" text-anchor="middle" fill="currentColor" font-size="14" opacity="0.2">98</text>
    ${TL(85, 65, 30)}
    <text x="162" y="58" text-anchor="middle" fill="currentColor" font-size="14" opacity="0.2">5K</text>
    ${TL(147, 65, 30)}
  `,
  "stats-grid": `
    <text x="50" y="40" text-anchor="middle" fill="currentColor" font-size="14" opacity="0.2">150</text>
    ${TL(30, 48, 40)}
    <text x="150" y="40" text-anchor="middle" fill="currentColor" font-size="14" opacity="0.2">99%</text>
    ${TL(130, 48, 40)}
    <text x="50" y="82" text-anchor="middle" fill="currentColor" font-size="14" opacity="0.2">24/7</text>
    ${TL(30, 90, 40)}
    <text x="150" y="82" text-anchor="middle" fill="currentColor" font-size="14" opacity="0.2">50+</text>
    ${TL(130, 90, 40)}
  `,

  // === TEAM ===
  "team-grid": `
    ${RF(15, 12, 45, 40)}${CF(37, 28, 10)}${TL(22, 58, 32)}${TL(25, 65, 25)}
    ${RF(75, 12, 45, 40)}${CF(97, 28, 10)}${TL(82, 58, 32)}${TL(85, 65, 25)}
    ${RF(135, 12, 45, 40)}${CF(157, 28, 10)}${TL(142, 58, 32)}${TL(145, 65, 25)}
  `,
  "team-carousel": `
    <polygon points="5,55 12,50 12,60" fill="currentColor" opacity="0.2"/>
    ${RF(25, 15, 55, 45)}${CF(52, 32, 12)}${TL(32, 68, 38)}${TL(36, 76, 30)}
    ${RF(90, 15, 55, 45)}${CF(117, 32, 12)}${TL(97, 68, 38)}${TL(101, 76, 30)}
    <polygon points="195,55 188,50 188,60" fill="currentColor" opacity="0.2"/>
  `,
  "team-featured": `
    ${RF(12, 15, 75, 90)}${CF(49, 50, 18)}
    ${TL(100, 30, 80)}${TL(100, 40, 60)}
    ${TL(100, 55, 85)}${TL(100, 63, 75)}${TL(100, 71, 80)}
    ${TL(100, 85, 50)}
  `,

  // === MEDIA ===
  "video-embed": `
    ${RF(15, 12, 170, 96)}
    <polygon points="88,48 88,72 108,60" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="0.5"/>
  `,
  "video-modal": `
    ${RF(40, 20, 120, 75)}
    <polygon points="90,48 90,68 106,58" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="0.5"/>
    ${C(155, 25, 5)}
    <line x1="152" y1="22" x2="158" y2="28" stroke="currentColor" stroke-width="0.7" opacity="0.3"/>
    <line x1="158" y1="22" x2="152" y2="28" stroke="currentColor" stroke-width="0.7" opacity="0.3"/>
  `,
  "gallery-grid": `
    ${RF(8, 10, 58, 45)}${RF(72, 10, 58, 45)}${RF(136, 10, 58, 45)}
    ${RF(8, 62, 58, 45)}${RF(72, 62, 58, 45)}${RF(136, 62, 58, 45)}
  `,

  // === MISC ===
  "diagram-interactive": `
    ${RF(70, 15, 60, 25)}${TL(80, 25, 40)}
    <line x1="85" y1="40" x2="50" y2="60" stroke="currentColor" stroke-width="0.7" opacity="0.2"/>
    <line x1="115" y1="40" x2="150" y2="60" stroke="currentColor" stroke-width="0.7" opacity="0.2"/>
    ${RF(20, 60, 55, 22)}${TL(28, 69, 38)}
    ${RF(125, 60, 55, 22)}${TL(133, 69, 38)}
    <line x1="47" y1="82" x2="47" y2="95" stroke="currentColor" stroke-width="0.7" opacity="0.2"/>
    <line x1="152" y1="82" x2="152" y2="95" stroke="currentColor" stroke-width="0.7" opacity="0.2"/>
    ${RF(20, 95, 55, 18)}${TL(28, 102, 38)}
    ${RF(125, 95, 55, 18)}${TL(133, 102, 38)}
  `,
  "comparison-table": `
    ${RF(10, 10, 180, 14)}${TL(60, 15, 40)}${TL(120, 15, 40)}
    ${L(10, 30, 190, 30)}${TL(15, 36, 35)}${TL(60, 36, 30)}${TL(120, 36, 30)}
    ${L(10, 44, 190, 44)}${TL(15, 50, 35)}${TL(60, 50, 30)}${TL(120, 50, 30)}
    ${L(10, 58, 190, 58)}${TL(15, 64, 35)}${TL(60, 64, 30)}${TL(120, 64, 30)}
    ${L(10, 72, 190, 72)}${TL(15, 78, 35)}${TL(60, 78, 30)}${TL(120, 78, 30)}
    ${L(10, 86, 190, 86)}
    <line x1="55" y1="10" x2="55" y2="86" stroke="currentColor" stroke-width="0.5" opacity="0.15"/>
    <line x1="110" y1="10" x2="110" y2="86" stroke="currentColor" stroke-width="0.5" opacity="0.15"/>
  `,
  "badge-display": `
    ${RF(20, 30, 32, 18, 9)}${TL(26, 37, 20)}
    ${RF(60, 30, 32, 18, 9)}${TL(66, 37, 20)}
    ${RF(100, 30, 32, 18, 9)}${TL(106, 37, 20)}
    ${RF(140, 30, 32, 18, 9)}${TL(146, 37, 20)}
    ${RF(40, 58, 32, 18, 9)}${TL(46, 65, 20)}
    ${RF(80, 58, 32, 18, 9)}${TL(86, 65, 20)}
    ${RF(120, 58, 32, 18, 9)}${TL(126, 65, 20)}
  `,
  "filter-grid": `
    ${BTN(12, 10, 30, 10)}${BTN(48, 10, 30, 10)}${BTN(84, 10, 30, 10)}${BTN(120, 10, 30, 10)}
    ${RF(12, 30, 50, 35)}${TL(18, 50, 36)}
    ${RF(70, 30, 50, 35)}${TL(76, 50, 36)}
    ${RF(128, 30, 50, 35)}${TL(134, 50, 36)}
    ${RF(12, 73, 50, 35)}${TL(18, 93, 36)}
    ${RF(70, 73, 50, 35)}${TL(76, 93, 36)}
    ${RF(128, 73, 50, 35)}${TL(134, 93, 36)}
  `,
  "faq-accordion": `
    ${TL(60, 10, 80)}
    ${R(15, 25, 170, 16)}${TL(22, 31, 100)}
    ${R(15, 45, 170, 28)}${TL(22, 51, 100)}
    ${TL(25, 59, 145)}${TL(25, 65, 120)}
    ${R(15, 77, 170, 16)}${TL(22, 83, 110)}
    ${R(15, 97, 170, 16)}${TL(22, 103, 95)}
  `,
};

export function WireframeBlock({
  blockId,
  className = "",
}: {
  blockId: WireframeBlockId;
  className?: string;
}) {
  const svgContent = wireframeSvgs[blockId];
  if (!svgContent) {
    return (
      <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="5" width="190" height="110" rx="4" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
        <text x="100" y="65" textAnchor="middle" fill="currentColor" fontSize="8" opacity="0.3">
          {blockId}
        </text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 200 120"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
