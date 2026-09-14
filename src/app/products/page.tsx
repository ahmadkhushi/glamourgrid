export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/shop/ProductCard';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default async function ProductsPage() {
  let products: any[] = [];

  try {
    products = await prisma.product.findMany({
      include: { category: true },
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.error('Prisma error in ProductsPage:', err);
  }

  if (products.length === 0) {
    products = [
      {
        id: 1,
        name: 'Azzaro Wanted Elixir',
        slug: 'azzaro-wanted-elixir',
        description: 'Intense woody oriental elixir with passionfruit & leather notes.',
        price: 990,
        originalPrice: 1200,
        category: { name: 'Fragrance' },
        imageUrl: '/perfume-banner.jpg',
        isNewArrival: true,
      },
      {
        id: 2,
        name: 'Versace Man Eau Fraîche',
        slug: 'versace-man-eau-fraiche',
        description: 'Fresh masculine fragrance with lemon, cedar & musk notes.',
        price: 950,
        originalPrice: 1150,
        category: { name: 'Fragrance' },
        imageUrl: '/versace-fragrance.jpg',
        isBestSeller: true,
      },
      {
        id: 3,
        name: 'Nebli Eyeliner Pen - Rose Gold',
        slug: 'nebli-eyeliner-rosegold',
        description: '24H all day wear waterproof eyeliner pen with intense black pigment.',
        price: 750,
        originalPrice: 900,
        category: { name: 'Mascara' },
        imageUrl: '/eyeliner-rosegold.jpg',
        isNewArrival: true,
      },
      {
        id: 4,
        name: 'Nebli Eyeliner Pen - Blue Crane',
        slug: 'nebli-eyeliner-blue',
        description: '24H smudge-proof & water-resistant 0.1mm fine tip eyeliner pen.',
        price: 850,
        originalPrice: 1000,
        category: { name: 'Mascara' },
        isBestSeller: true,
        imageUrl: '/eyeliner-blue.jpg',
      },
      {
        id: 5,
        name: 'HudaFashion Mini Makeup Brush Set',
        slug: 'hudafashion-mini-brush-set',
        description: '3-piece ultra-soft powder, foundation & concealer travel brush set.',
        price: 650,
        originalPrice: 800,
        category: { name: 'Makeup Brushes' },
        imageUrl: '/huda-brush-set.jpg',
        isNewArrival: true,
      },
    ];
  }

  return (
    <>
      <Navbar />
      <div className="pt-28 min-h-screen bg-[#0B0C10] text-[#F8F9FA]">
        <div className="container mx-auto px-4 md:px-8 py-12">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1 rounded-full">
              Full Catalog
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mt-3 tracking-wider">All Products</h1>
            <div className="w-12 h-0.5 bg-[#D4AF37] mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
