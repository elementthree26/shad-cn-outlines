/**
 * Page template library - save built pages as reusable templates.
 * Stored in localStorage separately from projects.
 */

import { PageSection } from "./project-types";

export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  industry: string;
  createdAt: string;
  /** The sections that make up the template */
  sections: PageSection[];
  /** Number of times this template has been used */
  useCount: number;
}

const STORAGE_KEY = "shad-cn-page-templates";

function loadTemplates(): PageTemplate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTemplates(templates: PageTemplate[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

export function getAllPageTemplates(): PageTemplate[] {
  return loadTemplates();
}

export function savePageTemplate(template: PageTemplate): PageTemplate {
  const templates = loadTemplates();
  const idx = templates.findIndex((t) => t.id === template.id);
  if (idx >= 0) {
    templates[idx] = template;
  } else {
    templates.push(template);
  }
  saveTemplates(templates);
  return template;
}

export function deletePageTemplate(id: string) {
  const templates = loadTemplates().filter((t) => t.id !== id);
  saveTemplates(templates);
}

export function createPageTemplate(
  name: string,
  description: string,
  industry: string,
  sections: PageSection[]
): PageTemplate {
  // Clone sections with fresh IDs but keep structure and direction notes
  const clonedSections: PageSection[] = sections.map((s) => ({
    ...s,
    instanceId: `${s.themeId}-tmpl-${crypto.randomUUID().slice(0, 8)}`,
    content: {
      heading: "",
      subheading: "",
      body: "",
      ctaText: "",
      backgroundImageUrl: "",
      items: [],
    },
    // Keep direction notes since they're structural guidance
    directionNotes: s.directionNotes,
  }));

  return {
    id: crypto.randomUUID(),
    name,
    description,
    industry,
    createdAt: new Date().toISOString(),
    sections: clonedSections,
    useCount: 0,
  };
}

/** Apply a template to get fresh sections with new instance IDs */
export function instantiateTemplate(template: PageTemplate): PageSection[] {
  // Increment use count
  savePageTemplate({ ...template, useCount: template.useCount + 1 });

  return template.sections.map((s) => ({
    ...s,
    instanceId: `${s.themeId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  }));
}
