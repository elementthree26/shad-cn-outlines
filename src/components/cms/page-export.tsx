"use client";

import { useState } from "react";
import { Code, FileText, Copy, Check, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Project,
  SitemapPage,
  PageSection,
  SectionContent,
  ContentItem,
} from "@/lib/project-types";
import { wireframeBlockMeta } from "@/components/wireframe-blocks";

// ============================================================
// CODE EXPORT — shadcnblocks-pattern component generation
// ============================================================

function esc(str: string): string {
  return str.replace(/`/g, "\\`").replace(/\$/g, "\\$").replace(/"/g, '\\"');
}

function toPascalCase(str: string): string {
  return str.replace(/[^a-zA-Z0-9 ]/g, "").split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
}

/**
 * Generate a standalone shadcnblocks-pattern component for a section.
 * Each section becomes its own file with typed props and defaults.
 */
function generateBlockComponent(section: PageSection, index: number): { filename: string; code: string } {
  const { content: c, selectedBlockId, themeName, directionNotes } = section;
  const meta = wireframeBlockMeta[selectedBlockId];
  const cat = meta?.category || "Section";
  const name = toPascalCase(themeName || `Section${index + 1}`);

  switch (cat) {
    case "Hero": return generateHeroBlock(c, name, selectedBlockId, directionNotes);
    case "Cards": return generateCardsBlock(c, name, selectedBlockId, directionNotes);
    case "Lists": return selectedBlockId.includes("accordion") || selectedBlockId === "faq-accordion"
      ? generateFaqBlock(c, name, directionNotes)
      : generateStepsBlock(c, name, directionNotes);
    case "Tabs": return generateTabsBlock(c, name, directionNotes);
    case "CTA": return generateCtaBlock(c, name, selectedBlockId, directionNotes);
    case "Testimonials": return generateTestimonialBlock(c, name, directionNotes);
    case "Stats": return generateStatsBlock(c, name, directionNotes);
    case "Team": return generateTeamBlock(c, name, directionNotes);
    case "Forms": return generateFormBlock(c, name, directionNotes);
    case "Logos": return generateLogosBlock(c, name, directionNotes);
    case "Text": return generateTextBlock(c, name, selectedBlockId, directionNotes);
    default: return generateGenericBlock(c, name, directionNotes);
  }
}

// --- Block generators (shadcnblocks pattern) ---

function notes(d: string | undefined): string {
  return d ? d.split("\n").map((l) => `// ${l.trim()}`).join("\n") + "\n\n" : "";
}

function generateHeroBlock(c: SectionContent, name: string, blockId: string, dn?: string): { filename: string; code: string } {
  const isSplit = blockId.includes("split") || blockId.includes("image-right");
  return { filename: `${name}.tsx`, code: `${notes(dn)}import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ${name}Props {
  badge?: string;
  heading?: string;
  description?: string;
  primaryCta?: { text: string; url: string };
  secondaryCta?: { text: string; url: string };
  image?: { src: string; alt: string };
}

const ${name} = ({
  badge = "",
  heading = "${esc(c.heading || "Your Headline Here")}",
  description = "${esc(c.subheading || c.body || "Supporting text goes here")}",
  primaryCta = { text: "${esc(c.ctaText || "Get Started")}", url: "#" },
  secondaryCta = { text: "Learn More", url: "#" },
  image = { src: "${esc(c.backgroundImageUrl || "/placeholder.jpg")}", alt: "${esc(c.heading || "Hero image")}" },
}: ${name}Props) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="${isSplit ? "grid items-center gap-8 lg:grid-cols-2" : "flex flex-col items-center text-center"}">
          <div className="${isSplit ? "flex flex-col items-center text-center lg:items-start lg:text-left" : "max-w-2xl"}">
            {badge && (
              <Badge variant="outline" className="mb-4">
                {badge}
                <ArrowRight className="ml-2 size-4" />
              </Badge>
            )}
            <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
              {heading}
            </h1>
            <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
              {description}
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row ${isSplit ? "lg:justify-start" : ""}">
              <Button size="lg" asChild>
                <a href={primaryCta.url}>{primaryCta.text}</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={secondaryCta.url}>{secondaryCta.text}</a>
              </Button>
            </div>
          </div>
          ${isSplit ? `<img
            src={image.src}
            alt={image.alt}
            className="max-h-96 w-full rounded-md object-cover"
          />` : ""}
        </div>
      </div>
    </section>
  );
};

export { ${name} };
` };
}

function generateCardsBlock(c: SectionContent, name: string, blockId: string, dn?: string): { filename: string; code: string } {
  const cols = blockId.includes("4") ? 4 : blockId.includes("2") ? 2 : 3;
  const itemType = `{ icon: React.ReactNode; title: string; description: string }`;
  const defaults = c.items.length > 0
    ? c.items.map((it) => `    { icon: <Zap className="size-6" />, title: "${esc(it.title)}", description: "${esc(it.description)}" }`).join(",\n")
    : `    { icon: <Zap className="size-6" />, title: "Feature One", description: "Description here" },\n    { icon: <Zap className="size-6" />, title: "Feature Two", description: "Description here" },\n    { icon: <Zap className="size-6" />, title: "Feature Three", description: "Description here" }`;

  return { filename: `${name}.tsx`, code: `${notes(dn)}import { Zap } from "lucide-react";

interface ${name}Props {
  heading?: string;
  description?: string;
  features?: ${itemType}[];
}

const ${name} = ({
  heading = "${esc(c.heading || "Features")}",
  description = "${esc(c.subheading || "")}",
  features = [
${defaults}
  ],
}: ${name}Props) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-semibold lg:text-4xl">{heading}</h2>
          {description && <p className="text-muted-foreground max-w-2xl mx-auto lg:text-lg">{description}</p>}
        </div>
        <div className="grid gap-6 md:grid-cols-${cols}">
          {features.map((feature, i) => (
            <div key={i} className="flex flex-col items-center rounded-lg border p-8 text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { ${name} };
` };
}

