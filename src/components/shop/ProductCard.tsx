"use client";
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { motion } from 'framer-motion';
import ColorSwatches from '@/components/ui/ColorSwatches';

export default function ProductCard({ product }: { product: any }) {
  const addItem = useCartStore((state) => state.addItem);
  const mainImage = product.imageUrl
    ?? product.images?.find((img: any) => img.isMain)?.url
    ?? product.images?.[0]?.url
    ?? 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop';
  const secondImage = product.images?.[1]?.url ?? mainImage;

  const mediaUrl = product.videoUrl || mainImage;
  const isVideo = Boolean(product.videoUrl) || (typeof mediaUrl === 'string' && (
    mediaUrl.toLowerCase().endsWith('.mp4') ||
    mediaUrl.toLowerCase().endsWith('.webm') ||
    mediaUrl.toLowerCase().endsWith('.mov') ||
    mediaUrl.toLowerCase().endsWith('.ogg')
  ));

  return (
    <motion.div
      className="group relative flex flex-col bg-[#121316]/80 backdrop-blur-md border border-white/10 hover:border-[#D4AF37]/50 hover:shadow-[0_18px_50px_-10px_rgba(212,175,55,0.25)] transition-all duration-500 rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.015 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Ambient gold glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#D4AF37]/15 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.isNewArrival && (
          <span className="bg-[#D4AF37] text-[#0B0C10] text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-sm shadow-sm">
            New
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-[#0B0C10]/90 backdrop-blur-sm text-[#D4AF37] border border-[#D4AF37]/60 text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-sm">
            Best Seller
          </span>
        )}
      </div>

      {/* Wishlist */}
      <button className="absolute top-3 right-3 z-10 text-[#9CA3AF] hover:text-[#D4AF37] transition-colors p-1.5 rounded-full bg-[#0B0C10]/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 duration-300" aria-label="Add to Wishlist">
        <Heart size={15} />
      </button>

      {/* Media: Image or Video */}
      <Link href={`/product/${product.slug}`} className="block overflow-hidden relative w-full h-[320px] bg-[#07080A]">
        {isVideo ? (
          <video
            src={mediaUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover absolute inset-0 pointer-events-none group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <>
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover absolute inset-0 transition-opacity duration-700 ease-in-out group-hover:opacity-0"
            />
            <img
              src={secondImage}
              alt={product.name}
              className="w-full h-full object-cover absolute inset-0 transition-opacity duration-700 ease-in-out opacity-0 group-hover:opacity-100 scale-105"
            />
          </>
        )}
      </Link>

      {/* Info */}
      <div className="px-4 pt-4 pb-5 flex flex-col gap-1 flex-grow">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#9CA3AF]">{product.brand}</p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-serif text-[#F8F9FA] hover:text-[#D4AF37] transition-colors leading-snug">{product.name}</h3>
        </Link>
        {product.colors && <ColorSwatches colors={product.colors} size="sm" />}
        {(() => {
          const reviews = Array.isArray(product.reviews) ? product.reviews : [];
          const reviewCount = reviews.length;
          const avgRating = reviewCount > 0
            ? reviews.reduce((sum: number, r: any) => sum + (r.rating || 5), 0) / reviewCount
            : 5;

          return (
            <div className="flex items-center gap-1.5 my-1">
              <div className="flex text-[#D4AF37]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={star <= Math.round(avgRating) ? "text-[#D4AF37]" : "text-[#22252E]"}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-[10px] text-[#9CA3AF] font-mono">
                {reviewCount > 0 ? `${avgRating.toFixed(1)} (${reviewCount})` : '5.0 (New)'}
              </span>
            </div>
          );
        })()}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            {product.salePrice ? (
              <>
                <span className="text-[#D4AF37] font-semibold text-sm">Rs. {product.salePrice.toLocaleString()}</span>
                <span className="text-[#9CA3AF] line-through text-xs">Rs. {product.price.toLocaleString()}</span>
              </>
            ) : (
              <span className="text-[#D4AF37] font-semibold text-sm">Rs. {product.price.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>

      {/* Add to Cart */}
      <div className="overflow-hidden max-h-16 md:max-h-0 md:group-hover:max-h-16 transition-all duration-500 ease-in-out">
        <button
          onClick={() => addItem({ id: product.id, name: product.name, price: product.salePrice ?? product.price, image: mainImage, quantity: 1 })}
          className="w-full py-3 bg-[#D4AF37] text-[#0B0C10] text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-[#E6CA65] transition-colors duration-300"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}