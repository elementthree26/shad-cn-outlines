/**
 * Registry of real shadcnblocks components pulled from
 * https://github.com/shadcnblocks/shadcn-ui-blocks
 *
 * Each entry maps to a .tsx file in src/blocks/
 */

export interface ShadcnBlock {
  /** Block ID matching filename without .tsx */
  id: string;
  /** Exported component name */
  component: string;
  /** Category for browsing */
  category: string;
  /** File path relative to src/blocks/ */
  filename: string;
  /** shadcn/ui components used */
  shadcnComponents: string[];
  /** Number of typed props */
  propCount: number;
  /** Lines of code */
  lineCount: number;
}

export const shadcnBlockRegistry: ShadcnBlock[] = [
  { id: "hero1", component: "Hero1", category: "Hero", filename: "hero1.tsx", shadcnComponents: ["badge", "button"], propCount: 7, lineCount: 90 },
  { id: "hero3", component: "Hero3", category: "Hero", filename: "hero3.tsx", shadcnComponents: ["avatar", "button"], propCount: 6, lineCount: 133 },
  { id: "hero7", component: "Hero7", category: "Hero", filename: "hero7.tsx", shadcnComponents: ["avatar", "button"], propCount: 5, lineCount: 101 },
  { id: "hero45", component: "Hero45", category: "Hero", filename: "hero45.tsx", shadcnComponents: ["badge", "separator"], propCount: 5, lineCount: 94 },
  { id: "hero47", component: "Hero47", category: "Hero", filename: "hero47.tsx", shadcnComponents: ["button"], propCount: 6, lineCount: 93 },
  { id: "hero115", component: "Hero115", category: "Hero", filename: "hero115.tsx", shadcnComponents: ["button"], propCount: 7, lineCount: 79 },
  { id: "feature1", component: "Feature1", category: "Features", filename: "feature1.tsx", shadcnComponents: ["button"], propCount: 7, lineCount: 70 },
  { id: "feature2", component: "Feature2", category: "Features", filename: "feature2.tsx", shadcnComponents: ["button"], propCount: 7, lineCount: 70 },
  { id: "feature13", component: "Feature13", category: "Features", filename: "feature13.tsx", shadcnComponents: [], propCount: 2, lineCount: 105 },
  { id: "feature17", component: "Feature17", category: "Features", filename: "feature17.tsx", shadcnComponents: ["badge", "button"], propCount: 5, lineCount: 112 },
  { id: "feature43", component: "Feature43", category: "Features", filename: "feature43.tsx", shadcnComponents: ["button"], propCount: 4, lineCount: 102 },
  { id: "feature51", component: "Feature51", category: "Features", filename: "feature51.tsx", shadcnComponents: ["tabs"], propCount: 1, lineCount: 109 },
  { id: "feature72", component: "Feature72", category: "Features", filename: "feature72.tsx", shadcnComponents: ["button"], propCount: 5, lineCount: 115 },
  { id: "feature73", component: "Feature73", category: "Features", filename: "feature73.tsx", shadcnComponents: ["button"], propCount: 5, lineCount: 107 },
  { id: "feature166", component: "Feature166", category: "Features", filename: "feature166.tsx", shadcnComponents: [], propCount: 6, lineCount: 105 },
  { id: "feature197", component: "Feature197", category: "Features", filename: "feature197.tsx", shadcnComponents: ["accordion"], propCount: 1, lineCount: 120 },
  { id: "experience5", component: "Experience5", category: "Features", filename: "experience5.tsx", shadcnComponents: [], propCount: 2, lineCount: 97 },
  { id: "integration3", component: "Integration3", category: "Features", filename: "integration3.tsx", shadcnComponents: [], propCount: 0, lineCount: 89 },
  { id: "cta10", component: "Cta10", category: "CTA", filename: "cta10.tsx", shadcnComponents: ["button"], propCount: 6, lineCount: 59 },
  { id: "cta11", component: "Cta11", category: "CTA", filename: "cta11.tsx", shadcnComponents: [], propCount: 6, lineCount: 42 },
  { id: "download2", component: "Download2", category: "CTA", filename: "download2.tsx", shadcnComponents: ["button"], propCount: 9, lineCount: 136 },
  { id: "faq1", component: "Faq1", category: "FAQ", filename: "faq1.tsx", shadcnComponents: ["accordion"], propCount: 2, lineCount: 90 },
  { id: "testimonial10", component: "Testimonial10", category: "Testimonials", filename: "testimonial10.tsx", shadcnComponents: ["avatar"], propCount: 7, lineCount: 52 },
  { id: "team1", component: "Team1", category: "Team", filename: "team1.tsx", shadcnComponents: ["avatar"], propCount: 4, lineCount: 86 },
  { id: "stats8", component: "Stats8", category: "Stats", filename: "stats8.tsx", shadcnComponents: [], propCount: 5, lineCount: 75 },
  { id: "logos8", component: "Logos8", category: "Logos", filename: "logos8.tsx", shadcnComponents: [], propCount: 3, lineCount: 69 },
  { id: "pricing2", component: "Pricing2", category: "Pricing", filename: "pricing2.tsx", shadcnComponents: ["button", "card", "separator", "switch"], propCount: 3, lineCount: 155 },
  { id: "pricing4", component: "Pricing4", category: "Pricing", filename: "pricing4.tsx", shadcnComponents: ["badge", "button", "label", "separator"], propCount: 4, lineCount: 168 },
  { id: "pricing6", component: "Pricing6", category: "Pricing", filename: "pricing6.tsx", shadcnComponents: ["button", "separator"], propCount: 6, lineCount: 73 },
  { id: "contact7", component: "Contact7", category: "Contact", filename: "contact7.tsx", shadcnComponents: [], propCount: 14, lineCount: 98 },
  { id: "footer2", component: "Footer2", category: "Footer", filename: "footer2.tsx", shadcnComponents: [], propCount: 5, lineCount: 133 },
  { id: "navbar1", component: "Navbar1", category: "Navbar", filename: "navbar1.tsx", shadcnComponents: ["accordion", "button", "sheet"], propCount: 5, lineCount: 300 },
  { id: "blog7", component: "Blog7", category: "Blog", filename: "blog7.tsx", shadcnComponents: ["badge", "button", "card"], propCount: 6, lineCount: 142 },
  { id: "blogpost1", component: "Blogpost1", category: "Blog", filename: "blogpost1.tsx", shadcnComponents: ["alert", "avatar"], propCount: 0, lineCount: 154 },
  { id: "careers4", component: "Careers4", category: "Careers", filename: "careers4.tsx", shadcnComponents: ["button"], propCount: 2, lineCount: 106 },
  { id: "about3", component: "About3", category: "About", filename: "about3.tsx", shadcnComponents: ["button"], propCount: 5, lineCount: 171 },
  { id: "gallery6", component: "Gallery6", category: "Gallery", filename: "gallery6.tsx", shadcnComponents: ["button", "carousel"], propCount: 3, lineCount: 186 },
  { id: "timeline9", component: "Timeline9", category: "Timeline", filename: "timeline9.tsx", shadcnComponents: ["card", "separator"], propCount: 0, lineCount: 79 },
  { id: "banner1", component: "Banner1", category: "Banner", filename: "banner1.tsx", shadcnComponents: ["button"], propCount: 5, lineCount: 65 },
  { id: "content1", component: "Content1", category: "Content", filename: "content1.tsx", shadcnComponents: ["alert", "badge"], propCount: 0, lineCount: 286 },
  { id: "compare7", component: "Compare7", category: "Comparison", filename: "compare7.tsx", shadcnComponents: ["table", "tooltip"], propCount: 0, lineCount: 136 },
  { id: "list2", component: "List2", category: "Lists", filename: "list2.tsx", shadcnComponents: ["button", "separator"], propCount: 2, lineCount: 120 },
  { id: "service1", component: "Service1", category: "Services", filename: "service1.tsx", shadcnComponents: [], propCount: 0, lineCount: 104 },
  { id: "services4", component: "Services4", category: "Services", filename: "services4.tsx", shadcnComponents: [], propCount: 0, lineCount: 84 },
  { id: "casestudies2", component: "Casestudies2", category: "Case Studies", filename: "casestudies2.tsx", shadcnComponents: ["separator"], propCount: 0, lineCount: 114 },
  { id: "casestudy8", component: "Casestudy8", category: "Case Studies", filename: "casestudy8.tsx", shadcnComponents: [], propCount: 0, lineCount: 156 },
  { id: "login1", component: "Login1", category: "Auth", filename: "login1.tsx", shadcnComponents: ["button", "input"], propCount: 6, lineCount: 77 },
  { id: "signup1", component: "Signup1", category: "Auth", filename: "signup1.tsx", shadcnComponents: ["button", "input"], propCount: 6, lineCount: 83 },
  { id: "waitlist1", component: "Waitlist1", category: "Auth", filename: "Auth", shadcnComponents: ["avatar", "button", "input"], propCount: 0, lineCount: 47 },
  { id: "changelog1", component: "Changelog1", category: "Changelog", filename: "changelog1.tsx", shadcnComponents: ["badge", "button"], propCount: 4, lineCount: 157 },
  { id: "community1", component: "Community1", category: "Community", filename: "community1.tsx", shadcnComponents: ["button"], propCount: 0, lineCount: 54 },
  { id: "compliance1", component: "Compliance1", category: "Content", filename: "compliance1.tsx", shadcnComponents: ["badge"], propCount: 0, lineCount: 91 },
  { id: "codeexample1", component: "Codeexample1", category: "Content", filename: "codeexample1.tsx", shadcnComponents: ["button", "tabs"], propCount: 0, lineCount: 249 },
  { id: "resource1", component: "Resource1", category: "Content", filename: "resource1.tsx", shadcnComponents: ["button"], propCount: 0, lineCount: 222 },
];

/** Get unique categories with block counts */
export function getBlockCategories(): { category: string; count: number; blocks: ShadcnBlock[] }[] {
  const map = new Map<string, ShadcnBlock[]>();
  for (const block of shadcnBlockRegistry) {
    if (!map.has(block.category)) map.set(block.category, []);
    map.get(block.category)!.push(block);
  }
  // Sort by most common categories first
  const order = ["Hero", "Features", "CTA", "FAQ", "Testimonials", "Team", "Stats", "Logos", "Pricing", "Contact", "Footer", "Navbar", "Blog", "Gallery", "Services", "About", "Careers", "Case Studies", "Timeline", "Banner", "Lists", "Comparison", "Auth", "Content", "Changelog", "Community"];
  return order
    .filter((cat) => map.has(cat))
    .map((cat) => ({ category: cat, count: map.get(cat)!.length, blocks: map.get(cat)! }));
}
