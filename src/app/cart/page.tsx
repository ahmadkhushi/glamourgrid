"use client";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";

const steps = ["Cart", "Checkout", "Order Placed"];

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const total = items.reduce((acc, item) => acc + item.price * (item.quantity ?? 1), 0);

  return (
    <div className="pt-28 min-h-screen bg-[#0f0c08]">
      <div className="container mx-auto px-4 md:px-8 py-12 max-w-6xl">

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-0 mb-12">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center">
              <div className={`flex flex-col items-center ${i === 0 ? "opacity-100" : "opacity-40"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  i === 0
                    ? "bg-[#d4af37] border-[#d4af37] text-[#0f0c08]"
                    : "border-[#2a2018] text-[#a89f91]"
                }`}>
                  {i + 1}
                </div>
                <span className="text-[10px] uppercase tracking-widest text-[#a89f91] mt-1">{step}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-16 md:w-24 h-px bg-[#2a2018] mx-2 mb-4" />
              )}
            </div>
          ))}
        </div>

        <h1 className="text-4xl font-serif text-[#d4af37] mb-8 tracking-wide text-center">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#a89f91] mb-6 text-lg">Your cart is empty.</p>
            <Link
              href="/shop"
              className="bg-[#d4af37] text-[#0f0c08] px-8 py-4 font-semibold tracking-widest uppercase hover:bg-[#e8c84a] transition-all inline-block"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Items */}
            <div className="w-full lg:w-2/3">
              {items.map((item) => {
                const qty = item.quantity ?? 1;
                return (
                  <div key={item.id} className="flex items-center gap-6 border-b border-[#2a2018] py-6">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover border border-[#2a2018]"
                    />
                    <div className="flex-grow">
                      <h3 className="text-lg font-serif text-[#FDFBF7] mb-1">{item.name}</h3>
                      <p className="text-[#d4af37] mb-3 text-sm">Rs. {item.price.toFixed(0)}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-[#2a2018]">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, qty - 1))}
                            className="px-3 py-1 text-[#a89f91] hover:text-[#d4af37] transition-colors"
                          >−</button>
                          <span className="px-3 py-1 text-[#FDFBF7] min-w-[40px] text-center">{qty}</span>
                          <button
                            onClick={() => updateQuantity(item.id, qty + 1)}
                            className="px-3 py-1 text-[#a89f91] hover:text-[#d4af37] transition-colors"
                          >+</button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-sm text-[#a89f91] hover:text-red-400 transition-colors uppercase tracking-widest"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#FDFBF7] text-lg">
                        Rs. {(item.price * qty).toFixed(0)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-[#16100a] p-8 border border-[#2a2018] sticky top-28">
                <h3 className="text-xl font-serif text-[#d4af37] mb-6 tracking-widest">Order Summary</h3>
                <div className="flex justify-between mb-3 text-[#a89f91] text-sm">
                  <span>Sub-Total ({items.length} items)</span>
                  <span>Rs. {total.toFixed(0)}</span>
                </div>
                <div className="flex justify-between mb-6 text-[#a89f91] text-sm">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="border-t border-[#2a2018] pt-4 flex justify-between font-semibold text-lg text-[#d4af37] mb-8">
                  <span>Total</span>
                  <span>Rs. {total.toFixed(0)}</span>
                </div>
                <Link
                  href="/checkout"
                  className="block text-center bg-[#d4af37] text-[#0f0c08] px-8 py-4 font-semibold tracking-widest uppercase hover:bg-[#e8c84a] transition-all"
                >
                  Proceed to Checkout →
                </Link>
                <Link
                  href="/shop"
                  className="block text-center text-[#a89f91] text-xs uppercase tracking-widest mt-4 hover:text-[#d4af37] transition-colors"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}