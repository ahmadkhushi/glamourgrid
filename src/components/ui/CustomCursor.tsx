"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type CursorMode = 'default' | 'pointer' | 'text';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [mode, setMode] = useState<CursorMode>('default');
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const tag = el.tagName;

      // Text-entry elements → show compact I-beam style
      if (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        el.isContentEditable
      ) {
        setMode('text');
        return;
      }

      // Clickable elements → expand ring
      const clickable =
        el.closest('a') ||
        el.closest('button') ||
        el.closest('[role="button"]') ||
        el.closest('label[for]');
      setMode(clickable ? 'pointer' : 'default');
    };
    const hide = () => setIsHidden(true);
    const show = () => setIsHidden(false);

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    document.addEventListener('mouseleave', hide);
    document.addEventListener('mouseenter', show);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      document.removeEventListener('mouseleave', hide);
      document.removeEventListener('mouseenter', show);
    };
  }, []);

  if (isHidden) return null;

  // Derived values per mode
  const ringSize   = mode === 'pointer' ? 40 : mode === 'text' ? 4 : 32;
  const ringOffset = ringSize / 2;
  const ringBg     = mode === 'pointer' ? 'rgba(212,175,55,0.15)' : 'rgba(0,0,0,0)';
  const dotSize    = mode === 'text' ? 20 : 6; // tall thin line for text mode
  const dotWidth   = mode === 'text' ? 2 : 6;

  return (
    <>
      {/* Outer ring — z-[99999] so it always floats above modals (z-[9999]) */}
      <motion.div
        className="fixed top-0 left-0 z-[99999] rounded-full pointer-events-none hidden md:block border border-[#d4af37]"
        animate={{
          x: pos.x - ringOffset,
          y: pos.y - ringOffset,
          width: ringSize,
          height: ringSize,
          opacity: mode === 'text' ? 0 : 1,
          backgroundColor: ringBg,
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.12 }}
      />
      {/* Inner dot / I-beam — always snaps instantly to cursor position */}
      <motion.div
        className="fixed top-0 left-0 z-[99999] rounded-sm bg-[#d4af37] pointer-events-none hidden md:block"
        animate={{
          x: pos.x - dotWidth / 2,
          y: pos.y - dotSize / 2,
          width: dotWidth,
          height: dotSize,
          opacity: mode === 'text' ? 0.7 : 1,
          borderRadius: mode === 'text' ? '1px' : '9999px',
        }}
        transition={{ type: 'tween', ease: 'linear', duration: 0.04 }}
      />
    </>
  );
}