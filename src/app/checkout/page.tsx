"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import Link from "next/link";

const steps = ["Cart", "Checkout", "Order Placed"];

type PaymentMethod = "cod" | "bank";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const { addOrder } = useOrderStore();
  const total = items.reduce((acc, item) => acc + item.price * (item.quantity ?? 1), 0);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "cod" as PaymentMethod,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Naam zaruri hai";
    if (!form.phone.trim() || !/^03\d{9}$/.test(form.phone)) e.phone = "Valid phone number daalein (03XXXXXXXXX)";
    if (!form.address.trim()) e.address = "Address zaruri hai";
    if (!form.city.trim()) e.city = "City zaruri hai";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlace = async () => {
    if (!validate()) return;
    if (items.length === 0) return;
    setPlacing(true);

    const orderPayload = {
      id: `GG-${Date.now()}`,
      items: items.map((i) => ({
        id: String(i.id),
        name: i.name,
        price: i.price,
        quantity: i.quantity ?? 1,
        image: i.image,
      })),
      total,
      name: form.name,
      phone: form.phone,
      address: form.address,
      city: form.city,
      paymentMethod: form.paymentMethod,
      status: "Placed" as const,
      placedAt: new Date().toISOString(),
    };

    addOrder(orderPayload);
    clearCart();
    router.push(`/order-success?id=${orderPayload.id}`);
  };

  if (items.length === 0) {
    return (
      <div className="pt-28 min-h-screen bg-[#0f0c08] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#a89f91] mb-4">Cart khali hai.</p>
          <Link href="/shop" className="text-[#d4af37] underline">Shop karo</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 min-h-screen bg-[#0f0c08]">
      <div className="container mx-auto px-4 md:px-8 py-12 max-w-6xl">

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-0 mb-12">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center">
              <div className={`flex flex-col items-center ${i === 1 ? "opacity-100" : "opacity-40"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  i <= 1
                    ? "bg-[#d4af37] border-[#d4af37] text-[#0f0c08]"
                    : "border-[#2a2018] text-[#a89f91]"
                }`}>
                  {i + 1}
                </div>
                <span className="text-[10px] uppercase tracking-widest text-[#a89f91] mt-1">{step}</span>
              </div>
              {i < steps.length - 1 && <div className="w-16 md:w-24 h-px bg-[#2a2018] mx-2 mb-4" />}
            </div>
          ))}
        </div>

        <h1 className="text-4xl font-serif text-[#d4af37] mb-10 tracking-wide text-center">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Form */}
          <div className="w-full lg:w-3/5">
            <div className="bg-[#16100a] border border-[#2a2018] p-8">
              <h2 className="text-[#d4af37] font-serif text-xl mb-6 tracking-widest">Delivery Information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                {/* Name */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#a89f91] mb-2">Poora Naam *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Ali Hassan"
                    className="w-full bg-[#0f0c08] border border-[#2a2018] text-[#FDFBF7] px-4 py-3 text-sm focus:outline-none focus:border-[#d4af37]/50 placeholder:text-[#a89f91]/40"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#a89f91] mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="03001234567"
                    className="w-full bg-[#0f0c08] border border-[#2a2018] text-[#FDFBF7] px-4 py-3 text-sm focus:outline-none focus:border-[#d4af37]/50 placeholder:text-[#a89f91]/40"
                  />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>

                {/* City */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#a89f91] mb-2">City *</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="e.g. Lahore"
                    className="w-full bg-[#0f0c08] border border-[#2a2018] text-[#FDFBF7] px-4 py-3 text-sm focus:outline-none focus:border-[#d4af37]/50 placeholder:text-[#a89f91]/40"
                  />
                  {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#a89f91] mb-2">Delivery Address *</label>
                  <textarea
                    rows={3}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Ghar / flat number, street, area..."
                    className="w-full bg-[#0f0c08] border border-[#2a2018] text-[#FDFBF7] px-4 py-3 text-sm focus:outline-none focus:border-[#d4af37]/50 resize-none placeholder:text-[#a89f91]/40"
                  />
                  {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                </div>
              </div>

              {/* Payment Method */}
              <h2 className="text-[#d4af37] font-serif text-xl mb-4 tracking-widest mt-8">Payment Method</h2>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {/* COD */}
                <label className={`flex-1 flex items-start gap-3 border p-4 cursor-pointer transition-colors ${
                  form.paymentMethod === "cod" ? "border-[#d4af37]" : "border-[#2a2018] hover:border-[#d4af37]/40"
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={form.paymentMethod === "cod"}
                    onChange={() => setForm({ ...form, paymentMethod: "cod" })}
                    className="mt-1 accent-[#d4af37]"
                  />
                  <div>
                    <p className="text-[#FDFBF7] text-sm font-semibold">Cash on Delivery</p>
                    <p className="text-[#a89f91] text-xs mt-1">Delivery ke waqt cash dein. Pakistan mein available.</p>
                  </div>
                </label>

                {/* Bank Transfer */}
                <label className={`flex-1 flex items-start gap-3 border p-4 cursor-pointer transition-colors ${
                  form.paymentMethod === "bank" ? "border-[#d4af37]" : "border-[#2a2018] hover:border-[#d4af37]/40"
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={form.paymentMethod === "bank"}
                    onChange={() => setForm({ ...form, paymentMethod: "bank" })}
                    className="mt-1 accent-[#d4af37]"
                  />
                  <div>
                    <p className="text-[#FDFBF7] text-sm font-semibold">Bank / JazzCash / EasyPaisa</p>
                    <p className="text-[#a89f91] text-xs mt-1">Order place ke baad account details share ki jaengi.</p>
                  </div>
                </label>
              </div>

              {form.paymentMethod === "bank" && (
                <div className="bg-[#0f0c08] border border-[#d4af37]/20 p-4 mb-6 text-sm text-[#a89f91]">
                  <p className="font-semibold text-[#d4af37] mb-2">Bank Details</p>
                  <p>Account Name: <span className="text-[#FDFBF7]">GlamourGrid Pvt</span></p>
                  <p>JazzCash: <span className="text-[#FDFBF7]">0300-1234567</span></p>
                  <p>EasyPaisa: <span className="text-[#FDFBF7]">0300-1234567</span></p>
                  <p className="mt-2 text-xs text-[#a89f91]/70">Receipt whatsapp karein: 0300-1234567</p>
                </div>
              )}

              <button
                onClick={handlePlace}
                disabled={placing}
                className="w-full bg-[#d4af37] text-[#0f0c08] py-4 font-semibold tracking-widest uppercase hover:bg-[#e8c84a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {placing ? "Order Place Ho Raha Hai..." : "Order Place Karein →"}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-2/5">
            <div className="bg-[#16100a] border border-[#2a2018] p-8 sticky top-28">
              <h3 className="text-xl font-serif text-[#d4af37] mb-6 tracking-widest">Your Order</h3>
              <div className="flex flex-col gap-4 mb-6 max-h-64 overflow-y-auto pr-2">
                {items.map((item) => {
                  const qty = item.quantity ?? 1;
                  return (
                    <div key={item.id} className="flex gap-3 items-center">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover border border-[#2a2018] flex-shrink-0" />
                      <div className="flex-grow min-w-0">
                        <p className="text-[#FDFBF7] text-sm truncate">{item.name}</p>
                        <p className="text-[#a89f91] text-xs">×{qty}</p>
                      </div>
                      <p className="text-[#d4af37] text-sm font-semibold flex-shrink-0">
                        Rs. {(item.price * qty).toFixed(0)}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-[#2a2018] pt-4">
                <div className="flex justify-between text-[#a89f91] text-sm mb-2">
                  <span>Sub-Total</span><span>Rs. {total.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-[#a89f91] text-sm mb-4">
                  <span>Delivery</span><span className="text-green-400">Free</span>
                </div>
                <div className="flex justify-between text-[#d4af37] font-semibold text-lg">
                  <span>Total</span><span>Rs. {total.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}