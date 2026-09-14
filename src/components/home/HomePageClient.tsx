"use client";

import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ImageLightbox from "@/components/ui/ImageLightbox";
import AdminPriceEdit from "@/components/ui/AdminPriceEdit";
import TrendingCarousel from "@/components/home/TrendingCarousel";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, ZoomIn, Play, Sparkles } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  category: string;
  imageUrl: string;
  videoUrl?: string | null;
  stock: number;
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Azzaro Wanted Elixir",
    description: "Intense woody oriental elixir with passionfruit & leather notes.",
    price: 990,
    originalPrice: 1200,
    category: "fragrance",
    imageUrl: "/perfume-banner.jpg",
    videoUrl: null,
    stock: 10,
  },
  {
    id: 2,
    name: "Versace Man Eau Fraîche",
    description: "A fresh, vibrant and masculine fragrance that energizes your senses.",
    price: 950,
    originalPrice: 1150,
    category: "fragrance",
    imageUrl: "/versace-fragrance.jpg",
    videoUrl: null,
    stock: 15,
  },
  {
    id: 3,
    name: "Nebli Eyeliner Pen - Rose Gold",
    description: "24H all day wear waterproof eyeliner pen with intense black pigment.",
    price: 750,
    originalPrice: 900,
    category: "mascara",
    imageUrl: "/eyeliner-rosegold.jpg",
    videoUrl: null,
    stock: 20,
  },
  {
    id: 4,
    name: "Nebli Eyeliner Pen - Blue Crane",
    description: "24H smudge-proof & water-resistant 0.1mm fine tip eyeliner pen.",
    price: 850,
    originalPrice: 1000,
    category: "mascara",
    imageUrl: "/eyeliner-blue.jpg",
    videoUrl: null,
    stock: 18,
  },
  {
    id: 5,
    name: "HudaFashion Mini Makeup Brush Set",
    description: "3-piece ultra-soft powder, foundation & concealer travel brush set.",
    price: 650,
    originalPrice: 800,
    category: "makeup-brushes",
    imageUrl: "/huda-brush-set.jpg",
    videoUrl: null,
    stock: 25,
  },
  {
    id: 6,
    name: "Matte Liquid Lipstick",
    description: "Velvety smooth long-wear matte formula in rich rose-gold hue.",
    price: 600,
    originalPrice: 750,
    category: "lipsticks",
    imageUrl:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop",
    videoUrl: null,
    stock: 18,
  },
  {
    id: 7,
    name: "Rosemary Hair & Scalp Oil",
    description: "Organic nutrient-dense botanical oil for hair thickness and vitality.",
    price: 550,
    originalPrice: 700,
    category: "skincare",
    imageUrl:
      "https://images.unsplash.com/photo-1608248597263-00079e96047c?q=80&w=800&auto=format&fit=crop",
    videoUrl: null,
    stock: 25,
  },
  {
    id: 8,
    name: "Silk Press Face Powder",
    description: "Micro-milled pore-blurring translucent setting powder.",
    price: 700,
    originalPrice: 850,
    category: "face-powder",
    imageUrl:
      "https://images.unsplash.com/photo-1590156546946-ce55a12a6a5d?q=80&w=800&auto=format&fit=crop",
    videoUrl: null,
    stock: 14,
  },
];

/* ─── Card entrance variants ─── */
const gridContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const gridCardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

