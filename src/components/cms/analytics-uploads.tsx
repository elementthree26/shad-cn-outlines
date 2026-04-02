"use client";

import { useState, useRef, useCallback } from "react";
import {
  Upload,
  FileSpreadsheet,
  Image as ImageIcon,
  Trash2,
  Eye,
  EyeOff,
  BarChart3,
  Table2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/lib/project-types";
import { AnalyticsUpload, parseCSV, summarizeCSV, ParsedCSV } from "@/lib/csv-parser";

function fileToText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const sourceLabels: Record<string, string> = {
  ga4: "Google Analytics 4",
  "search-console": "Search Console",
  semrush: "SEMrush",
  pagespeed: "PageSpeed",
  unknown: "Custom Data",
};

const sourceColors: Record<string, string> = {
  ga4: "bg-orange-100 text-orange-800 border-orange-300",
  "search-console": "bg-blue-100 text-blue-800 border-blue-300",
  semrush: "bg-purple-100 text-purple-800 border-purple-300",
  pagespeed: "bg-green-100 text-green-800 border-green-300",
  unknown: "bg-gray-100 text-gray-800 border-gray-300",
};

function CSVPreview({ csv }: { csv: ParsedCSV }) {
  const { keyMetrics, topRows } = summarizeCSV(csv);
  const [showRaw, setShowRaw] = useState(false);

  return (
    <div className="space-y-3">
      {/* Key metrics */}
      {keyMetrics.length > 0 && (
        <div className="flex gap-3">
          {keyMetrics.map((m, i) => (
            <div key={i} className="rounded border px-3 py-2 text-center flex-1">
              <p className="text-lg font-bold">{m.value}</p>
              <p className="text-[10px] text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Top rows */}
      {topRows.length > 0 && (
        <div className="space-y-1">
          {topRows.map((r, i) => (
            <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-border/30">
              <span className="truncate flex-1 font-mono">{r.label}</span>
              <span className="font-bold ml-3 flex-shrink-0">{r.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Raw table toggle */}
      <button onClick={() => setShowRaw(!showRaw)} className="text-[10px] text-primary hover:underline">
        {showRaw ? "Hide" : "Show"} raw data ({csv.rows.length} rows)
      </button>
      {showRaw && (
        <div className="overflow-x-auto max-h-48 overflow-y-auto">
          <table className="text-[10px] border-collapse w-full">
            <thead><tr className="bg-muted">
              {csv.headers.map((h, i) => <th key={i} className="text-left p-1.5 font-bold border">{h}</th>)}
            </tr></thead>
            <tbody>
              {csv.rows.slice(0, 50).map((row, ri) => (
                <tr key={ri} className="border-t">
                  {row.map((cell, ci) => <td key={ci} className="p-1.5 border">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function UploadCard({
  upload,
  onRemove,
  onUpdate,
}: {
  upload: AnalyticsUpload;
  onRemove: () => void;
  onUpdate: (patch: Partial<AnalyticsUpload>) => void;
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {upload.type === "csv" ? (
            <FileSpreadsheet className="h-4 w-4 text-green-600 flex-shrink-0" />
          ) : (
            <ImageIcon className="h-4 w-4 text-blue-600 flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate">{upload.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {upload.csv && (
                <Badge variant="outline" className={`text-[8px] ${sourceColors[upload.csv.source]}`}>
                  {sourceLabels[upload.csv.source]}
                </Badge>
              )}
              {upload.type === "screenshot" && (
                <Badge variant="outline" className="text-[8px]">Screenshot</Badge>
              )}
              <span className="text-[10px] text-muted-foreground">
                {new Date(upload.uploadedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onUpdate({ includeInDeck: !upload.includeInDeck })}
            className={`rounded p-1 ${upload.includeInDeck ? "text-primary" : "text-muted-foreground/40"} hover:bg-muted`}
            title={upload.includeInDeck ? "Included in deck" : "Not in deck"}
          >
            {upload.includeInDeck ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          </button>
          <button onClick={onRemove} className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-muted">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Caption */}
      <input
        className="w-full rounded border border-border bg-background px-2.5 py-1.5 text-xs outline-none focus:border-primary mb-3"
        placeholder="Slide caption / title for this data"
        value={upload.caption}
        onChange={(e) => onUpdate({ caption: e.target.value })}
      />

      {/* Preview */}
      {upload.csv && <CSVPreview csv={upload.csv} />}
      {upload.imageUrl && (
        <img src={upload.imageUrl} alt={upload.caption} className="w-full rounded-lg border max-h-64 object-contain" />
      )}
    </div>
  );
}

export function AnalyticsUploadsPanel({
  project,
  onUpdate,
}: {
  project: Project;
  onUpdate: (project: Project) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploads: AnalyticsUpload[] = (project as any).analyticsUploads || [];

  const updateUploads = (newUploads: AnalyticsUpload[]) => {
    onUpdate({ ...project, analyticsUploads: newUploads } as any);
  };

  const handleFiles = useCallback(async (files: FileList) => {
    const newUploads: AnalyticsUpload[] = [];

    for (const file of Array.from(files)) {
      const isImage = file.type.startsWith("image/");
      const isCSV = file.name.endsWith(".csv") || file.type === "text/csv";

      if (isCSV) {
        const text = await fileToText(file);
        const csv = parseCSV(text, file.name);
        newUploads.push({
          id: crypto.randomUUID(),
          type: "csv",
          name: file.name,
          uploadedAt: new Date().toISOString(),
          csv,
          caption: csv.title,
          includeInDeck: true,
        });
      } else if (isImage) {
        const dataUrl = await fileToDataUrl(file);
        newUploads.push({
          id: crypto.randomUUID(),
          type: "screenshot",
          name: file.name,
          uploadedAt: new Date().toISOString(),
          imageUrl: dataUrl,
          caption: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
          includeInDeck: true,
        });
      }
    }

    updateUploads([...uploads, ...newUploads]);
  }, [uploads, updateUploads]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    const files: File[] = [];
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) files.push(file);
      }
    }
    if (files.length > 0) {
      const dt = new DataTransfer();
      files.forEach((f) => dt.items.add(f));
      handleFiles(dt.files);
    }
  }, [handleFiles]);

  const removeUpload = (id: string) => updateUploads(uploads.filter((u) => u.id !== id));
  const updateUpload = (id: string, patch: Partial<AnalyticsUpload>) => {
    updateUploads(uploads.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  };

  const csvCount = uploads.filter((u) => u.type === "csv").length;
  const imgCount = uploads.filter((u) => u.type === "screenshot").length;
  const deckCount = uploads.filter((u) => u.includeInDeck).length;

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onPaste={handlePaste}
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        className="rounded-lg border-2 border-dashed border-border hover:border-primary/50 p-6 text-center cursor-pointer transition-colors outline-none focus:border-primary"
      >
        <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground/40" />
        <p className="text-xs text-muted-foreground">
          Drop <strong>CSV files</strong> (GA4, Search Console, SEMrush) or <strong>screenshots</strong> here
        </p>
        <p className="text-[10px] text-muted-foreground/60 mt-1">
          Or click to browse • Also supports paste (Cmd+V)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {/* Summary */}
      {uploads.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {csvCount > 0 && <Badge variant="secondary"><FileSpreadsheet className="h-3 w-3 mr-1" />{csvCount} CSV{csvCount !== 1 ? "s" : ""}</Badge>}
          {imgCount > 0 && <Badge variant="secondary"><ImageIcon className="h-3 w-3 mr-1" />{imgCount} screenshot{imgCount !== 1 ? "s" : ""}</Badge>}
          <span className="ml-auto">{deckCount} included in deck</span>
        </div>
      )}

      {/* Upload cards */}
      <div className="space-y-3">
        {uploads.map((upload) => (
          <UploadCard
            key={upload.id}
            upload={upload}
            onRemove={() => removeUpload(upload.id)}
            onUpdate={(patch) => updateUpload(upload.id, patch)}
          />
        ))}
      </div>
    </div>
  );
}
