'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderRef = searchParams.get('id') || 'GG-ORDER-SUCCESS';

  return (
    <div className="min-h-screen bg-[#0f0c08] pt-28 pb-16 text-[#FDFBF7] flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-[#16100a] border border-[#d4af37]/30 p-8 md:p-12 text-center rounded-sm shadow-2xl relative overflow-hidden">
        
        {/* Glow Effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#d4af37]/10 text-[#d4af37] mb-6 border border-[#d4af37]/30">
          <CheckCircle2 size={44} className="animate-pulse" />
        </div>

        <h1 className="text-3xl md:text-4xl font-serif text-[#d4af37] tracking-wider mb-2">
          Order Confirmed!
        </h1>
        <p className="text-xs uppercase tracking-[0.2em] text-[#a89f91] mb-6">
          Shukriya! Aapka order kamyabi se place ho gaya hai.
        </p>

        {/* Order Reference Box */}
        <div className="bg-[#0f0c08] border border-[#2a2018] p-4 rounded-sm mb-8 inline-block w-full">
          <p className="text-[10px] uppercase tracking-widest text-[#a89f91] mb-1">
            Order Reference ID
          </p>
          <p className="text-xl font-mono font-bold text-[#d4af37] tracking-wider">
            {orderRef}
          </p>
        </div>

        <p className="text-xs text-[#a89f91] leading-relaxed mb-8 max-w-md mx-auto">
          Humne aapka order receive kar liya hai. Delivery team jald hi aap se contact karegi. Delivery timeframe 2-4 working days hai.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#d4af37] text-[#0f0c08] text-xs font-bold uppercase tracking-widest hover:bg-[#e8c84a] transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag size={14} /> Continue Shopping
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 border border-[#2a2018] text-[#a89f91] hover:text-white hover:border-[#d4af37]/40 text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          >
            Home Page <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen bg-[#0f0c08] pt-28 text-center text-[#a89f91]">
          Loading Order Confirmation...
        </div>
      }>
        <OrderSuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}
