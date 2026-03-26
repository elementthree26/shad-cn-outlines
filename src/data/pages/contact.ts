import { PageTemplate } from "../types";

export const contactPage: PageTemplate = {
  id: "contact",
  slug: "contact",
  name: "Contact Us",
  description:
    "Primary contact page with forms, location info, and multiple ways to reach the company.",
  icon: "Mail",
  contentThemes: [
    {
      id: "contact-header",
      name: "Contact Header/Intro",
      frequencyTier: "high",
      componentOptions: [
        { name: "Hero Minimal", wireframeId: "hero-minimal" },
        { name: "Hero Centered", wireframeId: "hero-centered" },
        { name: "Split Text + Quick Contact", wireframeId: "hero-split" },
      ],
      considerations: [
        "Should the intro set expectations for response time?",
        "Are there different contact paths for different needs?",
        "Should phone/email be immediately visible before scrolling?",
      ],
      clientDiscoveryQuestions: [
        "What is your typical response time for inquiries?",
        "Do you want to route inquiries by type (sales, support, general)?",
        "Are there specific hours when someone is available to respond?",
      ],
      informationAndAssets: [
        "Page headline and supporting copy",
        "Response time expectation text",
        "Quick contact info (phone, email)",
      ],
      industryNotes: [
        "B2B companies often segment inquiries by purpose",
        "Setting response time expectations reduces friction",
        "Service companies may need different contact paths for emergencies vs. general",
      ],
    },
    {
      id: "contact-form",
      name: "Contact Form",
      frequencyTier: "high",
      componentOptions: [
        { name: "Simple Form", wireframeId: "form-simple" },
        { name: "Multi-Step Form", wireframeId: "form-multi-step" },
        { name: "Form with Info Sidebar", wireframeId: "form-with-info" },
        { name: "Tabs by Department", wireframeId: "tabs-horizontal" },
      ],
      considerations: [
        "How many fields are necessary?",
        "Should the form route to different teams?",
        "Is a CAPTCHA needed?",
        "What happens after submission?",
      ],
      clientDiscoveryQuestions: [
        "What information do you need from an inquiry to respond effectively?",
        "Who receives form submissions and how?",
        "Do you use a CRM that the form should integrate with?",
        "Do you need file upload capability?",
      ],
      informationAndAssets: [
        "Required form fields",
        "Routing rules (which team gets which inquiries)",
        "CRM or email integration details",
        "Thank you/confirmation messaging",
        "Privacy policy link",
      ],
      industryNotes: [
        "Manufacturing/B2B often needs more fields (company, industry, project details)",
        "Keep forms as short as possible — every field reduces completions",
        "Consider meeting scheduler integration for consultative businesses",
      ],
    },
    {
      id: "contact-info",
      name: "Contact Information & Map",
      frequencyTier: "high",
      componentOptions: [
        { name: "Map with Sidebar", wireframeId: "map-with-sidebar" },
        { name: "Map with Cards", wireframeId: "map-with-cards" },
        { name: "Card Grid 3x", wireframeId: "cards-3-col" },
        { name: "Map Full Width", wireframeId: "map-full" },
      ],
      considerations: [
        "Single location or multiple locations?",
        "Should a map be included?",
        "Are there department-specific contact numbers?",
      ],
      clientDiscoveryQuestions: [
        "How many locations need contact info displayed?",
        "Do different departments have different phone numbers?",
        "What social media profiles should be linked?",
      ],
      informationAndAssets: [
        "Full address(es)",
        "Phone numbers by department",
        "Email addresses and hours",
        "Social media URLs",
        "Map embed code or coordinates",
      ],
      industryNotes: [
        "Multi-location businesses need clear location selection",
        "Include schema.org markup for contact information",
      ],
    },
    {
      id: "faq-section",
      name: "FAQ / Common Questions",
      frequencyTier: "medium",
      componentOptions: [
        { name: "FAQ Accordion", wireframeId: "faq-accordion" },
        { name: "Tabs by Category", wireframeId: "tabs-horizontal" },
        { name: "Icon List", wireframeId: "icon-list" },
      ],
      considerations: [
        "What are the most common inquiries received?",
        "Should FAQs be categorized?",
        "How many FAQs should be included?",
      ],
      clientDiscoveryQuestions: [
        "What questions does your team get asked most frequently?",
        "Are there questions that could be answered on the site to reduce inquiries?",
        "Do you have an existing FAQ document or knowledge base?",
      ],
      informationAndAssets: [
        "List of frequently asked questions and answers",
        "Question categories (if organizing by topic)",
        "Links to relevant pages or resources",
      ],
      industryNotes: [
        "FAQ schema markup can improve SEO and generate rich snippets",
        "B2B FAQs often address pricing, timeline, and process questions",
      ],
    },
  ],
  contentArchitecture: [
    "Header: Clear purpose and expectation setting",
    "Contact Form: Primary conversion mechanism",
    "Contact Details: Phone, email, address, map",
    "FAQ: Reduce friction and answer common questions",
    "CTA: Reinforce the action if they scrolled past the form",
  ],
  generalNotes: [
    "The contact page is often a high-intent page — visitors here are ready to engage.",
    "Keep forms short — ask only what's needed to start the conversation.",
    "Include multiple contact methods to accommodate different preferences.",
    "Mobile optimization is critical — click-to-call, auto-fill forms.",
  ],
};
