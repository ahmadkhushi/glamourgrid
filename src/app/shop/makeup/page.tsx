import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const subCategories = [
  { name: 'Eye Lashes', slug: 'eye-lashes', emoji: '👁️', description: 'Natural & dramatic lash collections' },
  { name: 'Mascara', slug: 'mascara', emoji: '✨', description: 'Volumizing & lengthening mascaras' },
  { name: 'Lipsticks', slug: 'lipsticks', emoji: '💄', description: 'Matte, glossy & satin finishes' },
  { name: 'Face Powder', slug: 'face-powder', emoji: '🌸', description: 'Setting & finishing powders' },
  { name: 'BB Cream', slug: 'bb-cream', emoji: '🧴', description: 'BB & CC creams for flawless skin' },
  { name: 'Makeup Kits', slug: 'makeup-kits', emoji: '🎁', description: 'Complete sets & gift kits' },
  { name: 'Makeup Brushes', slug: 'makeup-brushes', emoji: '🖌️', description: 'Professional quality brushes' },
  { name: 'Lip Oil & Balms', slug: 'lip-oil-balms', emoji: '💋', description: 'Nourishing lip care & oils' },
  { name: 'Face Blush', slug: 'face-blush', emoji: '🌷', description: 'Powder & cream blushes' },
  { name: 'Eye Shadow', slug: 'eye-shadow', emoji: '🎨', description: 'Palettes, singles & duos' },
  { name: 'Lip Gloss', slug: 'lip-gloss', emoji: '✨', description: 'High-shine & plumping glosses' },
];

export default function MakeupPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0f0c08] pt-24">
        {/* Hero */}
        <div className="relative overflow-hidden py-20 px-6 text-center bg-gradient-to-b from-[#1a100a] to-[#0f0c08] border-b border-[#2a2018]">
          <h1 className="text-5xl md:text-7xl font-serif text-[#d4af37] tracking-widest mb-4">MAKEUP</h1>
          <p className="text-[#a89f91] text-sm uppercase tracking-[0.3em]">Explore Our Full Makeup Collection</p>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.04)_0%,_transparent_70%)]" />
        </div>

        {/* Sub-Category Grid */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {subCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop/makeup/${cat.slug}`}
                className="group bg-[#16100a] border border-[#2a2018] hover:border-[#d4af37]/40 p-6 flex flex-col items-center text-center transition-all duration-300 hover:bg-[#1a120c]"
              >
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {cat.emoji}
                </span>
                <h3 className="text-[#FDFBF7] font-serif text-sm tracking-wider group-hover:text-[#d4af37] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[#a89f91] text-xs mt-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity">
                  {cat.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
