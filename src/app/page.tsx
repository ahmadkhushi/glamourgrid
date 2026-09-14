export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { prisma } from '@/lib/prisma';
import HomePageClient from '@/components/home/HomePageClient';
import { getSession } from '@/lib/session';

export default async function Home() {
  const session = await getSession();
  const isAdmin = session?.role === 'ADMIN';

  let mainProducts: any[] = [];
  let featuredProducts: any[] = [];

  try {
    // 1. Fetch Main Vertical List Products
    mainProducts = await prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 24,
    });

    // 2. Fetch Isolated Side-Scroll Featured Products ONLY (where isFeatured: true)
    featuredProducts = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { category: true },
      orderBy: { updatedAt: 'desc' },
      take: 12,
    });
  } catch (err) {
    console.error('Error fetching home products from database:', err);
  }

  const formatProduct = (p: any) => ({
    id: p.id,
    name: p.name,
    description: p.description || '',
    price: p.price,
    originalPrice: p.salePrice || null,
    category: p.category?.name || 'Cosmetics',
    imageUrl: p.imageUrl || '/perfume-banner.jpg',
    videoUrl: p.videoUrl || null,
    stock: p.stock ?? 10,
    isFeatured: Boolean(p.isFeatured),
  });

  const formattedMainProducts = mainProducts.map(formatProduct);
  const formattedFeaturedProducts = featuredProducts.map(formatProduct);

  return (
    <HomePageClient
      initialProducts={formattedMainProducts.length > 0 ? formattedMainProducts : undefined}
      initialFeaturedProducts={formattedFeaturedProducts.length > 0 ? formattedFeaturedProducts : undefined}
      isAdmin={isAdmin}
    />
  );
}