function generateFaqBlock(c: SectionContent, name: string, dn?: string): { filename: string; code: string } {
  const defaults = c.items.length > 0
    ? c.items.map((it, i) => `    { id: "faq-${i + 1}", question: "${esc(it.title)}", answer: "${esc(it.description)}" }`).join(",\n")
    : `    { id: "faq-1", question: "What is this?", answer: "A common question answered here." }`;

  return { filename: `${name}.tsx`, code: `${notes(dn)}import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface ${name}Props {
  heading?: string;
  description?: string;
  items?: FaqItem[];
}

const ${name} = ({
  heading = "${esc(c.heading || "Frequently Asked Questions")}",
  description = "${esc(c.subheading || "")}",
  items = [
${defaults}
  ],
}: ${name}Props) => {
  return (
    <section className="py-32">
      <div className="container max-w-3xl">
        <h2 className="mb-4 text-3xl font-semibold md:text-4xl">{heading}</h2>
        {description && <p className="text-muted-foreground mb-8 lg:text-lg">{description}</p>}
        <Accordion type="single" collapsible>
          {items.map((item, index) => (
            <AccordionItem key={index} value={item.id}>
              <AccordionTrigger className="font-semibold hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export { ${name} };
` };
}

function generateStepsBlock(c: SectionContent, name: string, dn?: string): { filename: string; code: string } {
  const defaults = c.items.length > 0
    ? c.items.map((it, i) => `    { step: "${esc(it.extra || String(i + 1))}", title: "${esc(it.title)}", description: "${esc(it.description)}" }`).join(",\n")
    : `    { step: "1", title: "Step One", description: "Description" }`;

  return { filename: `${name}.tsx`, code: `${notes(dn)}interface ${name}Props {
  heading?: string;
  items?: { step: string; title: string; description: string }[];
}

const ${name} = ({
  heading = "${esc(c.heading || "How It Works")}",
  items = [
${defaults}
  ],
}: ${name}Props) => {
  return (
    <section className="py-32">
      <div className="container max-w-4xl">
        <h2 className="mb-12 text-center text-3xl font-semibold md:text-4xl">{heading}</h2>
        <div className="space-y-8">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-6">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                {item.step}
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { ${name} };
` };
}

function generateTabsBlock(c: SectionContent, name: string, dn?: string): { filename: string; code: string } {
  const defaults = c.items.length > 0
    ? c.items.map((it) => `    { label: "${esc(it.title)}", content: "${esc(it.description)}" }`).join(",\n")
    : `    { label: "Tab 1", content: "Content for tab 1" }`;

  return { filename: `${name}.tsx`, code: `${notes(dn)}import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ${name}Props {
  heading?: string;
  tabs?: { label: string; content: string }[];
}

const ${name} = ({
  heading = "${esc(c.heading || "Explore")}",
  tabs = [
${defaults}
  ],
}: ${name}Props) => {
  return (
    <section className="py-32">
      <div className="container max-w-4xl">
        <h2 className="mb-8 text-3xl font-semibold md:text-4xl">{heading}</h2>
        <Tabs defaultValue="tab-0">
          <TabsList>
            {tabs.map((tab, i) => (
              <TabsTrigger key={i} value={\`tab-\${i}\`}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab, i) => (
            <TabsContent key={i} value={\`tab-\${i}\`} className="mt-6">
              <p className="text-muted-foreground">{tab.content}</p>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export { ${name} };
` };
}

function generateCtaBlock(c: SectionContent, name: string, blockId: string, dn?: string): { filename: string; code: string } {
  return { filename: `${name}.tsx`, code: `${notes(dn)}import { Button } from "@/components/ui/button";

interface ${name}Props {
  heading?: string;
  description?: string;
  primaryCta?: { text: string; url: string };
  secondaryCta?: { text: string; url: string };
}

const ${name} = ({
  heading = "${esc(c.heading || "Ready to Get Started?")}",
  description = "${esc(c.subheading || c.body || "Take the next step today.")}",
  primaryCta = { text: "${esc(c.ctaText || "Get Started")}", url: "#" },
  secondaryCta = { text: "Learn More", url: "#" },
}: ${name}Props) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col items-center rounded-lg bg-accent p-8 text-center md:rounded-xl md:p-16">
          <h2 className="mb-4 text-3xl font-semibold md:text-5xl">{heading}</h2>
          <p className="text-muted-foreground mb-8 max-w-xl lg:text-lg">{description}</p>
          <div className="flex flex-col justify-center gap-2 sm:flex-row">
            <Button size="lg" asChild>
              <a href={primaryCta.url}>{primaryCta.text}</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={secondaryCta.url}>{secondaryCta.text}</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export { ${name} };
` };
}

function generateTestimonialBlock(c: SectionContent, name: string, dn?: string): { filename: string; code: string } {
  const defaults = c.items.length > 0
    ? c.items.map((it) => `    { quote: "${esc(it.extra || it.description)}", name: "${esc(it.title)}", role: "${esc(it.description)}", avatar: "${esc(it.imageUrl || "")}" }`).join(",\n")
    : `    { quote: "This product is amazing.", name: "Jane Doe", role: "CEO", avatar: "" }`;

  return { filename: `${name}.tsx`, code: `${notes(dn)}import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface ${name}Props {
  heading?: string;
  testimonials?: { quote: string; name: string; role: string; avatar: string }[];
}

const ${name} = ({
  heading = "${esc(c.heading || "What Our Clients Say")}",
  testimonials = [
${defaults}
  ],
}: ${name}Props) => {
  return (
    <section className="py-32">
      <div className="container">
        {heading && <h2 className="mb-12 text-center text-3xl font-semibold md:text-4xl">{heading}</h2>}
        <div className="grid gap-6 md:grid-cols-${Math.min(c.items.length || 3, 3)}">
          {testimonials.map((t, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={t.avatar} alt={t.name} />
                    <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-muted-foreground text-xs">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export { ${name} };
` };
}

function generateStatsBlock(c: SectionContent, name: string, dn?: string): { filename: string; code: string } {
  const defaults = c.items.length > 0
    ? c.items.map((it) => `    { value: "${esc(it.extra)}", label: "${esc(it.title)}" }`).join(",\n")
    : `    { value: "100+", label: "Customers" }`;

  return { filename: `${name}.tsx`, code: `${notes(dn)}interface ${name}Props {
  heading?: string;
  stats?: { value: string; label: string }[];
}

const ${name} = ({
  heading = "${esc(c.heading || "")}",
  stats = [
${defaults}
  ],
}: ${name}Props) => {
  return (
    <section className="py-32">
      <div className="container">
        {heading && <h2 className="mb-12 text-center text-3xl font-semibold md:text-4xl">{heading}</h2>}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-${Math.min(c.items.length || 4, 4)} text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <p className="text-4xl font-bold lg:text-5xl">{stat.value}</p>
              <p className="text-muted-foreground mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { ${name} };
` };
}

