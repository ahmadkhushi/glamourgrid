'use client';
import { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';

import { getApiUrl } from '@/lib/api';

interface AdminPriceEditProps {
  productId: number | string;
  currentPrice: number;
  onPriceUpdate?: (newPrice: number) => void;
}

export default function AdminPriceEdit({ productId, currentPrice, onPriceUpdate }: AdminPriceEditProps) {
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState(currentPrice.toString());
  const [saving, setSaving] = useState(false);
  const [displayPrice, setDisplayPrice] = useState(currentPrice);

  const handleSave = async () => {
    const newPrice = parseFloat(price);
    if (isNaN(newPrice) || newPrice <= 0) return;
    setSaving(true);
    const res = await fetch(getApiUrl(`/api/products/${productId}`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: newPrice }),
    });
    setSaving(false);
    if (res.ok) {
      setDisplayPrice(newPrice);
      setEditing(false);
      onPriceUpdate?.(newPrice);
    }
  };

  if (!editing) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-[#d4af37] font-semibold text-sm">Rs. {displayPrice.toLocaleString()}</span>
        <button
          onClick={() => setEditing(true)}
          className="text-[#a89f91] hover:text-[#d4af37] transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Edit Price"
          title="Admin: Edit Price"
        >
          <Pencil size={12} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-1">
      <span className="text-[10px] text-[#a89f91]">Rs.</span>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false); }}
        className="w-20 bg-[#0f0c08] border border-[#d4af37]/50 text-[#d4af37] px-2 py-0.5 text-xs focus:outline-none"
        autoFocus
      />
      <button onClick={handleSave} disabled={saving} className="text-green-400 hover:text-green-300 disabled:opacity-50" aria-label="Save">
        <Check size={14} />
      </button>
      <button onClick={() => setEditing(false)} className="text-[#a89f91] hover:text-red-400" aria-label="Cancel">
        <X size={14} />
      </button>
    </div>
  );
}
