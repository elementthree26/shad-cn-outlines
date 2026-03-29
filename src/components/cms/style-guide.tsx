"use client";

import { useState, useRef } from "react";
import { Upload, Paintbrush, RotateCcw, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface StyleGuide {
  // Colors
  primaryColor: string;
  primaryForeground: string;
  secondaryColor: string;
  secondaryForeground: string;
  accentColor: string;
  accentForeground: string;
  backgroundColor: string;
  foregroundColor: string;
  mutedColor: string;
  mutedForeground: string;
  cardColor: string;
  cardForeground: string;
  borderColor: string;

  // Typography
  headingFont: string;
  bodyFont: string;
  headingWeight: string;
  baseSize: string;

  // Shape
  borderRadius: string;
  buttonRadius: string;

  // Spacing
  sectionPadding: string;

  // Extras
  buttonStyle: "filled" | "outline" | "pill";
  cardShadow: "none" | "sm" | "md" | "lg";
  cardBorder: boolean;
}

export const defaultStyleGuide: StyleGuide = {
  primaryColor: "#171717",
  primaryForeground: "#fafafa",
  secondaryColor: "#f5f5f5",
  secondaryForeground: "#171717",
  accentColor: "#f5f5f5",
  accentForeground: "#171717",
  backgroundColor: "#ffffff",
  foregroundColor: "#0a0a0a",
  mutedColor: "#f5f5f5",
  mutedForeground: "#737373",
  cardColor: "#ffffff",
  cardForeground: "#0a0a0a",
  borderColor: "#e5e5e5",
  headingFont: "system-ui, sans-serif",
  bodyFont: "system-ui, sans-serif",
  headingWeight: "700",
  baseSize: "16",
  borderRadius: "8",
  buttonRadius: "8",
  sectionPadding: "32",
  buttonStyle: "filled",
  cardShadow: "none",
  cardBorder: true,
};

/** Convert a StyleGuide to a CSS variables object for inline style */
export function styleGuideToCSS(sg: StyleGuide): React.CSSProperties {
  return {
    "--sg-primary": sg.primaryColor,
    "--sg-primary-fg": sg.primaryForeground,
    "--sg-secondary": sg.secondaryColor,
    "--sg-secondary-fg": sg.secondaryForeground,
    "--sg-accent": sg.accentColor,
    "--sg-accent-fg": sg.accentForeground,
    "--sg-bg": sg.backgroundColor,
    "--sg-fg": sg.foregroundColor,
    "--sg-muted": sg.mutedColor,
    "--sg-muted-fg": sg.mutedForeground,
    "--sg-card": sg.cardColor,
    "--sg-card-fg": sg.cardForeground,
    "--sg-border": sg.borderColor,
    "--sg-heading-font": sg.headingFont,
    "--sg-body-font": sg.bodyFont,
    "--sg-heading-weight": sg.headingWeight,
    "--sg-base-size": `${sg.baseSize}px`,
    "--sg-radius": `${sg.borderRadius}px`,
    "--sg-btn-radius": sg.buttonStyle === "pill" ? "9999px" : `${sg.buttonRadius}px`,
    "--sg-section-py": `${sg.sectionPadding}px`,
    "--sg-card-shadow":
      sg.cardShadow === "none" ? "none"
        : sg.cardShadow === "sm" ? "0 1px 2px rgba(0,0,0,0.05)"
        : sg.cardShadow === "md" ? "0 4px 6px -1px rgba(0,0,0,0.1)"
        : "0 10px 15px -3px rgba(0,0,0,0.1)",
    "--sg-card-border": sg.cardBorder ? `1px solid ${sg.borderColor}` : "none",
  } as React.CSSProperties;
}

/** Parse an uploaded JSON style guide into our format */
function parseStyleGuideJSON(raw: string): Partial<StyleGuide> | null {
  try {
    const data = JSON.parse(raw);

    // Support various common style guide formats
    const result: Partial<StyleGuide> = {};

    // Direct format: { primaryColor: "#...", ... }
    if (data.primaryColor) Object.assign(result, data);

    // Figma / Tokens Studio format: { colors: { primary: "#..." } }
    if (data.colors) {
      const c = data.colors;
      if (c.primary) result.primaryColor = c.primary.value || c.primary;
      if (c.secondary) result.secondaryColor = c.secondary.value || c.secondary;
      if (c.accent) result.accentColor = c.accent.value || c.accent;
      if (c.background) result.backgroundColor = c.background.value || c.background;
      if (c.foreground) result.foregroundColor = c.foreground.value || c.foreground;
      if (c.muted) result.mutedColor = c.muted.value || c.muted;
      if (c.border) result.borderColor = c.border.value || c.border;
      if (c.card) result.cardColor = c.card.value || c.card;
    }

    // Tailwind CSS config format: { theme: { colors: { primary: "#..." } } }
    if (data.theme?.colors) {
      const c = data.theme.colors;
      if (c.primary) result.primaryColor = typeof c.primary === "string" ? c.primary : c.primary.DEFAULT || c.primary[500];
      if (c.secondary) result.secondaryColor = typeof c.secondary === "string" ? c.secondary : c.secondary.DEFAULT || c.secondary[100];
      if (c.accent) result.accentColor = typeof c.accent === "string" ? c.accent : c.accent.DEFAULT || c.accent[500];
    }

    // Typography
    if (data.fonts?.heading || data.typography?.headingFont || data.headingFont)
      result.headingFont = data.fonts?.heading || data.typography?.headingFont || data.headingFont;
    if (data.fonts?.body || data.typography?.bodyFont || data.bodyFont)
      result.bodyFont = data.fonts?.body || data.typography?.bodyFont || data.bodyFont;
    if (data.typography?.baseSize || data.baseSize)
      result.baseSize = String(data.typography?.baseSize || data.baseSize).replace("px", "");

    // Shape
    if (data.borderRadius !== undefined)
      result.borderRadius = String(data.borderRadius).replace("px", "");
    if (data.radii?.default || data.radius)
      result.borderRadius = String(data.radii?.default || data.radius).replace("px", "");

    // Shadows / borders
    if (data.cardShadow) result.cardShadow = data.cardShadow;
    if (data.cardBorder !== undefined) result.cardBorder = data.cardBorder;
    if (data.buttonStyle) result.buttonStyle = data.buttonStyle;

    return Object.keys(result).length > 0 ? result : null;
  } catch {
    return null;
  }
}

// --- Color input ---
function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-6 w-6 rounded border border-border cursor-pointer p-0 bg-transparent"
      />
      <span className="text-xs text-muted-foreground flex-1 truncate">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-[72px] rounded border border-border bg-background px-1.5 py-0.5 text-xs font-mono outline-none focus:border-primary"
      />
    </div>
  );
}

