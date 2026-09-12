const fs = require('fs');
const path = require('path');

const files = {
  'src/components/home/Hero.tsx': `
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
          className="text-5xl md:text-7xl lg:text-8xl font-serif text-[#d4af37] mb-6 tracking-wide drop-shadow-md"
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
`,
  'src/components/home/FeaturedCategories.tsx': `
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
`,
  'src/components/home/BrandStory.tsx': `
"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function BrandStory() {
  return (
    <section className="py-24 px-6 bg-[#0f0c08]">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center gap-12 md:gap-20">
        <motion.div 
          className="w-full md:w-1/2 h-[50vh] md:h-[60vh] overflow-hidden"
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
`,
  'src/app/page.tsx': `
import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import BrandStory from "@/components/home/BrandStory";

export default function Home() {
  return (
    <div className="bg-[#0f0c08] min-h-screen">
      <Hero />
      <FeaturedCategories />
      <BrandStory />
    </div>
  );
}
`
};

for (const [filepath, content] of Object.entries(files)) {
  const absolutePath = path.join(process.cwd(), filepath);
  fs.writeFileSync(absolutePath, content.trim());
}

console.log("Redesign complete.");
