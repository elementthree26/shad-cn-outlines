"use client";

import { WireframeBlockId } from "@/data/types";

interface WireframeBlockProps {
  className?: string;
}

// Shared wrapper for all wireframe SVGs
function WireframeSvg({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Page outline */}
      <rect
        x="0.5"
        y="0.5"
        width="399"
        height="259"
        rx="3"
        stroke="currentColor"
        strokeOpacity="0.15"
        fill="currentColor"
        fillOpacity="0.02"
      />
      {children}
    </svg>
  );
}

// ─── Hero variants ──────────────────────────────────────

function HeroFullwidthImage({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      {/* Full-width image placeholder */}
      <rect x="16" y="16" width="368" height="140" rx="4" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.15" />
      {/* Image icon */}
      <rect x="170" y="55" width="60" height="45" rx="3" fill="currentColor" fillOpacity="0.1" />
      <circle cx="185" cy="70" r="6" fill="currentColor" fillOpacity="0.15" />
      <path d="M173 95 L190 78 L205 90 L215 82 L227 95Z" fill="currentColor" fillOpacity="0.12" />
      {/* Headline */}
      <rect x="100" y="175" width="200" height="12" rx="2" fill="currentColor" fillOpacity="0.15" />
      {/* Subhead */}
      <rect x="130" y="195" width="140" height="8" rx="2" fill="currentColor" fillOpacity="0.08" />
      {/* CTA button */}
      <rect x="160" y="218" width="80" height="24" rx="4" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.2" />
      <rect x="175" y="227" width="50" height="6" rx="1" fill="currentColor" fillOpacity="0.15" />
    </WireframeSvg>
  );
}

function HeroSplit({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      {/* Left: text content */}
      <rect x="16" y="16" width="180" height="228" rx="4" fill="currentColor" fillOpacity="0.03" />
      {/* Headline */}
      <rect x="30" y="50" width="140" height="12" rx="2" fill="currentColor" fillOpacity="0.15" />
      <rect x="30" y="70" width="110" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {/* Body text lines */}
      <rect x="30" y="96" width="150" height="6" rx="1" fill="currentColor" fillOpacity="0.07" />
      <rect x="30" y="108" width="130" height="6" rx="1" fill="currentColor" fillOpacity="0.07" />
      <rect x="30" y="120" width="145" height="6" rx="1" fill="currentColor" fillOpacity="0.07" />
      {/* CTA button */}
      <rect x="30" y="148" width="90" height="26" rx="4" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.2" />
      <rect x="48" y="158" width="54" height="6" rx="1" fill="currentColor" fillOpacity="0.15" />
      {/* Right: image placeholder */}
      <rect x="204" y="16" width="180" height="228" rx="4" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.12" />
      {/* Image icon */}
      <rect x="264" y="90" width="60" height="45" rx="3" fill="currentColor" fillOpacity="0.1" />
      <circle cx="279" cy="105" r="6" fill="currentColor" fillOpacity="0.15" />
      <path d="M267 130 L284 113 L299 125 L309 117 L321 130Z" fill="currentColor" fillOpacity="0.12" />
    </WireframeSvg>
  );
}

function HeroCarousel({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      {/* Main slide area */}
      <rect x="40" y="16" width="320" height="150" rx="4" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.12" />
      {/* Image icon in slide */}
      <rect x="160" y="45" width="60" height="45" rx="3" fill="currentColor" fillOpacity="0.1" />
      <circle cx="175" cy="60" r="6" fill="currentColor" fillOpacity="0.15" />
      <path d="M163 85 L180 68 L195 80 L205 72 L217 85Z" fill="currentColor" fillOpacity="0.12" />
      {/* Left arrow */}
      <rect x="16" y="76" width="20" height="20" rx="10" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.15" />
      <path d="M29 82 L23 86 L29 90" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" fill="none" />
      {/* Right arrow */}
      <rect x="364" y="76" width="20" height="20" rx="10" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.15" />
      <path d="M371 82 L377 86 L371 90" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" fill="none" />
      {/* Dots indicator */}
      <circle cx="185" cy="178" r="4" fill="currentColor" fillOpacity="0.2" />
      <circle cx="200" cy="178" r="4" fill="currentColor" fillOpacity="0.08" />
      <circle cx="215" cy="178" r="4" fill="currentColor" fillOpacity="0.08" />
      {/* Headline */}
      <rect x="120" y="196" width="160" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {/* Subhead */}
      <rect x="145" y="214" width="110" height="7" rx="2" fill="currentColor" fillOpacity="0.07" />
      {/* CTA */}
      <rect x="163" y="232" width="74" height="20" rx="4" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.18" />
    </WireframeSvg>
  );
}

function HeroMinimalText({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      {/* Large centered headline */}
      <rect x="80" y="60" width="240" height="16" rx="2" fill="currentColor" fillOpacity="0.18" />
      <rect x="110" y="86" width="180" height="12" rx="2" fill="currentColor" fillOpacity="0.12" />
      {/* Body text */}
      <rect x="90" y="116" width="220" height="6" rx="1" fill="currentColor" fillOpacity="0.07" />
      <rect x="105" y="130" width="190" height="6" rx="1" fill="currentColor" fillOpacity="0.07" />
      {/* CTA */}
      <rect x="155" y="158" width="90" height="28" rx="4" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.2" />
      <rect x="172" y="169" width="56" height="6" rx="1" fill="currentColor" fillOpacity="0.15" />
    </WireframeSvg>
  );
}

function HeroVideo({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      {/* Video area */}
      <rect x="16" y="16" width="368" height="160" rx="4" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.12" />
      {/* Play button */}
      <circle cx="200" cy="96" r="22" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.2" />
      <path d="M193 84 L213 96 L193 108Z" fill="currentColor" fillOpacity="0.25" />
      {/* Headline */}
      <rect x="120" y="192" width="160" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {/* Subhead */}
      <rect x="140" y="210" width="120" height="7" rx="2" fill="currentColor" fillOpacity="0.07" />
      {/* CTA */}
      <rect x="160" y="230" width="80" height="20" rx="4" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.18" />
    </WireframeSvg>
  );
}

function HeroAnimated({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      {/* Animated bg suggestion - diagonal lines */}
      <rect x="16" y="16" width="368" height="140" rx="4" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.12" />
      <line x1="16" y1="56" x2="84" y2="16" stroke="currentColor" strokeOpacity="0.06" />
      <line x1="16" y1="96" x2="144" y2="16" stroke="currentColor" strokeOpacity="0.06" />
      <line x1="16" y1="136" x2="204" y2="16" stroke="currentColor" strokeOpacity="0.06" />
      <line x1="56" y1="156" x2="264" y2="16" stroke="currentColor" strokeOpacity="0.06" />
      <line x1="136" y1="156" x2="324" y2="16" stroke="currentColor" strokeOpacity="0.06" />
      <line x1="216" y1="156" x2="384" y2="16" stroke="currentColor" strokeOpacity="0.06" />
      {/* Motion indicator */}
      <rect x="165" y="60" width="70" height="50" rx="6" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.15" strokeDasharray="3 3" />
      <rect x="185" y="78" width="30" height="14" rx="2" fill="currentColor" fillOpacity="0.12" />
      {/* Headline */}
      <rect x="100" y="175" width="200" height="12" rx="2" fill="currentColor" fillOpacity="0.15" />
      <rect x="130" y="195" width="140" height="8" rx="2" fill="currentColor" fillOpacity="0.08" />
      {/* CTA */}
      <rect x="160" y="218" width="80" height="24" rx="4" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.2" />
    </WireframeSvg>
  );
}

