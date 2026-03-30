"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Plus,
  Trash2,
  Eye,
  ChevronDown,
  Settings2,
  LayoutGrid,
  Monitor,
  PanelLeft,
  Type,
  Image as ImageIcon,
  X,
  Paintbrush,
  Save,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContentTheme } from "@/data/types";
import { WireframeBlockId } from "@/data/wireframe-types";
import { WireframeBlock, wireframeBlockMeta } from "@/components/wireframe-blocks";
import { allPages } from "@/data/pages";
import { StyleGuide, StyleGuidePanel } from "./style-guide";
import { StyledPreview } from "./styled-preview";
import { ImageUpload } from "./image-upload";
import {
  Project,
  SitemapPage,
  PageSection,
  SectionContent,
  ContentItem,
} from "@/lib/project-types";

// Re-use all the helpers and sub-components from page-builder
// We import the building blocks from the main page-builder
import {
  BuilderSection,
  PageBuilder as StandalonePageBuilder,
} from "./page-builder";

/**
 * Project-scoped page builder.
 * Uses the project's style guide, loads sections from the page,
 * auto-saves, and shows discovery notes in a side panel.
 */
export function ProjectPageBuilder({
  project,
  page,
  onSave,
}: {
  project: Project;
  page: SitemapPage;
  onSave: (sections: PageSection[]) => void;
}) {
  const [styleGuide, setStyleGuide] = useState<StyleGuide>(project.styleGuide);
  const [showNotes, setShowNotes] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // We pass initial sections to the standalone builder and capture changes
  // via an interval-based auto-save approach
  // For now, render the standalone PageBuilder with initial data from the page
  // The standalone builder manages its own state - we just provide initial data

  return (
    <div className="flex flex-col flex-1">
      {/* Discovery notes side panel */}
      {showNotes && (
        <div className="border-b bg-muted/30 px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" /> Discovery Notes & Context
            </h3>
            <button onClick={() => setShowNotes(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs">
            {project.discoveryNotes && (
              <div>
                <p className="font-medium text-foreground mb-1">Meeting Notes</p>
                <p className="text-muted-foreground whitespace-pre-wrap line-clamp-4">{project.discoveryNotes}</p>
              </div>
            )}
            {project.valuePropositions.length > 0 && (
              <div>
                <p className="font-medium text-foreground mb-1">Value Props</p>
                <ul className="text-muted-foreground space-y-0.5">
                  {project.valuePropositions.map((v, i) => <li key={i}>• {v}</li>)}
                </ul>
              </div>
            )}
            {project.differentiators.length > 0 && (
              <div>
                <p className="font-medium text-foreground mb-1">Differentiators</p>
                <ul className="text-muted-foreground space-y-0.5">
                  {project.differentiators.map((d, i) => <li key={i}>• {d}</li>)}
                </ul>
              </div>
            )}
          </div>
          {page.notes && (
            <div className="mt-2 rounded border bg-card p-2 text-xs">
              <p className="font-medium text-foreground mb-0.5">Page Notes</p>
              <p className="text-muted-foreground">{page.notes}</p>
            </div>
          )}
        </div>
      )}
      {!showNotes && (project.discoveryNotes || page.notes) && (
        <div className="border-b bg-card px-6 py-1.5">
          <button
            onClick={() => setShowNotes(true)}
            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
          >
            <MessageSquare className="h-3 w-3" /> Show discovery notes & context
          </button>
        </div>
      )}
      <StandalonePageBuilder
        initialSections={page.sections as BuilderSection[]}
        initialStyleGuide={project.styleGuide}
        onSectionsChange={onSave}
      />
    </div>
  );
}
