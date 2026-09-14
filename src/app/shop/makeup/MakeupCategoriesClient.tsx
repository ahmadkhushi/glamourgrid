"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Eye,
  Wand2,
  Brush,
  Gift,
  Droplets,
  Palette,
  Gem,
  Sparkles,
  Heart,
  Feather,
  ArrowRight,
} from "lucide-react";

interface SubCategory {
  name: string;
  slug: string;
  tag: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Custom luxury lipstick SVG icon
const LipstickIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 22h6" />
    <path d="M10 17h4v5h-4z" />
    <path d="M9 11h6v6H9z" />
    <path d="M10 11V6.5a2.5 2.5 0 0 1 2.5-2.5L14 7v4" />
  </svg>
);

const subCategories: SubCategory[] = [
  {
    name: "Eye Lashes",
    slug: "eye-lashes",
    tag: "3D Mink & Silk",
    description: "Natural to dramatic volume lash collections crafted for captivating eyes.",
    icon: Eye,
  },
  {
    name: "Mascara",
    slug: "mascara",
    tag: "24H Waterproof",
    description: "Volumizing, lengthening & ultra-fine precision waterproof eyeliner pens.",
    icon: Wand2,
  },
  {
    name: "Lipsticks",
    slug: "lipsticks",
    tag: "Velvet Matte",
    description: "Velvety smooth long-wear formulas saturated with rich, opulent pigments.",
    icon: LipstickIcon,
  },
  {
    name: "Face Powder",
    slug: "face-powder",
    tag: "Pore-Blurring",
    description: "Micro-milled translucent setting and pressed powders for a flawless finish.",
    icon: Feather,
  },
  {
    name: "BB Cream",
    slug: "bb-cream",
    tag: "SPF 40 Radiance",
    description: "Lightweight tone-perfecting moisture cream with skin-loving hydration.",
    icon: Droplets,
  },
  {
    name: "Makeup Kits",
    slug: "makeup-kits",
    tag: "Luxury Gift Sets",
    description: "Curated full-face cosmetic collections & elegant designer gift mastersets.",
    icon: Gift,
  },
  {
    name: "Makeup Brushes",
    slug: "makeup-brushes",
    tag: "Artist Grade",
    description: "Ultra-soft synthetic brushes engineered for effortless, seamless blending.",
    icon: Brush,
  },
  {
    name: "Lip Oil & Balms",
    slug: "lip-oil-balm",
    tag: "Restorative Care",
    description: "Deeply nourishing botanical oils & tinted glosses for healthy, supple lips.",
    icon: Heart,
  },
  {
    name: "Face Blush",
    slug: "face-blush",
    tag: "Luminous Flush",
    description: "Silky mineral powder and cream formulas for a radiant, lit-from-within flush.",
    icon: Sparkles,
  },
  {
    name: "Eyes Blush",
    slug: "eyes-blush",
    tag: "Chroma Pigment",
    description: "Dimensional shimmer pigments, chromatic shadow palettes & contour duos.",
    icon: Palette,
  },
  {
    name: "Lip Gloss",
    slug: "lip-gloss",
    tag: "Crystalline Shine",
    description: "High-shine plumping glass glosses with crystalline reflective brilliance.",
    icon: Gem,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function MakeupCategoriesClient() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-8"
    >
      {subCategories.map((cat) => {
        const IconComponent = cat.icon;
        return (
          <motion.div
            key={cat.slug}
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="h-full"
          >
            <Link
              href={`/shop/makeup/${cat.slug}`}
              className="group relative flex flex-col justify-between h-full p-5 sm:p-6 md:p-7 rounded-xl bg-[#121316]/70 backdrop-blur-md border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 hover:shadow-[0_12px_40px_-10px_rgba(212,175,55,0.22)] overflow-hidden"
            >
              {/* Subtle ambient Champagne Gold glow behind the card on hover */}
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#D4AF37]/15 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#B07F6D]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Card Header: Icon & Category Tag */}
              <div>
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#0B0C10]/90 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:text-[#F8F9FA] group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.45)] transition-all duration-300">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-medium tracking-[0.2em] uppercase text-[#D4AF37]/90 px-2 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                    {cat.tag}
                  </span>
                </div>

                {/* Subcategory Title */}
                <h3 className="font-serif text-base sm:text-lg md:text-xl text-[#F8F9FA] tracking-wide group-hover:text-[#D4AF37] transition-colors duration-300">
                  {cat.name}
                </h3>

                {/* Subcategory Description */}
                <p className="text-[11px] sm:text-xs text-[#9CA3AF] mt-2 leading-relaxed line-clamp-2 font-light">
                  {cat.description}
                </p>
              </div>

              {/* Card Footer: Explore Link Arrow */}
              <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between text-[#D4AF37]">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-semibold text-[#9CA3AF] group-hover:text-[#F8F9FA] transition-colors">
                  Explore
                </span>
                <span className="w-6 h-6 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-[#D4AF37] group-hover:text-[#0B0C10] transition-all duration-300 group-hover:translate-x-1">
                  <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
