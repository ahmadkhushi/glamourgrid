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
      className="group relative flex flex-col bg-[#16100a] border border-[#2a2018] hover:border-[#d4af37]/30 transition-colors duration-500"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.isNewArrival && (
          <span className="bg-[#d4af37] text-[#0f0c08] text-[10px] font-bold tracking-widest uppercase px-2 py-1">
            New
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-[#0f0c08] text-[#d4af37] border border-[#d4af37] text-[10px] font-bold tracking-widest uppercase px-2 py-1">
            Best Seller
          </span>
        )}
      </div>

      {/* Wishlist */}
      <button className="absolute top-3 right-3 z-10 text-[#a89f91] hover:text-[#d4af37] transition-colors p-1 opacity-0 group-hover:opacity-100 duration-300" aria-label="Add to Wishlist">
        <Heart size={16} />
      </button>

      {/* Media: Image or Video */}
      <Link href={`/product/${product.slug}`} className="block overflow-hidden relative w-full h-[320px]">
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
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#a89f91]">{product.brand}</p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-serif text-[#FDFBF7] hover:text-[#d4af37] transition-colors leading-snug">{product.name}</h3>
        </Link>
        {product.colors && <ColorSwatches colors={product.colors} size="sm" />}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            {product.salePrice ? (
              <>
                <span className="text-[#d4af37] font-semibold text-sm">Rs. {product.salePrice.toLocaleString()}</span>
                <span className="text-[#a89f91] line-through text-xs">Rs. {product.price.toLocaleString()}</span>
              </>
            ) : (
              <span className="text-[#d4af37] font-semibold text-sm">Rs. {product.price.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>

      {/* Add to Cart */}
      <div className="overflow-hidden max-h-0 group-hover:max-h-16 transition-all duration-500 ease-in-out">
        <button
          onClick={() => addItem({ id: product.id, name: product.name, price: product.salePrice ?? product.price, image: mainImage, quantity: 1 })}
          className="w-full py-3 bg-[#d4af37] text-[#0f0c08] text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-[#e8c84a] transition-colors duration-300"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}