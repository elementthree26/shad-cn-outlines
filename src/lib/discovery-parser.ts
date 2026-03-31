/**
 * Parses discovery notes into structured sections that map to deck slides.
 * Handles common heading patterns from meeting transcripts, briefs, and notes.
 */

import {
  DeckSlide,
  createDeckSlide,
  CompetitiveAnalysisData,
  SiteBaselinesData,
  ContentRecommendationsData,
  CustomBulletsData,
  CustomTwoColumnData,
} from "./deck-types";

export interface ParsedSection {
  heading: string;
  content: string;
  bullets: string[];
  subSections: { heading: string; content: string; bullets: string[] }[];
}

/** Split raw notes into sections by headings */
export function parseDiscoveryNotes(raw: string): ParsedSection[] {
  if (!raw.trim()) return [];

  const lines = raw.split("\n");
  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection | null = null;
  let currentSubSection: { heading: string; content: string; bullets: string[] } | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === "---" || trimmed === "—") continue;

    // Detect main headings: ALL CAPS, or "## Heading", or "HEADING:" pattern
    const isMainHeading =
      (/^#{1,2}\s+/.test(trimmed)) ||
      (/^[A-Z][A-Z\s&/,()]+$/.test(trimmed) && trimmed.length > 3 && trimmed.length < 80) ||
      (/^[A-Z][A-Z\s&/,()]+:$/.test(trimmed));

    // Detect sub-headings: "### Sub", "Sub Heading:", "**Bold**" patterns
    const isSubHeading =
      (/^#{3,}\s+/.test(trimmed)) ||
      (/^[A-Z][a-zA-Z\s&/,()]+:$/.test(trimmed) && trimmed.length < 60) ||
      (/^\*\*[^*]+\*\*$/.test(trimmed));

    // Detect bullet points
    const isBullet = /^[-•*]\s+/.test(trimmed) || /^\d+[\.)]\s+/.test(trimmed);

    if (isMainHeading) {
      // Save current sub-section
      if (currentSubSection && currentSection) {
        currentSection.subSections.push(currentSubSection);
        currentSubSection = null;
      }
      // Start new main section
      const heading = trimmed
        .replace(/^#{1,3}\s+/, "")
        .replace(/:$/, "")
        .replace(/\*\*/g, "");
      currentSection = { heading, content: "", bullets: [], subSections: [] };
      sections.push(currentSection);
    } else if (isSubHeading && currentSection) {
      // Save previous sub-section
      if (currentSubSection) {
        currentSection.subSections.push(currentSubSection);
      }
      const heading = trimmed
        .replace(/^#{1,3}\s+/, "")
        .replace(/:$/, "")
        .replace(/\*\*/g, "");
      currentSubSection = { heading, content: "", bullets: [] };
    } else if (isBullet) {
      const text = trimmed.replace(/^[-•*]\s+/, "").replace(/^\d+[\.)]\s+/, "");
      if (currentSubSection) {
        currentSubSection.bullets.push(text);
      } else if (currentSection) {
        currentSection.bullets.push(text);
      }
    } else {
      // Regular content line
      if (currentSubSection) {
        currentSubSection.content += (currentSubSection.content ? " " : "") + trimmed;
      } else if (currentSection) {
        currentSection.content += (currentSection.content ? " " : "") + trimmed;
      } else {
        // Content before any heading — create an intro section
        currentSection = { heading: "Overview", content: trimmed, bullets: [], subSections: [] };
        sections.push(currentSection);
      }
    }
  }

  // Save final sub-section
  if (currentSubSection && currentSection) {
    currentSection.subSections.push(currentSubSection);
  }

  return sections;
}

/** Map section headings to slide types */
interface SlideMapping {
  pattern: RegExp;
  slideType: "bullets" | "two-column" | "competitive" | "skip-auto";
  /** If "skip-auto", this data will be extracted to project fields instead */
  projectField?: string;
}

const slideMappings: SlideMapping[] = [
  { pattern: /company\s*overview|about\s*(the|us)|background/i, slideType: "bullets" },
  { pattern: /brand\s*position|positioning|tagline|mission|brand\s*identity/i, slideType: "bullets" },
  { pattern: /target\s*audience|audience|customer\s*segments|personas/i, slideType: "bullets" },
  { pattern: /competitor|competitive\s*analysis|competitive\s*landscape/i, slideType: "competitive" },
  { pattern: /content\s*(strategy|plan|inventory|migration|audit)/i, slideType: "two-column" },
  { pattern: /technical|technology|platform|integrations|tech\s*stack/i, slideType: "bullets" },
  { pattern: /seo|search\s*engine|keyword|organic|rankings/i, slideType: "bullets" },
  { pattern: /conversion|cro|user\s*experience|ux|friction/i, slideType: "bullets" },
  { pattern: /sitemap|site\s*structure|information\s*architecture|navigation/i, slideType: "bullets" },
  { pattern: /goals|objectives|kpi|success\s*metrics/i, slideType: "bullets" },
  { pattern: /design|visual|style|creative\s*direction/i, slideType: "bullets" },
  { pattern: /timeline|phases|process|scope|deliverables/i, slideType: "bullets" },
  { pattern: /features|functionality|requirements|recommendations/i, slideType: "two-column" },
  { pattern: /usability|navigation|site\s*review|current\s*site/i, slideType: "bullets" },
  { pattern: /analytics|traffic|performance|speed|metrics/i, slideType: "bullets" },
];