/* ─── Single premium product card ─── */
function PremiumProductCard({
  product,
  isAdmin,
  addedId,
  onAddToCart,
  onZoom,
  onPriceUpdate,
}: {
  product: Product;
  isAdmin: boolean;
  addedId: number | null;
  onAddToCart: (p: Product) => void;
  onZoom: (p: Product) => void;
  onPriceUpdate: (id: number, price: number) => void;
}) {
  const mediaUrl = product.videoUrl || product.imageUrl || "";
  const isVid =
    Boolean(product.videoUrl) ||
    (typeof mediaUrl === "string" &&
      (mediaUrl.toLowerCase().endsWith(".mp4") ||
        mediaUrl.toLowerCase().endsWith(".webm") ||
        mediaUrl.toLowerCase().endsWith(".mov") ||
        mediaUrl.toLowerCase().endsWith(".ogg")));

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : null;

  const added = addedId === product.id;

  return (
    <motion.div
      variants={gridCardVariants}
      whileHover={{ y: -10, scale: 1.025 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group relative flex flex-col rounded-xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/55 bg-[#121316]/80 backdrop-blur-md hover:shadow-[0_24px_70px_-12px_rgba(212,175,55,0.30)] transition-shadow duration-500"
    >
      {/* Ambient top-right glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#D4AF37]/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      {/* Ambient bottom-left glow */}
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#B07F6D]/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none" />

      {/* Discount badge */}
      {discount && (
        <span className="absolute top-3 left-3 z-10 bg-[#D4AF37] text-[#0B0C10] text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-sm shadow-lg">
          -{discount}%
        </span>
      )}

      {/* Media */}
      <div className="relative h-56 sm:h-64 w-full bg-[#07080A] overflow-hidden">
        {isVid ? (
          <video
            src={mediaUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 pointer-events-none"
          />
        ) : (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        )}

        {/* Dark gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />

        {/* Zoom / Play overlay button */}
        <div className="absolute inset-0 flex items-end justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onZoom(product)}
            className="p-2.5 bg-[#D4AF37] text-[#0B0C10] rounded-full hover:bg-white transition-colors shadow-xl cursor-pointer"
            title="Quick View"
          >
            {isVid ? <Play size={15} /> : <ZoomIn size={15} />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mb-1">
          {product.category}
        </span>
        <h3 className="font-serif text-sm sm:text-base text-[#F8F9FA] leading-snug mb-2 group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-[10px] sm:text-xs text-[#6B7280] leading-relaxed line-clamp-2 mb-auto">
          {product.description}
        </p>

        {/* Price + actions */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-semibold text-[#D4AF37]">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] text-[#6B7280] line-through">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <AdminPriceEdit
                productId={product.id}
                currentPrice={product.price}
                onPriceUpdate={(np) => onPriceUpdate(product.id, np)}
              />
            )}
            <button
              onClick={() => onAddToCart(product)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] sm:text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                added
                  ? "bg-green-600 text-white shadow-[0_0_16px_rgba(22,163,74,0.45)]"
                  : "bg-[#D4AF37] text-[#0B0C10] hover:bg-[#E6CA65] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
              }`}
            >
              <ShoppingCart size={13} />
              <span className="hidden sm:inline">{added ? "Added!" : "Add"}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main page component ─── */
export default function HomePageClient({
  initialProducts,
  isAdmin = false,
}: {
  initialProducts?: Product[];
  isAdmin?: boolean;
}) {
  const [products, setProducts] = useState<Product[]>(
    initialProducts && initialProducts.length > 0 ? initialProducts : DEFAULT_PRODUCTS
  );

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
    }
  }, [initialProducts]);

  const [activeMedia, setActiveMedia] = useState<{
    type: "image" | "video";
    url: string;
    title: string;
  } | null>(null);

  const addItem = useCartStore((state) => state.addItem);
  const [addedId, setAddedId] = useState<number | null>(null);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleZoom = (product: Product) => {
    const mediaUrl = product.videoUrl || product.imageUrl || "";
    const isVid =
      Boolean(product.videoUrl) ||
      (typeof mediaUrl === "string" &&
        (mediaUrl.toLowerCase().endsWith(".mp4") ||
          mediaUrl.toLowerCase().endsWith(".webm") ||
          mediaUrl.toLowerCase().endsWith(".mov")));
    setActiveMedia({ type: isVid ? "video" : "image", url: mediaUrl, title: product.name });
  };

  const handlePriceUpdate = (productId: number, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, price: newPrice } : p))
    );
  };

  /* First 6 products feed the carousel; all products feed the grid */
  const carouselProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F8F9FA] cursor-default">
      <Navbar />

      {/* ── Cinematic Hero ── */}
      <section className="relative h-screen w-full flex items-center justify-center text-center overflow-hidden bg-black cursor-default">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/58 z-10 pointer-events-none select-none" />

        {/* Hero Content */}
        <div className="relative z-20 px-6 max-w-4xl text-white">
          <motion.span
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="inline-block text-[11px] uppercase tracking-[0.35em] text-[#D4AF37] border border-[#D4AF37]/40 px-4 py-1.5 rounded-full mb-6 bg-black/50 backdrop-blur-md"
          >
            Haute Parfumerie &amp; Cosmetics
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-2xl sm:text-4xl md:text-7xl font-serif tracking-tight mb-6 uppercase text-[#F8F9FA] drop-shadow-2xl leading-tight"
          >
            Iconic Scent. <br />
            <span className="italic font-serif lowercase text-[#D4AF37]">one</span>{" "}
            Unforgettable You.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.65, ease: "easeOut" }}
            className="text-sm md:text-lg text-[#9CA3AF] mb-10 font-light tracking-widest max-w-2xl mx-auto leading-relaxed"
          >
            Welcome to GlamourGrid — Redefining luxury cosmetics &amp; fragrances.
          </motion.p>

          <motion.a
            href="#products"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85, ease: "easeOut" }}
            className="inline-block px-10 py-4 bg-[#D4AF37] text-[#0B0C10] font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#F8F9FA] transition-all duration-300 shadow-2xl cursor-pointer rounded-sm"
          >
            Explore Collection
          </motion.a>
        </div>
      </section>

      {/* ── Trending Horizontal Carousel ── */}
      <TrendingCarousel products={carouselProducts} />

      {/* ── Divider ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* ── Premium Product Grid ── */}
      <section id="products" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1 rounded-full">
            Curated Excellence
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-[#F8F9FA] mt-3 tracking-wider">
            Latest Arrivals
          </h2>
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4" />
        </div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-7"
          variants={gridContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {products.map((product) => (
            <PremiumProductCard
              key={product.id}
              product={product}
              isAdmin={isAdmin}
              addedId={addedId}
              onAddToCart={handleAddToCart}
              onZoom={handleZoom}
              onPriceUpdate={handlePriceUpdate}
            />
          ))}
        </motion.div>
      </section>

      {/* ── Lightbox ── */}
      {activeMedia && (
        <ImageLightbox
          src={activeMedia.url}
          alt={activeMedia.title}
          type={activeMedia.type}
          onClose={() => setActiveMedia(null)}
        />
      )}

      <Footer />
    </div>
  );
}
