'use client';

import React, { useId } from 'react';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

interface MakeThisDealLogoProps {
  /** Visual size of the logo */
  size?: LogoSize;
  /** Show the brand name text alongside the icon */
  showText?: boolean;
  /** Show the "Together We Grow Strong" tagline */
  showTagline?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Light variant for dark backgrounds */
  light?: boolean;
}

/* ─── Size Configuration ─── */
const SIZE_CONFIG: Record<
  LogoSize,
  { iconH: number; showTextDefault: boolean; showTaglineDefault: boolean }
> = {
  sm: { iconH: 28, showTextDefault: false, showTaglineDefault: false },
  md: { iconH: 36, showTextDefault: true, showTaglineDefault: false },
  lg: { iconH: 48, showTextDefault: true, showTaglineDefault: false },
  xl: { iconH: 64, showTextDefault: true, showTaglineDefault: true },
};

/* ─── SVG Path Data ─── */
const ICON_PATH =
  'M 30 0 L 56 22 L 46 22 L 46 52 L 14 52 L 14 22 L 4 22 Z M 24 22 L 36 22 L 30 35 Z';

/* ─── Full Logo ViewBox (icon + text + tagline) ─── */
const FULL_VIEWBOX = '0 0 400 150';
const ICON_ONLY_VIEWBOX = '168 2 64 64';

/**
 * MakeThisDeal Logo Component
 *
 * Renders the MakeThisDeal brand mark as an inline SVG.
 * Supports four sizes, optional text and tagline, and can be used
 * as a standalone icon or as the full brand lockup.
 */
export function MakeThisDealLogo({
  size = 'md',
  showText: showTextProp,
  showTagline: showTaglineProp,
  className,
  light = false,
}: MakeThisDealLogoProps) {
  const { iconH, showTextDefault, showTaglineDefault } = SIZE_CONFIG[size];
  const showText = showTextProp ?? showTextDefault;
  const showTagline = showTaglineProp ?? showTaglineDefault;

  /* Unique gradient ID so multiple instances don't clash */
  const gradId = useId().replace(/:/g, '');

  /* Dimensions */
  const width = showText ? iconH * 3.2 : iconH;
  const height = showText
    ? showTagline
      ? iconH * 2.8
      : iconH * 2.2
    : iconH;

  const viewBox = showText ? FULL_VIEWBOX : ICON_ONLY_VIEWBOX;

  /* Color scheme based on light/dark context */
  const textBase = light ? '#DAE2EC' : '#26324E';
  const textAccent = light ? '#A78BFA' : '#9059E1';
  const taglineColor = light ? '#9BA1B9' : '#4A66A9';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={width}
      height={height}
      className={className}
      aria-label="MakeThisDeal – Together We Grow Strong"
      role="img"
    >
      {/* Gradient for the icon */}
      <defs>
        <linearGradient
          id={`mtd-grad-${gradId}`}
          x1="30"
          y1="0"
          x2="30"
          y2="52"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#8EB6E5" />
          <stop offset="100%" stopColor="#6D9BD3" />
        </linearGradient>
      </defs>

      {/* ─── M-Arrow Icon ─── */}
      <g transform="translate(170, 8)">
        <path
          fillRule="evenodd"
          d={ICON_PATH}
          fill={`url(#mtd-grad-${gradId})`}
        />
      </g>

      {/* ─── Brand Name ─── */}
      {showText && (
        <text
          x="200"
          y="96"
          textAnchor="middle"
          fontFamily="'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif"
          fontSize="32"
          fontWeight="700"
          letterSpacing="0.5"
        >
          <tspan fill={textBase}>make</tspan>
          <tspan fill={textAccent}>This</tspan>
          <tspan fill={textBase}>Deal</tspan>
        </text>
      )}

      {/* ─── Tagline ─── */}
      {showText && showTagline && (
        <>
          <line
            x1="28"
            y1="121"
            x2="78"
            y2="121"
            stroke={textAccent}
            strokeWidth="1"
            opacity="0.35"
          />
          <text
            x="200"
            y="126"
            textAnchor="middle"
            fontFamily="'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif"
            fontSize="11"
            fontWeight="400"
            letterSpacing="2.5"
            fill={taglineColor}
          >
            TOGETHER WE GROW STRONG
          </text>
          <line
            x1="322"
            y1="121"
            x2="372"
            y2="121"
            stroke={textAccent}
            strokeWidth="1"
            opacity="0.35"
          />
        </>
      )}
    </svg>
  );
}

/**
 * Standalone icon-only version of the MakeThisDeal logo mark.
 * Convenience wrapper around MakeThisDealLogo with showText={false}.
 */
export function MakeThisDealIcon({
  size = 'md',
  className,
}: {
  size?: LogoSize;
  className?: string;
}) {
  return <MakeThisDealLogo size={size} showText={false} className={className} />;
}