'use client';

import { useState } from 'react';
import ColorSwatches, { ColorVariant, parseColors } from '@/components/ui/ColorSwatches';
import AddToCartBtn from '@/components/shop/AddToCartBtn';
import { Tag, Check } from 'lucide-react';

export default function ProductDetailClient({ product }: { product: any }) {
  const parsedColors = parseColors(product.colors);
  const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(
    parsedColors.length > 0 ? parsedColors[0] : null
  );

  const mainImage = product.imageUrl || '/perfume-banner.jpg';
  const mediaUrl = product.videoUrl || mainImage;
  const isVideo = Boolean(product.videoUrl) || (typeof mediaUrl === 'string' && (
    mediaUrl.toLowerCase().endsWith('.mp4') ||
    mediaUrl.toLowerCase().endsWith('.webm') ||
    mediaUrl.toLowerCase().endsWith('.mov') ||
    mediaUrl.toLowerCase().endsWith('.ogg')
  ));

  const keywordsList = typeof product.keywords === 'string' 
    ? product.keywords.split(',').map((k: string) => k.trim()).filter(Boolean)
    : Array.isArray(product.keywords) ? product.keywords : [];

  return (
    <div className="pt-24 min-h-screen bg-[#0f0c08] text-[#FDFBF7]">
      <div className="container mx-auto px-4 md:px-8 py-12 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          
          {/* Media Player / Image */}
          <div className="w-full md:w-1/2 bg-[#16100a] border border-[#2a2018] rounded p-2 overflow-hidden shadow-2xl relative">
            {isVideo ? (
              <video
                src={mediaUrl}
                controls
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-[450px] object-cover rounded"
              />
            ) : (
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-[450px] object-cover rounded"
              />
            )}
            
            {product.isNewArrival && (
              <span className="absolute top-4 left-4 bg-[#d4af37] text-[#0f0c08] text-[10px] font-bold tracking-widest uppercase px-3 py-1 shadow-md">
                New Arrival
              </span>
            )}
          </div>

          {/* Details Column */}
          <div className="w-full md:w-1/2 flex flex-col">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold mb-2">
              {product.category?.name || product.brand || 'GlamourGrid Exclusives'}
            </span>
            <h1 className="text-3xl md:text-4xl font-serif text-[#FDFBF7] mb-3 leading-tight">{product.name}</h1>
            
            <div className="flex items-baseline gap-3 mb-6">
              {product.salePrice ? (
                <>
                  <span className="text-2xl font-semibold text-[#d4af37]">Rs. {product.salePrice.toLocaleString()}</span>
                  <span className="text-base text-[#a89f91] line-through">Rs. {product.price.toLocaleString()}</span>
                </>
              ) : (
                <span className="text-2xl font-semibold text-[#d4af37]">Rs. {product.price.toLocaleString()}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-[#a89f91] mb-6 leading-relaxed text-sm md:text-base border-t border-[#2a2018] pt-4">
              {product.description || 'Luxury haute cosmetics & fragrances crafted for elegance and enduring brilliance.'}
            </p>

            {/* Color Swatches / Shades */}
            {parsedColors.length > 0 && (
              <div className="mb-6 p-4 bg-[#16100a] border border-[#2a2018] rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold">
                    Available Color Shades ({parsedColors.length})
                  </span>
                  {selectedColor && (
                    <span className="text-xs text-[#a89f91] flex items-center gap-1 font-mono">
                      <span className="w-3 h-3 rounded-full inline-block border border-white/40" style={{ backgroundColor: selectedColor.hex }} />
                      {selectedColor.name} ({selectedColor.hex})
                    </span>
                  )}
                </div>
                <ColorSwatches
                  colors={parsedColors}
                  selectedColor={selectedColor?.name}
                  onSelectColor={(c) => setSelectedColor(c)}
                  size="lg"
                />
              </div>
            )}

            {/* SEO Keywords / Tags */}
            {keywordsList.length > 0 && (
              <div className="mb-6">
                <span className="text-[10px] uppercase tracking-widest text-[#a89f91] mb-2 block flex items-center gap-1">
                  <Tag size={12} className="text-[#d4af37]" /> Keywords & Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {keywordsList.map((tag: string, i: number) => (
                    <span key={i} className="text-[11px] bg-[#1a140e] border border-[#2a2018] text-[#a89f91] px-2.5 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="pt-2">
              <AddToCartBtn
                product={{
                  id: product.id,
                  name: selectedColor ? `${product.name} (${selectedColor.name})` : product.name,
                  price: product.salePrice ?? product.price,
                  image: mainImage,
                  quantity: 1,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
