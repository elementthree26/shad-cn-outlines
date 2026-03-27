"use client";

import { ContentTheme, WireframeBlockId } from "@/data/types";
import { WireframeBlock } from "./wireframe-blocks";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PageSection {
  themeId: string;
  themeName: string;
  wireframeId: WireframeBlockId;
  optionName: string;
}

export function WireframePreviewPanel({
  themes,
  selections,
  activeThemeId,
}: {
  themes: ContentTheme[];
  selections: Record<string, WireframeBlockId>;
  activeThemeId: string | null;
}) {
  // Build ordered list of sections that have selections
  const sections: PageSection[] = themes
    .filter((t) => selections[t.id])
    .map((t) => {
      const wireframeId = selections[t.id]!;
      const option = t.componentOptions.find(
        (o) => o.wireframeId === wireframeId
      );
      return {
        themeId: t.id,
        themeName: t.name,
        wireframeId,
        optionName: option?.name ?? "",
      };
    });

  const selectedCount = sections.length;
  const totalCount = themes.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Full Page Wireframe</h3>
        <Badge variant="secondary" className="text-xs">
          {selectedCount}/{totalCount}
        </Badge>
      </div>

      {sections.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="divide-y divide-border/50">
            {sections.map((section) => {
              const isActive = section.themeId === activeThemeId;
              return (
                <div
                  key={section.themeId}
                  className={`px-3 py-2 transition-colors ${
                    isActive ? "bg-primary/5 ring-1 ring-inset ring-primary/20" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] font-medium text-muted-foreground truncate">
                      {section.themeName}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 truncate ml-2">
                      {section.optionName}
                    </p>
                  </div>
                  <WireframeBlock
                    blockId={section.wireframeId}
                    className="w-full text-foreground"
                  />
                </div>
              );
            })}
          </div>
          {selectedCount < totalCount && (
            <div className="px-3 py-3 bg-muted/30 border-t">
              <p className="text-[11px] text-muted-foreground text-center">
                {totalCount - selectedCount} section{totalCount - selectedCount !== 1 ? "s" : ""} remaining
                — click badges to add
              </p>
            </div>
          )}
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
            <div className="rounded-lg bg-muted/50 p-4 mb-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-8 w-8 text-muted-foreground/40"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 3v18" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">
              Click component option badges to build your page wireframe
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
