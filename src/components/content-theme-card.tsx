"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  MessageSquare,
  ClipboardList,
  Lightbulb,
  Package,
  Factory,
  GripVertical,
  LayoutGrid,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ContentTheme } from "@/data/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const frequencyColors: Record<string, string> = {
  high: "bg-green-100 text-green-800 border-green-300",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  low: "bg-gray-100 text-gray-600 border-gray-300",
};

const frequencyLabels: Record<string, string> = {
  high: "High Frequency",
  medium: "Medium Frequency",
  low: "Low Frequency",
};

function DetailSection({
  icon: Icon,
  title,
  items,
  defaultOpen = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: string[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  if (items.length === 0) return null;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-md hover:bg-muted/50 transition-colors group/section">
        <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <span className="text-sm font-medium flex-1">{title}</span>
        <Badge variant="secondary" className="text-xs">
          {items.length}
        </Badge>
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="ml-9 mt-1 mb-2 space-y-1.5">
          {items.map((item, i) => (
            <li
              key={i}
              className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2"
            >
              <span className="text-muted-foreground/40 mt-1.5 text-[6px]">
                ●
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function ContentThemeCard({
  theme,
  index,
}: {
  theme: ContentTheme;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: theme.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className={`transition-all ${
          isDragging ? "shadow-xl ring-2 ring-primary/30" : ""
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <button
              className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground transition-colors touch-none"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-5 w-5" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono text-muted-foreground/60">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <CardTitle className="text-base">{theme.name}</CardTitle>
                <Badge
                  variant="outline"
                  className={`text-xs ${frequencyColors[theme.frequencyTier]}`}
                >
                  {frequencyLabels[theme.frequencyTier]}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
                {theme.componentOptions.map((opt, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-xs font-normal"
                  >
                    {opt.name}
                  </Badge>
                ))}
              </div>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="rounded-md p-1.5 hover:bg-muted transition-colors"
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          </div>
        </CardHeader>
        {expanded && (
          <CardContent className="pt-0 border-t">
            <div className="mt-3 space-y-1">
              <DetailSection
                icon={Lightbulb}
                title="Considerations"
                items={theme.considerations}
                defaultOpen
              />
              <DetailSection
                icon={MessageSquare}
                title="Client Discovery Questions"
                items={theme.clientDiscoveryQuestions}
              />
              <DetailSection
                icon={Package}
                title="Information & Assets Needed"
                items={theme.informationAndAssets}
              />
              <DetailSection
                icon={Factory}
                title="Industry Notes"
                items={theme.industryNotes}
              />
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

export function ContentThemeCardStatic({
  theme,
  index,
}: {
  theme: ContentTheme;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-muted-foreground/60">
                {String(index + 1).padStart(2, "0")}
              </span>
              <CardTitle className="text-base">{theme.name}</CardTitle>
              <Badge
                variant="outline"
                className={`text-xs ${frequencyColors[theme.frequencyTier]}`}
              >
                {frequencyLabels[theme.frequencyTier]}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
              {theme.componentOptions.map((opt, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="text-xs font-normal"
                >
                  {opt.name}
                </Badge>
              ))}
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-md p-1.5 hover:bg-muted transition-colors"
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-0 border-t">
          <div className="mt-3 space-y-1">
            <DetailSection
              icon={Lightbulb}
              title="Considerations"
              items={theme.considerations}
              defaultOpen
            />
            <DetailSection
              icon={MessageSquare}
              title="Client Discovery Questions"
              items={theme.clientDiscoveryQuestions}
            />
            <DetailSection
              icon={ClipboardList}
              title="Information & Assets Needed"
              items={theme.informationAndAssets}
            />
            <DetailSection
              icon={Factory}
              title="Industry Notes"
              items={theme.industryNotes}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
