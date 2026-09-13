'use client';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import ImageLightbox from '@/components/ui/ImageLightbox';
import AdminPriceEdit from '@/components/ui/AdminPriceEdit';
import ColorSwatches from '@/components/ui/ColorSwatches';
import { ShoppingCart, ZoomIn, Play } from 'lucide-react';

type Product = {
  id: number; name: string; slug: string; price: number; salePrice: number | null;
  imageUrl: string | null; videoUrl: string | null; brand: string | null;
  isNewArrival: boolean; isBestSeller: boolean; isSale: boolean;
  colors?: any;
};

const FALLBACK = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop';

export default function MakeupSubPageClient({
  products, isAdmin, subName,
}: { products: Product[]; isAdmin: boolean; subName: string }) {
  const { addItem } = useCartStore();
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const openLightbox = (url: string) => setLightboxImages([url]);

  return (
    <>
      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#a89f91] text-lg mb-4">There are currently no products in {subName}.</p>
          <p className="text-[#a89f91]/60 text-sm">Please add products via the admin panel.</p>

        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product) => {
            const img = product.imageUrl || FALLBACK;
            const price = product.salePrice ?? product.price;
            return (
              <div key={product.id} className="group relative bg-[#16100a] border border-[#2a2018] hover:border-[#d4af37]/30 transition-all duration-500 flex flex-col">
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                  {product.isNewArrival && <span className="bg-[#d4af37] text-[#0f0c08] text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest">New</span>}
                  {product.isSale && <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest">Sale</span>}
                </div>

                {/* Image / Video */}
                <div className="relative h-56 overflow-hidden bg-[#0f0c08]">
                  {(() => {
                    const mediaSrc = product.videoUrl || img;
                    const isVid = Boolean(product.videoUrl) || (typeof mediaSrc === 'string' && (
                      mediaSrc.toLowerCase().endsWith('.mp4') ||
                      mediaSrc.toLowerCase().endsWith('.webm') ||
                      mediaSrc.toLowerCase().endsWith('.mov') ||
                      mediaSrc.toLowerCase().endsWith('.ogg')
                    ));

                    return isVid ? (
                      <>
                        <video src={mediaSrc} autoPlay loop muted playsInline className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-700" />
                        <button
                          onClick={() => openLightbox(mediaSrc)}
                          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Play Video"
                        >
                          <Play size={36} className="text-[#d4af37]" fill="#d4af37" />
                        </button>
                      </>
                    ) : (
                      <>
                        <img src={img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <button
                          onClick={() => openLightbox(img)}
                          className="absolute bottom-3 right-3 bg-black/60 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-[#d4af37] hover:text-black"
                          aria-label="Quick View"
                        >
                          <ZoomIn size={14} />
                        </button>
                      </>
                    );
                  })()}
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col gap-1 flex-grow">
                  {product.brand && <p className="text-[10px] uppercase tracking-widest text-[#a89f91]">{product.brand}</p>}
                  <h3 className="text-sm font-serif text-[#FDFBF7] leading-snug">{product.name}</h3>
                  {product.colors && <ColorSwatches colors={product.colors} size="sm" />}

                  {/* Price — admin can edit inline */}
                  {isAdmin ? (
                    <AdminPriceEdit productId={product.id} currentPrice={price} />
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[#d4af37] font-semibold text-sm">Rs. {price.toLocaleString()}</span>
                      {product.salePrice && (
                        <span className="text-[#a89f91] line-through text-xs">Rs. {product.price.toLocaleString()}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Add to Cart */}
                <div className="overflow-hidden max-h-0 group-hover:max-h-14 transition-all duration-500">
                  <button
                    onClick={() => addItem({ id: String(product.id), name: product.name, price, image: img, quantity: 1 })}
                    className="w-full py-3 bg-[#d4af37] text-[#0f0c08] text-[11px] font-semibold tracking-widest uppercase hover:bg-[#e8c84a] transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={14} /> Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox */}
      {lightboxImages.length > 0 && (
        <ImageLightbox images={lightboxImages} onClose={() => setLightboxImages([])} />
      )}

      {/* Video Modal */}
      {videoUrl && (
        <div className="fixed inset-0 z-[9990] bg-black/95 flex items-center justify-center" onClick={() => setVideoUrl(null)}>
          <div className="w-full max-w-3xl aspect-video px-4">
            <video src={videoUrl} controls autoPlay className="w-full h-full rounded" />
          </div>
          <button onClick={() => setVideoUrl(null)} className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl">✕</button>
        </div>
      )}
    </>
  );
}
