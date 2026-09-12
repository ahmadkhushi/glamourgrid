const fs = require('fs');
const path = require('path');

const files = {
  'prisma/schema.prisma': `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  password      String?
  role          String    @default("USER") // USER, ADMIN
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  orders        Order[]
  addresses     Address[]
  reviews       Review[]
}

model Category {
  id          String         @id @default(cuid())
  name        String
  slug        String         @unique
  description String?
  image       String?
  isActive    Boolean        @default(true)
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  subcategories SubCategory[]
  products    Product[]
}

model SubCategory {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  categoryId  String
  category    Category  @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  products    Product[]
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Product {
  id              String           @id @default(cuid())
  name            String
  slug            String           @unique
  description     String
  ingredients     String?
  price           Float
  salePrice       Float?
  sku             String?
  stock           Int              @default(0)
  brand           String
  isFeatured      Boolean          @default(false)
  isNewArrival    Boolean          @default(false)
  isBestSeller    Boolean          @default(false)
  isActive        Boolean          @default(true)
  categoryId      String
  category        Category         @relation(fields: [categoryId], references: [id])
  subCategoryId   String?
  subCategory     SubCategory?     @relation(fields: [subCategoryId], references: [id])
  images          ProductImage[]
  variants        ProductVariant[]
  reviews         Review[]
  orderItems      OrderItem[]
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
}

model ProductImage {
  id        String   @id @default(cuid())
  url       String
  alt       String?
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  isMain    Boolean  @default(false)
}

model ProductVariant {
  id        String   @id @default(cuid())
  name      String
  value     String
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  stock     Int      @default(0)
  price     Float?
}

model Order {
  id            String      @id @default(cuid())
  userId        String?
  user          User?       @relation(fields: [userId], references: [id])
  status        String      @default("PENDING") // PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
  total         Float
  subtotal      Float
  shipping      Float
  discount      Float       @default(0)
  couponCode    String?
  paymentMethod String      @default("COD")
  addressId     String
  address       Address     @relation(fields: [addressId], references: [id])
  items         OrderItem[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Float
}

model Address {
  id         String   @id @default(cuid())
  userId     String?
  user       User?    @relation(fields: [userId], references: [id])
  fullName   String
  email      String
  phone      String
  street     String
  city       String
  postalCode String
  country    String
  orders     Order[]
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Review {
  id        String   @id @default(cuid())
  rating    Int
  comment   String?
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  isApproved Boolean @default(true)
  createdAt DateTime @default(now())
}
`,
  '.env': `
DATABASE_URL="sqlite:./dev.db"
NEXTAUTH_SECRET="super-secret-key-for-glamourgrid-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
`,
  'tailwind.config.ts': `
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        chocolate: {
          900: "#1E120D",
          800: "#2B1912",
          700: "#3D241A",
          600: "#5A3626",
          500: "#7A4933",
        },
        gold: {
          300: "#F3E5AB",
          400: "#D4AF37",
          500: "#C59B27",
          600: "#AA8222",
        },
        cream: "#FDFBF7",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
`,
  'src/app/globals.css': `
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #1E120D;
  --foreground: #FDFBF7;
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-inter), sans-serif;
  overflow-x: hidden;
}

h1, h2, h3, h4, h5, h6, .font-serif {
  font-family: var(--font-playfair), serif;
}

/* Custom Cursor */
@media (pointer: fine) {
  body {
    cursor: none;
  }
}
`,
  'src/app/layout.tsx': `
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "GlamourGrid | Premium Cosmetics & Beauty",
  description: "Sounds highly organized and structured for seamless B2B transactions, yet trendy enough to attract everyday consumers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={\`\${inter.variable} \${playfair.variable} antialiased min-h-screen flex flex-col\`}>
        <Providers>
          <CustomCursor />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
`,
  'src/app/page.tsx': `
import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import BestSellers from "@/components/home/BestSellers";
import BrandStory from "@/components/home/BrandStory";

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedCategories />
      <BestSellers />
      <BrandStory />
    </div>
  );
}
`,
  'src/components/Providers.tsx': `
"use client";

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
`,
  'src/components/ui/CustomCursor.tsx': `
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('a') || target.closest('button')) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-gold-400 pointer-events-none z-50 mix-blend-difference hidden md:flex items-center justify-center"
      animate={{
        x: mousePosition.x - 16,
        y: mousePosition.y - 16,
        scale: isHovered ? 1.5 : 1,
        backgroundColor: isHovered ? "rgba(212, 175, 55, 0.2)" : "transparent",
      }}
      transition={{ type: "tween", ease: "backOut", duration: 0.15 }}
    >
      <div className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
    </motion.div>
  );
}
`,
  'src/components/layout/Navbar.tsx': `
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, ShoppingCart, Heart, User, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={\`fixed top-0 w-full z-40 transition-all duration-300 \${isScrolled ? 'bg-chocolate-900/90 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6'}\`}>
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        
        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-gold-400" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link href="/" className="text-2xl font-serif text-gold-400 tracking-wider">
          GLAMOURGRID
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/shop" className="text-sm uppercase tracking-widest hover:text-gold-400 transition-colors">Shop</Link>
          <Link href="/shop/categories" className="text-sm uppercase tracking-widest hover:text-gold-400 transition-colors">Categories</Link>
          <Link href="/shop?sort=newest" className="text-sm uppercase tracking-widest hover:text-gold-400 transition-colors">New Arrivals</Link>
          <Link href="/about" className="text-sm uppercase tracking-widest hover:text-gold-400 transition-colors">About</Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <button className="hover:text-gold-400 transition-colors hidden md:block">
            <Search size={20} />
          </button>
          <Link href="/account" className="hover:text-gold-400 transition-colors hidden md:block">
            <User size={20} />
          </Link>
          <Link href="/wishlist" className="hover:text-gold-400 transition-colors hidden md:block">
            <Heart size={20} />
          </Link>
          <Link href="/cart" className="hover:text-gold-400 transition-colors relative">
            <ShoppingCart size={20} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold-500 text-chocolate-900 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-chocolate-900 border-t border-chocolate-800 p-4 flex flex-col space-y-4 md:hidden">
          <Link href="/shop" className="text-lg hover:text-gold-400">Shop</Link>
          <Link href="/shop/categories" className="text-lg hover:text-gold-400">Categories</Link>
          <Link href="/account" className="text-lg hover:text-gold-400 flex items-center gap-2"><User size={18} /> Account</Link>
          <Link href="/search" className="text-lg hover:text-gold-400 flex items-center gap-2"><Search size={18} /> Search</Link>
        </div>
      )}
    </header>
  );
}
`,
  'src/components/layout/Footer.tsx': `
import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-chocolate-800 border-t border-chocolate-700 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <h3 className="text-xl font-serif text-gold-400 mb-6">GLAMOURGRID</h3>
          <p className="text-sm text-gray-400 mb-6">
            Elevate Your Beauty. Premium international cosmetics brand for the modern aesthete.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-gold-400"><Instagram size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-gold-400"><Facebook size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-gold-400"><Twitter size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-gold-400"><Youtube size={20} /></a>
          </div>
        </div>
        
        <div>
          <h4 className="text-gold-400 font-semibold mb-6 tracking-widest uppercase text-sm">Shop</h4>
          <ul className="space-y-3 text-sm text-gray-300">
            <li><Link href="/shop/makeup" className="hover:text-gold-300">Makeup</Link></li>
            <li><Link href="/shop/skincare" className="hover:text-gold-300">Skincare</Link></li>
            <li><Link href="/shop/fragrance" className="hover:text-gold-300">Fragrance</Link></li>
            <li><Link href="/shop/haircare" className="hover:text-gold-300">Haircare</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gold-400 font-semibold mb-6 tracking-widest uppercase text-sm">Customer Care</h4>
          <ul className="space-y-3 text-sm text-gray-300">
            <li><Link href="/contact" className="hover:text-gold-300">Contact Us</Link></li>
            <li><Link href="/faq" className="hover:text-gold-300">FAQs</Link></li>
            <li><Link href="/shipping" className="hover:text-gold-300">Shipping & Returns</Link></li>
            <li><Link href="/account" className="hover:text-gold-300">My Account</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gold-400 font-semibold mb-6 tracking-widest uppercase text-sm">Newsletter</h4>
          <p className="text-sm text-gray-400 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <form className="flex">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-chocolate-900 text-white px-4 py-2 outline-none w-full border border-chocolate-600 focus:border-gold-500 transition-colors"
            />
            <button className="bg-gold-500 text-chocolate-900 px-4 py-2 font-semibold hover:bg-gold-400 transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="container mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-chocolate-700 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} GlamourGrid. All rights reserved.
      </div>
    </footer>
  );
}
`,
  'src/components/home/Hero.tsx': `
"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-chocolate-900">
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-chocolate-900 via-chocolate-900/40 to-transparent" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-serif text-gold-400 mb-6 tracking-wide"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          GLAMOURGRID
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-2xl text-cream mb-10 tracking-widest font-light uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Elevate Your Beauty
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <Link href="/shop" className="bg-gold-500 text-chocolate-900 px-8 py-4 font-semibold tracking-widest uppercase hover:bg-gold-400 transition-all w-full sm:w-auto text-center border border-gold-500">
            Shop Collection
          </Link>
          <Link href="/shop/categories" className="bg-transparent text-gold-400 border border-gold-500 px-8 py-4 font-semibold tracking-widest uppercase hover:bg-gold-500/10 transition-all w-full sm:w-auto text-center">
            Explore Beauty
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
`,
  'src/store/cartStore.ts': `
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
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

console.log("Scaffold complete.");
