import { PageTemplate } from "../types";

export const servicesPage: PageTemplate = {
  id: "services",
  slug: "services",
  name: "Services / Solutions",
  description:
    "Overview of all services or solutions offered, with pathways to individual service detail pages.",
  icon: "Layers",
  contentThemes: [
    {
      id: "services-hero",
      name: "Services Hero/Introduction",
      frequencyTier: "high",
      componentOptions: [
        { name: "Hero with Image Right", wireframeId: "hero-image-right" },
        { name: "Hero Centered", wireframeId: "hero-centered" },
        { name: "Hero Minimal", wireframeId: "hero-minimal" },
        { name: "Hero Split 50/50", wireframeId: "hero-split" },
      ],
      considerations: [
        "Should this serve as both introduction and navigation?",
        "Is there a unified services message or brand positioning?",
        "Should the hero hint at the breadth of services?",
      ],
      clientDiscoveryQuestions: [
        "Do you have a unifying theme or message across all services?",
        "What should visitors understand about your service approach before diving into specifics?",
        "How do you want to position your services relative to competitors?",
      ],
      informationAndAssets: [
        "Services page headline and introductory copy",
        "Supporting imagery",
        "Overview of service philosophy or approach",
      ],
      industryNotes: [
        "B2B companies often position services as solutions to problems",
        "Manufacturing may frame capabilities rather than traditional services",
        "Service companies should communicate end-to-end offerings",
      ],
    },
    {
      id: "services-grid",
      name: "Services Grid/Listing",
      frequencyTier: "high",
      componentOptions: [
        { name: "Card Grid 3x", wireframeId: "cards-3-col" },
        { name: "Alternating Split Sections", wireframeId: "text-split-image-right" },
        { name: "Tabbed Interface", wireframeId: "tabs-horizontal" },
        { name: "Accordion by Category", wireframeId: "accordion-list" },
        { name: "Icon Grid", wireframeId: "cards-icon-grid" },
      ],
      considerations: [
        "How many services to display?",
        "Should each service link to a dedicated detail page?",
        "Are there natural categories or groupings?",
        "How much detail on the overview page vs. detail pages?",
      ],
      clientDiscoveryQuestions: [
        "How many distinct services or solution areas do you offer?",
        "Should services be grouped by category, audience, or another dimension?",
        "Which services generate the most revenue or strategic interest?",
        "Are there new or emerging services to highlight?",
      ],
      informationAndAssets: [
        "Service names and descriptions (varying lengths)",
        "Icons or imagery for each service",
        "Service categories or groupings",
        "Links to individual service pages",
      ],
      industryNotes: [
        "3-8 services is typical; more than 10 may need categorization",
        "B2B2X often organizes by customer segment",
        "Manufacturing may present as capabilities or processes",
      ],
    },
    {
      id: "services-differentiators",
      name: "Why Choose Us for Services",
      frequencyTier: "medium",
      componentOptions: [
        { name: "Icon Grid 3-Column", wireframeId: "cards-icon-grid" },
        { name: "Stats Bar", wireframeId: "stats-bar" },
        { name: "Testimonial Cards", wireframeId: "testimonials-cards" },
        { name: "Split Text + Image", wireframeId: "text-split-image-right" },
      ],
      considerations: [
        "What makes service delivery unique?",
        "Should differentiators be backed by data or testimonials?",
        "Are there certifications specific to services?",
      ],
      clientDiscoveryQuestions: [
        "What do customers say about your service delivery?",
        "What certifications or credentials support your services?",
        "How does your service approach differ from competitors?",
      ],
      informationAndAssets: [
        "Service differentiators with descriptions",
        "Supporting statistics or metrics",
        "Relevant certifications and credentials",
        "Customer testimonials about service quality",
      ],
      industryNotes: [
        "B2B buyers often evaluate multiple providers — clear differentiators are essential",
        "Manufacturing emphasizes quality metrics, certifications, and reliability",
      ],
    },
    {
      id: "services-process",
      name: "Service Process/How We Work",
      frequencyTier: "medium",
      componentOptions: [
        { name: "Numbered Steps", wireframeId: "numbered-steps" },
        { name: "Timeline Vertical", wireframeId: "timeline-vertical" },
        { name: "Accordion with Details", wireframeId: "accordion-list" },
        { name: "Interactive Diagram", wireframeId: "diagram-interactive" },
      ],
      considerations: [
        "Is the process the same across all services?",
        "How many steps should be shown?",
        "Is the process a key differentiator?",
      ],
      clientDiscoveryQuestions: [
        "Do you have a standard process for delivering services?",
        "What does the customer experience look like start to finish?",
        "Are there distinct phases to your engagement model?",
      ],
      informationAndAssets: [
        "Process steps with descriptions",
        "Timeline or phase durations",
        "Icons or imagery for each step",
      ],
      industryNotes: [
        "Consultative B2B companies benefit from transparent process communication",
        "Showing process builds confidence for first-time buyers",
      ],
    },
    {
      id: "services-cta",
      name: "Services CTA / Next Steps",
      frequencyTier: "high",
      componentOptions: [
        { name: "CTA Full-Width Banner", wireframeId: "cta-full-width" },
        { name: "CTA Split (Two Options)", wireframeId: "cta-split" },
        { name: "CTA with Form", wireframeId: "cta-with-form" },
      ],
      considerations: [
        "Should CTA be service-specific or general?",
        "Is a quote request or consultation the right action?",
        "Should the form pre-select a service of interest?",
      ],
      clientDiscoveryQuestions: [
        "What action do you want visitors to take after reviewing services?",
        "Should visitors be able to request quotes for specific services?",
        "Do you offer free consultations, assessments, or demos?",
      ],
      informationAndAssets: [
        "CTA headline and copy",
        "Form fields if embedded",
        "Phone number for consultations",
      ],
      industryNotes: [
        "B2B service pages should have CTAs early and often",
        "Manufacturing may drive to quote requests with project specifications",
        "Consider mid-page CTAs alongside end-of-page for longer pages",
      ],
    },
  ],
  contentArchitecture: [
    "Hero: Overview of service philosophy and what the company delivers",
    "Services Grid: Clear navigation to all service areas with enough detail to inform",
    "Differentiators: Why choose this company for these services",
    "Process: How engagements work from start to finish",
    "CTA: Clear next step (quote, consultation, or contact)",
  ],
  generalNotes: [
    "The services page often serves as both a content page and a navigation hub.",
    "Balance enough detail to be useful with brevity that encourages clicking through.",
    "If services are closely related, explain how they work together.",
    "Consider audience-based navigation if services apply to different buyer personas.",
  ],
};