function HeroBreadcrumb({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      {/* Breadcrumb nav */}
      <rect x="16" y="20" width="40" height="6" rx="1" fill="currentColor" fillOpacity="0.08" />
      <rect x="62" y="20" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.06" />
      <rect x="74" y="20" width="60" height="6" rx="1" fill="currentColor" fillOpacity="0.1" />
      {/* Large page heading */}
      <rect x="16" y="50" width="260" height="18" rx="2" fill="currentColor" fillOpacity="0.18" />
      {/* Description */}
      <rect x="16" y="82" width="300" height="7" rx="1" fill="currentColor" fillOpacity="0.07" />
      <rect x="16" y="96" width="250" height="7" rx="1" fill="currentColor" fillOpacity="0.07" />
      {/* Divider */}
      <line x1="16" y1="120" x2="384" y2="120" stroke="currentColor" strokeOpacity="0.1" />
      {/* Content area below */}
      <rect x="16" y="132" width="368" height="112" rx="4" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.08" />
    </WireframeSvg>
  );
}

// ─── Text / Content ─────────────────────────────────────

function TextCentered({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      {/* Section heading */}
      <rect x="130" y="30" width="140" height="12" rx="2" fill="currentColor" fillOpacity="0.15" />
      {/* Body text centered */}
      <rect x="60" y="60" width="280" height="6" rx="1" fill="currentColor" fillOpacity="0.08" />
      <rect x="75" y="74" width="250" height="6" rx="1" fill="currentColor" fillOpacity="0.08" />
      <rect x="90" y="88" width="220" height="6" rx="1" fill="currentColor" fillOpacity="0.08" />
      <rect x="80" y="102" width="240" height="6" rx="1" fill="currentColor" fillOpacity="0.08" />
      {/* Supporting graphic */}
      <rect x="140" y="128" width="120" height="80" rx="6" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.1" />
      <circle cx="200" cy="160" r="14" fill="currentColor" fillOpacity="0.08" />
      {/* CTA */}
      <rect x="160" y="224" width="80" height="22" rx="4" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.15" />
    </WireframeSvg>
  );
}

function TextSplitImage({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      {/* Left: text */}
      <rect x="16" y="30" width="170" height="12" rx="2" fill="currentColor" fillOpacity="0.15" />
      <rect x="16" y="54" width="175" height="6" rx="1" fill="currentColor" fillOpacity="0.07" />
      <rect x="16" y="66" width="160" height="6" rx="1" fill="currentColor" fillOpacity="0.07" />
      <rect x="16" y="78" width="170" height="6" rx="1" fill="currentColor" fillOpacity="0.07" />
      <rect x="16" y="90" width="150" height="6" rx="1" fill="currentColor" fillOpacity="0.07" />
      <rect x="16" y="102" width="165" height="6" rx="1" fill="currentColor" fillOpacity="0.07" />
      <rect x="16" y="126" width="90" height="24" rx="4" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.18" />
      {/* Right: image */}
      <rect x="210" y="24" width="174" height="140" rx="4" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.12" />
      <rect x="260" y="65" width="60" height="45" rx="3" fill="currentColor" fillOpacity="0.1" />
      <circle cx="275" cy="80" r="6" fill="currentColor" fillOpacity="0.15" />
      <path d="M263 105 L280 88 L295 100 L305 92 L317 105Z" fill="currentColor" fillOpacity="0.12" />
    </WireframeSvg>
  );
}

function TextFullwidth({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      {/* Full-width background */}
      <rect x="16" y="16" width="368" height="228" rx="4" fill="currentColor" fillOpacity="0.04" />
      {/* Heading */}
      <rect x="100" y="40" width="200" height="14" rx="2" fill="currentColor" fillOpacity="0.15" />
      {/* Paragraph lines */}
      <rect x="50" y="72" width="300" height="6" rx="1" fill="currentColor" fillOpacity="0.08" />
      <rect x="55" y="86" width="290" height="6" rx="1" fill="currentColor" fillOpacity="0.08" />
      <rect x="60" y="100" width="280" height="6" rx="1" fill="currentColor" fillOpacity="0.08" />
      <rect x="50" y="114" width="300" height="6" rx="1" fill="currentColor" fillOpacity="0.08" />
      <rect x="65" y="128" width="270" height="6" rx="1" fill="currentColor" fillOpacity="0.08" />
      {/* Second paragraph */}
      <rect x="50" y="152" width="300" height="6" rx="1" fill="currentColor" fillOpacity="0.06" />
      <rect x="55" y="166" width="290" height="6" rx="1" fill="currentColor" fillOpacity="0.06" />
      <rect x="60" y="180" width="280" height="6" rx="1" fill="currentColor" fillOpacity="0.06" />
      <rect x="70" y="194" width="260" height="6" rx="1" fill="currentColor" fillOpacity="0.06" />
    </WireframeSvg>
  );
}

function TextBlockquote({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      {/* Large quote mark */}
      <text x="40" y="80" fontSize="60" fill="currentColor" fillOpacity="0.1" fontFamily="Georgia, serif">&ldquo;</text>
      {/* Quote text */}
      <rect x="60" y="80" width="280" height="8" rx="2" fill="currentColor" fillOpacity="0.12" />
      <rect x="60" y="96" width="260" height="8" rx="2" fill="currentColor" fillOpacity="0.12" />
      <rect x="60" y="112" width="220" height="8" rx="2" fill="currentColor" fillOpacity="0.12" />
      {/* Left accent bar */}
      <rect x="44" y="78" width="4" height="50" rx="2" fill="currentColor" fillOpacity="0.2" />
      {/* Attribution */}
      <rect x="60" y="148" width="100" height="6" rx="1" fill="currentColor" fillOpacity="0.1" />
      <rect x="60" y="162" width="70" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
      {/* Supporting image */}
      <rect x="300" y="140" width="60" height="40" rx="4" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.1" />
    </WireframeSvg>
  );
}

