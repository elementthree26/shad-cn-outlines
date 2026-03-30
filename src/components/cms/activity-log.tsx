"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  FileText,
  Layers,
  Paintbrush,
  Workflow,
  ArrowRightLeft,
  Download,
  FolderOpen,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ActivityEntry, getActivityLog, clearActivityLog } from "@/lib/activity-log";

const categoryIcons: Record<ActivityEntry["category"], typeof Clock> = {
  page: FileText,
  section: Layers,
  style: Paintbrush,
  phase: Workflow,
  redirect: ArrowRightLeft,
  export: Download,
  project: FolderOpen,
};

const categoryColors: Record<ActivityEntry["category"], string> = {
  page: "text-blue-600",
  section: "text-purple-600",
  style: "text-pink-600",
  phase: "text-amber-600",
  redirect: "text-red-600",
  export: "text-green-600",
  project: "text-cyan-600",
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function ActivityLog({ projectId }: { projectId: string }) {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setEntries(getActivityLog(projectId));
  }, [projectId]);

  const visible = showAll ? entries : entries.slice(0, 10);

  if (entries.length === 0) {
    return (
      <div className="text-center py-6 text-xs text-muted-foreground">
        No activity yet. Actions will be logged here as you work.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">{entries.length} events</span>
        <Button
          size="xs"
          variant="ghost"
          className="text-destructive gap-1"
          onClick={() => {
            clearActivityLog(projectId);
            setEntries([]);
          }}
        >
          <Trash2 className="h-2.5 w-2.5" /> Clear
        </Button>
      </div>
      {visible.map((entry) => {
        const Icon = categoryIcons[entry.category];
        return (
          <div key={entry.id} className="flex items-start gap-2.5 py-1.5">
            <Icon className={`h-3.5 w-3.5 mt-0.5 flex-shrink-0 ${categoryColors[entry.category]}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs">
                <span className="font-medium">{entry.action}</span>
                {entry.detail && (
                  <span className="text-muted-foreground"> — {entry.detail}</span>
                )}
              </p>
            </div>
            <span className="text-[10px] text-muted-foreground flex-shrink-0">
              {timeAgo(entry.timestamp)}
            </span>
          </div>
        );
      })}
      {entries.length > 10 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="text-xs text-primary hover:underline mt-1"
        >
          Show all {entries.length} events
        </button>
      )}
    </div>
  );
}