function SelectField({ label, value, options, onChange }: {
  label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border border-border bg-background px-1.5 py-0.5 text-xs outline-none focus:border-primary"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function RangeField({ label, value, min, max, unit, onChange }: {
  label: string; value: string; min: number; max: number; unit: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground flex-1">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-20 h-1 accent-primary"
      />
      <span className="text-xs font-mono text-muted-foreground w-10 text-right">{value}{unit}</span>
    </div>
  );
}

// --- Collapsible section ---
function Section({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 w-full text-left py-1">
        {open ? <ChevronDown className="h-3 w-3 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
        <span className="text-xs font-semibold text-foreground">{title}</span>
      </button>
      {open && <div className="pl-4.5 space-y-1.5 pb-2 mt-1">{children}</div>}
    </div>
  );
}

// --- Main component ---
export function StyleGuidePanel({
  styleGuide,
  onChange,
}: {
  styleGuide: StyleGuide;
  onChange: (sg: StyleGuide) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const update = (patch: Partial<StyleGuide>) => onChange({ ...styleGuide, ...patch });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const raw = ev.target?.result as string;
      const parsed = parseStyleGuideJSON(raw);
      if (parsed) {
        onChange({ ...styleGuide, ...parsed });
        setUploadError(null);
      } else {
        setUploadError("Could not parse style guide. Use JSON format.");
      }
    };
    reader.readAsText(file);
    // Reset file input so same file can be re-uploaded
    e.target.value = "";
  };

  const handlePaste = () => {
    navigator.clipboard.readText().then((text) => {
      const parsed = parseStyleGuideJSON(text);
      if (parsed) {
        onChange({ ...styleGuide, ...parsed });
        setUploadError(null);
      } else {
        setUploadError("Clipboard doesn't contain valid style guide JSON.");
      }
    }).catch(() => {
      setUploadError("Could not read clipboard.");
    });
  };

  return (
    <div className="space-y-3">
      {/* Upload / Paste */}
      <div className="flex gap-1.5">
        <Button
          variant="outline"
          size="xs"
          className="flex-1 gap-1"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-3 w-3" /> Upload JSON
        </Button>
        <Button
          variant="outline"
          size="xs"
          className="flex-1 gap-1"
          onClick={handlePaste}
        >
          <Paintbrush className="h-3 w-3" /> Paste
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => onChange({ ...defaultStyleGuide })}
          title="Reset to default"
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>
      {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}

      {/* Live color preview */}
      <div className="flex gap-1 rounded-md overflow-hidden h-5">
        {[styleGuide.primaryColor, styleGuide.secondaryColor, styleGuide.accentColor, styleGuide.backgroundColor, styleGuide.mutedColor, styleGuide.borderColor].map((c, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>

      {/* Editable sections */}
      <Section title="Colors" defaultOpen>
        <ColorField label="Primary" value={styleGuide.primaryColor} onChange={(v) => update({ primaryColor: v })} />
        <ColorField label="Primary Text" value={styleGuide.primaryForeground} onChange={(v) => update({ primaryForeground: v })} />
        <ColorField label="Background" value={styleGuide.backgroundColor} onChange={(v) => update({ backgroundColor: v })} />
        <ColorField label="Text" value={styleGuide.foregroundColor} onChange={(v) => update({ foregroundColor: v })} />
        <ColorField label="Accent" value={styleGuide.accentColor} onChange={(v) => update({ accentColor: v })} />
        <ColorField label="Muted" value={styleGuide.mutedColor} onChange={(v) => update({ mutedColor: v })} />
        <ColorField label="Muted Text" value={styleGuide.mutedForeground} onChange={(v) => update({ mutedForeground: v })} />
        <ColorField label="Card" value={styleGuide.cardColor} onChange={(v) => update({ cardColor: v })} />
        <ColorField label="Border" value={styleGuide.borderColor} onChange={(v) => update({ borderColor: v })} />
      </Section>

      <Section title="Typography">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">Heading font</span>
            <input
              type="text"
              value={styleGuide.headingFont}
              onChange={(e) => update({ headingFont: e.target.value })}
              className="w-32 rounded border border-border bg-background px-1.5 py-0.5 text-xs outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">Body font</span>
            <input
              type="text"
              value={styleGuide.bodyFont}
              onChange={(e) => update({ bodyFont: e.target.value })}
              className="w-32 rounded border border-border bg-background px-1.5 py-0.5 text-xs outline-none focus:border-primary"
            />
          </div>
          <SelectField
            label="Heading weight"
            value={styleGuide.headingWeight}
            options={[
              { value: "400", label: "Regular" },
              { value: "500", label: "Medium" },
              { value: "600", label: "Semibold" },
              { value: "700", label: "Bold" },
              { value: "800", label: "Extra Bold" },
              { value: "900", label: "Black" },
            ]}
            onChange={(v) => update({ headingWeight: v })}
          />
          <RangeField label="Base size" value={styleGuide.baseSize} min={12} max={22} unit="px" onChange={(v) => update({ baseSize: v })} />
        </div>
      </Section>

      <Section title="Shape & Style">
        <RangeField label="Border radius" value={styleGuide.borderRadius} min={0} max={24} unit="px" onChange={(v) => update({ borderRadius: v })} />
        <RangeField label="Button radius" value={styleGuide.buttonRadius} min={0} max={24} unit="px" onChange={(v) => update({ buttonRadius: v })} />
        <RangeField label="Section padding" value={styleGuide.sectionPadding} min={16} max={64} unit="px" onChange={(v) => update({ sectionPadding: v })} />
        <SelectField
          label="Button style"
          value={styleGuide.buttonStyle}
          options={[
            { value: "filled", label: "Filled" },
            { value: "outline", label: "Outline" },
            { value: "pill", label: "Pill" },
          ]}
          onChange={(v) => update({ buttonStyle: v as StyleGuide["buttonStyle"] })}
        />
        <SelectField
          label="Card shadow"
          value={styleGuide.cardShadow}
          options={[
            { value: "none", label: "None" },
            { value: "sm", label: "Small" },
            { value: "md", label: "Medium" },
            { value: "lg", label: "Large" },
          ]}
          onChange={(v) => update({ cardShadow: v as StyleGuide["cardShadow"] })}
        />
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">Card border</span>
          <button
            onClick={() => update({ cardBorder: !styleGuide.cardBorder })}
            className={`h-4 w-7 rounded-full transition-colors ${styleGuide.cardBorder ? "bg-primary" : "bg-muted"}`}
          >
            <span className={`block h-3 w-3 rounded-full bg-white shadow transition-transform ${styleGuide.cardBorder ? "translate-x-3.5" : "translate-x-0.5"}`} />
          </button>
        </div>
      </Section>
    </div>
  );
}