function IconRow({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      {/* Section heading */}
      <rect x="130" y="20" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {/* 4 icons in a row */}
      {[0, 1, 2, 3].map((i) => {
        const x = 36 + i * 90;
        return (
          <g key={i}>
            <circle cx={x + 35} cy={60} r="18" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.12" />
            <rect x={x + 27} y={52} width="16" height="16" rx="2" fill="currentColor" fillOpacity="0.12" />
            <rect x={x + 10} y={90} width="50" height="7" rx="1" fill="currentColor" fillOpacity="0.1" />
            <rect x={x + 5} y={104} width="60" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
            <rect x={x + 8} y={114} width="54" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
          </g>
        );
      })}
    </WireframeSvg>
  );
}

function IconGrid3({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      {/* Section heading */}
      <rect x="130" y="16" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {/* 3x2 icon grid */}
      {[0, 1, 2].map((col) =>
        [0, 1].map((row) => {
          const x = 20 + col * 128;
          const y = 40 + row * 110;
          return (
            <g key={`${col}-${row}`}>
              <rect x={x} y={y} width="116" height="96" rx="4" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.08" />
              <circle cx={x + 58} cy={y + 24} r="12" fill="currentColor" fillOpacity="0.1" />
              <rect x={x + 28} y={y + 44} width="60" height="7" rx="1" fill="currentColor" fillOpacity="0.12" />
              <rect x={x + 18} y={y + 58} width="80" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
              <rect x={x + 23} y={y + 68} width="70" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
            </g>
          );
        })
      )}
    </WireframeSvg>
  );
}

function IconGrid4({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="130" y="16" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {[0, 1, 2, 3].map((col) =>
        [0, 1].map((row) => {
          const x = 14 + col * 96;
          const y = 40 + row * 110;
          return (
            <g key={`${col}-${row}`}>
              <rect x={x} y={y} width="88" height="96" rx="4" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.08" />
              <circle cx={x + 44} cy={y + 24} r="12" fill="currentColor" fillOpacity="0.1" />
              <rect x={x + 18} y={y + 44} width="52" height="7" rx="1" fill="currentColor" fillOpacity="0.12" />
              <rect x={x + 10} y={y + 58} width="68" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
              <rect x={x + 14} y={y + 68} width="60" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
            </g>
          );
        })
      )}
    </WireframeSvg>
  );
}

function IconList({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="130" y="16" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 42 + i * 42;
        return (
          <g key={i}>
            <circle cx="44" cy={y + 12} r="14" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.1" />
            <rect x="36" y={y + 6} width="16" height="12" rx="2" fill="currentColor" fillOpacity="0.1" />
            <rect x="72" y={y + 2} width="120" height="8" rx="2" fill="currentColor" fillOpacity="0.12" />
            <rect x="72" y={y + 16} width="280" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
            {i < 4 && <line x1="72" y1={y + 34} x2="370" y2={y + 34} stroke="currentColor" strokeOpacity="0.06" />}
          </g>
        );
      })}
    </WireframeSvg>
  );
}

// ─── Stats ──────────────────────────────────────────────

function StatsBar({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="16" y="60" width="368" height="140" rx="6" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.1" />
      {[0, 1, 2, 3].map((i) => {
        const x = 36 + i * 90;
        return (
          <g key={i}>
            <rect x={x + 10} y={80} width="50" height="20" rx="2" fill="currentColor" fillOpacity="0.15" />
            <rect x={x + 5} y={110} width="60" height="6" rx="1" fill="currentColor" fillOpacity="0.08" />
            <rect x={x + 10} y={122} width="50" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
            {i < 3 && <line x1={x + 78} y1={80} x2={x + 78} y2={135} stroke="currentColor" strokeOpacity="0.08" />}
          </g>
        );
      })}
    </WireframeSvg>
  );
}

function StatsCallout({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="40" y="20" width="320" height="220" rx="8" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.1" />
      {/* Large stat */}
      <rect x="140" y="45" width="120" height="30" rx="3" fill="currentColor" fillOpacity="0.18" />
      <rect x="155" y="85" width="90" height="8" rx="2" fill="currentColor" fillOpacity="0.1" />
      {/* Supporting stats row */}
      {[0, 1, 2].map((i) => {
        const x = 70 + i * 100;
        return (
          <g key={i}>
            <rect x={x} y={120} width="60" height="18" rx="2" fill="currentColor" fillOpacity="0.12" />
            <rect x={x + 5} y={146} width="50" height="6" rx="1" fill="currentColor" fillOpacity="0.07" />
          </g>
        );
      })}
      {/* Description */}
      <rect x="80" y={180} width="240" height="6" rx="1" fill="currentColor" fillOpacity="0.06" />
      <rect x="100" y={194} width="200" height="6" rx="1" fill="currentColor" fillOpacity="0.06" />
    </WireframeSvg>
  );
}

// ─── Card layouts ───────────────────────────────────────

function CardGrid3({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="130" y="12" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {[0, 1, 2].map((i) => {
        const x = 16 + i * 128;
        return (
          <g key={i}>
            <rect x={x} y={34} width="120" height="210" rx="4" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.12" />
            <rect x={x + 4} y={38} width="112" height="70" rx="3" fill="currentColor" fillOpacity="0.08" />
            <rect x={x + 10} y={118} width="80" height="8" rx="2" fill="currentColor" fillOpacity="0.12" />
            <rect x={x + 10} y={134} width="100" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
            <rect x={x + 10} y={144} width="90" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
            <rect x={x + 10} y={154} width="95" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
            <rect x={x + 10} y={176} width="60" height="18" rx="3" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.12" />
          </g>
        );
      })}
    </WireframeSvg>
  );
}

function CardGrid4({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="130" y="12" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {[0, 1, 2, 3].map((i) => {
        const x = 12 + i * 96;
        return (
          <g key={i}>
            <rect x={x} y={34} width="90" height="210" rx="4" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.12" />
            <rect x={x + 3} y={38} width="84" height="55" rx="3" fill="currentColor" fillOpacity="0.08" />
            <rect x={x + 8} y={102} width="60" height="7" rx="2" fill="currentColor" fillOpacity="0.12" />
            <rect x={x + 8} y={116} width="74" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
            <rect x={x + 8} y={126} width="68" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
            <rect x={x + 8} y={150} width="50" height="16" rx="3" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.12" />
          </g>
        );
      })}
    </WireframeSvg>
  );
}

function CardCarousel({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="130" y="12" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {/* Visible cards */}
      {[0, 1, 2].map((i) => {
        const x = 30 + i * 118;
        const opacity = i === 1 ? 1 : 0.6;
        return (
          <g key={i} opacity={opacity}>
            <rect x={x} y={38} width="110" height="160" rx="4" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.12" />
            <rect x={x + 4} y={42} width="102" height="60" rx="3" fill="currentColor" fillOpacity="0.08" />
            <rect x={x + 8} y={112} width="70" height="7" rx="2" fill="currentColor" fillOpacity="0.12" />
            <rect x={x + 8} y={126} width="90" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
            <rect x={x + 8} y={136} width="80" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
          </g>
        );
      })}
      {/* Left/right arrows */}
      <rect x="8" y="108" width="18" height="18" rx="9" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.15" />
      <rect x="374" y="108" width="18" height="18" rx="9" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.15" />
      {/* Dots */}
      <circle cx="185" cy="218" r="3" fill="currentColor" fillOpacity="0.06" />
      <circle cx="200" cy="218" r="3" fill="currentColor" fillOpacity="0.18" />
      <circle cx="215" cy="218" r="3" fill="currentColor" fillOpacity="0.06" />
    </WireframeSvg>
  );
}

