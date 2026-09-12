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