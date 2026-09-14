export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MakeupCategoriesClient from './MakeupCategoriesClient';
import Link from 'next/link';

export default function MakeupPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0B0C10] text-[#F8F9FA] pt-24">
        {/* Luxury Hero Banner */}
        <div className="relative overflow-hidden py-20 px-6 text-center bg-gradient-to-b from-[#121316] via-[#0B0C10] to-[#0B0C10] border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.08)_0%,_transparent_70%)] pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF37] border border-[#D4AF37]/35 px-4 py-1.5 rounded-full mb-6 bg-[#0B0C10]/60 backdrop-blur-sm">
              Haute Cosmétiques
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#F8F9FA] tracking-widest mb-4 uppercase">
              Makeup
            </h1>
            <p className="text-[#9CA3AF] text-xs sm:text-sm uppercase tracking-[0.25em] font-light max-w-xl mx-auto leading-relaxed">
              Explore Our Curated Luxury Collections & Artistry Formulations
            </p>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6" />
          </div>
        </div>

        {/* Sub-Category Interactive Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-20">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-medium">Categories</span>
              <h2 className="text-xl sm:text-2xl font-serif text-[#F8F9FA] tracking-wide mt-0.5">Select a Collection</h2>
            </div>
            <Link
              href="/shop"
              className="text-xs uppercase tracking-widest text-[#9CA3AF] hover:text-[#D4AF37] transition-colors"
            >
              View All Products →
            </Link>
          </div>

          <MakeupCategoriesClient />
        </div>
      </div>
      <Footer />
    </>
  );
}
