'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getApiUrl } from '@/lib/api';

const ALL_CATEGORIES = [
  { slug: 'fragrance',      label: 'Fragrance' },
  { slug: 'skincare',       label: 'Skincare' },
  { slug: 'haircare',       label: 'Haircare' },
  { slug: 'makeup',         label: 'Makeup (General)' },
  { slug: 'eye-lashes',     label: 'Makeup — Eye Lashes' },
  { slug: 'mascara',        label: 'Makeup — Mascara' },
  { slug: 'lipsticks',      label: 'Makeup — Lipsticks' },
  { slug: 'face-powder',    label: 'Makeup — Face Powder' },
  { slug: 'bb-cream',       label: 'Makeup — BB Cream' },
  { slug: 'makeup-kits',    label: 'Makeup — Makeup Kits' },
  { slug: 'makeup-brushes', label: 'Makeup — Makeup Brushes' },
  { slug: 'lip-oil-balm',   label: 'Makeup — Lip Oil & Balms' },
  { slug: 'face-blush',     label: 'Makeup — Face Blush' },
  { slug: 'eyes-blush',     label: 'Makeup — Eyes Blush' },
  { slug: 'lip-gloss',      label: 'Makeup — Lip Gloss' },
];

interface FormState {
  name: string;
  slug: string;
  description: string;
  price: string;
  salePrice: string;
  imageUrl: string;
  videoUrl: string;
  brand: string;
  categorySlug: string;
  stock: string;
  isActive: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isSale: boolean;
}

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState<FormState>({
    name: '', slug: '', description: '', price: '', salePrice: '',
    imageUrl: '', videoUrl: '', brand: '', categorySlug: 'fragrance',
    stock: '100',
    isActive: true, isNewArrival: false, isBestSeller: false, isSale: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.slug) {
      setError('Name, slug aur price zaruri hain.');
      return;
    }
    setSaving(true);
    setError('');
    const res = await fetch(getApiUrl('/api/products'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        price: parseFloat(form.price),
        salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
        imageUrl: form.imageUrl.trim() || null,
        videoUrl: form.videoUrl.trim() || null,
        brand: form.brand.trim() || null,
        categorySlug: form.categorySlug,
        stock: parseInt(form.stock) || 100,
        isActive: form.isActive,
        isNewArrival: form.isNewArrival,
        isBestSeller: form.isBestSeller,
        isSale: form.isSale,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setSuccess('✓ Product saved successfully!');
      setTimeout(() => router.push('/admin/products'), 1000);
    } else {
      const data = await res.json();
      setError(data.error ?? 'Error saving product. Check if slug is unique.');
    }
  };

  const f = (key: keyof FormState, val: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const inputCls = "w-full bg-[#0f0c08] border border-[#2a2018] text-[#FDFBF7] px-4 py-3 text-sm focus:outline-none focus:border-[#d4af37]/60 placeholder:text-[#a89f91]/30 transition-colors";

  return (
    <div className="min-h-screen bg-[#0f0c08] px-6 md:px-12 py-10">
      <div className="mb-8">
        <Link href="/admin/products" className="text-[#a89f91] text-xs uppercase tracking-widest hover:text-[#d4af37] transition-colors">
          ← Back to Products
        </Link>
        <h1 className="text-3xl font-serif text-[#d4af37] tracking-widest mt-2">Add New Product</h1>
        <p className="text-[#a89f91] text-xs uppercase tracking-widest mt-1">Fill in all details below</p>
      </div>

      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} className="bg-[#16100a] border border-[#2a2018] p-8 flex flex-col gap-6">
          
          {/* Name + Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#a89f91] mb-2">Product Name *</label>
              <input type="text" value={form.name} placeholder="e.g. Azzaro Wanted Elixir"
                onChange={(e) => { f('name', e.target.value); f('slug', autoSlug(e.target.value)); }}
                className={inputCls} required />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#a89f91] mb-2">Slug * (auto-generated)</label>
              <input type="text" value={form.slug} placeholder="azzaro-wanted-elixir"
                onChange={(e) => f('slug', e.target.value)}
                className={inputCls} required />
            </div>
          </div>

          {/* Brand + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#a89f91] mb-2">Brand</label>
              <input type="text" value={form.brand} placeholder="e.g. Azzaro"
                onChange={(e) => f('brand', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#a89f91] mb-2">Category *</label>
              <select value={form.categorySlug} onChange={(e) => f('categorySlug', e.target.value)}
                className={inputCls + ' cursor-pointer'}>
                {ALL_CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price + Sale Price + Stock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#a89f91] mb-2">Price (Rs.) *</label>
              <input type="number" min="0" step="0.01" value={form.price} placeholder="999"
                onChange={(e) => f('price', e.target.value)} className={inputCls} required />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#a89f91] mb-2">Sale Price (Rs.)</label>
              <input type="number" min="0" step="0.01" value={form.salePrice} placeholder="Leave blank if not on sale"
                onChange={(e) => f('salePrice', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#a89f91] mb-2">Stock Quantity</label>
              <input type="number" min="0" value={form.stock} placeholder="100"
                onChange={(e) => f('stock', e.target.value)} className={inputCls} />
            </div>
          </div>

          {/* Image + Video URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#a89f91] mb-2">Image URL</label>
              <input type="text" value={form.imageUrl} placeholder="/my-product.jpg or https://..."
                onChange={(e) => f('imageUrl', e.target.value)} className={inputCls} />
              {form.imageUrl && (
                <img src={form.imageUrl} alt="Preview" className="mt-2 h-20 w-20 object-cover border border-[#2a2018]"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              )}
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#a89f91] mb-2">Video URL (mp4 or YouTube)</label>
              <input type="text" value={form.videoUrl} placeholder="https://... (optional)"
                onChange={(e) => f('videoUrl', e.target.value)} className={inputCls} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#a89f91] mb-2">Description</label>
            <textarea rows={4} value={form.description} placeholder="Short product description..."
              onChange={(e) => f('description', e.target.value)}
              className={inputCls + ' resize-none'} />
          </div>

          {/* Toggles */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#a89f91] mb-3">Product Flags</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {([
                ['isActive', 'Active', '🟢'],
                ['isNewArrival', 'New Arrival', '✨'],
                ['isBestSeller', 'Best Seller', '⭐'],
                ['isSale', 'On Sale 🔴', '🏷️'],
              ] as [keyof FormState, string, string][]).map(([key, label, icon]) => (
                <label key={key} className={`flex items-center gap-3 cursor-pointer border p-3 transition-colors ${form[key] ? 'border-[#d4af37]/40 bg-[#d4af37]/5' : 'border-[#2a2018]'}`}>
                  <input type="checkbox" checked={Boolean(form[key])}
                    onChange={(e) => f(key, e.target.checked)}
                    className="w-4 h-4 accent-[#d4af37]" />
                  <span className="text-sm text-[#a89f91]">{icon} {label}</span>
                </label>
              ))}
            </div>
          </div>

          {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-4 py-3">{error}</p>}
          {success && <p className="text-green-400 text-sm bg-green-400/10 border border-green-400/20 px-4 py-3">{success}</p>}

          <div className="flex gap-4 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 bg-[#d4af37] text-[#0f0c08] py-4 font-semibold tracking-widest uppercase hover:bg-[#e8c84a] transition-colors disabled:opacity-50 text-sm">
              {saving ? 'Saving...' : 'Save Product'}
            </button>
            <Link href="/admin/products"
              className="px-8 py-4 border border-[#2a2018] text-[#a89f91] text-sm uppercase tracking-widest hover:border-[#d4af37]/30 hover:text-[#d4af37] transition-colors text-center">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