function CardFeaturedPlus({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      {/* Featured large card */}
      <rect x="16" y="16" width="200" height="228" rx="4" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.12" />
      <rect x="20" y="20" width="192" height="110" rx="3" fill="currentColor" fillOpacity="0.08" />
      <rect x="28" y="142" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.14" />
      <rect x="28" y="162" width="170" height="6" rx="1" fill="currentColor" fillOpacity="0.07" />
      <rect x="28" y="174" width="155" height="6" rx="1" fill="currentColor" fillOpacity="0.07" />
      <rect x="28" y="200" width="80" height="22" rx="4" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.15" />
      {/* Supporting smaller cards */}
      {[0, 1].map((i) => {
        const y = 16 + i * 118;
        return (
          <g key={i}>
            <rect x="226" y={y} width="158" height="110" rx="4" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.12" />
            <rect x="230" y={y + 4} width="150" height="44" rx="3" fill="currentColor" fillOpacity="0.07" />
            <rect x="236" y={y + 56} width="100" height="7" rx="1" fill="currentColor" fillOpacity="0.1" />
            <rect x="236" y={y + 70} width="130" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
            <rect x="236" y={y + 80} width="120" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
          </g>
        );
      })}
    </WireframeSvg>
  );
}

function CardImageHover({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="130" y="12" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {[0, 1, 2].map((i) => {
        const x = 16 + i * 128;
        const isHovered = i === 1;
        return (
          <g key={i}>
            <rect x={x} y={34} width="120" height="210" rx="4" fill="currentColor" fillOpacity={isHovered ? "0.1" : "0.06"} stroke="currentColor" strokeOpacity={isHovered ? "0.2" : "0.1"} />
            {/* Image fills most of card */}
            <rect x={x + 4} y={38} width="112" height="130" rx="3" fill="currentColor" fillOpacity={isHovered ? "0.12" : "0.08"} />
            {/* Hover overlay on middle card */}
            {isHovered && <rect x={x + 4} y={100} width="112" height="68" rx="0" fill="currentColor" fillOpacity="0.15" />}
            {isHovered && <rect x={x + 20} y={116} width="80" height="8" rx="2" fill="currentColor" fillOpacity="0.2" />}
            {isHovered && <rect x={x + 30} y={132} width="60" height="6" rx="1" fill="currentColor" fillOpacity="0.15" />}
            <rect x={x + 10} y={180} width="80" height="7" rx="2" fill="currentColor" fillOpacity="0.12" />
            <rect x={x + 10} y={194} width="100" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
          </g>
        );
      })}
    </WireframeSvg>
  );
}

function TabInterface({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      {/* Tab bar */}
      <rect x="16" y="16" width="368" height="36" rx="4" fill="currentColor" fillOpacity="0.04" />
      {[0, 1, 2, 3].map((i) => {
        const x = 24 + i * 90;
        const isActive = i === 0;
        return (
          <g key={i}>
            <rect x={x} y={22} width="78" height="24" rx="3" fill="currentColor" fillOpacity={isActive ? "0.12" : "0.04"} />
            <rect x={x + 16} y={31} width="46" height="6" rx="1" fill="currentColor" fillOpacity={isActive ? "0.2" : "0.08"} />
          </g>
        );
      })}
      {/* Active tab underline */}
      <rect x="24" y="50" width="78" height="2" rx="1" fill="currentColor" fillOpacity="0.25" />
      {/* Content area */}
      <rect x="16" y="58" width="368" height="186" rx="4" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.08" />
      <rect x="30" y="74" width="200" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      <rect x="30" y="96" width="340" height="6" rx="1" fill="currentColor" fillOpacity="0.06" />
      <rect x="30" y="110" width="320" height="6" rx="1" fill="currentColor" fillOpacity="0.06" />
      <rect x="30" y="124" width="330" height="6" rx="1" fill="currentColor" fillOpacity="0.06" />
      {/* Inner content card */}
      <rect x="30" y="148" width="150" height="80" rx="4" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.08" />
      <rect x="196" y="148" width="150" height="80" rx="4" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.08" />
    </WireframeSvg>
  );
}

function TabCategory({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      {/* Category tabs - pill style */}
      <rect x="16" y="16" width="368" height="30" rx="4" fill="currentColor" fillOpacity="0.03" />
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 24 + i * 72;
        const isActive = i === 1;
        return (
          <g key={i}>
            <rect x={x} y={20} width="64" height="22" rx="11" fill="currentColor" fillOpacity={isActive ? "0.15" : "0.05"} stroke="currentColor" strokeOpacity={isActive ? "0.2" : "0.08"} />
            <rect x={x + 14} y={28} width="36" height="6" rx="1" fill="currentColor" fillOpacity={isActive ? "0.2" : "0.08"} />
          </g>
        );
      })}
      {/* Content cards below */}
      {[0, 1, 2].map((i) => {
        const x = 16 + i * 128;
        return (
          <g key={i}>
            <rect x={x} y={60} width="120" height="184" rx="4" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.08" />
            <rect x={x + 4} y={64} width="112" height="65" rx="3" fill="currentColor" fillOpacity="0.07" />
            <rect x={x + 10} y={140} width="80" height="7" rx="1" fill="currentColor" fillOpacity="0.1" />
            <rect x={x + 10} y={154} width="100" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
            <rect x={x + 10} y={164} width="90" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
          </g>
        );
      })}
    </WireframeSvg>
  );
}

// ─── Testimonials / Social proof ────────────────────────

function TestimonialCarousel({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="130" y="14" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {/* Quote card */}
      <rect x="60" y="38" width="280" height="140" rx="6" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.1" />
      {/* Quote mark */}
      <text x="75" y="72" fontSize="30" fill="currentColor" fillOpacity="0.1" fontFamily="Georgia, serif">&ldquo;</text>
      {/* Quote text */}
      <rect x="80" y="72" width="240" height="6" rx="1" fill="currentColor" fillOpacity="0.08" />
      <rect x="80" y="84" width="220" height="6" rx="1" fill="currentColor" fillOpacity="0.08" />
      <rect x="80" y="96" width="200" height="6" rx="1" fill="currentColor" fillOpacity="0.08" />
      {/* Avatar + name */}
      <circle cx="100" cy="132" r="14" fill="currentColor" fillOpacity="0.1" />
      <rect x="120" y="126" width="80" height="6" rx="1" fill="currentColor" fillOpacity="0.1" />
      <rect x="120" y="138" width="60" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
      {/* Arrows */}
      <rect x="30" y="98" width="20" height="20" rx="10" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.12" />
      <rect x="350" y="98" width="20" height="20" rx="10" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.12" />
      {/* Dots */}
      <circle cx="185" cy="196" r="3" fill="currentColor" fillOpacity="0.06" />
      <circle cx="200" cy="196" r="3" fill="currentColor" fillOpacity="0.18" />
      <circle cx="215" cy="196" r="3" fill="currentColor" fillOpacity="0.06" />
    </WireframeSvg>
  );
}

