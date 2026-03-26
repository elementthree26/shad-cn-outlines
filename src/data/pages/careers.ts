import { PageTemplate } from "../types";

export const careersPage: PageTemplate = {
  id: "careers",
  slug: "careers",
  name: "Careers",
  description:
    "Recruitment-focused page showcasing company culture, open positions, benefits, and reasons to join the team.",
  icon: "Briefcase",
  contentThemes: [
    {
      id: "careers-hero",
      name: "Careers Hero/Recruitment Message",
      frequencyTier: "high",
      componentOptions: [
        { name: "Hero with Image Right", wireframeId: "hero-image-right" },
        { name: "Hero Centered", wireframeId: "hero-centered" },
        { name: "Hero Video Background", wireframeId: "hero-video-bg" },
      ],
      considerations: [
        "Should this feel corporate or casual/authentic?",
        "Is the primary goal to drive applications or build employer brand?",
        "Should open position count be displayed prominently?",
      ],
      clientDiscoveryQuestions: [
        "What is your biggest hiring challenge right now?",
        "How would you describe your company culture in one sentence?",
        "Do you have team photos or recruitment video content?",
        "What do current employees say they love about working here?",
      ],
      informationAndAssets: [
        "Recruitment headline and supporting copy",
        "Team or workplace photos/video",
        "CTA text and link to application system",
      ],
      industryNotes: [
        "Manufacturing/trades companies often emphasize stability and career growth",
        "Tech/service companies may highlight innovation and flexibility",
        "Companies with high turnover should emphasize retention and growth stories",
      ],
    },
    {
      id: "culture-values",
      name: "Culture & Values",
      frequencyTier: "high",
      componentOptions: [
        { name: "Icon Grid 3-Column", wireframeId: "cards-icon-grid" },
        { name: "Photo Gallery", wireframeId: "gallery-grid" },
        { name: "Alternating Split Sections", wireframeId: "text-split-image-right" },
        { name: "Video Embed", wireframeId: "video-embed" },
      ],
      considerations: [
        "Are culture values formalized or more informal?",
        "Should employee quotes be featured alongside values?",
        "How many values should be highlighted?",
      ],
      clientDiscoveryQuestions: [
        "What are your core company values?",
        "How would current employees describe the work environment?",
        "Do you have employee testimonials or quotes to include?",
        "What team activities or perks define your culture?",
      ],
      informationAndAssets: [
        "List of company values with descriptions",
        "Employee testimonials or quotes",
        "Workplace and team event photos",
      ],
      industryNotes: [
        "Warehouse/manufacturing should show clean, modern, safe work environments",
        "B2B companies may highlight professional development and training programs",
        "Family businesses can emphasize close-knit, supportive environments",
      ],
    },
    {
      id: "benefits-perks",
      name: "Benefits & Perks",
      frequencyTier: "high",
      componentOptions: [
        { name: "Icon Grid 3-Column", wireframeId: "cards-icon-grid" },
        { name: "Feature Cards", wireframeId: "cards-3-col" },
        { name: "Tabs by Category", wireframeId: "tabs-horizontal" },
        { name: "Comparison Table", wireframeId: "comparison-table" },
      ],
      considerations: [
        "How many benefits to highlight?",
        "Should this be comprehensive or just top highlights?",
        "Are benefits the same across all roles/levels?",
      ],
      clientDiscoveryQuestions: [
        "What are your top 5 most competitive benefits?",
        "Do benefits differ by role type (hourly vs. salaried)?",
        "Are there unique perks that set you apart?",
        "Do you offer professional development or education benefits?",
      ],
      informationAndAssets: [
        "Complete benefits list organized by category",
        "Specific details for standout benefits",
        "Icons or imagery for benefit categories",
      ],
      industryNotes: [
        "Manufacturing often highlights safety programs, overtime opportunity, and apprenticeships",
        "B2B service companies emphasize professional development and career pathing",
        "Companies competing for talent should lead with most distinctive benefits",
      ],
    },
    {
      id: "open-positions",
      name: "Open Positions/Job Listings",
      frequencyTier: "high",
      componentOptions: [
        { name: "Filterable Grid", wireframeId: "filter-grid" },
        { name: "Accordion by Department", wireframeId: "accordion-list" },
        { name: "Card Grid", wireframeId: "cards-3-col" },
        { name: "Icon List", wireframeId: "icon-list" },
      ],
      considerations: [
        "Should jobs be managed in a CMS or pulled from an ATS?",
        "How many positions are typically open at once?",
        "Should filtering/search be available?",
        "Should this link to an external ATS or stay on-site?",
      ],
      clientDiscoveryQuestions: [
        "What applicant tracking system (ATS) do you use, if any?",
        "How frequently do positions change?",
        "How many departments typically have openings?",
        "Should visitors be able to submit a general application if no role fits?",
      ],
      informationAndAssets: [
        "Current open positions with descriptions",
        "ATS integration details or embed code",
        "Department/team structure",
        "General application form (if applicable)",
      ],
      industryNotes: [
        "High-volume employers need robust filtering and clear application flow",
        "Smaller companies may benefit from fewer but more descriptive listings",
        "ATS integration quality varies — test thoroughly on mobile",
      ],
    },
    {
      id: "employee-testimonials",
      name: "Employee Testimonials/Stories",
      frequencyTier: "medium",
      componentOptions: [
        { name: "Testimonial Carousel", wireframeId: "carousel-testimonials" },
        { name: "Video Testimonials", wireframeId: "testimonials-video" },
        { name: "Testimonial Cards", wireframeId: "testimonials-cards" },
        { name: "Split Text + Image", wireframeId: "text-split-image-right" },
      ],
      considerations: [
        "How many employees should be featured?",
        "Should testimonials include video or just text/photo?",
        "Should employees represent different departments/roles?",
      ],
      clientDiscoveryQuestions: [
        "Do you have employees willing to be featured?",
        "Are there specific career growth stories worth highlighting?",
        "Can we schedule employee interviews or use existing content?",
      ],
      informationAndAssets: [
        "Employee names, titles, and photos",
        "Written testimonials or interview transcripts",
        "Video testimonials (if available)",
      ],
      industryNotes: [
        "Long-tenure employees in manufacturing/trades demonstrate stability",
        "Career progression stories are powerful for companies promoting from within",
        "Diverse representation in testimonials broadens appeal",
      ],
    },
    {
      id: "career-growth",
      name: "Career Growth & Development",
      frequencyTier: "medium",
      componentOptions: [
        { name: "Numbered Steps", wireframeId: "numbered-steps" },
        { name: "Icon List", wireframeId: "icon-list" },
        { name: "Stats Bar", wireframeId: "stats-bar" },
        { name: "Split Text + Image", wireframeId: "text-split-image-right" },
      ],
      considerations: [
        "Are there formal training programs or mentorship opportunities?",
        "Should career paths be visualized?",
        "Should growth metrics be highlighted?",
      ],
      clientDiscoveryQuestions: [
        "Do you have formal training or onboarding programs?",
        "What percentage of leadership was promoted from within?",
        "Do you offer tuition reimbursement or certification support?",
      ],
      informationAndAssets: [
        "Training program details",
        "Career path examples or diagrams",
        "Growth statistics (internal promotion rates, etc.)",
      ],
      industryNotes: [
        "Trades and manufacturing highlight apprenticeships and skill development",
        "Companies struggling to hire should emphasize growth and advancement",
        "Internal promotion statistics are powerful trust signals",
      ],
    },
    {
      id: "dei-section",
      name: "Diversity, Equity & Inclusion",
      frequencyTier: "low",
      componentOptions: [
        { name: "Full-Width Text", wireframeId: "text-full-width" },
        { name: "Icon Grid 3-Column", wireframeId: "cards-icon-grid" },
        { name: "Stats Grid", wireframeId: "stats-grid" },
      ],
      considerations: [
        "Does the company have formal DEI commitments or programs?",
        "Should specific goals or metrics be shared?",
        "How authentic and specific can this content be?",
      ],
      clientDiscoveryQuestions: [
        "Do you have a formal DEI statement or program?",
        "Are there employee resource groups or affinity groups?",
        "What specific initiatives support diversity in your workplace?",
      ],
      informationAndAssets: [
        "DEI statement or commitment",
        "Initiative descriptions",
        "Related photos or media",
      ],
      industryNotes: [
        "Expectations for DEI content vary significantly by industry and region",
        "Authenticity is critical — vague statements can backfire",
        "Consider audience expectations and company readiness",
      ],
    },
  ],
  contentArchitecture: [
    "Hero: Compelling recruitment message that communicates employer brand",
    "Culture & Values: What's it like to work here?",
    "Benefits & Perks: Tangible reasons to join",
    "Growth: Career development and advancement opportunities",
    "Testimonials: Real employee voices and stories",
    "Open Positions: Easy-to-browse current openings",
    "CTA: Clear next step to apply or connect",
  ],
  generalNotes: [
    "The careers page is often the second most visited page after the homepage for companies actively hiring.",
    "Mobile experience is critical — many job seekers browse on phones.",
    "ATS integration quality directly impacts application completion rates.",
    "Balance aspirational employer brand with authentic representation.",
  ],
};