function generateTeamBlock(c: SectionContent, name: string, dn?: string): { filename: string; code: string } {
  const defaults = c.items.length > 0
    ? c.items.map((it) => `    { name: "${esc(it.title)}", role: "${esc(it.description)}", avatar: "${esc(it.imageUrl || "")}" }`).join(",\n")
    : `    { name: "Team Member", role: "Role", avatar: "" }`;

  return { filename: `${name}.tsx`, code: `${notes(dn)}import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ${name}Props {
  heading?: string;
  description?: string;
  members?: { name: string; role: string; avatar: string }[];
}

const ${name} = ({
  heading = "${esc(c.heading || "Our Team")}",
  description = "${esc(c.subheading || "")}",
  members = [
${defaults}
  ],
}: ${name}Props) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-semibold md:text-4xl">{heading}</h2>
          {description && <p className="text-muted-foreground mx-auto max-w-2xl lg:text-lg">{description}</p>}
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {members.map((member, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <Avatar className="mb-4 size-24">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="text-2xl">{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <p className="font-semibold">{member.name}</p>
              <p className="text-muted-foreground text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { ${name} };
` };
}

function generateFormBlock(c: SectionContent, name: string, dn?: string): { filename: string; code: string } {
  return { filename: `${name}.tsx`, code: `${notes(dn)}import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ${name}Props {
  heading?: string;
  description?: string;
  submitText?: string;
}

const ${name} = ({
  heading = "${esc(c.heading || "Contact Us")}",
  description = "${esc(c.subheading || "")}",
  submitText = "${esc(c.ctaText || "Submit")}",
}: ${name}Props) => {
  return (
    <section className="py-32">
      <div className="container max-w-lg">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-semibold md:text-4xl">{heading}</h2>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        <Card>
          <CardContent className="p-6">
            <form className="space-y-4">
${c.items.length > 0 ? c.items.map((it) => {
    const isTextarea = it.extra === "textarea";
    return `              <div>
                <label className="mb-1.5 block text-sm font-medium">${esc(it.title || "Field")}</label>
                ${isTextarea
      ? `<textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={4} placeholder="${esc(it.description || "")}" />`
      : `<input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="${esc(it.description || "")}" />`}
              </div>`;
  }).join("\n") : `              <input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Full name" />
              <input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Email" />
              <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={4} placeholder="Message" />`}
              <Button className="w-full">{submitText}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export { ${name} };
` };
}

function generateLogosBlock(c: SectionContent, name: string, dn?: string): { filename: string; code: string } {
  return { filename: `${name}.tsx`, code: `${notes(dn)}interface ${name}Props {
  heading?: string;
  logos?: { src: string; alt: string }[];
}

const ${name} = ({
  heading = "${esc(c.heading || "Trusted by leading companies")}",
  logos = [
${c.items.length > 0 ? c.items.map((it) => `    { src: "${esc(it.imageUrl)}", alt: "${esc(it.title)}" }`).join(",\n") : `    { src: "/logo1.svg", alt: "Company 1" }`}
  ],
}: ${name}Props) => {
  return (
    <section className="py-16">
      <div className="container">
        <p className="text-muted-foreground mb-8 text-center text-sm font-medium">{heading}</p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((logo, i) => (
            <img key={i} src={logo.src} alt={logo.alt} className="h-7 max-w-[120px] object-contain opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0" />
          ))}
        </div>
      </div>
    </section>
  );
};

export { ${name} };
` };
}

function generateTextBlock(c: SectionContent, name: string, blockId: string, dn?: string): { filename: string; code: string } {
  const isSplit = blockId.includes("split") || blockId.includes("image");
  const imgLeft = blockId.includes("image-left");

  return { filename: `${name}.tsx`, code: `${notes(dn)}import { Button } from "@/components/ui/button";

interface ${name}Props {
  heading?: string;
  description?: string;
  body?: string;
  cta?: { text: string; url: string };
  image?: { src: string; alt: string };
}

const ${name} = ({
  heading = "${esc(c.heading || "Section Title")}",
  description = "${esc(c.subheading || "")}",
  body = "${esc(c.body || "")}",
  cta = ${c.ctaText ? `{ text: "${esc(c.ctaText)}", url: "#" }` : "undefined"},
  image = { src: "${esc(c.backgroundImageUrl || "/placeholder.jpg")}", alt: "" },
}: ${name}Props) => {
  return (
    <section className="py-32">
      <div className="container">
        ${isSplit ? `<div className="grid items-center gap-8 lg:grid-cols-2${imgLeft ? "" : ""}">
          ${imgLeft ? '<img src={image.src} alt={image.alt} className="rounded-lg w-full object-cover aspect-[4/3]" />' : ""}
          <div>
            <h2 className="mb-4 text-3xl font-semibold lg:text-4xl">{heading}</h2>
            {description && <p className="text-muted-foreground mb-4 lg:text-lg">{description}</p>}
            {body && <p className="text-muted-foreground mb-6">{body}</p>}
            {cta && <Button asChild><a href={cta.url}>{cta.text}</a></Button>}
          </div>
          ${!imgLeft ? '<img src={image.src} alt={image.alt} className="rounded-lg w-full object-cover aspect-[4/3]" />' : ""}
        </div>` : `<div className="max-w-3xl ${blockId.includes("full") ? "mx-auto text-center" : ""}">
          <h2 className="mb-4 text-3xl font-semibold lg:text-4xl">{heading}</h2>
          {description && <p className="text-muted-foreground mb-4 lg:text-lg">{description}</p>}
          {body && <p className="text-muted-foreground mb-6">{body}</p>}
          {cta && <Button asChild><a href={cta.url}>{cta.text}</a></Button>}
        </div>`}
      </div>
    </section>
  );
};

export { ${name} };
` };
}

