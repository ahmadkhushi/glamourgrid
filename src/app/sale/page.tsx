import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SalePageClient from "./SalePageClient";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const revalidate = 0;

export default async function SalePage() {
  const session = await getSession();
  const isAdmin = session?.role === "ADMIN";

  let products: any[] = [];
  try {
    // Fetch products from database
    products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Prisma error on sale page:", err);
  }

  // Fallback demo items if DB is empty
  if (products.length === 0) {
    products = [
      {
        id: 101,
        name: "Azzaro Wanted Elixir (Sale Edition)",
        description: "Intense woody oriental elixir with passionfruit & leather notes.",
        price: 750,
        originalPrice: 990,
        category: "fragrance",
        imageUrl: "/perfume-banner.jpg",
        videoUrl: null,
        stock: 12,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 102,
        name: "Versace Man Eau Fraîche (Sale Edition)",
        description: "Fresh masculine fragrance with lemon, cedar & musk notes.",
        price: 700,
        originalPrice: 950,
        category: "fragrance",
        imageUrl: "/versace-fragrance.jpg",
        videoUrl: null,
        stock: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 103,
        name: "Nebli Eyeliner Pen - Rose Gold (Sale)",
        description: "24H waterproof & smudge-proof intense black eyeliner pen.",
        price: 600,
        originalPrice: 750,
        category: "mascara",
        imageUrl: "/eyeliner-rosegold.jpg",
        videoUrl: null,
        stock: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 104,
        name: "HudaFashion Mini Makeup Brush Set (Sale)",
        description: "3-piece ultra-soft powder & foundation mini brush set.",
        price: 500,
        originalPrice: 650,
        category: "makeup-brushes",
        imageUrl: "/huda-brush-set.jpg",
        videoUrl: null,
        stock: 18,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  return (
    <main className="bg-[#0f0c08] min-h-screen text-[#FDFBF7] pt-28">
      <Navbar />
      <div className="container mx-auto px-6 md:px-12 py-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] border border-[#d4af37]/30 px-4 py-1 rounded-full">
            Limited Time Offers
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#FDFBF7] mt-4 mb-4 tracking-wide">
            Exclusive <span className="italic text-[#d4af37]">Sale</span> Collection
          </h1>
          <p className="text-[#a89f91] text-sm tracking-wider leading-relaxed">
            Up to 30% OFF on selected luxury cosmetics, fragrances & skincare. Premium quality guaranteed.
          </p>
        </div>

        <SalePageClient initialProducts={products} isAdmin={isAdmin} />
      </div>
      <Footer />
    </main>
  );
}
