export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { prisma } from '@/lib/prisma';
import HomePageClient from '@/components/home/HomePageClient';
import { getSession } from '@/lib/session';

export default async function Home() {
  const session = await getSession();
  const isAdmin = session?.role === 'ADMIN';

  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 12,
    });
  } catch (err) {
    console.error('Error fetching home products from database:', err);
  }

  const formattedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description || '',
    price: p.price,
    originalPrice: p.salePrice || null,
    category: p.category?.name || 'Cosmetics',
    imageUrl: p.imageUrl || '/perfume-banner.jpg',
    videoUrl: p.videoUrl || null,
    stock: p.stock ?? 10,
  }));

  return (
    <HomePageClient
      initialProducts={formattedProducts.length > 0 ? formattedProducts : undefined}
      isAdmin={isAdmin}
    />
  );
}