function generateGenericBlock(c: SectionContent, name: string, dn?: string): { filename: string; code: string } {
  return { filename: `${name}.tsx`, code: `${notes(dn)}import { Button } from "@/components/ui/button";

interface ${name}Props {
  heading?: string;
  description?: string;
  cta?: { text: string; url: string };
}

const ${name} = ({
  heading = "${esc(c.heading || "Section")}",
  description = "${esc(c.subheading || c.body || "")}",
  cta = ${c.ctaText ? `{ text: "${esc(c.ctaText)}", url: "#" }` : "undefined"},
}: ${name}Props) => {
  return (
    <section className="py-32">
      <div className="container">
        <h2 className="mb-4 text-3xl font-semibold lg:text-4xl">{heading}</h2>
        {description && <p className="text-muted-foreground mb-8 max-w-2xl lg:text-lg">{description}</p>}
        {cta && <Button asChild><a href={cta.url}>{cta.text}</a></Button>}
      </div>
    </section>
  );
};

export { ${name} };
` };
}

// ============================================================
// (Old ImportTracker and sectionToShadcn removed — replaced by
//  generateBlockComponent pattern above)
// ============================================================

// Keep this class in case it's referenced elsewhere
class ImportTracker {
  private imports = new Map<string, Set<string>>();
  private lucideIcons = new Set<string>();

  add(path: string, ...names: string[]) {
    if (!this.imports.has(path)) this.imports.set(path, new Set());
    names.forEach((n) => this.imports.get(path)!.add(n));
  }

  addIcon(...names: string[]) {
    names.forEach((n) => this.lucideIcons.add(n));
  }

  toString(): string {
    const lines: string[] = [];
    // Sort: react first, then next, then lucide, then @/components/ui, then @/lib
    const sorted = [...this.imports.entries()].sort(([a], [b]) => {
      const order = (p: string) => p.startsWith("react") ? 0 : p.startsWith("next") ? 1 : p.startsWith("lucide") ? 2 : p.startsWith("@/components/ui") ? 3 : 4;
      return order(a) - order(b);
    });
    for (const [path, names] of sorted) {
      lines.push(`import { ${[...names].join(", ")} } from "${path}";`);
    }
    if (this.lucideIcons.size > 0) {
      lines.push(`import { ${[...this.lucideIcons].sort().join(", ")} } from "lucide-react";`);
    }
    return lines.join("\n");
  }
}

