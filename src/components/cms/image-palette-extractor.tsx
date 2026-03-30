"use client";

/**
 * Extracts a style guide from an uploaded image (e.g. a Figma style guide frame).
 * Uses Canvas API to sample colors and identify the dominant palette.
 */

export interface ExtractedPalette {
  colors: { hex: string; count: number; role?: string }[];
  dominantDark: string;
  dominantLight: string;
  dominantAccent: string;
}

/** Convert RGB to hex */
function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
}

/** Get luminance of a color (0-1) */
function luminance(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/** Get saturation of a color (0-1) */
function saturation(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  if (max === 0) return 0;
  return (max - min) / max;
}

/** Quantize a color to reduce similar shades */
function quantize(r: number, g: number, b: number, step = 16): [number, number, number] {
  return [
    Math.round(r / step) * step,
    Math.round(g / step) * step,
    Math.round(b / step) * step,
  ];
}

/** Distance between two colors */
function colorDistance(a: [number, number, number], b: [number, number, number]): number {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}

/**
 * Extract the dominant color palette from an image.
 * Returns sorted by frequency with role assignments.
 */
export function extractPaletteFromImage(imageData: ImageData): ExtractedPalette {
  const { data, width, height } = imageData;
  const colorMap = new Map<string, { r: number; g: number; b: number; count: number }>();

  // Sample every 2nd pixel for speed on large images
  const step = width * height > 500000 ? 4 : 2;

  for (let i = 0; i < data.length; i += 4 * step) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Skip transparent/near-transparent pixels
    if (a < 200) continue;

    const [qr, qg, qb] = quantize(r, g, b, 24);
    const key = `${qr},${qg},${qb}`;

    const existing = colorMap.get(key);
    if (existing) {
      existing.count++;
    } else {
      colorMap.set(key, { r: qr, g: qg, b: qb, count: 1 });
    }
  }

  // Sort by frequency
  const sorted = [...colorMap.values()].sort((a, b) => b.count - a.count);

  // Filter out pure white/near-white and pure black/near-black noise
  // but keep them tracked separately
  const whites: typeof sorted = [];
  const blacks: typeof sorted = [];
  const midtones: typeof sorted = [];
  const vivids: typeof sorted = [];

  for (const c of sorted) {
    const lum = luminance(c.r, c.g, c.b);
    const sat = saturation(c.r, c.g, c.b);

    if (lum > 0.92) whites.push(c);
    else if (lum < 0.08) blacks.push(c);
    else if (sat > 0.25) vivids.push(c);
    else midtones.push(c);
  }

  // Build the final palette: top colors by category
  const all = sorted.slice(0, 30).map((c) => ({
    hex: rgbToHex(c.r, c.g, c.b),
    count: c.count,
  }));

  // Assign roles
  const dominantDark = blacks.length > 0
    ? rgbToHex(blacks[0].r, blacks[0].g, blacks[0].b)
    : midtones.length > 0
    ? rgbToHex(midtones[midtones.length - 1].r, midtones[midtones.length - 1].g, midtones[midtones.length - 1].b)
    : "#111111";

  const dominantLight = whites.length > 0
    ? rgbToHex(whites[0].r, whites[0].g, whites[0].b)
    : "#ffffff";

  // Accent = most vivid (saturated) color
  const dominantAccent = vivids.length > 0
    ? rgbToHex(vivids[0].r, vivids[0].g, vivids[0].b)
    : midtones.length > 0
    ? rgbToHex(midtones[0].r, midtones[0].g, midtones[0].b)
    : "#6366f1";

  return { colors: all, dominantDark, dominantLight, dominantAccent };
}

/**
 * Read an image file and extract its palette via offscreen canvas.
 */
export function extractPaletteFromFile(file: File): Promise<ExtractedPalette> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Scale down for performance
      const maxDim = 400;
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Cannot create canvas context")); return; }

      ctx.drawImage(img, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      resolve(extractPaletteFromImage(imageData));
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Map an extracted palette to a partial StyleGuide.
 * Uses heuristics to assign colors to semantic roles.
 */
export function paletteToStyleGuide(palette: ExtractedPalette): Record<string, string> {
  const { dominantDark, dominantLight, dominantAccent, colors } = palette;

  // Find midtone grays for muted/border
  const grays = colors.filter((c) => {
    const r = parseInt(c.hex.slice(1, 3), 16);
    const g = parseInt(c.hex.slice(3, 5), 16);
    const b = parseInt(c.hex.slice(5, 7), 16);
    const sat = saturation(r, g, b);
    const lum = luminance(r, g, b);
    return sat < 0.15 && lum > 0.3 && lum < 0.85;
  });

  const mutedColor = grays.length > 0 ? grays[0].hex : "#f0f0f0";
  const borderColor = grays.length > 1 ? grays[1].hex : grays.length > 0 ? grays[0].hex : "#e0e0e0";

  // Find secondary: second most vivid color that's different from accent
  const vividColors = colors.filter((c) => {
    const r = parseInt(c.hex.slice(1, 3), 16);
    const g = parseInt(c.hex.slice(3, 5), 16);
    const b = parseInt(c.hex.slice(5, 7), 16);
    return saturation(r, g, b) > 0.2;
  });
  const accentRgb: [number, number, number] = [
    parseInt(dominantAccent.slice(1, 3), 16),
    parseInt(dominantAccent.slice(3, 5), 16),
    parseInt(dominantAccent.slice(5, 7), 16),
  ];
  const secondary = vividColors.find((c) => {
    const r = parseInt(c.hex.slice(1, 3), 16);
    const g = parseInt(c.hex.slice(3, 5), 16);
    const b = parseInt(c.hex.slice(5, 7), 16);
    return colorDistance([r, g, b], accentRgb) > 80;
  });

  // Determine if this is a dark or light theme based on the most common background
  const bgLum = luminance(
    parseInt(dominantLight.slice(1, 3), 16),
    parseInt(dominantLight.slice(3, 5), 16),
    parseInt(dominantLight.slice(5, 7), 16),
  );

  // Determine foreground contrast for the accent
  const accentLum = luminance(accentRgb[0], accentRgb[1], accentRgb[2]);
  const accentFg = accentLum > 0.5 ? dominantDark : dominantLight;

  return {
    primaryColor: dominantDark,
    primaryForeground: dominantLight,
    accentColor: dominantAccent,
    accentForeground: accentFg,
    secondaryColor: secondary?.hex || mutedColor,
    secondaryForeground: dominantDark,
    backgroundColor: dominantLight,
    foregroundColor: dominantDark,
    mutedColor,
    mutedForeground: grays.length > 0
      ? grays[Math.min(1, grays.length - 1)].hex
      : "#737373",
    cardColor: dominantLight,
    cardForeground: dominantDark,
    borderColor,
  };
}