function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Generate deck slides from parsed sections */
export function generateDeckSlidesFromDiscovery(raw: string): DeckSlide[] {
  const sections = parseDiscoveryNotes(raw);
  const slides: DeckSlide[] = [];

  for (const section of sections) {
    const title = titleCase(section.heading);

    // Determine the best slide type
    const mapping = slideMappings.find((m) => m.pattern.test(section.heading));

    if (section.subSections.length >= 2) {
      // Multiple sub-sections → two-column or multi-section slide
      if (section.subSections.length === 2) {
        const slide = createDeckSlide("custom-two-column", title, slides.length);
        const d = slide.data as CustomTwoColumnData;
        d.leftTitle = section.subSections[0].heading;
        d.leftItems = section.subSections[0].bullets.length > 0
          ? section.subSections[0].bullets
          : section.subSections[0].content ? [section.subSections[0].content] : [""];
        d.rightTitle = section.subSections[1].heading;
        d.rightItems = section.subSections[1].bullets.length > 0
          ? section.subSections[1].bullets
          : section.subSections[1].content ? [section.subSections[1].content] : [""];
        slides.push(slide);
      } else {
        // 3+ sub-sections → one bullet slide per sub-section pair
        for (let i = 0; i < section.subSections.length; i += 2) {
          if (i + 1 < section.subSections.length) {
            const slide = createDeckSlide("custom-two-column", title, slides.length);
            const d = slide.data as CustomTwoColumnData;
            d.leftTitle = section.subSections[i].heading;
            d.leftItems = section.subSections[i].bullets.length > 0
              ? section.subSections[i].bullets
              : [section.subSections[i].content || ""];
            d.rightTitle = section.subSections[i + 1].heading;
            d.rightItems = section.subSections[i + 1].bullets.length > 0
              ? section.subSections[i + 1].bullets
              : [section.subSections[i + 1].content || ""];
            slides.push(slide);
          } else {
            // Odd sub-section — bullet slide
            const slide = createDeckSlide("custom-bullets", `${title}: ${section.subSections[i].heading}`, slides.length);
            const d = slide.data as CustomBulletsData;
            d.subtitle = section.subSections[i].content;
            d.items = section.subSections[i].bullets.length > 0
              ? section.subSections[i].bullets
              : [section.subSections[i].content || ""];
            slides.push(slide);
          }
        }
      }
    } else if (mapping?.slideType === "competitive" || section.heading.toLowerCase().includes("competitor")) {
      // Competitive analysis — try to extract columns
      const slide = createDeckSlide("competitive-analysis", title, slides.length);
      const d = slide.data as CompetitiveAnalysisData;
      if (section.subSections.length > 0) {
        d.columns = section.subSections.map((sub) => ({
          name: sub.heading,
          isClient: false,
          items: sub.bullets.length > 0 ? sub.bullets : sub.content ? [sub.content] : [""],
        }));
      } else if (section.bullets.length > 0) {
        // Single list of competitors — one column with all bullets
        d.columns = [{ name: title, isClient: false, items: section.bullets }];
      }
      slides.push(slide);
    } else if (mapping?.slideType === "two-column" && section.bullets.length > 4) {
      // Long bullet list → split into two columns
      const mid = Math.ceil(section.bullets.length / 2);
      const slide = createDeckSlide("custom-two-column", title, slides.length);
      const d = slide.data as CustomTwoColumnData;
      d.leftTitle = "Key Points";
      d.leftItems = section.bullets.slice(0, mid);
      d.rightTitle = "Additional Details";
      d.rightItems = section.bullets.slice(mid);
      if (section.content) d.leftTitle = "";
      slides.push(slide);
    } else {
      // Default: bullet slide
      const slide = createDeckSlide("custom-bullets", title, slides.length);
      const d = slide.data as CustomBulletsData;
      d.subtitle = section.content;

      // Combine bullets from sub-sections if any
      const allBullets = [
        ...section.bullets,
        ...section.subSections.flatMap((sub) => {
          const label = sub.heading ? `${sub.heading}: ` : "";
          if (sub.bullets.length > 0) return sub.bullets.map((b) => `${label}${b}`);
          if (sub.content) return [`${label}${sub.content}`];
          return [];
        }),
      ];

      // If no bullets but there's content, split content into points
      if (allBullets.length === 0 && section.content) {
        // Split long paragraphs by sentences
        const sentences = section.content.split(/(?<=[.!?])\s+/).filter((s) => s.length > 10);
        d.items = sentences.length > 1 ? sentences : [section.content];
      } else {
        d.items = allBullets.length > 0 ? allBullets : [""];
      }

      slides.push(slide);
    }
  }

  return slides;
}