function sectionToShadcn(
  section: PageSection,
  imports: ImportTracker,
  I: string = "      "
): string {
  const { content: c, selectedBlockId, themeName, directionNotes } = section;
  const meta = wireframeBlockMeta[selectedBlockId];
  const cat = meta?.category || "Section";
  const lines: string[] = [];

  if (directionNotes) {
    directionNotes.split("\n").forEach((n) => lines.push(`${I}{/* ${n.trim()} */}`));
  }

  // ====== HERO ======
  if (cat === "Hero") {
    imports.add("@/components/ui/button", "Button");
    const isSplit = selectedBlockId.includes("split") || selectedBlockId.includes("image-right");
    const isCentered = selectedBlockId.includes("centered") || selectedBlockId.includes("minimal");
    const isVideo = selectedBlockId.includes("video");

    lines.push(`${I}<section className="relative ${isVideo ? "overflow-hidden" : ""}">`);
    if (isVideo) {
      lines.push(`${I}  {/* TODO: Add video background */}`);
      lines.push(`${I}  <div className="absolute inset-0 bg-background/60" />`);
    }
    if (c.backgroundImageUrl) {
      lines.push(`${I}  {/* Background image */}`);
      lines.push(`${I}  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('${esc(c.backgroundImageUrl)}')" }} />`);
      lines.push(`${I}  <div className="absolute inset-0 bg-background/70" />`);
    }
    lines.push(`${I}  <div className="relative max-w-6xl mx-auto px-6 ${isSplit ? "flex items-center gap-12 py-16" : `py-20 ${isCentered ? "text-center" : ""}`}">`);
    if (isSplit) lines.push(`${I}    <div className="flex-1">`);
    if (c.heading) lines.push(`${I}    ${isSplit ? "  " : ""}<h1 className="text-4xl font-bold tracking-tight ${isCentered ? "mx-auto max-w-2xl" : "max-w-xl"} mb-4">${esc(c.heading)}</h1>`);
    if (c.subheading) lines.push(`${I}    ${isSplit ? "  " : ""}<p className="text-xl text-muted-foreground ${isCentered ? "mx-auto max-w-xl" : "max-w-lg"} mb-6">${esc(c.subheading)}</p>`);
    if (c.body) lines.push(`${I}    ${isSplit ? "  " : ""}<p className="text-muted-foreground ${isCentered ? "mx-auto max-w-lg" : "max-w-md"} mb-8">${esc(c.body)}</p>`);
    if (c.ctaText) {
      lines.push(`${I}    ${isSplit ? "  " : ""}<div className="${isCentered ? "flex justify-center gap-3" : "flex gap-3"}">`);
      lines.push(`${I}      ${isSplit ? "  " : ""}<Button size="lg">${esc(c.ctaText)}</Button>`);
      lines.push(`${I}    ${isSplit ? "  " : ""}</div>`);
    }
    if (isSplit) {
      lines.push(`${I}    </div>`);
      lines.push(`${I}    <div className="flex-1">`);
      lines.push(`${I}      <img src="${esc(c.backgroundImageUrl || "/placeholder.jpg")}" alt="" className="rounded-lg w-full object-cover aspect-[4/3]" />`);
      lines.push(`${I}    </div>`);
    }
    lines.push(`${I}  </div>`);
    lines.push(`${I}</section>`);
    return lines.join("\n");
  }

  // ====== CARDS ======
  if (cat === "Cards") {
    imports.add("@/components/ui/card", "Card", "CardHeader", "CardTitle", "CardDescription", "CardContent");
    imports.add("@/components/ui/button", "Button");
    const cols = selectedBlockId.includes("4-col") ? 4 : selectedBlockId.includes("2-col") ? 2 : 3;
    const isIcon = selectedBlockId.includes("icon");

    lines.push(`${I}<section className="py-16 px-6">`);
    lines.push(`${I}  <div className="max-w-6xl mx-auto">`);
    if (c.heading) lines.push(`${I}    <h2 className="text-3xl font-bold text-center mb-3">${esc(c.heading)}</h2>`);
    if (c.subheading) lines.push(`${I}    <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-10">${esc(c.subheading)}</p>`);
    lines.push(`${I}    <div className="grid grid-cols-1 md:grid-cols-${cols} gap-6">`);
    if (c.items.length > 0) {
      c.items.forEach((item) => {
        lines.push(`${I}      <Card>`);
        if (item.imageUrl && !isIcon) {
          lines.push(`${I}        <img src="${esc(item.imageUrl)}" alt="${esc(item.title)}" className="w-full h-48 object-cover rounded-t-lg" />`);
        }
        lines.push(`${I}        <CardHeader>`);
        if (isIcon) {
          imports.addIcon("Sparkles");
          lines.push(`${I}          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">`);
          lines.push(`${I}            <Sparkles className="h-5 w-5 text-primary" />`);
          lines.push(`${I}          </div>`);
        }
        lines.push(`${I}          <CardTitle>${esc(item.title)}</CardTitle>`);
        if (item.description) lines.push(`${I}          <CardDescription>${esc(item.description)}</CardDescription>`);
        lines.push(`${I}        </CardHeader>`);
        lines.push(`${I}      </Card>`);
      });
    } else {
      lines.push(`${I}      {/* TODO: Add card items */}`);
    }
    lines.push(`${I}    </div>`);
    if (c.ctaText) lines.push(`${I}    <div className="text-center mt-8"><Button variant="outline">${esc(c.ctaText)}</Button></div>`);
    lines.push(`${I}  </div>`);
    lines.push(`${I}</section>`);
    return lines.join("\n");
  }

  // ====== ACCORDION / FAQ ======
  if (cat === "Lists" || selectedBlockId === "faq-accordion") {
    if (selectedBlockId.includes("accordion") || selectedBlockId === "faq-accordion") {
      imports.add("@/components/ui/accordion", "Accordion", "AccordionItem", "AccordionTrigger", "AccordionContent");
      lines.push(`${I}<section className="py-16 px-6">`);
      lines.push(`${I}  <div className="max-w-3xl mx-auto">`);
      if (c.heading) lines.push(`${I}    <h2 className="text-3xl font-bold mb-3">${esc(c.heading)}</h2>`);
      if (c.subheading) lines.push(`${I}    <p className="text-muted-foreground mb-8">${esc(c.subheading)}</p>`);
      lines.push(`${I}    <Accordion type="single" collapsible className="w-full">`);
      c.items.forEach((item, i) => {
        lines.push(`${I}      <AccordionItem value="item-${i}">`);
        lines.push(`${I}        <AccordionTrigger>${esc(item.title || `Item ${i + 1}`)}</AccordionTrigger>`);
        lines.push(`${I}        <AccordionContent>${esc(item.description || "Content here")}</AccordionContent>`);
        lines.push(`${I}      </AccordionItem>`);
      });
      lines.push(`${I}    </Accordion>`);
      lines.push(`${I}  </div>`);
      lines.push(`${I}</section>`);
      return lines.join("\n");
    }
    // Numbered steps
    if (selectedBlockId === "numbered-steps") {
      imports.add("@/components/ui/badge", "Badge");
      lines.push(`${I}<section className="py-16 px-6">`);
      lines.push(`${I}  <div className="max-w-3xl mx-auto">`);
      if (c.heading) lines.push(`${I}    <h2 className="text-3xl font-bold mb-8">${esc(c.heading)}</h2>`);
      lines.push(`${I}    <div className="space-y-6">`);
      c.items.forEach((item, i) => {
        lines.push(`${I}      <div className="flex items-start gap-4">`);
        lines.push(`${I}        <Badge className="h-8 w-8 rounded-full flex items-center justify-center shrink-0">${item.extra || String(i + 1)}</Badge>`);
        lines.push(`${I}        <div>`);
        lines.push(`${I}          <h3 className="font-semibold mb-1">${esc(item.title || `Step ${i + 1}`)}</h3>`);
        if (item.description) lines.push(`${I}          <p className="text-muted-foreground">${esc(item.description)}</p>`);
        lines.push(`${I}        </div>`);
        lines.push(`${I}      </div>`);
      });
      lines.push(`${I}    </div>`);
      lines.push(`${I}  </div>`);
      lines.push(`${I}</section>`);
      return lines.join("\n");
    }
  }

  // ====== TABS ======
  if (cat === "Tabs") {
    imports.add("@/components/ui/tabs", "Tabs", "TabsContent", "TabsList", "TabsTrigger");
    lines.push(`${I}<section className="py-16 px-6">`);
    lines.push(`${I}  <div className="max-w-4xl mx-auto">`);
    if (c.heading) lines.push(`${I}    <h2 className="text-3xl font-bold mb-8">${esc(c.heading)}</h2>`);
    lines.push(`${I}    <Tabs defaultValue="tab-0">`);
    lines.push(`${I}      <TabsList>`);
    c.items.forEach((item, i) => {
      lines.push(`${I}        <TabsTrigger value="tab-${i}">${esc(item.title || `Tab ${i + 1}`)}</TabsTrigger>`);
    });
    lines.push(`${I}      </TabsList>`);
    c.items.forEach((item, i) => {
      lines.push(`${I}      <TabsContent value="tab-${i}" className="mt-6">`);
      lines.push(`${I}        <p className="text-muted-foreground">${esc(item.description || "Tab content here")}</p>`);
      lines.push(`${I}      </TabsContent>`);
    });
    lines.push(`${I}    </Tabs>`);
    lines.push(`${I}  </div>`);
    lines.push(`${I}</section>`);
    return lines.join("\n");
  }

  // ====== CTA ======
  if (cat === "CTA") {
    imports.add("@/components/ui/button", "Button");
    const isCentered = selectedBlockId.includes("full-width");
    const hasForm = selectedBlockId.includes("form");
    const isSplit = selectedBlockId.includes("split") || hasForm;

    lines.push(`${I}<section className="py-16 px-6 bg-muted/30">`);
    lines.push(`${I}  <div className="max-w-6xl mx-auto ${isSplit ? "flex items-center gap-12" : "text-center"}">`);
    lines.push(`${I}    <div className="${isSplit ? "flex-1" : ""}">`);
    if (c.heading) lines.push(`${I}      <h2 className="text-3xl font-bold mb-3">${esc(c.heading)}</h2>`);
    if (c.subheading) lines.push(`${I}      <p className="text-lg text-muted-foreground ${!isSplit ? "max-w-xl mx-auto " : ""}mb-6">${esc(c.subheading)}</p>`);
    if (c.ctaText && !hasForm) lines.push(`${I}      <Button size="lg">${esc(c.ctaText)}</Button>`);
    lines.push(`${I}    </div>`);
    if (hasForm) {
      lines.push(`${I}    <div className="flex-1">`);
      lines.push(`${I}      <form className="rounded-lg border bg-card p-6 space-y-4">`);
      if (c.items.length > 0) {
        c.items.forEach((item) => {
          lines.push(`${I}        <div>`);
          lines.push(`${I}          <label className="text-sm font-medium mb-1.5 block">${esc(item.title || "Field")}</label>`);
          lines.push(`${I}          <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="${esc(item.description || "")}" />`);
          lines.push(`${I}        </div>`);
        });
      } else {
        lines.push(`${I}        <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Name" />`);
        lines.push(`${I}        <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Email" />`);
        lines.push(`${I}        <textarea className="w-full rounded-md border px-3 py-2 text-sm" rows={3} placeholder="Message" />`);
      }
      lines.push(`${I}        <Button className="w-full">${esc(c.ctaText || "Submit")}</Button>`);
      lines.push(`${I}      </form>`);
      lines.push(`${I}    </div>`);
    }
    lines.push(`${I}  </div>`);
    lines.push(`${I}</section>`);
    return lines.join("\n");
  }

  // ====== TESTIMONIALS ======
  if (cat === "Testimonials") {
    imports.add("@/components/ui/card", "Card", "CardContent");
    lines.push(`${I}<section className="py-16 px-6">`);
    lines.push(`${I}  <div className="max-w-6xl mx-auto">`);
    if (c.heading) lines.push(`${I}    <h2 className="text-3xl font-bold text-center mb-10">${esc(c.heading)}</h2>`);
    lines.push(`${I}    <div className="grid grid-cols-1 md:grid-cols-${Math.min(c.items.length || 3, 3)} gap-6">`);
    c.items.forEach((item) => {
      lines.push(`${I}      <Card>`);
      lines.push(`${I}        <CardContent className="pt-6">`);
      if (item.extra) lines.push(`${I}          <p className="text-muted-foreground italic mb-4">&ldquo;${esc(item.extra)}&rdquo;</p>`);
      lines.push(`${I}          <div className="flex items-center gap-3">`);
      if (item.imageUrl) lines.push(`${I}            <img src="${esc(item.imageUrl)}" alt="${esc(item.title)}" className="w-10 h-10 rounded-full object-cover" />`);
      lines.push(`${I}            <div>`);
      if (item.title) lines.push(`${I}              <p className="font-medium text-sm">${esc(item.title)}</p>`);
      if (item.description) lines.push(`${I}              <p className="text-xs text-muted-foreground">${esc(item.description)}</p>`);
      lines.push(`${I}            </div>`);
      lines.push(`${I}          </div>`);
      lines.push(`${I}        </CardContent>`);
      lines.push(`${I}      </Card>`);
    });
    lines.push(`${I}    </div>`);
    lines.push(`${I}  </div>`);
    lines.push(`${I}</section>`);
    return lines.join("\n");
  }

  // ====== STATS ======
  if (cat === "Stats") {
    lines.push(`${I}<section className="py-16 px-6 bg-muted/30">`);
    lines.push(`${I}  <div className="max-w-6xl mx-auto">`);
    if (c.heading) lines.push(`${I}    <h2 className="text-3xl font-bold text-center mb-10">${esc(c.heading)}</h2>`);
    lines.push(`${I}    <div className="grid grid-cols-2 md:grid-cols-${Math.min(c.items.length || 4, 4)} gap-8 text-center">`);
    c.items.forEach((item) => {
      lines.push(`${I}      <div>`);
      lines.push(`${I}        <p className="text-4xl font-bold">${esc(item.extra || "0")}</p>`);
      lines.push(`${I}        <p className="text-sm text-muted-foreground mt-1">${esc(item.title)}</p>`);
      lines.push(`${I}      </div>`);
    });
    lines.push(`${I}    </div>`);
    lines.push(`${I}  </div>`);
    lines.push(`${I}</section>`);
    return lines.join("\n");
  }

  // ====== FORMS ======
  if (cat === "Forms") {
    imports.add("@/components/ui/button", "Button");
    imports.add("@/components/ui/card", "Card", "CardContent", "CardHeader", "CardTitle");
    lines.push(`${I}<section className="py-16 px-6">`);
    lines.push(`${I}  <div className="max-w-2xl mx-auto">`);
    if (c.heading) lines.push(`${I}    <h2 className="text-3xl font-bold text-center mb-3">${esc(c.heading)}</h2>`);
    if (c.subheading) lines.push(`${I}    <p className="text-muted-foreground text-center mb-8">${esc(c.subheading)}</p>`);
    lines.push(`${I}    <Card>`);
    lines.push(`${I}      <CardContent className="pt-6">`);
    lines.push(`${I}        <form className="space-y-4">`);
    if (c.items.length > 0) {
      c.items.forEach((item) => {
        const isTextarea = item.extra === "textarea";
        lines.push(`${I}          <div>`);
        lines.push(`${I}            <label className="text-sm font-medium mb-1.5 block">${esc(item.title || "Field")}</label>`);
        if (isTextarea) {
          lines.push(`${I}            <textarea className="w-full rounded-md border px-3 py-2 text-sm" rows={4} placeholder="${esc(item.description || "")}" />`);
        } else {
          lines.push(`${I}            <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="${esc(item.description || "")}" />`);
        }
        lines.push(`${I}          </div>`);
      });
    } else {
      lines.push(`${I}          <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Full name" />`);
      lines.push(`${I}          <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Email address" />`);
      lines.push(`${I}          <textarea className="w-full rounded-md border px-3 py-2 text-sm" rows={4} placeholder="Message" />`);
    }
    lines.push(`${I}          <Button className="w-full">${esc(c.ctaText || "Submit")}</Button>`);
    lines.push(`${I}        </form>`);
    lines.push(`${I}      </CardContent>`);
    lines.push(`${I}    </Card>`);
    lines.push(`${I}  </div>`);
    lines.push(`${I}</section>`);
    return lines.join("\n");
  }

  // ====== TEXT / SPLIT ======
  if (cat === "Text") {
    imports.add("@/components/ui/button", "Button");
    const isSplit = selectedBlockId.includes("split") || selectedBlockId.includes("image");
    const imgLeft = selectedBlockId.includes("image-left");
    const isBlockquote = selectedBlockId.includes("blockquote");

    lines.push(`${I}<section className="py-16 px-6">`);
    lines.push(`${I}  <div className="max-w-6xl mx-auto ${isSplit ? `flex ${imgLeft ? "flex-row-reverse " : ""}items-center gap-12` : ""}">`);
    if (isSplit) lines.push(`${I}    <div className="flex-1">`);
    if (c.heading) lines.push(`${I}    ${isSplit ? "  " : ""}<h2 className="text-3xl font-bold mb-4">${esc(c.heading)}</h2>`);
    if (c.subheading) lines.push(`${I}    ${isSplit ? "  " : ""}<p className="text-lg text-muted-foreground mb-4">${esc(c.subheading)}</p>`);
    if (c.body) {
      if (isBlockquote) {
        lines.push(`${I}    ${isSplit ? "  " : ""}<blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">${esc(c.body)}</blockquote>`);
      } else {
        lines.push(`${I}    ${isSplit ? "  " : ""}<p className="text-muted-foreground mb-6">${esc(c.body)}</p>`);
      }
    }
    if (c.ctaText) lines.push(`${I}    ${isSplit ? "  " : ""}<Button>${esc(c.ctaText)}</Button>`);
    if (isSplit) {
      lines.push(`${I}    </div>`);
      lines.push(`${I}    <div className="flex-1">`);
      lines.push(`${I}      <img src="${esc(c.backgroundImageUrl || "/placeholder.jpg")}" alt="" className="rounded-lg w-full object-cover aspect-[4/3]" />`);
      lines.push(`${I}    </div>`);
    }
    lines.push(`${I}  </div>`);
    lines.push(`${I}</section>`);
    return lines.join("\n");
  }

  // ====== TEAM ======
  if (cat === "Team") {
    imports.add("@/components/ui/card", "Card", "CardContent");
    lines.push(`${I}<section className="py-16 px-6">`);
    lines.push(`${I}  <div className="max-w-6xl mx-auto">`);
    if (c.heading) lines.push(`${I}    <h2 className="text-3xl font-bold text-center mb-10">${esc(c.heading)}</h2>`);
    lines.push(`${I}    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">`);
    c.items.forEach((item) => {
      lines.push(`${I}      <Card className="text-center">`);
      lines.push(`${I}        <CardContent className="pt-6">`);
      if (item.imageUrl) lines.push(`${I}          <img src="${esc(item.imageUrl)}" alt="${esc(item.title)}" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />`);
      if (item.title) lines.push(`${I}          <p className="font-semibold">${esc(item.title)}</p>`);
      if (item.description) lines.push(`${I}          <p className="text-sm text-muted-foreground">${esc(item.description)}</p>`);
      if (item.extra) lines.push(`${I}          <p className="text-sm text-muted-foreground mt-2">${esc(item.extra)}</p>`);
      lines.push(`${I}        </CardContent>`);
      lines.push(`${I}      </Card>`);
    });
    lines.push(`${I}    </div>`);
    lines.push(`${I}  </div>`);
    lines.push(`${I}</section>`);
    return lines.join("\n");
  }

  // ====== LOGOS ======
  if (cat === "Logos") {
    imports.add("@/components/ui/separator", "Separator");
    lines.push(`${I}<section className="py-12 px-6">`);
    lines.push(`${I}  <div className="max-w-6xl mx-auto">`);
    if (c.heading) lines.push(`${I}    <p className="text-sm text-muted-foreground text-center mb-6">${esc(c.heading)}</p>`);
    lines.push(`${I}    <div className="flex flex-wrap items-center justify-center gap-8">`);
    c.items.forEach((item) => {
      if (item.imageUrl) {
        lines.push(`${I}      <img src="${esc(item.imageUrl)}" alt="${esc(item.title)}" className="h-8 max-w-[120px] object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all" />`);
      }
    });
    lines.push(`${I}    </div>`);
    lines.push(`${I}  </div>`);
    lines.push(`${I}</section>`);
    return lines.join("\n");
  }

  // ====== DEFAULT — generic section ======
  imports.add("@/components/ui/button", "Button");
  lines.push(`${I}<section className="py-16 px-6">`);
  lines.push(`${I}  <div className="max-w-6xl mx-auto">`);
  if (c.heading) lines.push(`${I}    <h2 className="text-3xl font-bold mb-4">${esc(c.heading)}</h2>`);
  if (c.subheading) lines.push(`${I}    <p className="text-lg text-muted-foreground mb-6">${esc(c.subheading)}</p>`);
  if (c.body) lines.push(`${I}    <p className="text-muted-foreground mb-6">${esc(c.body)}</p>`);
  if (c.items.length > 0) {
    lines.push(`${I}    <div className="space-y-4">`);
    c.items.forEach((item, i) => {
      lines.push(`${I}      <div className="flex items-start gap-4 rounded-lg border p-4">`);
      lines.push(`${I}        <span className="text-sm font-mono text-muted-foreground">${String(i + 1).padStart(2, "0")}</span>`);
      lines.push(`${I}        <div>`);
      if (item.title) lines.push(`${I}          <p className="font-medium">${esc(item.title)}</p>`);
      if (item.description) lines.push(`${I}          <p className="text-sm text-muted-foreground">${esc(item.description)}</p>`);
      lines.push(`${I}        </div>`);
      lines.push(`${I}      </div>`);
    });
    lines.push(`${I}    </div>`);
  }
  if (c.ctaText) lines.push(`${I}    <div className="mt-8"><Button>${esc(c.ctaText)}</Button></div>`);
  lines.push(`${I}  </div>`);
  lines.push(`${I}</section>`);
  return lines.join("\n");
}

