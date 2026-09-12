import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

const db = prisma as any;

export async function GET() {
  try {
    // ── 1. Admin User ────────────────────────────────────────
    const adminExists = await db.user.findUnique({
      where: { email: 'admin@glamourgrid.com' },
    });
    
    const hashedPassword = await hash('hafiz123451122', 10);

    if (adminExists) {
      await db.user.update({
        where: { email: 'admin@glamourgrid.com' },
        data: { passwordHash: hashedPassword, role: 'ADMIN' },
      });
    } else {
      await db.user.create({
        data: {
          email: 'admin@glamourgrid.com',
          passwordHash: hashedPassword,
          role: 'ADMIN',
        },
      });
    }

    // ── 2. Categories ────────────────────────────────────────
    const categoryDefs = [
      { name: 'Fragrance',       slug: 'fragrance',      description: 'Luxury perfumes & colognes', parentSlug: null },
      { name: 'Skincare',        slug: 'skincare',        description: 'Premium skincare products',  parentSlug: null },
      { name: 'Haircare',        slug: 'haircare',        description: 'Hair care & treatments',     parentSlug: null },
      { name: 'Makeup',          slug: 'makeup',          description: 'Premium cosmetics',          parentSlug: null },
      { name: 'Eye Lashes',      slug: 'eye-lashes',      description: 'Dramatic & natural lashes',  parentSlug: 'makeup' },
      { name: 'Mascara',         slug: 'mascara',         description: 'Volumizing mascaras & eyeliners', parentSlug: 'makeup' },
      { name: 'Lipsticks',       slug: 'lipsticks',       description: 'Matte, glossy & liquid lipsticks', parentSlug: 'makeup' },
      { name: 'Face Powder',     slug: 'face-powder',     description: 'Setting & pressed powders',  parentSlug: 'makeup' },
      { name: 'BB Cream',        slug: 'bb-cream',        description: 'BB & CC creams',             parentSlug: 'makeup' },
      { name: 'Makeup Kits',     slug: 'makeup-kits',     description: 'Complete makeup sets',       parentSlug: 'makeup' },
      { name: 'Makeup Brushes',  slug: 'makeup-brushes',  description: 'Professional brush sets',    parentSlug: 'makeup' },
      { name: 'Lip Oil & Balms', slug: 'lip-oil-balm',   description: 'Nourishing lip care',        parentSlug: 'makeup' },
      { name: 'Face Blush',      slug: 'face-blush',      description: 'Powder & cream blushes',    parentSlug: 'makeup' },
      { name: 'Eyes Blush',      slug: 'eyes-blush',      description: 'Eye palettes & shimmer',    parentSlug: 'makeup' },
      { name: 'Lip Gloss',       slug: 'lip-gloss',       description: 'High-shine & plumping lip glosses', parentSlug: 'makeup' },
    ];

    const catMap: Record<string, any> = {};
    for (const def of categoryDefs) {
      const parentId = def.parentSlug ? (catMap[def.parentSlug] ?? null) : null;
      const cat = await db.category.upsert({
        where: { slug: def.slug },
        update: { name: def.name, description: def.description },
        create: { name: def.name, slug: def.slug, description: def.description, parentId },
      });
      catMap[def.slug] = cat.id;
    }

    // ── 3. Products with Color Variants ─────────────────────
    const productDefs = [
      {
        name: 'Azzaro Wanted Elixir', slug: 'azzaro-wanted-elixir',
        description: 'Intense woody oriental elixir with passionfruit & leather notes.',
        price: 990, salePrice: null, brand: 'Azzaro',
        imageUrl: '/perfume-banner.jpg', isBestSeller: true, isSale: false, isNewArrival: true,
        cat: 'fragrance',
        keywords: 'perfume, fragrance, azzaro, luxury, elixir',
      },
      {
        name: 'Versace Man Eau Fraîche', slug: 'versace-man-eau-fraiche',
        description: 'A fresh, vibrant masculine fragrance that energizes your senses.',
        price: 950, salePrice: 800, brand: 'Versace',
        imageUrl: '/versace-fragrance.jpg', isBestSeller: true, isSale: true, isNewArrival: false,
        cat: 'fragrance',
        keywords: 'versace, perfume, fragrance, cologne',
      },
      {
        name: 'Nebli 24H Waterproof Eyeliner Pen - Rose Gold', slug: 'nebli-eyeliner-rosegold',
        description: '24H all day wear waterproof eyeliner pen with intense black pigment.',
        price: 750, salePrice: null, brand: 'NEBLI Paris',
        imageUrl: '/eyeliner-rosegold.jpg', isBestSeller: true, isSale: false, isNewArrival: true,
        cat: 'mascara',
        keywords: 'eyeliner, nebli, rose gold, waterproof, mascara',
        colors: [
          { name: 'Intense Black', hex: '#0a0a0a', inStock: true },
          { name: 'Rose Gold Shimmer', hex: '#b76e79', inStock: true },
        ],
      },
      {
        name: 'Nebli 24H Waterproof Eyeliner Pen - Blue Crane', slug: 'nebli-eyeliner-blue',
        description: '24H smudge-proof & water-resistant 0.1mm fine tip eyeliner pen.',
        price: 850, salePrice: null, brand: 'NEBLI Paris',
        imageUrl: '/eyeliner-blue.jpg', isBestSeller: false, isSale: false, isNewArrival: true,
        cat: 'mascara',
        keywords: 'eyeliner, nebli, blue crane, waterproof',
        colors: [
          { name: 'Royal Blue', hex: '#002366', inStock: true },
          { name: 'Midnight Black', hex: '#111111', inStock: true },
        ],
      },
      {
        name: 'HudaFashion Mini Makeup Brush Set (3-Piece)', slug: 'hudafashion-mini-brush-set',
        description: '3-piece ultra-soft powder, foundation & concealer travel brush set.',
        price: 650, salePrice: null, brand: 'HudaFashion',
        imageUrl: '/huda-brush-set.jpg', isBestSeller: true, isSale: false, isNewArrival: true,
        cat: 'makeup-brushes',
        keywords: 'brush set, huda, makeup brushes, travel kit',
        colors: [
          { name: 'Rose Gold Blush', hex: '#e8c5c8', inStock: true },
          { name: 'Matte Black', hex: '#1c1c1c', inStock: true },
        ],
      },
      {
        name: 'Velvet Matte Long-Wear Lipstick', slug: 'velvet-matte-lipstick',
        description: 'Velvety smooth long-wear matte formula in rich rose-gold hue.',
        price: 600, salePrice: 500, brand: 'GlamourGrid',
        imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop',
        isBestSeller: true, isSale: true, isNewArrival: false, cat: 'lipsticks',
        keywords: 'lipstick, matte, velvet, long wear, lip color',
        colors: [
          { name: 'Ruby Velvet', hex: '#9b111e', inStock: true },
          { name: 'Rosewood Nude', hex: '#b76e79', inStock: true },
          { name: 'Plum Passion', hex: '#4a0e17', inStock: true },
          { name: 'Coral Crush', hex: '#e07a5f', inStock: true },
        ],
      },
      {
        name: 'Crystalline High-Shine Plumping Lip Gloss', slug: 'crystalline-lip-gloss',
        description: 'Ultra-glossy, non-sticky plumping lip gloss with glass-like shimmer.',
        price: 650, salePrice: null, brand: 'GlamourGrid',
        imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop',
        isBestSeller: true, isSale: false, isNewArrival: true, cat: 'lip-gloss',
        keywords: 'lip gloss, high shine, plumping, crystalline',
        colors: [
          { name: 'Crystal Clear', hex: '#f0f4f8', inStock: true },
          { name: 'Shimmer Pink', hex: '#ffb6c1', inStock: true },
          { name: 'Golden Nude', hex: '#d4af37', inStock: true },
        ],
      },
      {
        name: 'Chilired Lavender Soothing Sleep Pillow Spray', slug: 'chilired-lavender-sleep-spray',
        description: 'Natural lavender soothing formula sleep spray. Calms mind, reduces stress, and promotes deep peaceful sleep.',
        price: 850, salePrice: null, brand: 'CHILIRED',
        imageUrl: '/sleep-spray.jpg', isBestSeller: true, isSale: false, isNewArrival: true, cat: 'skincare',
        keywords: 'sleep spray, lavender, soothing, pillow spray, skincare',
      },
      {
        name: 'BelyBela Velvet Creamy Lipstick - Shade 04', slug: 'belybela-velvet-lipstick-04',
        description: 'Rich color payoff with smooth, creamy texture and long-lasting hydrating formula in glitter rose gold case.',
        price: 750, salePrice: 650, brand: 'BELYBELA',
        imageUrl: '/belybela-lipstick.jpg', isBestSeller: true, isSale: true, isNewArrival: true, cat: 'lipsticks',
        keywords: 'lipstick, belybela, shade 04, creamy, velvet, rose gold',
        colors: [
          { name: 'Shade 04 Scarlet', hex: '#cb2027', inStock: true },
          { name: 'Shade 02 Rose Pink', hex: '#e75480', inStock: true },
          { name: 'Shade 06 Deep Berry', hex: '#800020', inStock: true },
        ],
      },
      {
        name: 'Hannaier Color Lasting Wine Lip Tint & Gloss', slug: 'hannaier-wine-lip-tint-gloss',
        description: 'Luxury 24H non-sticky reddish wine color lip tint with natural glass shine & moisturizing wine extract.',
        price: 690, salePrice: null, brand: 'Hannaier',
        imageUrl: '/wine-lip-tint.jpg', isBestSeller: true, isSale: false, isNewArrival: true, cat: 'lip-gloss',
        keywords: 'wine lip tint, hannaier, lip gloss, reddish wine, 24h tint',
        colors: [
          { name: 'Reddish Wine', hex: '#722f37', inStock: true },
          { name: 'Burgundy Rose', hex: '#800020', inStock: true },
          { name: 'Cherry Red', hex: '#d2042d', inStock: true },
        ],
      },
      {
        name: 'NEBLI Heart Glow Stick - Natural Radiance BB Stick', slug: 'nebli-heart-glow-stick',
        description: 'Soft blend natural glow stick for instant skin radiance. Lightweight formula with skin-friendly soothing glow for everyday fresh look.',
        price: 150, salePrice: null, brand: 'NEBLI Paris',
        imageUrl: '/heart-glow-stick.jpg', isBestSeller: true, isSale: false, isNewArrival: true, cat: 'bb-cream',
        keywords: 'glow stick, nebli, bb cream, radiance, natural glow',
        colors: [
          { name: 'Natural Glow', hex: '#f4c2c2', inStock: true },
          { name: 'Rosy Peach', hex: '#ffdab9', inStock: true },
        ],
      },
    ];

    let seededProducts = 0;
    for (const def of productDefs) {
      const existing = await db.product.findUnique({ where: { slug: def.slug } });
      const categoryId = catMap[def.cat] ?? null;

      if (!existing) {
        await db.product.create({
          data: {
            name: def.name,
            slug: def.slug,
            description: def.description,
            price: def.price,
            salePrice: def.salePrice,
            brand: def.brand,
            imageUrl: def.imageUrl,
            isBestSeller: def.isBestSeller,
            isSale: def.isSale,
            isNewArrival: def.isNewArrival,
            isActive: true,
            stock: 100,
            categoryId,
            colors: def.colors ? JSON.stringify(def.colors) : null,
            keywords: def.keywords || null,
          },
        });
        seededProducts++;
      } else {
        // Update colors and keywords on existing products
        await db.product.update({
          where: { id: existing.id },
          data: {
            colors: def.colors ? JSON.stringify(def.colors) : existing.colors,
            keywords: def.keywords || existing.keywords,
          },
        });
      }
    }

    // ── 4. Clean out Test Orders & Complaints ───────────────
    await db.complaint.deleteMany({});
    await db.order.deleteMany({});

    return NextResponse.json({
      success: true,
      message: `Seed complete! Admin user, categories, products with color variants updated. All test orders & complaints cleared for production launch.`,
      adminEmail: 'admin@glamourgrid.com',
      adminPassword: 'hafiz123451122',
      seededProducts,
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Seed failed', details: error?.message }, { status: 500 });
  }
}