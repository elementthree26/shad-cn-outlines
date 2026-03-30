"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  ArrowRight,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Project, RedirectEntry } from "@/lib/project-types";
import { generateRedirectMap } from "@/lib/sitemap-suggestions";

const inputCls =
  "w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/30";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "bg-amber-100 text-amber-800 border-amber-300" },
  mapped: { label: "Mapped", icon: AlertCircle, color: "bg-blue-100 text-blue-800 border-blue-300" },
  verified: { label: "Verified", icon: Check, color: "bg-green-100 text-green-800 border-green-300" },
};

export function RedirectMapEditor({
  project,
  onUpdate,
}: {
  project: Project;
  onUpdate: (project: Project) => void;
}) {
  const redirects = project.redirects || [];
  const [showAdd, setShowAdd] = useState(false);
  const [newOld, setNewOld] = useState("");
  const [newNew, setNewNew] = useState("");

  const updateRedirect = (id: string, patch: Partial<RedirectEntry>) => {
    onUpdate({
      ...project,
      redirects: redirects.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    });
  };

  const removeRedirect = (id: string) => {
    onUpdate({
      ...project,
      redirects: redirects.filter((r) => r.id !== id),
    });
  };

  const addRedirect = () => {
    if (!newOld.trim()) return;
    const entry: RedirectEntry = {
      id: crypto.randomUUID(),
      oldUrl: newOld.trim(),
      newUrl: newNew.trim(),
      status: newNew.trim() ? "mapped" : "pending",
      notes: "",
    };
    onUpdate({ ...project, redirects: [...redirects, entry] });
    setNewOld("");
    setNewNew("");
    setShowAdd(false);
  };

  const autoGenerate = async () => {
    if (!project.currentSiteUrl) {
      alert("Set the current site URL in project setup first.");
      return;
    }
    try {
      const res = await fetch(
        `/api/scrape-sitemap?url=${encodeURIComponent(project.currentSiteUrl)}`
      );
      if (!res.ok) throw new Error("Failed to scrape");
      const oldPages = await res.json();
      const generated = generateRedirectMap(oldPages, project.sitemap);
      const entries: RedirectEntry[] = generated.map((g) => ({
        id: crypto.randomUUID(),
        ...g,
      }));
      onUpdate({ ...project, redirects: [...redirects, ...entries] });
    } catch {
      alert("Could not scrape the current site. Add redirects manually.");
    }
  };

  const exportCsv = () => {
    const header = "old_url,new_url,status,notes";
    const rows = redirects.map(
      (r) => `${r.oldUrl},${r.newUrl},${r.status},"${r.notes.replace(/"/g, '""')}"`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.clientName || "project"}-redirects.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const pendingCount = redirects.filter((r) => r.status === "pending").length;
  const mappedCount = redirects.filter((r) => r.status === "mapped").length;
  const verifiedCount = redirects.filter((r) => r.status === "verified").length;

  return (
    <div className="space-y-3">
      {/* Summary bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">{redirects.length} redirects</span>
          {pendingCount > 0 && (
            <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-700">
              {pendingCount} pending
            </Badge>
          )}
          {mappedCount > 0 && (
            <Badge variant="outline" className="text-[10px] border-blue-300 text-blue-700">
              {mappedCount} mapped
            </Badge>
          )}
          {verifiedCount > 0 && (
            <Badge variant="outline" className="text-[10px] border-green-300 text-green-700">
              {verifiedCount} verified
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Button size="xs" variant="outline" className="gap-1" onClick={autoGenerate}>
            <Sparkles className="h-3 w-3" /> Auto-Generate
          </Button>
          {redirects.length > 0 && (
            <Button size="xs" variant="ghost" className="gap-1" onClick={exportCsv}>
              <Download className="h-3 w-3" /> CSV
            </Button>
          )}
          <Button size="xs" variant="outline" className="gap-1" onClick={() => setShowAdd(true)}>
            <Plus className="h-3 w-3" /> Add
          </Button>
        </div>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="flex items-center gap-2 rounded-lg border bg-muted/20 p-2">
          <input
            className={inputCls}
            placeholder="/old-path"
            value={newOld}
            onChange={(e) => setNewOld(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addRedirect()}
          />
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <input
            className={inputCls}
            placeholder="/new-path"
            value={newNew}
            onChange={(e) => setNewNew(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addRedirect()}
          />
          <Button size="xs" onClick={addRedirect}>Add</Button>
          <button onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground">
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Redirect table */}
      {redirects.length > 0 ? (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/30 text-left">
                <th className="px-3 py-2 font-medium text-muted-foreground">Old URL</th>
                <th className="px-1 py-2 w-6"></th>
                <th className="px-3 py-2 font-medium text-muted-foreground">New URL</th>
                <th className="px-3 py-2 font-medium text-muted-foreground w-20">Status</th>
                <th className="px-3 py-2 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {redirects.map((r) => {
                const cfg = statusConfig[r.status];
                const StatusIcon = cfg.icon;
                return (
                  <tr key={r.id} className="border-t hover:bg-muted/20">
                    <td className="px-3 py-1.5">
                      <span className="font-mono text-muted-foreground">{r.oldUrl}</span>
                    </td>
                    <td className="px-1 py-1.5">
                      <ArrowRight className="h-3 w-3 text-muted-foreground/40" />
                    </td>
                    <td className="px-3 py-1.5">
                      <input
                        className="w-full bg-transparent outline-none font-mono focus:text-primary"
                        value={r.newUrl}
                        onChange={(e) => updateRedirect(r.id, { newUrl: e.target.value })}
                        placeholder="/new-path"
                      />
                    </td>
                    <td className="px-3 py-1.5">
                      <button
                        onClick={() => {
                          const next =
                            r.status === "pending"
                              ? "mapped"
                              : r.status === "mapped"
                              ? "verified"
                              : "pending";
                          updateRedirect(r.id, { status: next });
                        }}
                      >
                        <Badge variant="outline" className={`text-[9px] cursor-pointer ${cfg.color}`}>
                          <StatusIcon className="h-2.5 w-2.5 mr-0.5" />
                          {cfg.label}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-3 py-1.5 text-right">
                      <button
                        onClick={() => removeRedirect(r.id)}
                        className="text-muted-foreground/40 hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <p className="text-xs text-muted-foreground">
            No redirects yet. Click "Auto-Generate" to scan the current site and map old URLs to your new sitemap.
          </p>
        </div>
      )}
    </div>
  );
}
