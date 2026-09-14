"use client";

import { useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { ShoppingCart, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface CarouselProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  category: string;
  imageUrl: string;
  videoUrl?: string | null;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

function CarouselCard({
  product,
  index,
}: {
  product: CarouselProduct;
  index: number;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const isVideo =
    Boolean(product.videoUrl) ||
    (typeof product.imageUrl === "string" &&
      (product.imageUrl.toLowerCase().endsWith(".mp4") ||
        product.imageUrl.toLowerCase().endsWith(".webm")));

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.025 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative flex-shrink-0 w-[230px] sm:w-[270px] md:w-[300px] flex flex-col rounded-xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/50 bg-[#121316]/80 backdrop-blur-md hover:shadow-[0_20px_60px_-10px_rgba(212,175,55,0.28)] transition-all duration-500 select-none"
    >
      {/* Ambient gold glow on hover */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#D4AF37]/15 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#B07F6D]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Discount badge */}
      {discount && (
        <span className="absolute top-3 left-3 z-10 bg-[#D4AF37] text-[#0B0C10] text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm shadow-md">
          -{discount}%
        </span>
      )}

      {/* Trending badge */}
      {index < 3 && (
        <span className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-[#0B0C10]/80 backdrop-blur-sm text-[#D4AF37] border border-[#D4AF37]/40 text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm">
          <Sparkles size={10} />
          Hot
        </span>
      )}

      {/* Media */}
      <div className="relative h-[220px] sm:h-[260px] w-full overflow-hidden bg-[#07080A]">
        {isVideo ? (
          <video
            src={product.videoUrl || product.imageUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
          />
        ) : (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
            draggable={false}
          />
        )}
        {/* Subtle bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121316] via-transparent to-transparent opacity-60 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mb-1">
          {product.category}
        </span>
        <h3 className="font-serif text-sm sm:text-base text-[#F8F9FA] leading-snug mb-1.5 group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-[10px] sm:text-xs text-[#9CA3AF] leading-relaxed line-clamp-2 mb-auto font-light">
          {product.description}
        </p>

        {/* Price row + CTA */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-semibold text-[#D4AF37]">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] text-[#9CA3AF] line-through">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex-shrink-0 p-2.5 rounded-lg transition-all duration-300 shadow-md cursor-pointer ${
              added
                ? "bg-green-600 text-white shadow-[0_0_16px_rgba(22,163,74,0.45)]"
                : "bg-[#D4AF37] text-[#0B0C10] hover:bg-[#E6CA65] hover:shadow-[0_0_16px_rgba(212,175,55,0.4)]"
            }`}
            title="Add to Cart"
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function TrendingCarousel({
  products,
}: {
  products: CarouselProduct[];
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Mouse Drag to Scroll handlers (for PC)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Arrow navigation buttons
  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 340;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="py-20 overflow-hidden relative">
      {/* Section Header */}
      <div className="px-6 md:px-12 max-w-7xl mx-auto mb-10">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1 rounded-full">
              Trending Now
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#F8F9FA] mt-3 tracking-wider">
              Most Wanted
            </h2>
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mt-3" />
          </div>

          {/* Navigation Controls & Hint */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-[#9CA3AF] uppercase tracking-widest mr-2 font-light">
              Swipe or Drag
            </span>
            <button
              onClick={() => scroll("left")}
              aria-label="Previous items"
              className="w-9 h-9 rounded-full bg-[#121316] border border-white/10 hover:border-[#D4AF37]/50 text-[#F8F9FA] hover:text-[#D4AF37] flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.25)] cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Next items"
              className="w-9 h-9 rounded-full bg-[#121316] border border-white/10 hover:border-[#D4AF37]/50 text-[#F8F9FA] hover:text-[#D4AF37] flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.25)] cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scrolling Track */}
      <div className="relative">
        {/* Soft edge fades for luxury look */}
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-[#0B0C10] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-[#0B0C10] to-transparent z-10 pointer-events-none" />

        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`flex gap-4 sm:gap-6 px-6 md:px-12 pb-4 overflow-x-auto no-scrollbar scroll-smooth select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="flex gap-4 sm:gap-6"
          >
            {products.map((product, i) => (
              <CarouselCard key={product.id} product={product} index={i} />
            ))}
          </motion.div>

          {/* Spacer to prevent clipping on last card */}
          <div className="flex-shrink-0 w-4 md:w-8" />
        </div>
      </div>
    </section>
  );
}
