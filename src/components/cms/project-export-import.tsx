"use client";

import { useRef, useState } from "react";
import { Download, Upload, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Project } from "@/lib/project-types";
import { saveProject } from "@/lib/project-store";

export function ProjectExportButton({ project }: { project: Project }) {
  const handleExport = () => {
    const data = JSON.stringify(project, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(project.clientName || "project").toLowerCase().replace(/\s+/g, "-")}-backup.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button size="xs" variant="ghost" className="gap-1" onClick={handleExport}>
      <Download className="h-3 w-3" /> Backup
    </Button>
  );
}

export function ProjectImportButton({ onImport }: { onImport: (project: Project) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as Project;
        if (!data.clientName && !data.sitemap) {
          setError("Invalid project file");
          return;
        }
        // Generate new ID so it doesn't overwrite existing
        const imported = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          clientName: data.clientName ? `${data.clientName} (Imported)` : "Imported Project",
        };
        const saved = saveProject(imported);
        onImport(saved);
      } catch {
        setError("Could not parse file");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <>
      <Button size="sm" variant="outline" className="gap-1.5" onClick={() => fileRef.current?.click()}>
        <Upload className="h-3.5 w-3.5" /> Import Project
      </Button>
      <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleFile} />
      {error && <span className="text-xs text-destructive ml-2">{error}</span>}
    </>
  );
}
