const fs = require('fs');
const path = require('path');

const files = {
  'src/app/api/auth/[...nextauth]/route.ts': `
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        if (!user || !user.password) {
          return null;
        }
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          return null;
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt"
  }
});

export { handler as GET, handler as POST };
`,
  'src/app/api/seed/route.ts': `
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Check if admin exists
    const adminExists = await prisma.user.findUnique({ where: { email: 'admin@glamourgrid.com' } });
    if (!adminExists) {
      const hashedPassword = await hash('admin123', 10);
      await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@glamourgrid.com',
          password: hashedPassword,
          role: 'ADMIN'
        }
      });
    }

    // Check categories
    const count = await prisma.category.count();
    if (count === 0) {
      const catMakeup = await prisma.category.create({
        data: {
          name: 'Makeup',
          slug: 'makeup',
          description: 'Premium face cosmetics'
        }
      });
      const catSkincare = await prisma.category.create({
        data: {
          name: 'Skincare',
          slug: 'skincare',
          description: 'Luxury skincare products'
        }
      });
      
      const subLips = await prisma.subCategory.create({
        data: { name: 'Lipsticks', slug: 'lipsticks', categoryId: catMakeup.id }
      });
      const subFace = await prisma.subCategory.create({
        data: { name: 'Foundation', slug: 'foundation', categoryId: catMakeup.id }
      });

      await prisma.product.create({
        data: {
          name: 'Velvet Matte Lipstick',
          slug: 'velvet-matte-lipstick',
          description: 'A luxurious matte finish lipstick.',
          price: 45.00,
          brand: 'GlamourGrid Exclusives',
          categoryId: catMakeup.id,
          subCategoryId: subLips.id,
          isFeatured: true,
          isBestSeller: true,
          images: {
            create: [
              { url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop', isMain: true }
            ]
          }
        }
      });

      await prisma.product.create({
        data: {
          name: 'Luminous Foundation',
          slug: 'luminous-foundation',
          description: 'Flawless coverage with a radiant finish.',
          price: 65.00,
          brand: 'GlamourGrid',
          categoryId: catMakeup.id,
          subCategoryId: subFace.id,
          isFeatured: true,
          isNewArrival: true,
          images: {
            create: [
              { url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=600&auto=format&fit=crop', isMain: true }
            ]
          }
        }
      });

      await prisma.product.create({
        data: {
          name: 'Hydrating Night Serum',
          slug: 'hydrating-night-serum',
          description: 'Deep hydration for youthful skin.',
          price: 120.00,
          brand: 'Luxe Skin',
          categoryId: catSkincare.id,
          isBestSeller: true,
          images: {
            create: [
              { url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop', isMain: true }
            ]
          }
        }
      });
    }

    return NextResponse.json({ message: 'Seed successful' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
  }
}
`,
  'src/app/shop/page.tsx': `
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import ProductCard from '@/components/shop/ProductCard';

const prisma = new PrismaClient();

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    include: { images: true, category: true },
    where: { isActive: true }
  });

  return (
    <div className="pt-24 min-h-screen bg-chocolate-900">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <h1 className="text-4xl font-serif text-gold-400 mb-8 text-center tracking-wide">All Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
`,
  'src/app/shop/[category]/page.tsx': `
import { PrismaClient } from '@prisma/client';
import ProductCard from '@/components/shop/ProductCard';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = await prisma.category.findUnique({
    where: { slug: params.category },
    include: { subcategories: true }
  });

  if (!category) return notFound();

  const products = await prisma.product.findMany({
    where: { categoryId: category.id, isActive: true },
    include: { images: true }
  });

  return (
    <div className="pt-24 min-h-screen bg-chocolate-900">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <h1 className="text-4xl font-serif text-gold-400 mb-4 text-center tracking-wide">{category.name}</h1>
        <p className="text-center text-gray-300 mb-12">{category.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
`,
  'src/app/product/[slug]/page.tsx': `
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import AddToCartBtn from '@/components/shop/AddToCartBtn';

const prisma = new PrismaClient();

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { images: true, category: true }
  });

  if (!product) return notFound();
  
  const mainImage = product.images.find(img => img.isMain)?.url || product.images[0]?.url || 'https://via.placeholder.com/600';

  return (
    <div className="pt-24 min-h-screen bg-chocolate-900">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2">
            <img src={mainImage} alt={product.name} className="w-full h-auto object-cover rounded shadow-lg border border-chocolate-800" />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h1 className="text-4xl font-serif text-gold-400 mb-2">{product.name}</h1>
            <p className="text-gray-400 mb-4 uppercase tracking-widest text-sm">{product.brand}</p>
            <p className="text-2xl text-cream mb-6">$\${product.price.toFixed(2)}</p>
            <p className="text-gray-300 mb-8 leading-relaxed">{product.description}</p>
            
            <AddToCartBtn product={{ id: product.id, name: product.name, price: product.price, image: mainImage, quantity: 1 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
`,
  'src/components/shop/ProductCard.tsx': `
"use client";
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';

export default function ProductCard({ product }: { product: any }) {
  const addItem = useCartStore((state) => state.addItem);
  const mainImage = product.images?.find((img: any) => img.isMain)?.url || product.images?.[0]?.url || 'https://via.placeholder.com/300';

  return (
    <div className="group relative bg-chocolate-800 border border-chocolate-700 hover:border-gold-500/50 transition-colors overflow-hidden">
      <Link href={\`/product/\${product.slug}\`}>
        <div className="aspect-[3/4] overflow-hidden">
          <img 
            src={mainImage} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
        </div>
      </Link>
      <div className="p-4 text-center">
        <h3 className="text-cream font-serif text-lg mb-1">{product.name}</h3>
        <p className="text-gold-400">$\${product.price.toFixed(2)}</p>
      </div>
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: mainImage, quantity: 1 })}
          className="bg-gold-500 text-chocolate-900 px-6 py-2 uppercase tracking-widest font-semibold hover:bg-gold-400 transition-colors translate-y-4 group-hover:translate-y-0 duration-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
`,
  'src/components/shop/AddToCartBtn.tsx': `
"use client";
import { useCartStore, CartItem } from '@/store/cartStore';
import { useState } from 'react';

export default function AddToCartBtn({ product }: { product: CartItem }) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button 
      onClick={handleAdd}
      className="bg-gold-500 text-chocolate-900 px-8 py-4 font-semibold tracking-widest uppercase hover:bg-gold-400 transition-all border border-gold-500 w-full md:w-auto"
    >
      {added ? 'Added to Cart' : 'Add to Cart'}
    </button>
  );
}
`,
  'src/app/cart/page.tsx': `
"use client";
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="pt-24 min-h-screen bg-chocolate-900">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <h1 className="text-4xl font-serif text-gold-400 mb-8 tracking-wide">Shopping Cart</h1>
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-6">Your cart is currently empty.</p>
            <Link href="/shop" className="bg-gold-500 text-chocolate-900 px-8 py-4 font-semibold tracking-widest uppercase hover:bg-gold-400 transition-all">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="w-full lg:w-2/3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-6 border-b border-chocolate-700 py-6">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover border border-chocolate-600" />
                  <div className="flex-grow">
                    <h3 className="text-lg font-serif text-cream mb-1">{item.name}</h3>
                    <p className="text-gold-400 mb-2">$\${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-4">
                      <input 
                        type="number" 
                        min="1" 
                        value={item.quantity} 
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        className="bg-chocolate-800 text-cream border border-chocolate-600 px-2 py-1 w-16"
                      />
                      <button onClick={() => removeItem(item.id)} className="text-sm text-gray-500 hover:text-red-400 transition-colors uppercase tracking-widest">
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-cream">$\${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full lg:w-1/3">
              <div className="bg-chocolate-800 p-8 border border-chocolate-700">
                <h3 className="text-xl font-serif text-gold-400 mb-6">Order Summary</h3>
                <div className="flex justify-between mb-4 text-cream">
                  <span>Subtotal</span>
                  <span>$\${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-6 text-cream">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-chocolate-600 pt-4 flex justify-between font-semibold text-lg text-gold-400 mb-8">
                  <span>Total</span>
                  <span>$\${total.toFixed(2)}</span>
                </div>
                <Link href="/checkout" className="block text-center bg-gold-500 text-chocolate-900 px-8 py-4 font-semibold tracking-widest uppercase hover:bg-gold-400 transition-all">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
`,
  'src/app/checkout/page.tsx': `
export default function CheckoutPage() {
  return (
    <div className="pt-24 min-h-screen bg-chocolate-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-serif text-gold-400 mb-4 tracking-wide">Checkout</h1>
        <p className="text-gray-400">Payment integration architecture prepared. Please integrate Stripe/PayPal here.</p>
      </div>
    </div>
  );
}
`,
  'src/app/admin/layout.tsx': `
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-chocolate-900 pt-20 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-chocolate-800 border-r border-chocolate-700 p-6 hidden md:block">
        <h2 className="text-gold-400 font-serif text-xl mb-8 tracking-widest">ADMIN PANEL</h2>
        <nav className="space-y-4">
          <Link href="/admin" className="block text-cream hover:text-gold-400 transition-colors">Dashboard</Link>
          <Link href="/admin/products" className="block text-cream hover:text-gold-400 transition-colors">Products</Link>
          <Link href="/admin/categories" className="block text-cream hover:text-gold-400 transition-colors">Categories</Link>
          <Link href="/admin/orders" className="block text-cream hover:text-gold-400 transition-colors">Orders</Link>
          <Link href="/admin/users" className="block text-cream hover:text-gold-400 transition-colors">Customers</Link>
        </nav>
      </aside>
      <main className="flex-grow p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
`,
  'src/app/admin/page.tsx': `
export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-serif text-gold-400 mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-chocolate-800 p-6 border border-chocolate-700 rounded shadow">
          <h3 className="text-gray-400 text-sm tracking-widest uppercase mb-2">Total Sales</h3>
          <p className="text-3xl text-cream font-serif">$12,450.00</p>
        </div>
        <div className="bg-chocolate-800 p-6 border border-chocolate-700 rounded shadow">
          <h3 className="text-gray-400 text-sm tracking-widest uppercase mb-2">Total Orders</h3>
          <p className="text-3xl text-cream font-serif">145</p>
        </div>
        <div className="bg-chocolate-800 p-6 border border-chocolate-700 rounded shadow">
          <h3 className="text-gray-400 text-sm tracking-widest uppercase mb-2">Active Products</h3>
          <p className="text-3xl text-cream font-serif">32</p>
        </div>
      </div>
      <div className="bg-chocolate-800 p-8 border border-chocolate-700 rounded shadow">
        <h2 className="text-xl font-serif text-gold-400 mb-6">Recent Orders</h2>
        <p className="text-gray-400">Order management table goes here...</p>
      </div>
    </div>
  );
}
`,
  'src/components/home/FeaturedCategories.tsx': `
import Link from 'next/link';

export default function FeaturedCategories() {
  const categories = [
    { title: 'Lipsticks', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop', link: '/shop/lipsticks' },
    { title: 'Skincare', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop', link: '/shop/skincare' },
    { title: 'Fragrance', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop', link: '/shop/fragrance' },
  ];

  return (
    <section className="py-24 bg-chocolate-900">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-serif text-center text-gold-400 mb-16 tracking-wide">Curated Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <Link key={idx} href={cat.link} className="group relative block aspect-[3/4] overflow-hidden border border-chocolate-700">
              <img src={cat.image} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <h3 className="text-3xl font-serif text-cream uppercase tracking-widest">{cat.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  'src/components/home/BestSellers.tsx': `
export default function BestSellers() {
  return (
    <section className="py-24 bg-chocolate-800">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-serif text-center text-gold-400 mb-16 tracking-wide">Best Sellers</h2>
        <div className="text-center text-gray-400">
          <p>Please run the seed script \`/api/seed\` to populate products.</p>
        </div>
      </div>
    </section>
  );
}
`,
  'src/components/home/BrandStory.tsx': `
export default function BrandStory() {
  return (
    <section className="py-24 bg-chocolate-900 border-y border-chocolate-800">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-16">
        <div className="w-full md:w-1/2">
          <img src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800&auto=format&fit=crop" alt="Brand Story" className="w-full h-auto rounded border border-chocolate-700" />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl md:text-5xl font-serif text-gold-400 mb-6 leading-tight">The Art of Pure Elegance</h2>
          <p className="text-gray-300 mb-8 leading-relaxed text-lg">
            GlamourGrid was born from a desire to merge the highly structured world of premium aesthetics with the seamless accessibility of everyday luxury. Every formula is meticulously crafted, every shade thoughtfully selected, to ensure you experience beauty at its most profound level.
          </p>
          <a href="/about" className="inline-block border-b-2 border-gold-500 text-cream pb-1 font-semibold tracking-widest uppercase hover:text-gold-400 transition-colors">
            Discover Our Story
          </a>
        </div>
      </div>
    </section>
  );
}
`
};

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

for (const [filepath, content] of Object.entries(files)) {
  const absolutePath = path.join(process.cwd(), filepath);
  ensureDir(path.dirname(absolutePath));
  fs.writeFileSync(absolutePath, content.trim());
}

console.log("Scaffold 2 complete.");
