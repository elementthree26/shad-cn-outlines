"use client";

import { useState, useEffect } from "react";
import { Bookmark, Plus, Trash2, X, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PageTemplate,
  getAllPageTemplates,
  deletePageTemplate,
  createPageTemplate,
  instantiateTemplate,
} from "@/lib/page-template-store";
import { PageSection } from "@/lib/project-types";
import { wireframeBlockMeta } from "@/components/wireframe-blocks";

const inputCls =
  "w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30";

/** Dialog to save current page sections as a template */
export function SaveAsTemplateDialog({
  sections,
  industry,
  onClose,
}: {
  sections: PageSection[];
  industry?: string;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const handleSave = () => {
    if (!name.trim()) return;
    createPageTemplate(name.trim(), desc.trim(), industry || "", sections);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={onClose}>
      <div className="bg-card rounded-xl border shadow-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5">
            <Bookmark className="h-4 w-4" /> Save as Page Template
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Template name</label>
            <input
              className={inputCls}
              placeholder="e.g. B2B Homepage, Services Detail..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
            <input
              className={inputCls}
              placeholder="What is this template good for?"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {sections.length} sections will be saved. Content will be cleared; direction notes will be kept.
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button size="sm" onClick={handleSave} disabled={!name.trim()}>
              <Bookmark className="h-3.5 w-3.5 mr-1" /> Save Template
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Template library browser — pick a template to apply */
export function TemplateLibrary({
  onApply,
  onClose,
}: {
  onApply: (sections: PageSection[]) => void;
  onClose: () => void;
}) {
  const [templates, setTemplates] = useState<PageTemplate[]>([]);

  useEffect(() => {
    setTemplates(getAllPageTemplates());
  }, []);

  const handleDelete = (id: string) => {
    deletePageTemplate(id);
    setTemplates(getAllPageTemplates());
  };

  const handleApply = (template: PageTemplate) => {
    const sections = instantiateTemplate(template);
    onApply(sections);
    setTemplates(getAllPageTemplates()); // refresh use count
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={onClose}>
      <div className="bg-card rounded-xl border shadow-xl p-6 w-full max-w-lg max-h-[70vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5">
            <Bookmark className="h-4 w-4" /> Page Templates
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {templates.length === 0 ? (
            <div className="text-center py-10 text-sm text-muted-foreground">
              <Bookmark className="h-8 w-8 mx-auto mb-2 opacity-20" />
              <p>No templates saved yet.</p>
              <p className="text-xs mt-1">Build a page, then save it as a template to reuse later.</p>
            </div>
          ) : (
            templates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="rounded-lg border p-3 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{tmpl.name}</p>
                    {tmpl.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{tmpl.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <Badge variant="secondary" className="text-[10px]">
                        {tmpl.sections.length} sections
                      </Badge>
                      {tmpl.industry && (
                        <Badge variant="outline" className="text-[10px]">{tmpl.industry}</Badge>
                      )}
                      <span className="text-[10px] text-muted-foreground">
                        Used {tmpl.useCount}x
                      </span>
                    </div>
                    {/* Section preview */}
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {tmpl.sections.slice(0, 6).map((s) => (
                        <span
                          key={s.instanceId}
                          className="rounded bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground"
                        >
                          {s.themeName}
                        </span>
                      ))}
                      {tmpl.sections.length > 6 && (
                        <span className="text-[9px] text-muted-foreground">
                          +{tmpl.sections.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button size="xs" onClick={() => handleApply(tmpl)}>
                      <Copy className="h-3 w-3 mr-1" /> Use
                    </Button>
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(tmpl.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
