"use client";

import { StyleGuide, styleGuideToCSS } from "./style-guide";

/**
 * Wraps the preview area and injects CSS custom properties from the style guide.
 * All children can use `var(--sg-*)` OR the scoped className overrides below.
 */
export function StyledPreview({
  styleGuide,
  children,
}: {
  styleGuide: StyleGuide;
  children: React.ReactNode;
}) {
  const cssVars = styleGuideToCSS(styleGuide);

  return (
    <div style={cssVars} className="styled-preview">
      <style>{`
        .styled-preview {
          background: var(--sg-bg);
          color: var(--sg-fg);
          font-family: var(--sg-body-font);
          font-size: var(--sg-base-size);
        }
        /* Headings */
        .styled-preview h1,
        .styled-preview h2,
        .styled-preview h3,
        .styled-preview h4 {
          font-family: var(--sg-heading-font);
          font-weight: var(--sg-heading-weight);
          color: var(--sg-fg);
        }
        /* Muted text */
        .styled-preview .text-muted-foreground {
          color: var(--sg-muted-fg) !important;
        }
        /* Primary buttons / badges */
        .styled-preview .bg-primary {
          background: var(--sg-primary) !important;
          color: var(--sg-primary-fg) !important;
          border-radius: var(--sg-btn-radius) !important;
        }
        .styled-preview .text-primary {
          color: var(--sg-primary) !important;
        }
        .styled-preview .bg-primary\\/10,
        .styled-preview .bg-primary\\/20 {
          background: color-mix(in srgb, var(--sg-primary) 12%, transparent) !important;
        }
        /* Cards */
        .styled-preview .bg-card,
        .styled-preview .rounded-lg.border.bg-card {
          background: var(--sg-card) !important;
          color: var(--sg-card-fg) !important;
          border: var(--sg-card-border) !important;
          border-radius: var(--sg-radius) !important;
          box-shadow: var(--sg-card-shadow) !important;
        }
        /* Border overrides */
        .styled-preview .border,
        .styled-preview .border-b,
        .styled-preview .border-t {
          border-color: var(--sg-border) !important;
        }
        /* Muted backgrounds */
        .styled-preview .bg-muted\\/20,
        .styled-preview .bg-muted\\/30,
        .styled-preview .bg-muted\\/40 {
          background: color-mix(in srgb, var(--sg-muted) 30%, transparent) !important;
        }
        /* Section padding */
        .styled-preview .py-8 {
          padding-top: var(--sg-section-py) !important;
          padding-bottom: var(--sg-section-py) !important;
        }
        .styled-preview .py-12 {
          padding-top: calc(var(--sg-section-py) * 1.5) !important;
          padding-bottom: calc(var(--sg-section-py) * 1.5) !important;
        }
        .styled-preview .py-16 {
          padding-top: calc(var(--sg-section-py) * 2) !important;
          padding-bottom: calc(var(--sg-section-py) * 2) !important;
        }
        /* Rounded elements */
        .styled-preview .rounded-lg {
          border-radius: var(--sg-radius) !important;
        }
        .styled-preview .rounded-full {
          border-radius: 9999px !important;
        }
        /* Accent backgrounds */
        .styled-preview .bg-muted\\/20.rounded-lg {
          background: color-mix(in srgb, var(--sg-accent) 15%, var(--sg-bg)) !important;
        }
      `}</style>
      {children}
    </div>
  );
}