function TestimonialCards({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="130" y="12" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {[0, 1, 2].map((i) => {
        const x = 16 + i * 128;
        return (
          <g key={i}>
            <rect x={x} y={34} width="120" height="210" rx="4" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.1" />
            <text x={x + 12} y={60} fontSize="24" fill="currentColor" fillOpacity="0.1" fontFamily="Georgia, serif">&ldquo;</text>
            <rect x={x + 12} y={64} width="96" height="5" rx="1" fill="currentColor" fillOpacity="0.08" />
            <rect x={x + 12} y={75} width="88" height="5" rx="1" fill="currentColor" fillOpacity="0.08" />
            <rect x={x + 12} y={86} width="80" height="5" rx="1" fill="currentColor" fillOpacity="0.08" />
            {/* Stars */}
            {[0, 1, 2, 3, 4].map((s) => (
              <rect key={s} x={x + 12 + s * 12} y={104} width="8" height="8" rx="1" fill="currentColor" fillOpacity="0.12" />
            ))}
            {/* Avatar + name */}
            <circle cx={x + 26} cy={136} r="12" fill="currentColor" fillOpacity="0.1" />
            <rect x={x + 44} y={130} width="60" height="6" rx="1" fill="currentColor" fillOpacity="0.1" />
            <rect x={x + 44} y={140} width="45" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
          </g>
        );
      })}
    </WireframeSvg>
  );
}

function TestimonialVideo({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="130" y="14" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {/* Video thumbnail */}
      <rect x="40" y="36" width="200" height="130" rx="4" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.12" />
      <circle cx="140" cy="101" r="18" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.18" />
      <path d="M134 92 L150 101 L134 110Z" fill="currentColor" fillOpacity="0.2" />
      {/* Quote text on right */}
      <rect x="256" y="42" width="128" height="6" rx="1" fill="currentColor" fillOpacity="0.08" />
      <rect x="256" y="54" width="120" height="6" rx="1" fill="currentColor" fillOpacity="0.08" />
      <rect x="256" y="66" width="110" height="6" rx="1" fill="currentColor" fillOpacity="0.08" />
      {/* Name */}
      <rect x="256" y="90" width="80" height="7" rx="1" fill="currentColor" fillOpacity="0.12" />
      <rect x="256" y="104" width="60" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
      {/* More videos thumbnails */}
      {[0, 1, 2].map((i) => {
        const x = 40 + i * 128;
        return (
          <g key={i}>
            <rect x={x} y={184} width="118" height="60" rx="3" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.08" />
            <circle cx={x + 59} cy={214} r="8" fill="currentColor" fillOpacity="0.08" />
          </g>
        );
      })}
    </WireframeSvg>
  );
}

function TestimonialQuote({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      {/* Logo bar top */}
      <rect x="16" y="16" width="368" height="50" rx="4" fill="currentColor" fillOpacity="0.03" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={30 + i * 60} y={28} width="44" height="26" rx="3" fill="currentColor" fillOpacity="0.07" />
      ))}
      {/* Quote section below */}
      <rect x="40" y="82" width="320" height="150" rx="6" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.08" />
      <text x="55" y="116" fontSize="30" fill="currentColor" fillOpacity="0.1" fontFamily="Georgia, serif">&ldquo;</text>
      <rect x="60" y="116" width="280" height="7" rx="1" fill="currentColor" fillOpacity="0.08" />
      <rect x="60" y="130" width="260" height="7" rx="1" fill="currentColor" fillOpacity="0.08" />
      <rect x="60" y="144" width="220" height="7" rx="1" fill="currentColor" fillOpacity="0.08" />
      {/* Attribution */}
      <circle cx="80" cy="180" r="12" fill="currentColor" fillOpacity="0.1" />
      <rect x="98" y="174" width="80" height="6" rx="1" fill="currentColor" fillOpacity="0.1" />
      <rect x="98" y="186" width="60" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
    </WireframeSvg>
  );
}

// ─── Logo displays ──────────────────────────────────────

function LogoBar({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="16" y="80" width="368" height="100" rx="6" fill="currentColor" fillOpacity="0.03" />
      <rect x="130" y="60" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.1" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={30 + i * 60} y={106} width="44" height="30" rx="4" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.08" />
      ))}
    </WireframeSvg>
  );
}

function LogoGrid({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="130" y="14" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {[0, 1, 2, 3].map((col) =>
        [0, 1, 2].map((row) => {
          const x = 30 + col * 90;
          const y = 36 + row * 72;
          return (
            <rect key={`${col}-${row}`} x={x} y={y} width="70" height="56" rx="4" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.08" />
          );
        })
      )}
    </WireframeSvg>
  );
}

function LogoMarquee({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="130" y="90" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.1" />
      {/* First row scrolling right */}
      <rect x="16" y="110" width="368" height="44" rx="4" fill="currentColor" fillOpacity="0.02" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={`a${i}`} x={-10 + i * 58} y={118} width="48" height="28" rx="3" fill="currentColor" fillOpacity={0.04 + i * 0.01} stroke="currentColor" strokeOpacity="0.06" />
      ))}
      {/* Arrow hint */}
      <path d="M374 132 L384 132" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" />
      <path d="M380 128 L384 132 L380 136" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" fill="none" />
    </WireframeSvg>
  );
}

// ─── CTA sections ───────────────────────────────────────

function CtaBannerFullwidth({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="16" y="50" width="368" height="160" rx="6" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.12" />
      {/* Headline */}
      <rect x="100" y="80" width="200" height="14" rx="2" fill="currentColor" fillOpacity="0.18" />
      {/* Subhead */}
      <rect x="110" y="104" width="180" height="7" rx="1" fill="currentColor" fillOpacity="0.1" />
      <rect x="130" y="118" width="140" height="7" rx="1" fill="currentColor" fillOpacity="0.08" />
      {/* CTA button */}
      <rect x="150" y="144" width="100" height="32" rx="5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeOpacity="0.25" />
      <rect x="170" y="156" width="60" height="8" rx="1" fill="currentColor" fillOpacity="0.2" />
    </WireframeSvg>
  );
}

