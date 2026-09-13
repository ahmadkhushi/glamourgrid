'use client';

import { useState } from 'react';
import ColorSwatches, { ColorVariant, parseColors } from '@/components/ui/ColorSwatches';
import AddToCartBtn from '@/components/shop/AddToCartBtn';
import ProductCard from '@/components/shop/ProductCard';
import { getApiUrl } from '@/lib/api';
import { Tag, Star, MessageSquare, Check, Sparkles } from 'lucide-react';

interface Review {
  id: number;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductDetailClient({
  product,
  relatedProducts = [],
}: {
  product: any;
  relatedProducts?: any[];
}) {
  const parsedColors = parseColors(product.colors);
  const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(
    parsedColors.length > 0 ? parsedColors[0] : null
  );

  // Reviews state
  const [reviewsList, setReviewsList] = useState<Review[]>(product.reviews || []);
  const [reviewForm, setReviewForm] = useState({ authorName: '', rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');

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

  // Average Rating
  const totalReviews = reviewsList.length;
  const avgRating = totalReviews > 0
    ? reviewsList.reduce((acc, r) => acc + r.rating, 0) / totalReviews
    : 5;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.authorName.trim() || !reviewForm.comment.trim()) {
      setReviewError('Please enter your name and review comment.');
      return;
    }

    setSubmittingReview(true);
    setReviewError('');
    setReviewSuccess(false);

    try {
      const res = await fetch(getApiUrl('/api/reviews'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          authorName: reviewForm.authorName.trim(),
          rating: reviewForm.rating,
          comment: reviewForm.comment.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setReviewsList([data.review, ...reviewsList]);
        setReviewForm({ authorName: '', rating: 5, comment: '' });
        setReviewSuccess(true);
        setTimeout(() => setReviewSuccess(false), 5000);
      } else {
        setReviewError(data.error || 'Failed to submit review.');
      }
    } catch (err) {
      console.error('Review submit error:', err);
      setReviewError('Network error. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-[#0f0c08] text-[#FDFBF7]">
      <div className="container mx-auto px-4 md:px-8 py-12 max-w-6xl">
        
        {/* Main Product Showcase Section */}
        <div className="flex flex-col md:flex-row gap-12 items-start mb-20">
          
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
                className="w-full h-[300px] sm:h-[400px] md:h-[450px] object-cover rounded"
              />
            ) : (
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-[300px] sm:h-[400px] md:h-[450px] object-cover rounded"
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
            <h1 className="text-3xl md:text-4xl font-serif text-[#FDFBF7] mb-2 leading-tight">{product.name}</h1>
            
            {/* Rating Summary Badge */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-[#d4af37]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={15}
                    fill={star <= Math.round(avgRating) ? '#d4af37' : 'none'}
                    className={star <= Math.round(avgRating) ? 'text-[#d4af37]' : 'text-[#3a2e22]'}
                  />
                ))}
              </div>
              <span className="text-xs text-[#a89f91] font-mono">
                {avgRating.toFixed(1)} ({totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'})
              </span>
            </div>

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
                <span className="text-[10px] uppercase tracking-widest text-[#a89f91] mb-2 flex items-center gap-1">
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

        {/* ── CUSTOMER REVIEWS SECTION ── */}
        <div className="border-t border-[#2a2018] pt-16 mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold block mb-1">
                Verified Feedback
              </span>
              <h2 className="text-3xl font-serif text-[#FDFBF7]">Customer Reviews</h2>
            </div>
            <div className="flex items-center gap-3 bg-[#16100a] border border-[#2a2018] px-5 py-3 rounded">
              <span className="text-2xl font-bold font-mono text-[#d4af37]">{avgRating.toFixed(1)}</span>
              <div className="flex flex-col">
                <div className="flex text-[#d4af37]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={13}
                      fill={star <= Math.round(avgRating) ? '#d4af37' : 'none'}
                      className={star <= Math.round(avgRating) ? 'text-[#d4af37]' : 'text-[#3a2e22]'}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-[#a89f91] tracking-wider uppercase">
                  Based on {totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Reviews List Column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {reviewsList.length === 0 ? (
                <div className="bg-[#16100a] border border-[#2a2018] p-8 text-center rounded text-[#a89f91]">
                  <MessageSquare className="mx-auto mb-3 text-[#d4af37]/60" size={32} />
                  <p className="text-sm font-serif text-[#FDFBF7] mb-1">Be the first to review this product!</p>
                  <p className="text-xs">Share your experience with fellow beauty enthusiasts.</p>
                </div>
              ) : (
                reviewsList.map((review) => (
                  <div key={review.id} className="bg-[#16100a] border border-[#2a2018] p-6 rounded flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] font-bold text-xs uppercase">
                          {review.authorName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#FDFBF7]">{review.authorName}</p>
                          <p className="text-[10px] text-[#a89f91]">
                            {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex text-[#d4af37]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            fill={star <= review.rating ? '#d4af37' : 'none'}
                            className={star <= review.rating ? 'text-[#d4af37]' : 'text-[#3a2e22]'}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-[#a89f91] leading-relaxed pt-2 border-t border-[#2a2018]/60">
                      "{review.comment}"
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review Form */}
            <div className="bg-[#16100a] border border-[#2a2018] p-6 rounded h-fit">
              <h3 className="text-xl font-serif text-[#FDFBF7] mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-[#d4af37]" /> Write a Review
              </h3>

              {reviewSuccess && (
                <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs rounded flex items-center gap-2">
                  <Check size={16} /> Thank you! Your review has been submitted successfully.
                </div>
              )}

              {reviewError && (
                <div className="mb-4 p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded">
                  {reviewError}
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#a89f91] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={reviewForm.authorName}
                    onChange={(e) => setReviewForm({ ...reviewForm, authorName: e.target.value })}
                    placeholder="e.g. Sophia Vance"
                    className="w-full bg-[#0f0c08] border border-[#2a2018] text-[#FDFBF7] px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#d4af37]/50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#a89f91] mb-1">
                    Star Rating *
                  </label>
                  <div className="flex items-center gap-1 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="p-1 text-[#d4af37] hover:scale-110 transition-transform"
                      >
                        <Star
                          size={20}
                          fill={star <= reviewForm.rating ? '#d4af37' : 'none'}
                          className={star <= reviewForm.rating ? 'text-[#d4af37]' : 'text-[#3a2e22]'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#a89f91] mb-1">
                    Your Review *
                  </label>
                  <textarea
                    rows={4}
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    placeholder="Share details of your experience with this item..."
                    className="w-full bg-[#0f0c08] border border-[#2a2018] text-[#FDFBF7] px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#d4af37]/50 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-3 bg-[#d4af37] text-[#0f0c08] text-xs font-semibold uppercase tracking-widest hover:bg-[#e8c84a] transition-colors rounded disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ── YOU MIGHT ALSO LIKE (RELATED PRODUCTS CROSS-SELLING) ── */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-[#2a2018] pt-16">
            <div className="text-center mb-12">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold block mb-1">
                Complementary Selections
              </span>
              <h2 className="text-3xl font-serif text-[#FDFBF7]">You Might Also Like</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
