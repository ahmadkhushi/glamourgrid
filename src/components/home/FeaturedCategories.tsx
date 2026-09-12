"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function FeaturedCategories() {
  const categories = [
    { title: 'Lipsticks', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop', link: '/shop/lipsticks' },
    { title: 'Skincare', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop', link: '/shop/skincare' },
    { title: 'Fragrance', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop', link: '/shop/fragrance' },
  ];

  return (
    <section className="py-20 px-6 bg-[#0f0c08]">
      <div className="container mx-auto max-w-7xl">
        <motion.h2 
          className="text-2xl md:text-3xl font-serif text-center text-[#d4af37] mb-12 tracking-[0.15em] uppercase"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Curated Collections
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {categories.map((cat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
            >
              <Link href={cat.link} className="group relative block w-full h-[50vh] overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
                <img 
                  src={cat.image} 
                  alt={cat.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
                />
                <div className="absolute bottom-0 left-0 w-full p-8 z-20 bg-gradient-to-t from-[#0f0c08] to-transparent opacity-90">
                  <h3 className="text-xl md:text-2xl font-serif text-[#FDFBF7] uppercase tracking-widest translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    {cat.title}
                  </h3>
                  <div className="w-8 h-px bg-[#d4af37] mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}