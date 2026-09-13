"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function BrandStory() {
  return (
    <section className="py-24 px-6 bg-[#0f0c08]">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center gap-12 md:gap-20">
        <motion.div 
          className="w-full md:w-1/2 h-[35vh] sm:h-[45vh] md:h-[60vh] overflow-hidden"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <img 
            src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800&auto=format&fit=crop" 
            alt="Brand Story" 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" 
          />
        </motion.div>
        
        <motion.div 
          className="w-full md:w-1/2 flex flex-col justify-center"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-serif text-[#d4af37] mb-6 leading-snug tracking-wide">
            The Art of Pure Elegance
          </h2>
          <p className="text-[#a89f91] mb-8 leading-relaxed text-sm md:text-base font-light tracking-wide">
            GlamourGrid was born from a desire to merge the highly structured world of premium aesthetics with the seamless accessibility of everyday luxury. Every formula is meticulously crafted, every shade thoughtfully selected, to ensure you experience beauty at its most profound level.
          </p>
          <div>
            <Link href="/about" className="inline-block text-xs uppercase tracking-[0.2em] text-[#FDFBF7] pb-2 border-b border-[#d4af37] hover:text-[#d4af37] transition-colors duration-300">
              Discover Our Story
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}