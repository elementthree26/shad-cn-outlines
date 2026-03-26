import { PageTemplate } from "../types";

export const homePage: PageTemplate = {
  id: "home",
  slug: "home",
  name: "Homepage",
  description:
    "The primary landing page that establishes brand identity, communicates value proposition, and guides visitors to key areas of the site.",
  icon: "Home",
  contentThemes: [
    {
      id: "homepage-hero",
      name: "Hero Section",
      frequencyTier: "high",
      componentOptions: [
        { name: "Hero with Image Right", wireframeId: "hero-image-right" },
        { name: "Hero Centered", wireframeId: "hero-centered" },
        { name: "Hero Split 50/50", wireframeId: "hero-split" },
        { name: "Hero Video Background", wireframeId: "hero-video-bg" },
        { name: "Hero Minimal", wireframeId: "hero-minimal" },
      ],
      considerations: [
        "Single message vs. rotating content?",
        "Background image, video, or illustration?",
        "Primary and secondary CTA placement?",
        "Does the hero need to serve multiple audiences?",
        "Mobile-first hero design (stacked vs. cropped)?",
      ],
      clientDiscoveryQuestions: [
        "What is the single most important message for first-time visitors?",
        "Do you have professional photography or video for the hero?",
        "What action should visitors take first?",
        "Do you serve multiple audiences that need different entry points?",
      ],
      informationAndAssets: [
        "Hero headline(s) and supporting copy",
        "High-resolution hero image or video",
        "Primary and secondary CTA text and destinations",
      ],
      industryNotes: [
        "B2B companies often split-test hero messages for different buyer personas",
        "Manufacturing may showcase products, facilities, or processes",
        "Service companies benefit from people-first imagery",
      ],
    },
    {
      id: "value-proposition",
      name: "Value Proposition/Intro",
      frequencyTier: "high",
      componentOptions: [
        { name: "Full-Width Text", wireframeId: "text-full-width" },
        { name: "Icon Grid 3-Column", wireframeId: "cards-icon-grid" },
        { name: "Stats Bar", wireframeId: "stats-bar" },
        { name: "Split Text + Image", wireframeId: "text-split-image-right" },
      ],
      considerations: [
        "How quickly should the value prop be communicated?",
        "Should this include quantifiable proof points?",
        "Should key statistics be featured?",
      ],
      clientDiscoveryQuestions: [
        "How would you describe what you do in one sentence?",
        "What are 3-4 key facts that build credibility?",
        "What makes you the obvious choice over competitors?",
        "Are there numbers or statistics that demonstrate your impact?",
      ],
      informationAndAssets: [
        "Value proposition statement",
        "Key statistics or proof points",
        "Supporting icons or imagery",
      ],
      industryNotes: [
        "B2B companies often lead with years of experience and customer count",
        "Manufacturing highlights quality metrics and certifications",
        "Service companies emphasize responsiveness and customer satisfaction rates",
      ],
    },
    {
      id: "services-overview",
      name: "Services/Products Overview",
      frequencyTier: "high",
      componentOptions: [
        { name: "Card Grid 3x", wireframeId: "cards-3-col" },
        { name: "Icon List", wireframeId: "icon-list" },
        { name: "Tabbed Interface", wireframeId: "tabs-horizontal" },
        { name: "Image Cards", wireframeId: "cards-image-cards" },
      ],
      considerations: [
        "How many services to feature on the homepage?",
        "Should this be a quick overview or include detail?",
        "Should cards link to individual service pages?",
        "Is there a natural hierarchy or featured service?",
      ],
      clientDiscoveryQuestions: [
        "Which services/products are most important to feature on the homepage?",
        "How many distinct offerings should be highlighted?",
        "Are certain services seasonal or time-sensitive?",
        "Do you want to drive visitors to specific service pages?",
      ],
      informationAndAssets: [
        "Service/product names and short descriptions",
        "Icons or images for each service",
        "Links to detailed service pages",
      ],
      industryNotes: [
        "B2B2X companies may organize by audience rather than service",
        "Keep descriptions brief — homepage is for navigation, not deep content",
        "3-6 services is the typical sweet spot for homepage display",
      ],
    },
    {
      id: "social-proof",
      name: "Social Proof/Testimonials",
      frequencyTier: "high",
      componentOptions: [
        { name: "Testimonial Carousel", wireframeId: "carousel-testimonials" },
        { name: "Logo Bar", wireframeId: "logos-marquee" },
        { name: "Testimonial Cards", wireframeId: "testimonials-cards" },
        { name: "Video Testimonial", wireframeId: "testimonials-video" },
        { name: "Logo Grid", wireframeId: "logos-grid" },
      ],
      considerations: [
        "Logos only, quotes only, or both?",
        "How many testimonials to include?",
        "Should testimonials rotate or be static?",
        "Are case study links appropriate here?",
      ],
      clientDiscoveryQuestions: [
        "Do you have customer testimonials we can feature?",
        "Can we use customer/partner logos on the homepage?",
        "Are there case studies or success stories to link to?",
        "Are video testimonials available?",
      ],
      informationAndAssets: [
        "Customer testimonials with attribution",
        "Client logos (with permission)",
        "Case study summaries and links",
        "Video testimonials (if available)",
      ],
      industryNotes: [
        "B2B homepage testimonials should include company name and title",
        "Logo bars build instant credibility for newer companies",
        "Manufacturing can include industry certifications alongside testimonials",
      ],
    },
    {
      id: "cta-section",
      name: "Call-to-Action Section",
      frequencyTier: "high",
      componentOptions: [
        { name: "CTA Full-Width Banner", wireframeId: "cta-full-width" },
        { name: "CTA Split (Two Options)", wireframeId: "cta-split" },
        { name: "CTA with Form", wireframeId: "cta-with-form" },
      ],
      considerations: [
        "What is the primary conversion action?",
        "Should there be multiple CTAs for different audiences?",
        "Should the CTA include a form or link to a form page?",
      ],
      clientDiscoveryQuestions: [
        "What is the most valuable action a visitor can take?",
        "Is there a secondary action for visitors not ready to commit?",
        "Do you prefer contact forms, phone calls, or scheduled meetings?",
      ],
      informationAndAssets: [
        "CTA headline and supporting copy",
        "Form fields (if embedding a form)",
        "Destination URLs",
        "Phone number for click-to-call",
      ],
      industryNotes: [
        "B2B typically drives to contact forms or consultation requests",
        "Companies with complex products may offer guided navigation",
        "Service businesses often feature phone number prominently alongside form",
      ],
    },
    {
      id: "news-updates",
      name: "News/Blog/Updates",
      frequencyTier: "medium",
      componentOptions: [
        { name: "Card Grid 3x", wireframeId: "cards-3-col" },
        { name: "Card Grid 2-Column", wireframeId: "cards-2-col" },
        { name: "Carousel Cards", wireframeId: "carousel-cards" },
      ],
      considerations: [
        "Is there an active blog or news section?",
        "How frequently is content published?",
        "Should this be auto-populated from CMS?",
      ],
      clientDiscoveryQuestions: [
        "Do you have a blog or news section?",
        "How often is new content published?",
        "What types of content are published?",
      ],
      informationAndAssets: [
        "Recent blog posts or news articles",
        "Featured image for each post",
        "CMS integration details",
      ],
      industryNotes: [
        "Active blogs signal industry expertise and help with SEO",
        "Only include if content will be regularly updated — stale news is worse than none",
        "B2B companies may feature industry insights or thought leadership",
      ],
    },
  ],
  contentArchitecture: [
    "Hero: Immediate value proposition and primary CTA",
    "Value Prop: Why this company, supported by proof points",
    "Services: Quick overview of what they offer, linking deeper",
    "Social Proof: Testimonials, logos, and case studies building trust",
    "News/Blog: Fresh content demonstrating activity and expertise",
    "Final CTA: Clear next step for the visitor",
  ],
  generalNotes: [
    "The homepage should function as a hub, guiding visitors to deeper content.",
    "Page load speed is especially critical for the homepage.",
    "Above-the-fold content should include the value proposition and primary CTA.",
    "Keep the homepage focused — resist the urge to include everything.",
  ],
};
