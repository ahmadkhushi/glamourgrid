"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ImageLightbox from "@/components/ui/ImageLightbox";
import AdminPriceEdit from "@/components/ui/AdminPriceEdit";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, ZoomIn, Play } from "lucide-react";

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
    imageUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop",
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
    imageUrl: "https://images.unsplash.com/photo-1608248597263-00079e96047c?q=80&w=800&auto=format&fit=crop",
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
    imageUrl: "https://images.unsplash.com/photo-1590156546946-ce55a12a6a5d?q=80&w=800&auto=format&fit=crop",
    videoUrl: null,
    stock: 14,
  },
];

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

  const handlePriceUpdate = (productId: number, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, price: newPrice } : p))
    );
  };

  return (
    <div className="min-h-screen bg-[#0f0c08] text-[#FDFBF7] cursor-default">
      <Navbar />

      {/* Cinematic Hero Video Cover Page — Intact Cursor Fix */}
      <section className="relative h-screen w-full flex items-center justify-center text-center overflow-hidden bg-black cursor-default">
        {/* Video (Z-0, pointer-events-none) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Overlay (Z-10, pointer-events-none) */}
        <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none select-none" />

        {/* Hero Content (Z-20) */}
        <div className="relative z-20 px-6 max-w-4xl text-white">
          <span className="inline-block text-[11px] uppercase tracking-[0.3em] text-[#d4af37] border border-[#d4af37]/40 px-4 py-1.5 rounded-full mb-6 bg-black/40 backdrop-blur-sm">
            Haute Parfumerie & Cosmetics
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-7xl font-serif tracking-tight mb-6 uppercase text-[#FDFBF7] drop-shadow-2xl leading-tight">
            Iconic Scent. <br />
            <span className="italic font-serif lowercase text-[#d4af37]">one</span> Unforgettable You.
          </h1>
          <p className="text-sm md:text-lg text-[#a89f91] mb-10 font-light tracking-widest max-w-2xl mx-auto leading-relaxed">
            Welcome to GlamourGrid — Redefining luxury cosmetics & fragrances.
          </p>
          <a
            href="#products"
            className="inline-block px-10 py-4 bg-[#d4af37] text-[#0f0c08] font-bold uppercase tracking-[0.2em] text-xs hover:bg-white transition-all duration-300 shadow-2xl cursor-pointer"
          >
            Explore Collection
          </a>
        </div>
      </section>

      {/* Product Showcase Section */}
      <section id="products" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] border border-[#d4af37]/30 px-3 py-1 rounded-full">
            Curated Excellence
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-[#FDFBF7] mt-3 tracking-wider">
            Latest Arrivals
          </h2>
          <div className="w-12 h-0.5 bg-[#d4af37] mx-auto mt-4" />
        </div>

        {/* Product Grid — 2 in a row on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-[#140f0a] border border-[#2a2018] hover:border-[#d4af37]/40 transition-all duration-500 rounded-sm overflow-hidden flex flex-col justify-between"
            >
              {/* Media Box */}
              <div className="relative h-64 w-full bg-[#0a0805] overflow-hidden">
                {(() => {
                  const mediaUrl = product.videoUrl || product.imageUrl || '';
                  const isVid = Boolean(product.videoUrl) || (typeof mediaUrl === 'string' && (
                    mediaUrl.toLowerCase().endsWith('.mp4') ||
                    mediaUrl.toLowerCase().endsWith('.webm') ||
                    mediaUrl.toLowerCase().endsWith('.mov') ||
                    mediaUrl.toLowerCase().endsWith('.ogg')
                  ));

                  return isVid ? (
                    <video
                      src={mediaUrl}
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
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  );
                })()}

                {/* Lightbox Trigger Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      const mediaUrl = product.videoUrl || product.imageUrl || '';
                      const isVid = Boolean(product.videoUrl) || (typeof mediaUrl === 'string' && (
                        mediaUrl.toLowerCase().endsWith('.mp4') ||
                        mediaUrl.toLowerCase().endsWith('.webm') ||
                        mediaUrl.toLowerCase().endsWith('.mov')
                      ));
                      setActiveMedia({
                        type: isVid ? "video" : "image",
                        url: mediaUrl,
                        title: product.name,
                      });
                    }}
                    className="p-3 bg-[#d4af37] text-[#0f0c08] rounded-full hover:bg-white transition-colors shadow-xl cursor-pointer"
                    title="Explore Media"
                  >
                    {product.videoUrl || (product.imageUrl && product.imageUrl.toLowerCase().endsWith('.mp4')) ? <Play size={18} /> : <ZoomIn size={18} />}
                  </button>
                </div>
              </div>

              {/* Content Box */}
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#d4af37]/70 font-semibold">
                    {product.category}
                  </span>
                  <h3 className="font-serif text-lg text-[#FDFBF7] mt-1 mb-2 group-hover:text-[#d4af37] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#a89f91] line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#2a2018]/60 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-semibold text-[#d4af37]">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-[#a89f91] line-through ml-2">
                        Rs. {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <AdminPriceEdit
                        productId={product.id}
                        currentPrice={product.price}
                        onPriceUpdate={(np) => handlePriceUpdate(product.id, np)}
                      />
                    )}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`p-2.5 rounded text-xs tracking-wider uppercase font-semibold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                        addedId === product.id
                          ? "bg-green-600 text-white"
                          : "bg-[#d4af37] text-[#0f0c08] hover:bg-[#e8c84a]"
                      }`}
                    >
                      <ShoppingCart size={14} />
                      {addedId === product.id ? "Added!" : "Add"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
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