/**
 * Generate all code for a page:
 * - Individual block component files (shadcnblocks pattern)
 * - A page file that imports and renders them
 */
export function generatePageCode(page: SitemapPage, project: Project): string {
  const blocks = page.sections.map((section, i) => generateBlockComponent(section, i));
  const pageName = toPascalCase(page.name);

  // Build the page file that imports all blocks
  const lines: string[] = [];

  // Imports for block components
  blocks.forEach((b) => {
    const name = b.filename.replace(".tsx", "");
    lines.push(`import { ${name} } from "@/components/blocks/${b.filename.replace(".tsx", "")}";`);
  });

  lines.push(``);
  lines.push(`export const metadata = {`);
  lines.push(`  title: "${esc(page.seoTitle || page.name)} | ${esc(project.clientName)}",`);
  lines.push(`  description: "${esc(page.seoDescription || page.purpose)}",`);
  if (page.ogImageUrl) {
    lines.push(`  openGraph: {`);
    lines.push(`    images: ["${esc(page.ogImageUrl)}"],`);
    lines.push(`  },`);
  }
  lines.push(`};`);
  lines.push(``);
  lines.push(`export default function ${pageName}Page() {`);
  lines.push(`  return (`);
  lines.push(`    <main>`);
  blocks.forEach((b) => {
    const name = b.filename.replace(".tsx", "");
    lines.push(`      <${name} />`);
  });
  lines.push(`    </main>`);
  lines.push(`  );`);
  lines.push(`}`);

  // Also append all block component code below, separated
  lines.push(``);
  lines.push(`// ============================================================`);
  lines.push(`// BLOCK COMPONENTS (save each to @/components/blocks/)`);
  lines.push(`// ============================================================`);
  blocks.forEach((b) => {
    lines.push(``);
    lines.push(`// --- ${b.filename} ---`);
    lines.push(b.code);
  });

  return lines.join("\n");
}

