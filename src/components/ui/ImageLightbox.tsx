"use client";

import { useEffect, useState, useCallback } from "react";
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageLightboxProps {
  images?: string[];
  src?: string;
  alt?: string;
  type?: "image" | "video";
  initialIndex?: number;
  onClose: () => void;
}

export function isVideoUrl(url?: string | null): boolean {
  if (!url) return false;
  const clean = url.toLowerCase().split('?')[0];
  return clean.endsWith('.mp4') || clean.endsWith('.webm') || clean.endsWith('.mov') || clean.endsWith('.ogg');
}

export default function ImageLightbox({ images, src, alt = "Media preview", type = "image", initialIndex = 0, onClose }: ImageLightboxProps) {
  const mediaList = images && images.length > 0 ? images : src ? [src] : [];
  const [current, setCurrent] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const activeSrc = mediaList[current] || src || "";
  const isVideo = type === "video" || isVideoUrl(activeSrc);

  const prev = useCallback(() => {
    setCurrent((i) => (i === 0 ? mediaList.length - 1 : i - 1));
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [mediaList.length]);

  const next = useCallback(() => {
    setCurrent((i) => (i === mediaList.length - 1 ? 0 : i + 1));
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [mediaList.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1 || isVideo) return;
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || isVideo) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    if (isVideo) return;
    e.preventDefault();
    setZoom((z) => Math.min(4, Math.max(1, z - e.deltaY * 0.001)));
  };

  return (
    <div
      className="fixed inset-0 z-[9990] bg-black/95 flex items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white/70 hover:text-white bg-black/50 p-2.5 rounded-full transition-colors border border-white/10"
        aria-label="Close"
      >
        <X size={22} />
      </button>

      {/* Counter */}
      {mediaList.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm tracking-widest font-mono">
          {current + 1} / {mediaList.length}
        </div>
      )}

      {/* Zoom Controls (Images only) */}
      {!isVideo && (
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <button
            onClick={() => setZoom((z) => Math.min(4, z + 0.5))}
            className="text-white/70 hover:text-white bg-black/50 p-2 rounded-full transition-colors"
            aria-label="Zoom In"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={() => { setZoom((z) => Math.max(1, z - 0.5)); if (zoom <= 1.5) setOffset({ x: 0, y: 0 }); }}
            className="text-white/70 hover:text-white bg-black/50 p-2 rounded-full transition-colors"
            aria-label="Zoom Out"
          >
            <ZoomOut size={18} />
          </button>
          {zoom > 1 && (
            <button
              onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}
              className="text-white/70 hover:text-white bg-black/50 px-2 py-1 rounded text-xs transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      )}

      {/* Prev */}
      {mediaList.length > 1 && (
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 p-3 rounded-full transition-colors z-10"
          aria-label="Previous"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Media Content */}
      <div
        className="w-full h-full flex items-center justify-center overflow-hidden p-4"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: !isVideo && zoom > 1 ? (dragging ? "grabbing" : "grab") : "default" }}
      >
        {isVideo ? (
          <video
            src={activeSrc}
            controls
            autoPlay
            loop
            muted
            playsInline
            className="max-w-[90vw] max-h-[85vh] rounded shadow-2xl object-contain"
          />
        ) : (
          <img
            src={activeSrc}
            alt={alt || `Product image ${current + 1}`}
            style={{
              transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
              transition: dragging ? "none" : "transform 0.2s ease",
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              userSelect: "none",
            }}
            draggable={false}
          />
        )}
      </div>

      {/* Next */}
      {mediaList.length > 1 && (
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 p-3 rounded-full transition-colors z-10"
          aria-label="Next"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Thumbnail strip */}
      {mediaList.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {mediaList.map((itemSrc, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); setZoom(1); setOffset({ x: 0, y: 0 }); }}
              className={`w-14 h-14 border-2 transition-colors overflow-hidden rounded ${
                i === current ? "border-[#d4af37]" : "border-white/20 hover:border-white/50"
              }`}
            >
              {isVideoUrl(itemSrc) ? (
                <video src={itemSrc} muted className="w-full h-full object-cover" />
              ) : (
                <img src={itemSrc} alt="" className="w-full h-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