function CtaSplit({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      {/* Left CTA */}
      <rect x="16" y="40" width="180" height="180" rx="6" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.1" />
      <rect x="40" y="70" width="130" height="10" rx="2" fill="currentColor" fillOpacity="0.15" />
      <rect x="40" y="90" width="140" height="6" rx="1" fill="currentColor" fillOpacity="0.07" />
      <rect x="40" y="102" width="120" height="6" rx="1" fill="currentColor" fillOpacity="0.07" />
      <rect x="40" y="130" width="90" height="28" rx="4" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.2" />
      {/* Right CTA */}
      <rect x="204" y="40" width="180" height="180" rx="6" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.1" />
      <rect x="228" y="70" width="130" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      <rect x="228" y="90" width="140" height="6" rx="1" fill="currentColor" fillOpacity="0.07" />
      <rect x="228" y="102" width="120" height="6" rx="1" fill="currentColor" fillOpacity="0.07" />
      <rect x="228" y="130" width="90" height="28" rx="4" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.15" />
    </WireframeSvg>
  );
}

function CtaFormEmbed({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="16" y="30" width="368" height="200" rx="6" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.1" />
      <rect x="30" y="50" width="160" height="12" rx="2" fill="currentColor" fillOpacity="0.15" />
      <rect x="30" y="72" width="170" height="6" rx="1" fill="currentColor" fillOpacity="0.07" />
      <rect x="30" y="84" width="150" height="6" rx="1" fill="currentColor" fillOpacity="0.07" />
      {/* Form */}
      <rect x="220" y="46" width="148" height="170" rx="4" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.1" />
      <rect x="232" y="60" width="124" height="20" rx="3" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.1" />
      <rect x="232" y="88" width="124" height="20" rx="3" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.1" />
      <rect x="232" y="116" width="124" height="40" rx="3" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.1" />
      <rect x="232" y="168" width="124" height="28" rx="4" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.2" />
    </WireframeSvg>
  );
}

function CtaSimple({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="80" y="80" width="240" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      <rect x="100" y="100" width="200" height="7" rx="1" fill="currentColor" fillOpacity="0.07" />
      <rect x="140" y="126" width="120" height="36" rx="5" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.2" />
      <rect x="165" y="140" width="70" height="8" rx="1" fill="currentColor" fillOpacity="0.18" />
    </WireframeSvg>
  );
}

// ─── Forms ──────────────────────────────────────────────

function FormSimple({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="80" y="16" width="240" height="228" rx="6" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.1" />
      <rect x="140" y="28" width="120" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="100" y={52 + i * 36} width="60" height="6" rx="1" fill="currentColor" fillOpacity="0.08" />
          <rect x="100" y={64 + i * 36} width="200" height="22" rx="3" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.1" />
        </g>
      ))}
      <rect x="100" y="160" width="200" height="36" rx="3" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.1" />
      <rect x="100" y="206" width="200" height="24" rx="4" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.2" />
    </WireframeSvg>
  );
}

function FormMultiStep({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      {/* Step indicators */}
      {[0, 1, 2].map((i) => {
        const cx = 140 + i * 60;
        const isActive = i === 0;
        return (
          <g key={i}>
            <circle cx={cx} cy={28} r="10" fill="currentColor" fillOpacity={isActive ? "0.15" : "0.06"} stroke="currentColor" strokeOpacity={isActive ? "0.25" : "0.1"} />
            {i < 2 && <line x1={cx + 12} y1={28} x2={cx + 48} y2={28} stroke="currentColor" strokeOpacity="0.1" />}
          </g>
        );
      })}
      <rect x="60" y="50" width="280" height="180" rx="6" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.08" />
      <rect x="80" y="66" width="160" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {[0, 1].map((i) => (
        <rect key={i} x="80" y={90 + i * 36} width="240" height="22" rx="3" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.1" />
      ))}
      <rect x="240" y="196" width="80" height="22" rx="4" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.2" />
    </WireframeSvg>
  );
}

function FormTabbed({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      {[0, 1, 2].map((i) => {
        const x = 60 + i * 100;
        const isActive = i === 0;
        return (
          <rect key={i} x={x} y={16} width="90" height="26" rx="3" fill="currentColor" fillOpacity={isActive ? "0.1" : "0.03"} />
        );
      })}
      <rect x="60" y="42" width="90" height="2" fill="currentColor" fillOpacity="0.2" />
      <rect x="60" y="50" width="280" height="190" rx="4" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.08" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x="80" y={68 + i * 36} width="240" height="20" rx="3" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.1" />
      ))}
      <rect x="80" y="210" width="240" height="22" rx="4" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.2" />
    </WireframeSvg>
  );
}

function FormQuoteRequest({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="40" y="12" width="320" height="236" rx="6" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.1" />
      <rect x="120" y="22" width="160" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {[0, 1].map((row) =>
        [0, 1].map((col) => (
          <rect key={`${row}-${col}`} x={60 + col * 150} y={50 + row * 36} width="130" height="22" rx="3" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.1" />
        ))
      )}
      <rect x="60" y="122" width="280" height="22" rx="3" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.1" />
      <rect x="60" y="152" width="280" height="44" rx="3" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.1" />
      <rect x="60" y="206" width="280" height="24" rx="4" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.2" />
    </WireframeSvg>
  );
}

function FormScheduler({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="40" y="12" width="320" height="236" rx="6" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.1" />
      <rect x="130" y="22" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {/* Calendar */}
      <rect x="60" y="44" width="180" height="140" rx="4" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.1" />
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3, 4, 5, 6].map((col) => (
          <rect key={`${row}-${col}`} x={66 + col * 24} y={60 + row * 28} width="16" height="16" rx="2" fill="currentColor" fillOpacity={row === 1 && col === 3 ? "0.2" : "0.04"} />
        ))
      )}
      {/* Time slots */}
      <rect x="256" y="44" width="88" height="140" rx="4" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.1" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={264} y={56 + i * 24} width="72" height="16" rx="3" fill="currentColor" fillOpacity={i === 1 ? "0.15" : "0.06"} />
      ))}
      <rect x="60" y="196" width="280" height="24" rx="4" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.2" />
    </WireframeSvg>
  );
}

function FormSelectorCombo({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="40" y="12" width="320" height="236" rx="6" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.1" />
      <rect x="120" y="24" width="160" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {/* Service selector pills */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={60 + i * 70} y={46} width="60" height="24" rx="12" fill="currentColor" fillOpacity={i === 0 ? "0.15" : "0.06"} stroke="currentColor" strokeOpacity={i === 0 ? "0.2" : "0.08"} />
      ))}
      {[0, 1].map((i) => (
        <rect key={i} x="60" y={86 + i * 34} width="280" height="22" rx="3" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.1" />
      ))}
      <rect x="60" y="154" width="280" height="40" rx="3" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.1" />
      <rect x="60" y="206" width="280" height="24" rx="4" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.2" />
    </WireframeSvg>
  );
}

// ─── Timeline / Process ─────────────────────────────────

