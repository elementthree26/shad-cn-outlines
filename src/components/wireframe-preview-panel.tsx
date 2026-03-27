"use client";

import { WireframeBlockId } from "@/data/types";
import { WireframeBlock } from "./wireframe-blocks";
import { Card } from "@/components/ui/card";

export function WireframePreviewPanel({
  wireframeId,
  themeName,
  optionName,
}: {
  wireframeId: WireframeBlockId | null;
  themeName?: string;
  optionName?: string;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold">Wireframe Preview</h3>
        {themeName && (
          <p className="text-xs text-muted-foreground mt-0.5">{themeName}</p>
        )}
      </div>
      <Card className="overflow-hidden">
        {wireframeId ? (
          <div className="p-4">
            <WireframeBlock blockId={wireframeId} className="w-full text-foreground" />
            {optionName && (
              <p className="text-xs text-center text-muted-foreground mt-3 font-medium">
                {optionName}
              </p>
            )}
          </div>
        ) : (
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
              Click a component option to preview its wireframe
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
