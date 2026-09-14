'use client';

import { useState, useTransition } from 'react';
import { Pencil, Trash2, ToggleLeft, ToggleRight, Check, X, Tag, Edit3, Sparkles } from 'lucide-react';

import { getApiUrl } from '@/lib/api';

export interface ProductData {
  id: number;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  isActive: boolean;
  isSale: boolean;
  isFeatured?: boolean;
  imageUrl: string | null;
  description?: string | null;
  keywords?: string | null;
  colors?: any;
  category: { name: string } | null;
}

interface AdminProductRowProps {
  product: ProductData;
  /** Called when the user clicks "Edit All" — parent renders the modal */
  onEditClick: (product: ProductData) => void;
}

export default function AdminProductRow({ product, onEditClick }: AdminProductRowProps) {
  const [productData, setProductData] = useState<ProductData>(product);
  const [isPending, startTransition] = useTransition();
  const [editingPrice, setEditingPrice] = useState(false);
  const [priceInput, setPriceInput] = useState(String(productData.price));
  const [salePriceInput, setSalePriceInput] = useState(String(productData.salePrice ?? ''));
  const [editingSalePrice, setEditingSalePrice] = useState(false);
  const [msg, setMsg] = useState('');

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 2000); };

  const patchProduct = async (body: Record<string, unknown>) => {
    const res = await fetch(getApiUrl(`/api/products/${productData.id}`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.ok;
  };

  const savePrice = () => {
    const val = parseFloat(priceInput);
    if (isNaN(val) || val <= 0) return;
    startTransition(async () => {
      const ok = await patchProduct({ price: val });
      if (ok) { setProductData((prev) => ({ ...prev, price: val })); flash('✓ Price updated'); }
      setEditingPrice(false);
    });
  };

  const saveSalePrice = () => {
    const val = salePriceInput.trim() === '' ? null : parseFloat(salePriceInput);
    if (val !== null && isNaN(val)) return;
    startTransition(async () => {
      const ok = await patchProduct({ salePrice: val });
      if (ok) { setProductData((prev) => ({ ...prev, salePrice: val })); flash('✓ Sale price updated'); }
      setEditingSalePrice(false);
    });
  };

  const toggleSale = () => {
    startTransition(async () => {
      const ok = await patchProduct({ isSale: !productData.isSale });
      if (ok) {
        setProductData((prev) => ({ ...prev, isSale: !prev.isSale }));
        flash(productData.isSale ? '✓ Removed from sale' : '✓ Added to sale');
      }
    });
  };

  const toggleActive = () => {
    startTransition(async () => {
      const ok = await patchProduct({ isActive: !productData.isActive });
      if (ok) {
        setProductData((prev) => ({ ...prev, isActive: !prev.isActive }));
        flash(productData.isActive ? '✓ Deactivated' : '✓ Activated');
      }
    });
  };

  const toggleFeatured = () => {
    startTransition(async () => {
      const nextVal = !productData.isFeatured;
      const ok = await patchProduct({ isFeatured: nextVal });
      if (ok) {
        setProductData((prev) => ({ ...prev, isFeatured: nextVal }));
        flash(nextVal ? '✓ Added to Side-Scroll' : '✓ Removed from Side-Scroll');
      }
    });
  };

  const deleteProduct = () => {
    if (!confirm(`Delete "${productData.name}"?`)) return;
    startTransition(async () => {
      const res = await fetch(getApiUrl(`/api/products/${productData.id}`), { method: 'DELETE' });
      if (res.ok) window.location.reload();
    });
  };

  // NOTE: Returns ONLY a <tr> — no modal div here (would break <tbody> HTML rules).
  return (
    <tr className={`border-b border-[#2a2018]/50 hover:bg-[#1a120c] transition-colors ${isPending ? 'opacity-60' : ''}`}>
      <td className="px-5 py-4">
        {productData.imageUrl ? (
          <img
            src={productData.imageUrl}
            alt={productData.name}
            className="w-12 h-12 object-cover border border-[#2a2018]"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" fill="%232a2018"/></svg>';
            }}
          />
        ) : (
          <div className="w-12 h-12 bg-[#2a2018] flex items-center justify-center text-[#a89f91] text-xs">📷</div>
        )}
      </td>

      <td className="px-5 py-4">
        <p className="text-[#FDFBF7] text-sm font-medium">{productData.name}</p>
        <p className="text-[#a89f91] text-xs mt-0.5">{productData.slug}</p>
        {msg && <p className="text-green-400 text-[10px] mt-1 font-semibold animate-pulse">{msg}</p>}
      </td>

      <td className="px-5 py-4 text-[#a89f91] text-sm">{productData.category?.name ?? '—'}</td>

      {/* Price Edit */}
      <td className="px-5 py-4">
        {editingPrice ? (
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              className="w-24 bg-[#0f0c08] border border-[#d4af37]/50 text-[#d4af37] px-2 py-1 text-sm focus:outline-none"
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') savePrice(); if (e.key === 'Escape') setEditingPrice(false); }}
            />
            <button onClick={savePrice} className="text-green-400 hover:text-green-300 p-1"><Check size={14} /></button>
            <button onClick={() => setEditingPrice(false)} className="text-red-400 hover:text-red-300 p-1"><X size={14} /></button>
          </div>
        ) : (
          <button onClick={() => setEditingPrice(true)} className="text-[#d4af37] text-sm font-semibold hover:text-[#e8c84a] flex items-center gap-1 group">
            Rs. {productData.price.toLocaleString()} <Pencil size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}
      </td>

      {/* Sale Price Edit */}
      <td className="px-5 py-4">
        {editingSalePrice ? (
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={salePriceInput}
              onChange={(e) => setSalePriceInput(e.target.value)}
              placeholder="Empty to remove"
              className="w-28 bg-[#0f0c08] border border-green-400/50 text-green-400 px-2 py-1 text-sm focus:outline-none"
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') saveSalePrice(); if (e.key === 'Escape') setEditingSalePrice(false); }}
            />
            <button onClick={saveSalePrice} className="text-green-400 hover:text-green-300 p-1"><Check size={14} /></button>
            <button onClick={() => setEditingSalePrice(false)} className="text-red-400 hover:text-red-300 p-1"><X size={14} /></button>
          </div>
        ) : (
          <button onClick={() => setEditingSalePrice(true)} className="text-green-400 text-sm hover:text-green-300 flex items-center gap-1 group">
            {productData.salePrice ? `Rs. ${productData.salePrice.toLocaleString()}` : <span className="text-[#a89f91]">—</span>}
            <Pencil size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <div className="flex flex-col gap-1 items-start">
          <span className={`text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-widest ${productData.isActive ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
            {productData.isActive ? 'Active' : 'Inactive'}
          </span>
          {productData.isFeatured && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-widest bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 flex items-center gap-1 font-semibold">
              <Sparkles size={9} /> Side-Scroll
            </span>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Side-Scroll (Featured) Toggle Button */}
          <button
            onClick={toggleFeatured}
            title={productData.isFeatured ? 'Click to remove from Side Scroll' : 'Click to add to Side Scroll'}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-wider rounded-sm transition-all font-semibold border ${
              productData.isFeatured
                ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/30 shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                : 'border-[#2a2018] text-[#a89f91] hover:border-[#d4af37]/50 hover:text-[#d4af37]'
            }`}
          >
            <Sparkles size={11} className={productData.isFeatured ? 'text-[#d4af37]' : ''} />
            {productData.isFeatured ? 'In Side Scroll' : '+ Side Scroll'}
          </button>

          {/* Edit All — triggers modal in PARENT (outside the table) */}
          <button
            onClick={() => onEditClick(productData)}
            title="Full Edit (Price, Status, Description, Keywords, Color Swatches)"
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-wider rounded-sm bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-[#0f0c08] transition-all font-semibold"
          >
            <Edit3 size={12} /> Edit
          </button>

          {/* Sale Toggle */}
          <button
            onClick={toggleSale}
            title={productData.isSale ? 'Remove from Sale' : 'Add to Sale'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] uppercase tracking-wider rounded-sm transition-colors border ${productData.isSale ? 'border-orange-400/40 text-orange-400 bg-orange-400/10 hover:bg-orange-400/20' : 'border-[#2a2018] text-[#a89f91] hover:border-orange-400/40 hover:text-orange-400'}`}
          >
            <Tag size={11} /> {productData.isSale ? 'On Sale' : 'Set Sale'}
          </button>

          {/* Active Toggle */}
          <button
            onClick={toggleActive}
            title={productData.isActive ? 'Deactivate' : 'Activate'}
            className={`p-1.5 rounded-sm border transition-colors ${productData.isActive ? 'border-[#2a2018] text-[#a89f91] hover:border-red-400/40 hover:text-red-400' : 'border-green-400/30 text-green-400 hover:bg-green-400/10'}`}
          >
            {productData.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
          </button>

          {/* Delete */}
          <button
            onClick={deleteProduct}
            title="Delete product"
            className="p-1.5 border border-[#2a2018] text-[#a89f91] hover:border-red-400/40 hover:text-red-400 rounded-sm transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
