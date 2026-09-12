import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import MakeupSubPageClient from './MakeupSubPageClient';

const subCategoryMeta: Record<string, { name: string; emoji: string; description: string; gradient: string }> = {
  'eye-lashes':      { name: 'Eye Lashes',      emoji: '👁️', description: 'Dramatic & natural lash collections for every look', gradient: 'from-purple-900/30' },
  'mascara':         { name: 'Mascara',          emoji: '✨', description: 'Volumizing, lengthening & 24H waterproof mascara eyeliner pens', gradient: 'from-pink-900/30' },
  'lipsticks':       { name: 'Lipsticks',        emoji: '💄', description: 'Matte, glossy, satin & liquid lipsticks',              gradient: 'from-red-900/30' },
  'face-powder':     { name: 'Face Powder',      emoji: '🌸', description: 'Setting, translucent & pressed face powders',          gradient: 'from-rose-900/30' },
  'bb-cream':        { name: 'BB Cream',         emoji: '🧴', description: 'BB & CC creams for flawless, natural coverage',        gradient: 'from-amber-900/30' },
  'makeup-kits':     { name: 'Makeup Kits',      emoji: '🎁', description: 'Complete makeup sets & luxury gift kits',              gradient: 'from-yellow-900/30' },
  'makeup-brushes':  { name: 'Makeup Brushes',   emoji: '🖌️', description: 'Professional artist-quality mini brush sets',        gradient: 'from-teal-900/30' },
  'lip-oil-balm':    { name: 'Lip Oil & Balms',  emoji: '💋', description: 'Nourishing lip oils, balms & tinted glosses',         gradient: 'from-pink-900/30' },
  'face-blush':      { name: 'Face Blush',       emoji: '🌷', description: 'Powder, cream & liquid blushes for a natural flush',  gradient: 'from-rose-900/30' },
  'eyes-blush':      { name: 'Eyes Blush',       emoji: '🎨', description: 'Palettes, singles, duos & eye blush shimmer',         gradient: 'from-violet-900/30' },
  'lip-gloss':       { name: 'Lip Gloss',        emoji: '✨', description: 'High-shine, plumping & crystalline lip glosses',        gradient: 'from-pink-900/30' },
};

