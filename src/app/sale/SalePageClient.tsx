"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import ImageLightbox from "@/components/ui/ImageLightbox";
import AdminPriceEdit from "@/components/ui/AdminPriceEdit";
import ColorSwatches from "@/components/ui/ColorSwatches";
import { ShoppingCart, ZoomIn, Play, Tag } from "lucide-react";

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

export default function SalePageClient({
  initialProducts,
  isAdmin,
}: {
  initialProducts: any[];
  isAdmin: boolean;
}) {
  const [products, setProducts] = useState(initialProducts);
  const [activeMedia, setActiveMedia] = useState<{ type: "image" | "video"; url: string; title: string } | null>(null);
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
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => {
          const original = product.originalPrice || Math.round(product.price * 1.25);
          const discountPct = Math.round(((original - product.price) / original) * 100);

          return (
            <div
              key={product.id}
              className="group relative bg-[#140f0a] border border-[#2a2018] hover:border-[#d4af37]/40 transition-all duration-500 rounded-sm overflow-hidden flex flex-col justify-between"
            >
              {/* Badge */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-red-600/90 text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-sm shadow-md">
                <Tag size={12} />
                <span>SAVE {discountPct}%</span>
              </div>

              {/* Media Container */}
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

                {/* Hover overlay with lightbox trigger */}
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
                    className="p-2.5 bg-[#d4af37] text-[#0f0c08] rounded-full hover:bg-white transition-colors shadow-lg"
                    title="Explore Media"
                  >
                    {product.videoUrl || (product.imageUrl && product.imageUrl.toLowerCase().endsWith('.mp4')) ? <Play size={18} /> : <ZoomIn size={18} />}
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#d4af37]/70">
                    {product.category}
                  </span>
                  <h3 className="font-serif text-lg text-[#FDFBF7] mt-1 mb-2 group-hover:text-[#d4af37] transition-colors">
                    {product.name}
                  </h3>
                  {product.colors && <ColorSwatches colors={product.colors} size="sm" />}
                  <p className="text-xs text-[#a89f91] line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#2a2018]/60 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-semibold text-[#d4af37]">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#a89f91] line-through">
                      Rs. {original.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <AdminPriceEdit
                      productId={product.id}
                      currentPrice={product.price}
                      onPriceUpdate={(np) => handlePriceUpdate(product.id, np)}
                    />
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`p-2.5 rounded text-xs tracking-wider uppercase font-semibold transition-all duration-300 flex items-center gap-1.5 ${
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
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {activeMedia && (
        <ImageLightbox
          src={activeMedia.url}
          alt={activeMedia.title}
          type={activeMedia.type}
          onClose={() => setActiveMedia(null)}
        />
      )}
    </div>
  );
}