// ============================================================
// CONTENT EXPORT — generates markdown for writers
// ============================================================

export function generatePageContent(page: SitemapPage, project: Project): string {
  const lines: string[] = [];

  lines.push(`# ${page.name}`);
  lines.push(``);
  lines.push(`**Slug:** /${page.slug}`);
  if (page.purpose) lines.push(`**Purpose:** ${page.purpose}`);
  if (page.pageGoal) lines.push(`**Page Goal:** ${page.pageGoal}`);
  lines.push(``);

  if (page.seoTitle || page.seoDescription) {
    lines.push(`## SEO`);
    if (page.seoTitle) lines.push(`- **Title Tag:** ${page.seoTitle}`);
    if (page.seoDescription) lines.push(`- **Meta Description:** ${page.seoDescription}`);
    lines.push(``);
  }

  if (page.audiences.length > 0) {
    lines.push(`## Audiences`);
    page.audiences.forEach((a) => lines.push(`- ${a}`));
    lines.push(``);
  }

  if (page.referenceUrls.length > 0) {
    lines.push(`## Reference URLs`);
    page.referenceUrls.forEach((u) => lines.push(`- ${u}`));
    lines.push(``);
  }

  lines.push(`---`);
  lines.push(``);

  for (const section of page.sections) {
    const meta = wireframeBlockMeta[section.selectedBlockId];
    lines.push(`## ${section.themeName}`);
    lines.push(`*Component: ${meta?.label || section.selectedBlockId}*`);
    lines.push(``);

    if (section.directionNotes) {
      lines.push(`> **Direction:** ${section.directionNotes}`);
      lines.push(``);
    }

    const c = section.content;
    if (c.heading) lines.push(`**Heading:** ${c.heading}`);
    if (c.subheading) lines.push(`**Subheading:** ${c.subheading}`);
    if (c.body) {
      lines.push(``);
      lines.push(c.body);
    }
    if (c.ctaText) lines.push(`**CTA:** ${c.ctaText}`);
    lines.push(``);

    if (c.items.length > 0) {
      const cat = meta?.category || "";
      c.items.forEach((item, i) => {
        lines.push(`### ${item.title || `Item ${i + 1}`}`);
        if (item.description) lines.push(item.description);
        if (item.extra) lines.push(`*${item.extra}*`);
        lines.push(``);
      });
    }

    lines.push(`---`);
    lines.push(``);
  }

  if (page.contentNotes) {
    lines.push(`## Content Notes`);
    lines.push(page.contentNotes);
    lines.push(``);
  }

  return lines.join("\n");
}

