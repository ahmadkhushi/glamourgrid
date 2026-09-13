'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getApiUrl } from '@/lib/api';
import { Search, PackageCheck, Truck, CheckCircle2, Clock, ShieldCheck, MapPin, CreditCard, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface TrackedOrder {
  id: number;
  orderRef: string;
  customerName: string;
  status: 'PENDING' | 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'RETURNED' | 'CANCELLED' | 'REPLACE_REQUESTED';
  total: number;
  paymentMethod: string;
  address: string;
  city: string;
  items: any[];
  createdAt: string;
  updatedAt: string;
}

const statusSteps = [
  { key: 'PLACED', label: 'Order Placed', icon: Clock },
  { key: 'PROCESSING', label: 'Processing', icon: PackageCheck },
  { key: 'SHIPPED', label: 'Dispatched / Shipped', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
];

export default function TrackOrderPage() {
  const [form, setForm] = useState({ orderRef: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<TrackedOrder | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.orderRef.trim() || !form.phone.trim()) {
      setError('Please enter both your Order Reference ID and Phone Number.');
      return;
    }

    setLoading(true);
    setError('');
    setTrackedOrder(null);

    try {
      const res = await fetch(getApiUrl('/api/orders/track'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderRef: form.orderRef.trim(),
          phone: form.phone.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTrackedOrder(data.order);
      } else {
        setError(data.error || 'No matching order found. Please check your details and try again.');
      }
    } catch (err) {
      console.error('Order tracking error:', err);
      setError('Network error while tracking order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'PLACED':
        return 0;
      case 'PROCESSING':
        return 1;
      case 'SHIPPED':
        return 2;
      case 'DELIVERED':
        return 3;
      default:
        return 0;
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-28 pb-20 min-h-screen bg-[#0f0c08] text-[#FDFBF7]">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          
          {/* Title Header */}
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold block mb-2">
              Real-Time Order Lookup
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-[#FDFBF7] mb-4">Track Your Order</h1>
            <p className="text-xs md:text-sm text-[#a89f91] max-w-md mx-auto leading-relaxed">
              Enter your Order Reference ID and registered Phone Number below for private, instant shipment updates.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-[#16100a] border border-[#2a2018] p-8 md:p-10 rounded shadow-2xl mb-12">
            <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-5 items-end">
              <div className="w-full md:w-1/2">
                <label className="block text-[10px] uppercase tracking-widest text-[#a89f91] mb-2 font-semibold">
                  Order ID / Reference *
                </label>
                <input
                  type="text"
                  value={form.orderRef}
                  onChange={(e) => setForm({ ...form, orderRef: e.target.value })}
                  placeholder="e.g. GG-17890123"
                  className="w-full bg-[#0f0c08] border border-[#2a2018] text-[#FDFBF7] px-4 py-3.5 text-xs rounded focus:outline-none focus:border-[#d4af37]/60 placeholder:text-[#a89f91]/40 font-mono"
                />
              </div>

              <div className="w-full md:w-1/2">
                <label className="block text-[10px] uppercase tracking-widest text-[#a89f91] mb-2 font-semibold">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="03001234567"
                  className="w-full bg-[#0f0c08] border border-[#2a2018] text-[#FDFBF7] px-4 py-3.5 text-xs rounded focus:outline-none focus:border-[#d4af37]/60 placeholder:text-[#a89f91]/40 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-3.5 bg-[#d4af37] text-[#0f0c08] text-xs font-bold uppercase tracking-widest hover:bg-[#e8c84a] transition-colors rounded flex items-center justify-center gap-2 disabled:opacity-50 whitespace-nowrap"
              >
                <Search size={15} /> {loading ? 'Searching...' : 'Track Order'}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded text-center">
                {error}
              </div>
            )}
          </div>

          {/* Tracked Order Result Box */}
          {trackedOrder && (
            <div className="bg-[#16100a] border border-[#d4af37]/30 p-8 md:p-10 rounded shadow-2xl animate-fade-in">
              
              {/* Order Header Summary */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2a2018] mb-8">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#a89f91]">Order Reference</span>
                  <h2 className="text-2xl font-mono font-bold text-[#d4af37]">{trackedOrder.orderRef}</h2>
                  <p className="text-xs text-[#a89f91] mt-0.5">
                    Customer: <span className="text-[#FDFBF7] font-semibold">{trackedOrder.customerName}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-widest text-[#a89f91] block">Current Status</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37] px-3 py-1 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded inline-block mt-0.5">
                      {trackedOrder.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Step Bar */}
              {['CANCELLED', 'RETURNED'].includes(trackedOrder.status) ? (
                <div className="mb-10 p-4 bg-amber-950/40 border border-amber-800 text-amber-300 text-xs rounded text-center">
                  Notice: This order status is currently marked as <strong className="uppercase">{trackedOrder.status}</strong>. Please contact our WhatsApp support team for assistance.
                </div>
              ) : (
                <div className="mb-12">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {statusSteps.map((step, idx) => {
                      const currentIdx = getStepIndex(trackedOrder.status);
                      const isDone = idx <= currentIdx;
                      const Icon = step.icon;

                      return (
                        <div
                          key={step.key}
                          className={`p-4 border rounded flex flex-col items-center text-center transition-all ${
                            isDone
                              ? 'bg-[#d4af37]/10 border-[#d4af37] text-[#d4af37]'
                              : 'bg-[#0f0c08] border-[#2a2018] text-[#a89f91]/40'
                          }`}
                        >
                          <Icon size={24} className="mb-2" />
                          <span className="text-xs font-semibold tracking-wider uppercase mb-1">{step.label}</span>
                          <span className="text-[10px] opacity-75 font-mono">
                            {isDone ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Delivery & Items Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[#2a2018]">
                
                {/* Shipping info */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold flex items-center gap-1.5">
                    <MapPin size={14} /> Shipping Information
                  </h3>
                  <div className="bg-[#0f0c08] border border-[#2a2018] p-4 rounded text-xs text-[#a89f91] flex flex-col gap-1.5">
                    <p><strong className="text-[#FDFBF7]">Address:</strong> {trackedOrder.address}</p>
                    <p><strong className="text-[#FDFBF7]">City:</strong> {trackedOrder.city}</p>
                    <p><strong className="text-[#FDFBF7]">Payment Method:</strong> {trackedOrder.paymentMethod.toUpperCase()}</p>
                    <p><strong className="text-[#FDFBF7]">Placed On:</strong> {new Date(trackedOrder.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>

                {/* Items breakdown */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold flex items-center gap-1.5">
                    <CreditCard size={14} /> Order Summary
                  </h3>
                  <div className="bg-[#0f0c08] border border-[#2a2018] p-4 rounded text-xs text-[#a89f91] flex flex-col gap-2">
                    <div className="max-h-36 overflow-y-auto pr-1 flex flex-col gap-2">
                      {Array.isArray(trackedOrder.items) && trackedOrder.items.map((item: any, i: number) => (
                        <div key={i} className="flex items-center justify-between border-b border-[#2a2018]/40 pb-1.5">
                          <span className="text-[#FDFBF7] truncate max-w-[180px]">{item.name}</span>
                          <span className="font-mono text-[#d4af37]">×{item.quantity || 1} — Rs. {((item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#2a2018] text-sm text-[#FDFBF7] font-semibold">
                      <span>Total Amount:</span>
                      <span className="text-[#d4af37] font-mono">Rs. {trackedOrder.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
}
