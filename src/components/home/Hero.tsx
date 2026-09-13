"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full h-[65vh] md:h-[75vh] flex items-center justify-center overflow-hidden bg-[#0f0c08]">
      <div className="absolute inset-0 z-0">
        <motion.img 
          src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2000&auto=format&fit=crop"
          alt="Luxury Cosmetics"
          className="w-full h-full object-cover opacity-30"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 15, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c08] via-[#0f0c08]/50 to-transparent" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-12">
        <motion.h1 
          className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-[#d4af37] mb-6 tracking-wide drop-shadow-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          GLAMOURGRID
        </motion.h1>
        
        <motion.p 
          className="text-sm md:text-lg text-[#FDFBF7] mb-10 tracking-[0.2em] font-light uppercase opacity-90"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Elevate Your Beauty
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <Link href="/shop" className="bg-[#d4af37] text-[#0f0c08] px-10 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-white hover:text-[#0f0c08] transition-all duration-300 w-full sm:w-auto text-center">
            Shop Collection
          </Link>
          <Link href="/shop/categories" className="bg-transparent text-[#d4af37] border border-[#d4af37] px-10 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#d4af37] hover:text-[#0f0c08] transition-all duration-300 w-full sm:w-auto text-center">
            Explore Beauty
          </Link>
        </motion.div>
      </div>
    </section>
  );
}