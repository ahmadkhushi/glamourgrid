'use client';

import { useState } from 'react';

export interface ColorVariant {
  name: string;
  hex: string;
  inStock?: boolean;
}

export function parseColors(rawColors: any): ColorVariant[] {
  if (!rawColors) return [];
  if (Array.isArray(rawColors)) return rawColors;
  if (typeof rawColors === 'string') {
    try {
      const parsed = JSON.parse(rawColors);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export default function ColorSwatches({
  colors,
  selectedColor,
  onSelectColor,
  size = 'md',
}: {
  colors: any;
  selectedColor?: string | null;
  onSelectColor?: (color: ColorVariant) => void;
  size?: 'sm' | 'md' | 'lg';
}) {
  const parsedList = parseColors(colors);
  if (parsedList.length === 0) return null;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  }[size];

  return (
    <div className="flex flex-col gap-1.5 my-2">
      <div className="flex items-center gap-1.5 flex-wrap">
        {parsedList.map((c, i) => {
          const isSelected = selectedColor === c.name;
          return (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectColor) onSelectColor(c);
              }}
              title={`${c.name} (${c.hex})`}
              className={`group/swatch relative rounded-full transition-transform border ${sizeClasses} ${
                isSelected
                  ? 'ring-2 ring-[#d4af37] ring-offset-2 ring-offset-[#0f0c08] scale-110 border-white'
                  : 'border-white/30 hover:scale-110 hover:border-white'
              }`}
              style={{ backgroundColor: c.hex }}
            >
              {/* Tooltip on Hover */}
              <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/swatch:opacity-100 transition-opacity bg-black/90 text-[#d4af37] text-[10px] uppercase tracking-wider px-2 py-0.5 rounded whitespace-nowrap z-30 shadow-lg border border-[#d4af37]/30">
                {c.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
