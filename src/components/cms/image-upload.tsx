"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

/**
 * Converts a File to a data URL string.
 */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Inline image upload: supports file picker, drag-drop, and paste.
 * Returns a data URL so images work without a server.
 */
export function ImageUpload({
  value,
  onChange,
  placeholder = "Upload image",
  compact = false,
}: {
  value: string;
  onChange: (dataUrl: string) => void;
  placeholder?: string;
  compact?: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const dataUrl = await fileToDataUrl(file);
    onChange(dataUrl);
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) handleFile(file);
        return;
      }
    }
  }, [handleFile]);

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <ImageIcon className="h-3 w-3 text-muted-foreground flex-shrink-0" />
        {value ? (
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <img src={value} alt="" className="h-6 w-6 rounded object-cover flex-shrink-0" />
            <span className="text-xs text-muted-foreground truncate flex-1">Image uploaded</span>
            <button onClick={() => onChange("")} className="text-muted-foreground/50 hover:text-destructive flex-shrink-0">
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            onPaste={handlePaste}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            className={`flex-1 rounded-md border border-dashed px-2 py-1 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors text-left ${
              dragOver ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            {placeholder} or paste
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onPaste={handlePaste}
      tabIndex={0}
      className={`relative rounded-lg border-2 border-dashed transition-colors cursor-pointer outline-none focus:border-primary ${
        dragOver ? "border-primary bg-primary/5" : value ? "border-border" : "border-border hover:border-primary/40"
      }`}
      onClick={() => { if (!value) fileInputRef.current?.click(); }}
    >
      {value ? (
        <div className="relative">
          <img src={value} alt="" className="w-full rounded-lg object-cover max-h-48" />
          <button
            onClick={(e) => { e.stopPropagation(); onChange(""); }}
            className="absolute top-1.5 right-1.5 rounded-full bg-background/80 p-1 text-muted-foreground hover:text-destructive transition-colors shadow-sm"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
          <Upload className="h-6 w-6 text-muted-foreground/40 mb-2" />
          <p className="text-xs text-muted-foreground">
            Drop image, click to browse, or <span className="text-primary font-medium">paste</span>
          </p>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/**
 * Style guide image upload: larger drop zone specifically for Figma frames.
 * Returns the File object so the caller can extract colors.
 */
export function StyleGuideImageUpload({
  onFile,
  previewUrl,
}: {
  onFile: (file: File) => void;
  previewUrl: string | null;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    onFile(file);
  }, [onFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) handleFile(file);
        return;
      }
    }
  }, [handleFile]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onPaste={handlePaste}
      tabIndex={0}
      onClick={() => fileInputRef.current?.click()}
      className={`relative rounded-lg border-2 border-dashed transition-colors cursor-pointer outline-none focus:border-primary ${
        dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
      }`}
    >
      {previewUrl ? (
        <img src={previewUrl} alt="Style guide" className="w-full rounded-lg object-contain max-h-32" />
      ) : (
        <div className="flex flex-col items-center justify-center py-4 px-3 text-center">
          <ImageIcon className="h-5 w-5 text-muted-foreground/40 mb-1.5" />
          <p className="text-[10px] text-muted-foreground leading-tight">
            Drop a Figma style guide screenshot, or <span className="text-primary font-medium">paste</span> an image
          </p>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
