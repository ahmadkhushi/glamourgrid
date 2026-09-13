import Link from 'next/link';
import { getSession } from '@/lib/session';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-[#0f0c08] flex flex-col text-slate-100 font-sans">
      {/* Top Navigation Bar */}
      <header className="w-full bg-[#0a0805] border-b border-[#2a2018] px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-lg shadow-black/40 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="text-[#d4af37] font-serif text-lg tracking-[0.2em] hover:opacity-90 transition-opacity">
            GLAMOURGRID <span className="text-[#a89f91] text-xs font-sans ml-1 tracking-normal font-semibold">ADMIN</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/admin" className="text-xs uppercase tracking-[0.2em] text-[#a89f91] hover:text-[#d4af37] transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/analytics" className="text-xs uppercase tracking-[0.2em] text-[#d4af37] font-bold flex items-center gap-1 bg-[#d4af37]/10 px-2.5 py-1 rounded border border-[#d4af37]/30 hover:bg-[#d4af37]/20 transition-all">
              <span>📊</span> Analytics
            </Link>
            <Link href="/admin/orders" className="text-xs uppercase tracking-[0.2em] text-[#a89f91] hover:text-[#d4af37] transition-colors">
              Orders
            </Link>
            <Link href="/admin/products" className="text-xs uppercase tracking-[0.2em] text-[#a89f91] hover:text-[#d4af37] transition-colors">
              Products
            </Link>
            <Link href="/admin/reviews" className="text-xs uppercase tracking-[0.2em] text-[#a89f91] hover:text-[#d4af37] transition-colors">
              Reviews
            </Link>
            <Link href="/admin/products/new" className="text-xs uppercase tracking-[0.2em] text-[#a89f91] hover:text-[#d4af37] transition-colors">
              + Add Product
            </Link>

          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xs uppercase tracking-widest text-[#a89f91] hover:text-[#d4af37] transition-colors border border-[#2a2018] px-3 py-1.5 rounded">
            View Store ↗
          </Link>
          {session && (
            <span className="text-xs uppercase tracking-widest text-[#d4af37] border border-[#d4af37]/40 bg-[#d4af37]/10 px-3 py-1.5 rounded font-semibold">
              Admin Mode
            </span>
          )}
        </div>
      </header>
      <main className="flex-grow">{children}</main>
    </div>
  );
}