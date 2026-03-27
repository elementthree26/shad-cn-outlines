"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Briefcase,
  MapPin,
  Home,
  Mail,
  Layers,
  FileText,
  ListOrdered,
  StickyNote,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SortableThemeList } from "@/components/sortable-theme-list";
import { ContentThemeCardStatic } from "@/components/content-theme-card";
import { WireframePreviewPanel } from "@/components/wireframe-preview-panel";
import { PageTemplate, ComponentOption, WireframeBlockId } from "@/data/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Briefcase,
  MapPin,
  Home,
  Mail,
  Layers,
  FileText,
};

export function PageDetailClient({ page }: { page: PageTemplate }) {
  const Icon = iconMap[page.icon] || FileText;

  const [selections, setSelections] = useState<
    Record<string, WireframeBlockId>
  >({});
  const [activeThemeId, setActiveThemeId] = useState<string | null>(null);

  const handleSelectOption = useCallback(
    (themeId: string, option: ComponentOption) => {
      setSelections((prev) => ({
        ...prev,
        [themeId]: option.wireframeId,
      }));
      setActiveThemeId(themeId);
    },
    []
  );

  const highThemes = page.contentThemes.filter(
    (t) => t.frequencyTier === "high"
  );
  const medThemes = page.contentThemes.filter(
    (t) => t.frequencyTier === "medium"
  );
  const lowThemes = page.contentThemes.filter(
    (t) => t.frequencyTier === "low"
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <ArrowLeft className="h-4 w-4" />
                All Pages
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-primary/10 p-2">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">
                  {page.name}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {page.contentThemes.length} content themes
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Page description */}
        <div className="mb-6">
          <p className="text-muted-foreground">{page.description}</p>
        </div>

        <div className="flex gap-8">
          {/* Left: content */}
          <div className="flex-1 min-w-0">
            <Tabs defaultValue="builder" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="builder" className="gap-1.5">
                  <ListOrdered className="h-3.5 w-3.5" />
                  Page Builder
                </TabsTrigger>
                <TabsTrigger value="reference" className="gap-1.5">
                  <StickyNote className="h-3.5 w-3.5" />
                  Reference
                </TabsTrigger>
              </TabsList>

              {/* Builder tab with drag-and-drop */}
              <TabsContent value="builder">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    Drag and drop to reorder content themes. Click a component
                    option badge to preview its wireframe.
                  </p>
                </div>
                <SortableThemeList
                  initialThemes={page.contentThemes}
                  selections={selections}
                  onSelectOption={handleSelectOption}
                />
              </TabsContent>

              {/* Reference tab with grouped themes */}
              <TabsContent value="reference">
                <div className="space-y-8">
                  {/* Content Architecture */}
                  {page.contentArchitecture &&
                    page.contentArchitecture.length > 0 && (
                      <div className="rounded-lg border bg-card p-5">
                        <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                          <ListOrdered className="h-4 w-4 text-primary" />
                          Recommended Content Architecture
                        </h2>
                        <ol className="space-y-2 ml-1">
                          {page.contentArchitecture.map((step, i) => (
                            <li
                              key={i}
                              className="text-sm text-muted-foreground flex items-start gap-2"
                            >
                              <span className="font-mono text-xs text-primary font-medium mt-0.5 w-5 flex-shrink-0">
                                {i + 1}.
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                  {/* General Notes */}
                  {page.generalNotes && page.generalNotes.length > 0 && (
                    <div className="rounded-lg border bg-muted/30 p-5">
                      <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                        <StickyNote className="h-4 w-4 text-primary" />
                        General Notes
                      </h2>
                      <ul className="space-y-2">
                        {page.generalNotes.map((note, i) => (
                          <li
                            key={i}
                            className="text-sm text-muted-foreground flex items-start gap-2"
                          >
                            <span className="text-muted-foreground/40 mt-1.5 text-[6px]">
                              ●
                            </span>
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* High Frequency */}
                  {highThemes.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          High Frequency
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Core content themes that appear on most sites
                        </span>
                      </div>
                      <div className="space-y-3">
                        {highThemes.map((theme, i) => (
                          <ContentThemeCardStatic
                            key={theme.id}
                            theme={theme}
                            index={i}
                            selectedWireframeId={selections[theme.id]}
                            onSelectOption={handleSelectOption}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Medium Frequency */}
                  {medThemes.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                          Medium Frequency
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Common themes appearing in 2-3 sites
                        </span>
                      </div>
                      <div className="space-y-3">
                        {medThemes.map((theme, i) => (
                          <ContentThemeCardStatic
                            key={theme.id}
                            theme={theme}
                            index={i}
                            selectedWireframeId={selections[theme.id]}
                            onSelectOption={handleSelectOption}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Low Frequency */}
                  {lowThemes.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-gray-100 text-gray-600 border-gray-300">
                          Low Frequency
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Specialized themes appearing in 1 site
                        </span>
                      </div>
                      <div className="space-y-3">
                        {lowThemes.map((theme, i) => (
                          <ContentThemeCardStatic
                            key={theme.id}
                            theme={theme}
                            index={i}
                            selectedWireframeId={selections[theme.id]}
                            onSelectOption={handleSelectOption}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: sticky wireframe preview */}
          <div className="hidden lg:block w-[340px] flex-shrink-0">
            <div className="sticky top-[73px] max-h-[calc(100vh-90px)] overflow-y-auto">
              <WireframePreviewPanel
                themes={page.contentThemes}
                selections={selections}
                activeThemeId={activeThemeId}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
