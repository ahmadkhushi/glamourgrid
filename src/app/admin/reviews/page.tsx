'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getApiUrl } from '@/lib/api';
import { Star, Trash2, Eye, EyeOff, MessageSquare, ArrowLeft, RefreshCw } from 'lucide-react';

interface AdminReview {
  id: number;
  authorName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  product?: {
    id: number;
    name: string;
    slug: string;
    imageUrl: string | null;
  };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterRating, setFilterRating] = useState<number | 'ALL'>('ALL');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/reviews?all=true'), { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      } else {
        setError('Failed to load reviews.');
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
      setError('Network error loading reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApproval = async (id: number, currentApprovedState: boolean) => {
    try {
      const res = await fetch(getApiUrl(`/api/reviews/${id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: !currentApprovedState }),
      });

      if (res.ok) {
        setReviews(reviews.map((r) => (r.id === id ? { ...r, isApproved: !currentApprovedState } : r)));
      }
    } catch (err) {
      console.error('Toggle approval error:', err);
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (!confirm('Are you sure you want to delete this review permanently?')) return;
    try {
      const res = await fetch(getApiUrl(`/api/reviews/${id}`), {
        method: 'DELETE',
      });

      if (res.ok) {
        setReviews(reviews.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error('Delete review error:', err);
    }
  };

  const filteredReviews = filterRating === 'ALL'
    ? reviews
    : reviews.filter((r) => r.rating === filterRating);

  return (
    <div className="min-h-screen bg-[#0f0c08] text-[#FDFBF7] pt-24 pb-16 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link href="/admin" className="text-xs uppercase tracking-widest text-[#a89f91] hover:text-[#d4af37] flex items-center gap-1.5 mb-2 transition-colors">
              <ArrowLeft size={14} /> Back to Admin Dashboard
            </Link>
            <h1 className="text-3xl font-serif text-[#d4af37]">Customer Reviews Moderation</h1>
          </div>

          <button
            onClick={fetchReviews}
            className="self-start md:self-auto bg-[#16100a] border border-[#2a2018] hover:border-[#d4af37]/40 px-4 py-2 text-xs text-[#a89f91] hover:text-white rounded flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <span className="text-xs text-[#a89f91] uppercase tracking-wider mr-2 font-mono">Filter Rating:</span>
          {['ALL', 5, 4, 3, 2, 1].map((r) => (
            <button
              key={String(r)}
              onClick={() => setFilterRating(r as any)}
              className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                filterRating === r
                  ? 'bg-[#d4af37] text-[#0f0c08] border-[#d4af37] font-semibold'
                  : 'bg-[#16100a] text-[#a89f91] border-[#2a2018] hover:border-[#d4af37]/30'
              }`}
            >
              {r === 'ALL' ? 'All Reviews' : `${r} ★`}
            </button>
          ))}
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="bg-[#16100a] border border-[#2a2018] p-12 text-center text-[#a89f91] rounded">
            Loading customer reviews...
          </div>
        ) : error ? (
          <div className="bg-red-950/30 border border-red-800 p-6 text-center text-red-300 rounded">
            {error}
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-[#16100a] border border-[#2a2018] p-12 text-center text-[#a89f91] rounded">
            <MessageSquare className="mx-auto mb-3 text-[#d4af37]/40" size={36} />
            <p className="text-base text-[#FDFBF7] mb-1">No reviews found</p>
            <p className="text-xs">Customer reviews submitted on product pages will appear here for moderation.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredReviews.map((rev) => (
              <div key={rev.id} className="bg-[#16100a] border border-[#2a2018] p-5 rounded flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Product & Review Content */}
                <div className="flex flex-col md:flex-row items-start gap-4 flex-grow">
                  {rev.product?.imageUrl && (
                    <img
                      src={rev.product.imageUrl}
                      alt={rev.product.name}
                      className="w-14 h-14 object-cover border border-[#2a2018] rounded flex-shrink-0"
                    />
                  )}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-[#FDFBF7]">{rev.authorName}</span>
                      <div className="flex text-[#d4af37]">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={13}
                            fill={s <= rev.rating ? '#d4af37' : 'none'}
                            className={s <= rev.rating ? 'text-[#d4af37]' : 'text-[#3a2e22]'}
                          />
                        ))}
                      </div>
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-mono ${
                        rev.isApproved ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {rev.isApproved ? 'Visible' : 'Hidden'}
                      </span>
                    </div>

                    {rev.product && (
                      <p className="text-xs text-[#d4af37]">
                        Product: <Link href={`/product/${rev.product.slug}`} className="hover:underline font-mono">{rev.product.name}</Link>
                      </p>
                    )}

                    <p className="text-xs text-[#a89f91] mt-1 italic">
                      "{rev.comment}"
                    </p>

                    <span className="text-[10px] text-[#a89f91]/60 mt-1">
                      Submitted on {new Date(rev.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Moderation Action Buttons */}
                <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                  <button
                    onClick={() => handleToggleApproval(rev.id, rev.isApproved)}
                    className={`px-3 py-1.5 text-xs rounded border flex items-center gap-1.5 transition-colors ${
                      rev.isApproved
                        ? 'bg-amber-950/40 text-amber-300 border-amber-800 hover:bg-amber-900/60'
                        : 'bg-emerald-950/40 text-emerald-300 border-emerald-800 hover:bg-emerald-900/60'
                    }`}
                  >
                    {rev.isApproved ? (
                      <>
                        <EyeOff size={13} /> Hide Review
                      </>
                    ) : (
                      <>
                        <Eye size={13} /> Approve & Show
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    className="px-3 py-1.5 text-xs bg-red-950/40 text-red-400 border border-red-800 hover:bg-red-900/60 rounded flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
