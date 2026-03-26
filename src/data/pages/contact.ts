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
        { name: "Simple Heading Text", wireframeId: "hero-minimal-text" },
        { name: "Hero Contact Imagery", wireframeId: "hero-fullwidth-image" },
        { name: "Split Intro + Quick Contact", wireframeId: "hero-split" },
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
        "Service companies may need different contact paths for emergencies vs. general inquiries",
      ],
    },
    {
      id: "contact-form",
      name: "Contact Form",
      frequencyTier: "high",
      componentOptions: [
        { name: "Form Simple Contact", wireframeId: "form-simple" },
        { name: "Form Multi-Step Routing", wireframeId: "form-multi-step" },
        { name: "Form Tabbed Departments", wireframeId: "form-tabbed" },
        { name: "Form Quote Request", wireframeId: "form-quote-request" },
        { name: "Meeting Scheduler", wireframeId: "form-scheduler" },
      ],
      considerations: [
        "How many fields are necessary?",
        "Should the form route to different teams based on inquiry type?",
        "Is a CAPTCHA needed?",
        "Should file upload be available?",
        "What happens after submission? (thank you message, redirect, email confirmation)",
      ],
      clientDiscoveryQuestions: [
        "What information do you need from an inquiry to respond effectively?",
        "Who receives form submissions and how?",
        "Do you use a CRM that the form should integrate with?",
        "Should different inquiry types go to different teams?",
        "Do you need file upload capability (RFQs, specifications)?",
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
        "Consider Calendly/HubSpot meeting scheduler for consultative businesses",
      ],
    },
    {
      id: "contact-info",
      name: "Contact Information & Map",
      frequencyTier: "high",
      componentOptions: [
        { name: "Map + Contact Overlay", wireframeId: "map-contact-overlay" },
        { name: "Multi-Location Map Pins", wireframeId: "map-multi-pin" },
        { name: "Contact Info Grid", wireframeId: "contact-grid" },
        { name: "Interactive Map Locations", wireframeId: "map-interactive" },
      ],
      considerations: [
        "Single location or multiple locations?",
        "Should a map be included?",
        "Are there department-specific contact numbers?",
        "Should social media links be included?",
      ],
      clientDiscoveryQuestions: [
        "How many locations need contact info displayed?",
        "Do different departments have different phone numbers?",
        "What social media profiles should be linked?",
        "Do you have a general inquiry email and department-specific emails?",
      ],
      informationAndAssets: [
        "Full address(es)",
        "Phone numbers by department",
        "Email addresses",
        "Hours of operation",
        "Social media URLs",
        "Map embed code or coordinates",
      ],
      industryNotes: [
        "Multi-location businesses need clear location selection",
        "B2B companies may need department-specific contact routing",
        "Include schema.org markup for contact information",
      ],
    },
    {
      id: "faq-section",
      name: "FAQ / Common Questions",
      frequencyTier: "medium",
      componentOptions: [
        { name: "FAQ Accordion", wireframeId: "accordion-simple" },
        { name: "FAQ Categorized Tabs", wireframeId: "accordion-categorized" },
        { name: "FAQ Searchable", wireframeId: "faq-searchable" },
        { name: "FAQ Simple List", wireframeId: "list-simple" },
      ],
      considerations: [
        "What are the most common inquiries received?",
        "Should FAQs be categorized?",
        "How many FAQs should be included?",
        "Should FAQs link to deeper content?",
      ],
      clientDiscoveryQuestions: [
        "What questions does your team get asked most frequently?",
        "Are there questions that could be answered on the site to reduce inquiries?",
        "Do you have an existing FAQ document or knowledge base?",
        "Should FAQs cover pre-sales, support, or both?",
      ],
      informationAndAssets: [
        "List of frequently asked questions and answers",
        "Question categories (if organizing by topic)",
        "Links to relevant pages or resources",
      ],
      industryNotes: [
        "FAQ schema markup can improve SEO and generate rich snippets",
        "B2B FAQs often address pricing, timeline, and process questions",
        "Service companies benefit from setting expectations in FAQ format",
      ],
    },
  ],
  contentArchitecture: [
    "Header: Clear purpose and expectation setting",
    "Contact Form: Primary conversion mechanism",
    "Contact Details: Phone, email, address, map for those who prefer direct contact",
    "FAQ: Reduce friction and answer common questions",
    "CTA: Reinforce the action if they scrolled past the form",
  ],
  generalNotes: [
    "The contact page is often a high-intent page — visitors here are ready to engage.",
    "Keep forms short — ask only what's needed to start the conversation.",
    "Include multiple contact methods (form, phone, email) to accommodate different preferences.",
    "Mobile optimization is critical for contact pages — click-to-call, auto-fill forms.",
    "Consider adding a privacy policy link near the form for trust.",
  ],
};
