import { prisma } from '@/lib/prisma';
import ProductDetailClient from '@/app/product/[slug]/ProductDetailClient';

export const revalidate = 0;

export default async function ProductsAliasPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let product: any = null;

  try {
    const numericId = parseInt(slug);
    product = await prisma.product.findFirst({
      where: !isNaN(numericId)
        ? { OR: [{ id: numericId }, { slug }] }
        : { slug },
      include: { category: true }
    });
  } catch (err) {
    console.error("Prisma error in ProductsAliasPage:", err);
  }

  // Fallback product if DB is offline or empty
  if (!product) {
    product = {
      id: 1,
      name: slug.replace(/-/g, ' ').toUpperCase(),
      brand: 'GlamourGrid Exclusives',
      price: 15500,
      description: 'Luxury haute cosmetics & fragrances crafted for elegance.',
      imageUrl: '/perfume-banner.jpg',
      colors: [
        { name: 'Rose Gold', hex: '#b76e79' },
        { name: 'Classic Red', hex: '#c41e3a' },
      ],
      keywords: 'glamour, luxury, cosmetics, beauty'
    };
  }

  return <ProductDetailClient product={product} />;
}
