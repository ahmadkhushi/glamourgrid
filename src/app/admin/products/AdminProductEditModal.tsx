'use client';

import { useState } from 'react';
import { X, Plus, Trash2, Check, Sparkles } from 'lucide-react';
import { parseColors, ColorVariant } from '@/components/ui/ColorSwatches';
import { getApiUrl } from '@/lib/api';

interface AdminProductEditModalProps {
  product: any;
  onClose: () => void;
  onSaved: (updatedProduct: any) => void;
}

export default function AdminProductEditModal({
  product,
  onClose,
  onSaved,
}: AdminProductEditModalProps) {
  const [name, setName] = useState(product.name || '');
  const [price, setPrice] = useState(String(product.price || ''));
  const [salePrice, setSalePrice] = useState(String(product.salePrice ?? ''));
  const [isActive, setIsActive] = useState(Boolean(product.isActive));
  const [description, setDescription] = useState(product.description || '');
  const [keywords, setKeywords] = useState(product.keywords || '');
  
  // Color Variants State
  const [colors, setColors] = useState<ColorVariant[]>(parseColors(product.colors));
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#d4af37');

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    const added: ColorVariant = {
      name: newColorName.trim(),
      hex: newColorHex,
      inStock: true,
    };
    setColors([...colors, added]);
    setNewColorName('');
    setNewColorHex('#d4af37');
  };

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    try {
      const payload = {
        name,
        price: parseFloat(price),
        salePrice: salePrice.trim() ? parseFloat(salePrice) : null,
        isActive,
        description,
        keywords,
        colors,
      };

      const res = await fetch(getApiUrl(`/api/products/${product.id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.details || err.error || 'Failed to save product');
      }

      const updated = await res.json();
      onSaved(updated);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#140f0a] border border-[#d4af37]/40 w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2a2018] flex items-center justify-between bg-[#0a0805]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-lg font-serif text-[#d4af37] tracking-wider uppercase">
              Edit Product #{product.id}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#a89f91] hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-2 rounded text-xs">
              {errorMsg}
            </div>
          )}

          {/* Product Name */}
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-[#a89f91] mb-1">
              Product Title
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0f0c08] border border-[#2a2018] text-[#FDFBF7] px-3 py-2 text-sm focus:outline-none focus:border-[#d4af37]"
              required
            />
          </div>

          {/* Pricing & Active Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#a89f91] mb-1">
                Regular Price (Rs.)
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#0f0c08] border border-[#2a2018] text-[#d4af37] font-semibold px-3 py-2 text-sm focus:outline-none focus:border-[#d4af37]"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#a89f91] mb-1">
                Sale Price (Optional)
              </label>
              <input
                type="number"
                step="0.01"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="Leave empty if none"
                className="w-full bg-[#0f0c08] border border-[#2a2018] text-green-400 px-3 py-2 text-sm focus:outline-none focus:border-green-400"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#a89f91] mb-1">
                Product Status
              </label>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-full py-2 px-3 text-xs font-semibold uppercase tracking-wider border transition-colors flex items-center justify-center gap-2 ${
                  isActive
                    ? 'bg-green-500/10 border-green-500/50 text-green-400'
                    : 'bg-red-500/10 border-red-500/50 text-red-400'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                {isActive ? 'Active (Live)' : 'Inactive (Hidden)'}
              </button>
            </div>
          </div>

          {/* Description Editing */}
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-[#a89f91] mb-1">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0f0c08] border border-[#2a2018] text-[#FDFBF7] px-3 py-2 text-sm focus:outline-none focus:border-[#d4af37] leading-relaxed"
              placeholder="Enter comprehensive product description..."
            />
          </div>

          {/* Keywords & SEO Tags */}
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-[#a89f91] mb-1">
              Keywords & Search Tags (Comma separated)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full bg-[#0f0c08] border border-[#2a2018] text-[#a89f91] px-3 py-2 text-sm focus:outline-none focus:border-[#d4af37]"
              placeholder="e.g. lipstick, matte, waterproof, rose gold, lip balm"
            />
          </div>

          {/* Color Variants Dynamic Manager */}
          <div className="border border-[#2a2018] bg-[#0f0c08] p-4 rounded-sm">
            <label className="block text-[11px] uppercase tracking-widest text-[#d4af37] font-semibold mb-2">
              Product Color Swatches ({colors.length})
            </label>

            {/* List of active color swatches */}
            <div className="flex flex-wrap gap-2 mb-4">
              {colors.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-[#1a140e] border border-[#2a2018] px-3 py-1.5 rounded-full text-xs"
                >
                  <span
                    className="w-4 h-4 rounded-full border border-white/30"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[#FDFBF7] font-medium">{c.name}</span>
                  <span className="text-[10px] text-[#a89f91] font-mono">{c.hex}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(i)}
                    className="text-red-400 hover:text-red-300 ml-1"
                    title="Remove shade"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              {colors.length === 0 && (
                <p className="text-xs text-[#a89f91] italic">No color shades added yet.</p>
              )}
            </div>

            {/* Add New Color Swatch Form */}
            <div className="flex items-center gap-2 bg-[#16100a] p-3 border border-[#2a2018] rounded-sm">
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-9 h-9 bg-transparent border-0 cursor-pointer rounded"
                title="Choose Color Hex"
              />
              <input
                type="text"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder="Shade Name (e.g. Velvet Rose)"
                className="flex-1 bg-[#0f0c08] border border-[#2a2018] text-[#FDFBF7] px-3 py-1.5 text-xs focus:outline-none focus:border-[#d4af37]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddColor();
                  }
                }}
              />
              <input
                type="text"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                placeholder="#HEX"
                className="w-24 bg-[#0f0c08] border border-[#2a2018] text-[#a89f91] font-mono px-2 py-1.5 text-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="bg-[#d4af37] text-[#0f0c08] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider hover:bg-[#e8c84a] transition-colors flex items-center gap-1"
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#2a2018]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-[#2a2018] text-[#a89f91] text-xs uppercase tracking-widest hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#d4af37] text-[#0f0c08] text-xs font-bold uppercase tracking-widest hover:bg-[#e8c84a] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? 'Saving...' : 'Save Product Upgrades'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
