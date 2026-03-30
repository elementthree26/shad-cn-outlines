"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Circle,
  Clock,
  Lock,
  Shield,
  Unlock,
  User,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Project,
  ProjectPhase,
  PhaseStatus,
  ChecklistItem,
  phaseDefinitions,
} from "@/lib/project-types";

const statusColors: Record<PhaseStatus, string> = {
  "not-started": "bg-muted text-muted-foreground",
  "in-progress": "bg-blue-100 text-blue-800 border-blue-300",
  review: "bg-amber-100 text-amber-800 border-amber-300",
  approved: "bg-green-100 text-green-800 border-green-300",
};

const statusLabels: Record<PhaseStatus, string> = {
  "not-started": "Not Started",
  "in-progress": "In Progress",
  review: "In Review",
  approved: "Approved",
};

const statusOptions: PhaseStatus[] = [
  "not-started",
  "in-progress",
  "review",
  "approved",
];

const humanRoleIcons: Record<string, typeof User> = {
  "Humans Lead": User,
  "Humans Approve": Shield,
  "Humans Supervise": User,
  "Humans Verify": Check,
  Continuous: Clock,
};

function PhaseCard({
  phase,
  definition,
  onUpdate,
}: {
  phase: ProjectPhase;
  definition: (typeof phaseDefinitions)[number];
  onUpdate: (updated: ProjectPhase) => void;
}) {
  const [expanded, setExpanded] = useState(phase.status === "in-progress");
  const checkedCount = phase.checklist.filter((c) => c.checked).length;
  const totalCount = phase.checklist.length;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;
  const RoleIcon = humanRoleIcons[definition.humanRole] || User;

  const toggleCheck = (itemId: string) => {
    onUpdate({
      ...phase,
      checklist: phase.checklist.map((c) =>
        c.id === itemId ? { ...c, checked: !c.checked } : c
      ),
    });
  };

  const updateItemNotes = (itemId: string, notes: string) => {
    onUpdate({
      ...phase,
      checklist: phase.checklist.map((c) =>
        c.id === itemId ? { ...c, notes } : c
      ),
    });
  };

  const approveGate = () => {
    onUpdate({
      ...phase,
      gateApproved: true,
      gateApprovedDate: new Date().toISOString(),
      status: "approved",
    });
  };

  return (
    <div
      className={`rounded-lg border transition-all ${
        phase.status === "in-progress"
          ? "border-blue-300 bg-blue-50/30"
          : phase.status === "approved"
          ? "border-green-200 bg-green-50/20"
          : "border-border"
      }`}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center gap-3 text-left"
      >
        {/* Status indicator */}
        <div className="relative">
          {phase.status === "approved" ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : phase.status === "in-progress" ? (
            <div className="h-5 w-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            </div>
          ) : phase.status === "review" ? (
            <AlertCircle className="h-5 w-5 text-amber-500" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground/30" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{definition.name}</span>
            <Badge variant="outline" className={`text-[10px] ${statusColors[phase.status]}`}>
              {statusLabels[phase.status]}
            </Badge>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <RoleIcon className="h-2.5 w-2.5" /> {definition.humanRole}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {definition.timing}
            </span>
            {totalCount > 0 && (
              <span className="text-[10px] text-muted-foreground">
                {checkedCount}/{totalCount} tasks
              </span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden flex-shrink-0">
          <div
            className={`h-full rounded-full transition-all ${
              phase.status === "approved"
                ? "bg-green-500"
                : "bg-blue-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {expanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 border-t mt-0 pt-3">
          {/* Status control */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-muted-foreground">Status:</span>
            <div className="flex gap-1">
              {statusOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => onUpdate({ ...phase, status: s })}
                  className={`rounded px-2 py-0.5 text-[10px] font-medium transition-colors ${
                    phase.status === s
                      ? statusColors[s]
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {statusLabels[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Phase notes */}
          <div className="mb-3">
            <textarea
              placeholder="Phase notes..."
              value={phase.notes}
              onChange={(e) => onUpdate({ ...phase, notes: e.target.value })}
              rows={2}
              className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 resize-none"
            />
          </div>

          {/* Checklist */}
          <div className="space-y-1">
            {phase.checklist.map((item) => (
              <div key={item.id} className="group flex items-start gap-2 rounded px-1.5 py-1 hover:bg-muted/30">
                <button
                  onClick={() => toggleCheck(item.id)}
                  className={`mt-0.5 flex-shrink-0 h-4 w-4 rounded border transition-colors ${
                    item.checked
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-border hover:border-primary"
                  }`}
                >
                  {item.checked && <Check className="h-3 w-3 mx-auto" />}
                </button>
                <div className="flex-1 min-w-0">
                  <span
                    className={`text-xs ${
                      item.checked
                        ? "text-muted-foreground line-through"
                        : "text-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                  {/* Inline notes - show on hover or if has content */}
                  <input
                    type="text"
                    placeholder="Add note..."
                    value={item.notes}
                    onChange={(e) => updateItemNotes(item.id, e.target.value)}
                    className={`block w-full text-[10px] bg-transparent outline-none text-muted-foreground mt-0.5 ${
                      item.notes ? "" : "opacity-0 group-hover:opacity-100"
                    } transition-opacity`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Gate approval */}
          <div className="mt-4 pt-3 border-t border-dashed">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {phase.gateApproved ? (
                  <Lock className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <Unlock className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <span className="text-xs font-medium">
                  Gate: {definition.gate}
                </span>
              </div>
              {phase.gateApproved ? (
                <div className="flex items-center gap-1.5">
                  <Badge className="bg-green-100 text-green-800 border-green-300 text-[10px]">
                    Approved
                  </Badge>
                  {phase.gateApprovedDate && (
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(phase.gateApprovedDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ) : (
                <Button
                  size="xs"
                  variant="outline"
                  className="gap-1 text-green-700 border-green-300 hover:bg-green-50"
                  onClick={approveGate}
                  disabled={progress < 80}
                >
                  <Check className="h-3 w-3" />
                  Approve Gate
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function PhaseTracker({
  project,
  onUpdate,
}: {
  project: Project;
  onUpdate: (project: Project) => void;
}) {
  const phases = project.phases || [];

  const updatePhase = (updated: ProjectPhase) => {
    const newPhases = phases.map((p) => (p.id === updated.id ? updated : p));
    onUpdate({ ...project, phases: newPhases });
  };

  // Overall progress
  const totalItems = phases.reduce((sum, p) => sum + p.checklist.length, 0);
  const checkedItems = phases.reduce(
    (sum, p) => sum + p.checklist.filter((c) => c.checked).length,
    0
  );
  const overallProgress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;
  const approvedPhases = phases.filter((p) => p.gateApproved).length;

  return (
    <div className="space-y-4">
      {/* Overall progress */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium">Overall Progress</span>
            <span className="text-xs text-muted-foreground">
              {approvedPhases}/7 phases • {checkedItems}/{totalItems} tasks
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Phase timeline */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {phases.map((phase, i) => {
          const def = phaseDefinitions.find((d) => d.id === phase.id);
          if (!def) return null;
          return (
            <div key={phase.id} className="flex items-center">
              <div
                className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                  statusColors[phase.status]
                }`}
              >
                {def.shortName}
              </div>
              {i < phases.length - 1 && (
                <div className={`w-4 h-px flex-shrink-0 ${
                  phase.gateApproved ? "bg-green-400" : "bg-border"
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Phase cards */}
      <div className="space-y-2">
        {phases.map((phase) => {
          const def = phaseDefinitions.find((d) => d.id === phase.id);
          if (!def) return null;
          return (
            <PhaseCard
              key={phase.id}
              phase={phase}
              definition={def}
              onUpdate={updatePhase}
            />
          );
        })}
      </div>
    </div>
  );
}