// ============================================================
// Full project content export
// ============================================================

export function generateFullContentExport(project: Project): string {
  const lines: string[] = [];

  lines.push(`# ${project.clientName} — Content Document`);
  lines.push(`*Generated ${new Date().toLocaleDateString()}*`);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);

  for (const page of project.sitemap) {
    lines.push(generatePageContent(page, project));
    lines.push(``);
  }

  return lines.join("\n");
}

// ============================================================
// UI Components
// ============================================================

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button size="xs" variant="ghost" className="gap-1" onClick={handleCopy}>
      {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

function downloadFile(filename: string, content: string, type: string = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportPanel({
  project,
  page,
  onClose,
}: {
  project: Project;
  page: SitemapPage;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"code" | "content">("code");
  const code = generatePageCode(page, project);
  const content = generatePageContent(page, project);

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-auto">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-card border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold">{page.name} — Export</h2>
          <div className="flex gap-1 rounded-lg bg-muted p-0.5">
            <button
              onClick={() => setTab("code")}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                tab === "code" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Code className="h-3 w-3 inline mr-1" /> Code
            </button>
            <button
              onClick={() => setTab("content")}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                tab === "content" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="h-3 w-3 inline mr-1" /> Content
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={tab === "code" ? code : content} />
          <Button
            size="xs"
            variant="outline"
            className="gap-1"
            onClick={() => {
              if (tab === "code") {
                downloadFile(`${page.slug}.tsx`, code, "text/typescript");
              } else {
                downloadFile(`${page.slug}-content.md`, content, "text/markdown");
              }
            }}
          >
            <Download className="h-3 w-3" />
            {tab === "code" ? ".tsx" : ".md"}
          </Button>
          <Button
            size="xs"
            variant="ghost"
            className="gap-1"
            onClick={() => {
              const full = generateFullContentExport(project);
              downloadFile(`${project.clientName || "project"}-all-content.md`, full, "text/markdown");
            }}
          >
            <Download className="h-3 w-3" /> All Pages
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Code/content display */}
      <div className="max-w-5xl mx-auto p-6">
        <pre className="rounded-lg bg-muted/30 border p-6 text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">
          {tab === "code" ? code : content}
        </pre>
      </div>
    </div>
  );
}
