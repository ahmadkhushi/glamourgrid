'use client';
import { useState } from 'react';
import { getApiUrl } from '@/lib/api';

export default function AdminProductActions({
  productId,
  currentPrice,
}: {
  productId: number | string;
  currentPrice: number;
}) {
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState(currentPrice.toString());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch(getApiUrl(`/api/products/${productId}`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: parseFloat(price) }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {editing ? (
        <>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-24 bg-[#0f0c08] border border-[#d4af37]/40 text-[#FDFBF7] px-2 py-1 text-xs focus:outline-none"
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-xs bg-[#d4af37] text-[#0f0c08] px-2 py-1 font-semibold disabled:opacity-50"
          >
            {saving ? '...' : 'Save'}
          </button>
          <button
            onClick={() => setEditing(false)}
            className="text-xs text-[#a89f91] hover:text-red-400 transition-colors"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="text-xs text-[#a89f91] hover:text-[#d4af37] transition-colors flex items-center gap-1"
        >
          ✏️ {saved ? <span className="text-green-400">Saved!</span> : 'Edit Price'}
        </button>
      )}
    </div>
  );
}
