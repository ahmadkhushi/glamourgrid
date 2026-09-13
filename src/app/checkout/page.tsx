"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import Link from "next/link";

import { getApiUrl } from "@/lib/api";

const steps = ["Cart", "Checkout", "Order Placed"];

type PaymentMethod = "cod" | "bank";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const { addOrder } = useOrderStore();
  const total = items.reduce((acc, item) => acc + item.price * (item.quantity ?? 1), 0);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "cod" as PaymentMethod,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full Name is required";
    if (!form.phone.trim() || !/^03\d{9}$/.test(form.phone)) e.phone = "Please enter a valid phone number (03XXXXXXXXX)";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };


  const handlePlace = async () => {
    if (!validate()) return;
    if (items.length === 0) return;
    setPlacing(true);

    const orderPayload = {
      customerName: form.name.trim(),
      customerEmail: form.email.trim() || undefined,
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      paymentMethod: form.paymentMethod,
      total,
      items: items.map((i) => ({
        id: String(i.id),
        name: i.name,
        price: i.price,
        quantity: i.quantity ?? 1,
        image: i.image,
      })),
    };

    try {
      const res = await fetch(getApiUrl('/api/orders'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      let orderRef = `GG-${Date.now()}`;
      if (res.ok) {
        const data = await res.json();
        orderRef = data.orderRef || orderRef;
      }

      addOrder({
        id: orderRef,
        ...orderPayload,
        name: form.name,
        status: 'Placed' as const,
        placedAt: new Date().toISOString(),
      });
      clearCart();
      router.push(`/order-success?id=${orderRef}`);
    } catch (err) {
      console.error('Order submission network error:', err);
      const fallbackRef = `GG-${Date.now()}`;
      addOrder({
        id: fallbackRef,
        ...orderPayload,
        name: form.name,
        status: 'Placed' as const,
        placedAt: new Date().toISOString(),
      });
      clearCart();
      router.push(`/order-success?id=${fallbackRef}`);
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-28 min-h-screen bg-[#0f0c08] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#a89f91] mb-4">Your cart is empty.</p>
          <Link href="/shop" className="text-[#d4af37] underline">Start Shopping</Link>
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
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#a89f91] mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Ali Hassan"
                    className="w-full bg-[#0f0c08] border border-[#2a2018] text-[#FDFBF7] px-4 py-3 text-sm focus:outline-none focus:border-[#d4af37]/50 placeholder:text-[#a89f91]/40"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#a89f91] mb-2">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="customer@example.com"
                    className="w-full bg-[#0f0c08] border border-[#2a2018] text-[#FDFBF7] px-4 py-3 text-sm focus:outline-none focus:border-[#d4af37]/50 placeholder:text-[#a89f91]/40"
                  />
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
                    placeholder="House / flat number, street, area..."
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
                    <p className="text-[#a89f91] text-xs mt-1">Pay cash upon delivery. Available nationwide across Pakistan.</p>
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
                    <p className="text-[#a89f91] text-xs mt-1">Account details will be shared after placing the order.</p>
                  </div>
                </label>
              </div>

              {form.paymentMethod === "bank" && (
                <div className="bg-[#0f0c08] border border-[#d4af37]/20 p-4 mb-6 text-sm text-[#a89f91]">
                  <p className="font-semibold text-[#d4af37] mb-2">Bank Details</p>
                  <p>Account Name: <span className="text-[#FDFBF7]">GlamourGrid Pvt</span></p>
                  <p>JazzCash: <span className="text-[#FDFBF7]">0300-1234567</span></p>
                  <p>EasyPaisa: <span className="text-[#FDFBF7]">0300-1234567</span></p>
                  <p className="mt-2 text-xs text-[#a89f91]/70">Send payment receipt via WhatsApp: 0300-1234567</p>
                </div>
              )}

              <button
                onClick={handlePlace}
                disabled={placing}
                className="w-full bg-[#d4af37] text-[#0f0c08] py-4 font-semibold tracking-widest uppercase hover:bg-[#e8c84a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {placing ? "Placing Order..." : "Place Order →"}
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