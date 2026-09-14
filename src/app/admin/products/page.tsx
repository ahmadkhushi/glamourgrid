export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { logoutAction } from '@/lib/auth-actions';
import AdminProductsTable from './AdminProductsTable';

export default async function AdminProductsPage() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      include: { category: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    // DB not connected
  }

  return (
    <div className="min-h-screen bg-[#0f0c08] px-6 md:px-12 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-[#a89f91] text-xs uppercase tracking-widest hover:text-[#d4af37] transition-colors">
            ← Dashboard
          </Link>
          <h1 className="text-3xl font-serif text-[#d4af37] tracking-widest mt-2">Products</h1>
          <p className="text-[#a89f91] text-xs uppercase tracking-widest mt-1">{products.length} items total</p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/admin/products/new"
            className="bg-[#d4af37] text-[#0f0c08] px-6 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-[#e8c84a] transition-colors"
          >
            + Add Product
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="border border-[#2a2018] text-[#a89f91] px-5 py-3 text-xs uppercase tracking-widest hover:text-red-400 hover:border-red-400/40 transition-colors"
            >
              Logout
            </button>
          </form>
        </div>
      </div>

      {/*
        AdminProductsTable is a Client Component.
        It owns the modal state and renders the modal OUTSIDE the <table>,
        preventing the hydration error: "<div> cannot be a child of <tbody>".
      */}
      <AdminProductsTable products={products} />
    </div>
  );
}
