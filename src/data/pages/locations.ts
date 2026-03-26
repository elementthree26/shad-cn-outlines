import { PageTemplate } from "../types";

export const locationsPage: PageTemplate = {
  id: "locations",
  slug: "locations",
  name: "Individual Location Page",
  description:
    "Dedicated page for a single physical location, featuring contact info, services, staff, and local relevance.",
  icon: "MapPin",
  contentThemes: [
    {
      id: "location-hero",
      name: "Location Hero/Header",
      frequencyTier: "high",
      componentOptions: [
        { name: "Hero with Image Right", wireframeId: "hero-image-right" },
        { name: "Map with Sidebar", wireframeId: "map-with-sidebar" },
        { name: "Hero Minimal", wireframeId: "hero-minimal" },
        { name: "Hero Split 50/50", wireframeId: "hero-split" },
      ],
      considerations: [
        "Should the hero feature a photo of the facility or the area?",
        "How prominent should the address and phone number be?",
        "Should a map be embedded in the hero or below it?",
      ],
      clientDiscoveryQuestions: [
        "Do you have professional exterior/interior photos of this location?",
        "What is the most important action a visitor should take?",
        "Are there specific hours of operation for this location?",
      ],
      informationAndAssets: [
        "Facility photos (exterior and interior)",
        "Full address, phone number, email",
        "Hours of operation",
        "Google Maps embed or coordinates",
      ],
      industryNotes: [
        "Service businesses benefit from showing clean, professional facilities",
        "Distribution/warehouse locations may show scale and logistics capability",
        "Retail or customer-facing locations benefit from inviting imagery",
      ],
    },
    {
      id: "location-details",
      name: "Contact & Details",
      frequencyTier: "high",
      componentOptions: [
        { name: "Map with Sidebar", wireframeId: "map-with-sidebar" },
        { name: "Card Grid 3x", wireframeId: "cards-3-col" },
        { name: "Tabs (Contact/Hours/Directions)", wireframeId: "tabs-horizontal" },
        { name: "Form with Info Sidebar", wireframeId: "form-with-info" },
      ],
      considerations: [
        "Should contact form be embedded on this page?",
        "Are there multiple phone numbers (sales, service, parts)?",
        "Should driving directions be included?",
      ],
      clientDiscoveryQuestions: [
        "What are all the ways customers can reach this location?",
        "Are there department-specific phone numbers or emails?",
        "Do you want a contact form specific to this location?",
      ],
      informationAndAssets: [
        "All phone numbers by department",
        "Email addresses and hours by day",
        "Driving directions or landmarks",
        "Parking information",
      ],
      industryNotes: [
        "B2B locations often have complex contact structures (sales vs. service vs. parts)",
        "Click-to-call is essential for mobile-first industries",
      ],
    },
    {
      id: "location-services",
      name: "Location-Specific Services",
      frequencyTier: "high",
      componentOptions: [
        { name: "Card Grid 3x", wireframeId: "cards-3-col" },
        { name: "Icon List", wireframeId: "icon-list" },
        { name: "Tabs by Category", wireframeId: "tabs-horizontal" },
        { name: "Comparison Table", wireframeId: "comparison-table" },
      ],
      considerations: [
        "Do services vary by location?",
        "Should services link to main service pages?",
        "Are there location-exclusive capabilities?",
      ],
      clientDiscoveryQuestions: [
        "Does this location offer the full range of your services?",
        "Are there services unique to this location?",
        "Should we list equipment or capabilities specific to this location?",
      ],
      informationAndAssets: [
        "List of services available at this location",
        "Location-specific capabilities or equipment",
        "Certifications or specializations",
        "Service area coverage",
      ],
      industryNotes: [
        "Manufacturing locations often have different capabilities",
        "Service companies may have different specialties by location",
        "Dealers often highlight brands carried per location",
      ],
    },
    {
      id: "location-team",
      name: "Location Staff/Team",
      frequencyTier: "medium",
      componentOptions: [
        { name: "Team Card Grid", wireframeId: "team-grid" },
        { name: "Team Featured + List", wireframeId: "team-featured" },
        { name: "Icon List", wireframeId: "icon-list" },
      ],
      considerations: [
        "Should all staff be listed or just key contacts?",
        "Are professional headshots available for this location?",
        "How often does staff change?",
      ],
      clientDiscoveryQuestions: [
        "Who are the key contacts at this location?",
        "Should customers be able to reach specific staff members?",
        "Do you have headshots for location staff?",
      ],
      informationAndAssets: [
        "Staff names, titles, and photos",
        "Direct phone numbers and emails (if applicable)",
        "Brief bios for key staff",
      ],
      industryNotes: [
        "Relationship-driven industries benefit from featuring local team members",
        "High-turnover positions may be better represented by role rather than name",
        "Dealer/service locations often feature the GM/manager prominently",
      ],
    },
    {
      id: "location-testimonials",
      name: "Location-Specific Testimonials",
      frequencyTier: "medium",
      componentOptions: [
        { name: "Testimonial Cards", wireframeId: "testimonials-cards" },
        { name: "Testimonial Carousel", wireframeId: "carousel-testimonials" },
        { name: "Video Testimonial", wireframeId: "testimonials-video" },
      ],
      considerations: [
        "Are there reviews or testimonials specific to this location?",
        "Should third-party reviews be embedded?",
      ],
      clientDiscoveryQuestions: [
        "Do you have customer testimonials for this specific location?",
        "Are Google/Yelp reviews available and positive?",
        "Would customers provide video testimonials?",
      ],
      informationAndAssets: [
        "Customer testimonials specific to this location",
        "Google/Yelp review data or screenshots",
        "Customer names, companies, and photos (with permission)",
      ],
      industryNotes: [
        "Local reviews are critical for location SEO",
        "B2B testimonials should include company names when possible",
        "Service industries benefit from specific, outcome-focused reviews",
      ],
    },
    {
      id: "location-service-area",
      name: "Service Area/Coverage Map",
      frequencyTier: "medium",
      componentOptions: [
        { name: "Map Full Width", wireframeId: "map-full" },
        { name: "Map with Cards", wireframeId: "map-with-cards" },
        { name: "Icon List", wireframeId: "icon-list" },
      ],
      considerations: [
        "Is coverage area defined by radius, territory, or zip codes?",
        "Should the map be interactive?",
        "Do coverage areas overlap between locations?",
      ],
      clientDiscoveryQuestions: [
        "What geographic area does this location serve?",
        "Is coverage defined by distance, territory, or another method?",
        "Should we list specific cities, counties, or regions served?",
      ],
      informationAndAssets: [
        "Coverage area boundaries or radius",
        "List of cities/counties/zip codes served",
        "Map data or territory definitions",
      ],
      industryNotes: [
        "Service/repair businesses need clear coverage communication",
        "Distribution companies may define territory by customer assignment",
        "Multi-location businesses must avoid coverage confusion between locations",
      ],
    },
  ],
  contentArchitecture: [
    "Hero: Facility imagery with location name and key details",
    "Contact/Details: Address, phone, hours, map — easily scannable",
    "Services: What this location offers",
    "Team: Key contacts at this location",
    "Testimonials: Local social proof",
    "Service Area: Geographic coverage",
    "CTA: Contact or visit this location",
  ],
  generalNotes: [
    "Location pages are critical for local SEO — include structured data markup.",
    "Consistency across location pages builds trust; unique local details add value.",
    "Mobile optimization is essential — many users search for locations on mobile.",
    "Consider schema.org LocalBusiness markup for each location.",
  ],
};