const DEFAULT_SUB_PRODUCTS: Record<string, any[]> = {
  'mascara': [
    {
      id: 201,
      name: 'Nebli 24H Waterproof Eyeliner Pen - Rose Gold Edition',
      slug: 'nebli-waterproof-eyeliner-rosegold',
      price: 750,
      salePrice: null,
      imageUrl: '/eyeliner-rosegold.jpg',
      videoUrl: null,
      brand: 'NEBLI Paris',
      isNewArrival: true,
      isBestSeller: true,
      isSale: false,
    },
    {
      id: 202,
      name: 'Nebli 24H Waterproof Eyeliner Pen - Blue Crane Edition',
      slug: 'nebli-waterproof-eyeliner-blue',
      price: 850,
      salePrice: null,
      imageUrl: '/eyeliner-blue.jpg',
      videoUrl: null,
      brand: 'NEBLI Paris',
      isNewArrival: true,
      isBestSeller: false,
      isSale: false,
    },
  ],
  'makeup-brushes': [
    {
      id: 203,
      name: 'HudaFashion Mini Makeup Brush Set (3-Piece Soft Skin)',
      slug: 'hudafashion-mini-brush-set',
      price: 650,
      salePrice: null,
      imageUrl: '/huda-brush-set.jpg',
      videoUrl: null,
      brand: 'HudaFashion',
      isNewArrival: true,
      isBestSeller: true,
      isSale: false,
    },
  ],
  'eye-lashes': [
    {
      id: 204,
      name: 'Pro Volume 3D Mink Lash Set',
      slug: 'pro-volume-mink-lashes',
      price: 550,
      salePrice: null,
      imageUrl: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?q=80&w=800&auto=format&fit=crop',
      videoUrl: null,
      brand: 'GlamourGrid',
      isNewArrival: false,
      isBestSeller: true,
      isSale: false,
    },
  ],
  'lipsticks': [
    {
      id: 205,
      name: 'Velvet Matte Long-Wear Lipstick',
      slug: 'velvet-matte-lipstick',
      price: 600,
      salePrice: null,
      imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop',
      videoUrl: null,
      brand: 'GlamourGrid',
      isNewArrival: false,
      isBestSeller: true,
      isSale: false,
    },
    {
      id: 213,
      name: 'BelyBela Velvet Creamy Lipstick - Shade 04',
      slug: 'belybela-velvet-lipstick-04',
      price: 750,
      salePrice: 650,
      imageUrl: '/belybela-lipstick.jpg',
      videoUrl: null,
      brand: 'BELYBELA',
      isNewArrival: true,
      isBestSeller: true,
      isSale: true,
    },
  ],
  'face-powder': [
    {
      id: 206,
      name: 'Silk Press Poreless Setting Powder',
      slug: 'silk-press-face-powder',
      price: 700,
      salePrice: null,
      imageUrl: 'https://images.unsplash.com/photo-1590156546946-ce55a12a6a5d?q=80&w=800&auto=format&fit=crop',
      videoUrl: null,
      brand: 'GlamourGrid',
      isNewArrival: true,
      isBestSeller: false,
      isSale: false,
    },
  ],
  'bb-cream': [
    {
      id: 207,
      name: 'Glowing Radiance BB Cream SPF 40',
      slug: 'glow-bb-cream',
      price: 800,
      salePrice: null,
      imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop',
      videoUrl: null,
      brand: 'GlamourGrid',
      isNewArrival: false,
      isBestSeller: true,
      isSale: false,
    },
    {
      id: 215,
      name: 'NEBLI Heart Glow Stick - Natural Radiance BB Stick',
      slug: 'nebli-heart-glow-stick',
      price: 150,
      salePrice: null,
      imageUrl: '/heart-glow-stick.jpg',
      videoUrl: null,
      brand: 'NEBLI Paris',
      isNewArrival: true,
      isBestSeller: true,
      isSale: false,
    },
  ],
  'makeup-kits': [
    {
      id: 208,
      name: 'Deluxe All-In-One Beauty Gift Kit',
      slug: 'deluxe-beauty-kit',
      price: 990,
      salePrice: null,
      imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop',
      videoUrl: null,
      brand: 'GlamourGrid',
      isNewArrival: true,
      isBestSeller: true,
      isSale: false,
    },
  ],
  'lip-oil-balm': [
    {
      id: 209,
      name: 'Nourishing Botanical Lip Oil & Tinted Balm',
      slug: 'nourishing-lip-oil',
      price: 500,
      salePrice: null,
      imageUrl: 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?q=80&w=800&auto=format&fit=crop',
      videoUrl: null,
      brand: 'GlamourGrid',
      isNewArrival: true,
      isBestSeller: false,
      isSale: false,
    },
  ],
  'face-blush': [
    {
      id: 210,
      name: 'Soft Velvet Liquid Flush Blush',
      slug: 'soft-velvet-blush',
      price: 580,
      salePrice: null,
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop',
      videoUrl: null,
      brand: 'GlamourGrid',
      isNewArrival: false,
      isBestSeller: true,
      isSale: false,
    },
  ],
  'eyes-blush': [
    {
      id: 211,
      name: 'Rose Gold Shimmer Eyes & Blush Palette',
      slug: 'rose-gold-eyes-blush',
      price: 720,
      salePrice: null,
      imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop',
      videoUrl: null,
      brand: 'GlamourGrid',
      isNewArrival: true,
      isBestSeller: false,
      isSale: false,
    },
  ],
  'lip-gloss': [
    {
      id: 212,
      name: 'Crystalline High-Shine Plumping Lip Gloss',
      slug: 'crystalline-lip-gloss',
      price: 650,
      salePrice: null,
      imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop',
      videoUrl: null,
      brand: 'GlamourGrid',
      isNewArrival: true,
      isBestSeller: true,
      isSale: false,
    },
    {
      id: 214,
      name: 'Hannaier Color Lasting Wine Lip Tint & Gloss',
      slug: 'hannaier-wine-lip-tint-gloss',
      price: 690,
      salePrice: null,
      imageUrl: '/wine-lip-tint.jpg',
      videoUrl: null,
      brand: 'Hannaier',
      isNewArrival: true,
      isBestSeller: true,
      isSale: false,
    },
  ],
};

export async function generateStaticParams() {
  return Object.keys(subCategoryMeta).map((slug) => ({ sub: slug }));
}

export default async function MakeupSubPage({
  params,
}: {
  params: Promise<{ sub: string }>;
}) {
  const { sub } = await params;
  const meta = subCategoryMeta[sub];
  if (!meta) return notFound();

  const session = await getSession();
  const isAdmin = session?.role === 'ADMIN';

  let products: any[] = [];

  try {
    const cat = await prisma.category.findUnique({ where: { slug: sub } });
    if (cat) {
      products = await prisma.product.findMany({
        where: { categoryId: cat.id, isActive: true },
        orderBy: { createdAt: 'desc' },
      });
    }
  } catch (err) {
    console.error("Prisma query error in sub category:", err);
  }

  if (products.length === 0) {
    products = DEFAULT_SUB_PRODUCTS[sub] || [];
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0f0c08] pt-24">
        {/* Hero Banner */}
        <div className={`relative py-20 px-6 text-center bg-gradient-to-b ${meta.gradient} to-[#0f0c08] border-b border-[#2a2018]`}>
          <Link href="/shop/makeup" className="text-[#a89f91] text-xs uppercase tracking-widest hover:text-[#d4af37] transition-colors inline-block mb-6">
            ← Back to Makeup
          </Link>
          <div className="text-6xl mb-4">{meta.emoji}</div>
          <h1 className="text-4xl md:text-6xl font-serif text-[#d4af37] tracking-widest mb-4">{meta.name.toUpperCase()}</h1>
          <p className="text-[#a89f91] text-sm uppercase tracking-[0.2em] max-w-md mx-auto">{meta.description}</p>
        </div>

        {/* Products */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <MakeupSubPageClient products={products} isAdmin={isAdmin} subName={meta.name} />
        </div>
      </div>
      <Footer />
    </>
  );
}
