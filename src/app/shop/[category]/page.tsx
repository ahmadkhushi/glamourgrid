export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/shop/ProductCard';

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  let categoryName = categorySlug.toUpperCase();
  let categoryDesc = "Luxury cosmetics & fragrances collection";
  let products: any[] = [];

  try {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });
    if (category) {
      categoryName = category.name;
      if (category.description) categoryDesc = category.description;
      products = await prisma.product.findMany({
        where: { categoryId: category.id, isActive: true },
        orderBy: { createdAt: 'desc' },
      });
    }
  } catch (err) {
    console.error("Prisma error in CategoryPage:", err);
  }

  return (
    <div className="pt-24 min-h-screen bg-[#0f0c08] text-[#FDFBF7]">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <h1 className="text-4xl font-serif text-[#d4af37] mb-4 text-center tracking-wide">{categoryName}</h1>
        <p className="text-center text-[#a89f91] mb-12">{categoryDesc}</p>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {products.length === 0 && (
            <div className="col-span-full text-center text-[#a89f91] py-12">
              No products found in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}