function TimelineVertical({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="130" y="10" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      <line x1="80" y1="34" x2="80" y2="248" stroke="currentColor" strokeOpacity="0.1" strokeWidth="2" />
      {[0, 1, 2, 3].map((i) => {
        const y = 38 + i * 54;
        return (
          <g key={i}>
            <circle cx="80" cy={y + 6} r="6" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeOpacity="0.2" />
            <rect x="100" y={y - 2} width="60" height="7" rx="1" fill="currentColor" fillOpacity="0.12" />
            <rect x="100" y={y + 12} width="260" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
            <rect x="100" y={y + 22} width="240" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
          </g>
        );
      })}
    </WireframeSvg>
  );
}

function TimelineHorizontal({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="130" y="14" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      <line x1="30" y1="90" x2="370" y2="90" stroke="currentColor" strokeOpacity="0.1" strokeWidth="2" />
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 40 + i * 72;
        return (
          <g key={i}>
            <circle cx={x} cy={90} r="6" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeOpacity="0.2" />
            <rect x={x - 16} y={48} width="32" height="7" rx="1" fill="currentColor" fillOpacity="0.1" />
            <rect x={x - 28} y={110} width="56" height="6" rx="1" fill="currentColor" fillOpacity="0.08" />
            <rect x={x - 24} y={122} width="48" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
          </g>
        );
      })}
    </WireframeSvg>
  );
}

function StepsNumbered({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="130" y="10" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 24 + i * 74;
        return (
          <g key={i}>
            <circle cx={x + 30} cy={50} r="16" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.15" />
            <rect x={x + 24} y={44} width="12" height="12" rx="1" fill="currentColor" fillOpacity="0.15" />
            <rect x={x + 8} y={78} width="44" height="7" rx="1" fill="currentColor" fillOpacity="0.1" />
            <rect x={x + 4} y={92} width="52" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
            <rect x={x + 8} y={102} width="44" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
            {i < 4 && <line x1={x + 48} y1={50} x2={x + 72} y2={50} stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />}
          </g>
        );
      })}
    </WireframeSvg>
  );
}

function StepsIcon({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="130" y="10" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {[0, 1, 2, 3].map((i) => {
        const x = 30 + i * 90;
        return (
          <g key={i}>
            <rect x={x} y={36} width="76" height="76" rx="6" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.1" />
            <circle cx={x + 38} cy={60} r="14" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.1" />
            <rect x={x + 30} y={54} width="16" height="12" rx="2" fill="currentColor" fillOpacity="0.1" />
            <rect x={x + 12} y={86} width="52" height="6" rx="1" fill="currentColor" fillOpacity="0.1" />
            <rect x={x + 6} y={100} width="64" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
            {i < 3 && <path d={`M${x + 78} 74 L${x + 88} 74`} stroke="currentColor" strokeOpacity="0.1" strokeDasharray="2 2" />}
          </g>
        );
      })}
    </WireframeSvg>
  );
}

function ProcessDiagram({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="130" y="10" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {/* Central node */}
      <circle cx="200" cy="130" r="30" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.15" />
      <rect x="182" y="124" width="36" height="12" rx="2" fill="currentColor" fillOpacity="0.12" />
      {/* Surrounding nodes */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i * 72 - 90) * (Math.PI / 180);
        const cx = 200 + Math.cos(angle) * 80;
        const cy = 130 + Math.sin(angle) * 80;
        return (
          <g key={i}>
            <line x1={200 + Math.cos(angle) * 32} y1={130 + Math.sin(angle) * 32} x2={cx - Math.cos(angle) * 20} y2={cy - Math.sin(angle) * 20} stroke="currentColor" strokeOpacity="0.1" />
            <circle cx={cx} cy={cy} r="20" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.1" />
            <rect x={cx - 12} y={cy - 4} width="24" height="8" rx="1" fill="currentColor" fillOpacity="0.1" />
          </g>
        );
      })}
    </WireframeSvg>
  );
}

// ─── Accordion / Lists ──────────────────────────────────

function AccordionSimple({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="130" y="10" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 30 + i * 44;
        const isOpen = i === 1;
        return (
          <g key={i}>
            <rect x="30" y={y} width="340" height={isOpen ? 40 : 24} rx="3" fill="currentColor" fillOpacity={isOpen ? "0.06" : "0.03"} stroke="currentColor" strokeOpacity="0.1" />
            <rect x="44" y={y + 6} width="140" height="7" rx="1" fill="currentColor" fillOpacity="0.12" />
            <rect x="348" y={y + 6} width="10" height="10" rx="1" fill="currentColor" fillOpacity="0.08" />
            {isOpen && <rect x="44" y={y + 22} width="300" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />}
            {isOpen && <rect x="44" y={y + 30} width="260" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />}
          </g>
        );
      })}
    </WireframeSvg>
  );
}

function AccordionCategorized({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      {/* Category tabs */}
      {[0, 1, 2].map((i) => {
        const x = 30 + i * 120;
        return <rect key={i} x={x} y={14} width="110" height="22" rx="3" fill="currentColor" fillOpacity={i === 0 ? "0.12" : "0.04"} stroke="currentColor" strokeOpacity="0.08" />;
      })}
      {/* Accordion items */}
      {[0, 1, 2, 3].map((i) => {
        const y = 48 + i * 48;
        const isOpen = i === 0;
        return (
          <g key={i}>
            <rect x="30" y={y} width="340" height={isOpen ? 42 : 26} rx="3" fill="currentColor" fillOpacity={isOpen ? "0.06" : "0.03"} stroke="currentColor" strokeOpacity="0.1" />
            <rect x="44" y={y + 6} width="160" height="7" rx="1" fill="currentColor" fillOpacity="0.12" />
            {isOpen && <rect x="44" y={y + 22} width="300" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />}
            {isOpen && <rect x="44" y={y + 32} width="270" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />}
          </g>
        );
      })}
    </WireframeSvg>
  );
}

function ListCompact({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="130" y="12" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const y = 34 + i * 30;
        return (
          <g key={i}>
            <rect x="30" y={y} width="60" height="6" rx="1" fill="currentColor" fillOpacity="0.08" />
            <rect x="100" y={y} width="200" height="7" rx="1" fill="currentColor" fillOpacity="0.1" />
            <rect x="100" y={y + 12} width="260" height="5" rx="1" fill="currentColor" fillOpacity="0.05" />
            {i < 6 && <line x1="30" y1={y + 26} x2="370" y2={y + 26} stroke="currentColor" strokeOpacity="0.05" />}
          </g>
        );
      })}
    </WireframeSvg>
  );
}

function ListNumbered({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="130" y="12" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const y = 36 + i * 36;
        return (
          <g key={i}>
            <circle cx="46" cy={y + 8} r="10" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.1" />
            <rect x="40" y={y + 4} width="12" height="8" rx="1" fill="currentColor" fillOpacity="0.12" />
            <rect x="68" y={y + 2} width="160" height="7" rx="1" fill="currentColor" fillOpacity="0.1" />
            <rect x="68" y={y + 16} width="290" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
          </g>
        );
      })}
    </WireframeSvg>
  );
}

function ListSimple({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="130" y="12" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const y = 34 + i * 28;
        return (
          <g key={i}>
            <circle cx="40" cy={y + 4} r="2.5" fill="currentColor" fillOpacity="0.15" />
            <rect x="54" y={y} width="300" height="6" rx="1" fill="currentColor" fillOpacity="0.08" />
          </g>
        );
      })}
    </WireframeSvg>
  );
}

// ─── Team / People ──────────────────────────────────────

function TeamGrid({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="130" y="8" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {[0, 1, 2, 3].map((col) =>
        [0, 1].map((row) => {
          const x = 16 + col * 94;
          const y = 26 + row * 118;
          return (
            <g key={`${col}-${row}`}>
              <rect x={x} y={y} width="86" height="112" rx="4" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.08" />
              <circle cx={x + 43} cy={y + 32} r="20" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.08" />
              <rect x={x + 14} y={y + 62} width="58" height="7" rx="1" fill="currentColor" fillOpacity="0.1" />
              <rect x={x + 20} y={y + 74} width="46" height="5" rx="1" fill="currentColor" fillOpacity="0.06" />
              <rect x={x + 24} y={y + 86} width="38" height="5" rx="1" fill="currentColor" fillOpacity="0.05" />
            </g>
          );
        })
      )}
    </WireframeSvg>
  );
}

function TeamCarousel({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="130" y="10" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.12" />
      {[0, 1, 2].map((i) => {
        const x = 40 + i * 118;
        const opacity = i === 1 ? 1 : 0.6;
        return (
          <g key={i} opacity={opacity}>
            <rect x={x} y={34} width="110" height="170" rx="4" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.1" />
            <circle cx={x + 55} cy={74} r="24" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.08" />
            <rect x={x + 16} y={110} width="78" height="8" rx="1" fill="currentColor" fillOpacity="0.1" />
            <rect x={x + 22} y={124} width="66" height="6" rx="1" fill="currentColor" fillOpacity="0.06" />
            <rect x={x + 10} y={142} width="90" height="5" rx="1" fill="currentColor" fillOpacity="0.05" />
            <rect x={x + 14} y={152} width="82" height="5" rx="1" fill="currentColor" fillOpacity="0.05" />
          </g>
        );
      })}
      {/* Arrows */}
      <rect x="14" y="110" width="18" height="18" rx="9" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.12" />
      <rect x="368" y="110" width="18" height="18" rx="9" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.12" />
      {/* Dots */}
      <circle cx="185" cy="222" r="3" fill="currentColor" fillOpacity="0.06" />
      <circle cx="200" cy="222" r="3" fill="currentColor" fillOpacity="0.18" />
      <circle cx="215" cy="222" r="3" fill="currentColor" fillOpacity="0.06" />
    </WireframeSvg>
  );
}

// ─── Registry ───────────────────────────────────────────

const wireframeRegistry: Record<WireframeBlockId, React.FC<WireframeBlockProps>> = {
  "hero-fullwidth-image": HeroFullwidthImage,
  // Remaining blocks use a placeholder for now
  "hero-split": HeroSplit,
  "hero-carousel": HeroCarousel,
  "hero-animated": HeroAnimated,
  "hero-minimal-text": HeroMinimalText,
  "hero-video": HeroVideo,
  "hero-breadcrumb": HeroBreadcrumb,
  "text-centered": TextCentered,
  "text-split-image": TextSplitImage,
  "text-fullwidth": TextFullwidth,
  "text-blockquote": TextBlockquote,
  "icon-row": IconRow,
  "icon-grid-3": IconGrid3,
  "icon-grid-4": IconGrid4,
  "icon-list": IconList,
  "stats-bar": StatsBar,
  "stats-callout": StatsCallout,
  "card-grid-3": CardGrid3,
  "card-grid-4": CardGrid4,
  "card-carousel": CardCarousel,
  "card-featured-plus": CardFeaturedPlus,
  "card-image-hover": CardImageHover,
  "tab-interface": TabInterface,
  "tab-category": TabCategory,
  "testimonial-carousel": TestimonialCarousel,
  "testimonial-cards": TestimonialCards,
  "testimonial-video": TestimonialVideo,
  "testimonial-quote": TestimonialQuote,
  "logo-bar": LogoBar,
  "logo-grid": LogoGrid,
  "logo-marquee": LogoMarquee,
  "cta-banner-fullwidth": CtaBannerFullwidth,
  "cta-split": CtaSplit,
  "cta-form-embed": CtaFormEmbed,
  "cta-simple": CtaSimple,
  "form-simple": FormSimple,
  "form-multi-step": FormMultiStep,
  "form-tabbed": FormTabbed,
  "form-quote-request": FormQuoteRequest,
  "form-scheduler": FormScheduler,
  "form-selector-combo": FormSelectorCombo,
  "timeline-vertical": TimelineVertical,
  "timeline-horizontal": TimelineHorizontal,
  "steps-numbered": StepsNumbered,
  "steps-icon": StepsIcon,
  "process-diagram": ProcessDiagram,
  "accordion-simple": AccordionSimple,
  "accordion-categorized": AccordionCategorized,
  "list-compact": ListCompact,
  "list-numbered": ListNumbered,
  "list-simple": ListSimple,
  "team-grid": TeamGrid,
  "team-carousel": TeamCarousel,
  "team-modal": Placeholder,
  "team-simple": Placeholder,
  "team-featured": Placeholder,
  "map-interactive": Placeholder,
  "map-contact-overlay": Placeholder,
  "map-coverage": Placeholder,
  "map-multi-pin": Placeholder,
  "jobs-filterable": Placeholder,
  "jobs-accordion": Placeholder,
  "jobs-cards": Placeholder,
  "jobs-ats-embed": Placeholder,
  "jobs-list": Placeholder,
  "video-embed": Placeholder,
  "video-modal": Placeholder,
  "video-background": Placeholder,
  "photo-gallery": Placeholder,
  "badge-seal-display": Placeholder,
  "comparison-table": Placeholder,
  "contact-card": Placeholder,
  "contact-grid": Placeholder,
  "contact-tabs": Placeholder,
  "infographic": Placeholder,
  "diagram-interactive": Placeholder,
  "faq-searchable": Placeholder,
  "zipcode-lookup": Placeholder,
  "region-coverage": Placeholder,
  "star-rating": Placeholder,
};

function Placeholder({ className }: WireframeBlockProps) {
  return (
    <WireframeSvg className={className}>
      <rect x="16" y="16" width="368" height="228" rx="4" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4 4" />
      <rect x="140" y="115" width="120" height="10" rx="2" fill="currentColor" fillOpacity="0.08" />
      <rect x="165" y="133" width="70" height="8" rx="2" fill="currentColor" fillOpacity="0.06" />
    </WireframeSvg>
  );
}

export function WireframeBlock({
  blockId,
  className,
}: {
  blockId: WireframeBlockId;
  className?: string;
}) {
  const Component = wireframeRegistry[blockId];
  return <Component className={className} />;
}
