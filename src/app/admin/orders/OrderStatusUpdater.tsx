'use client';
import { useState } from 'react';
import { getApiUrl } from '@/lib/api';

const STATUSES = [
  'PENDING',
  'PLACED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'RETURNED',
  'REPLACE_REQUESTED',
  'CANCELLED',
];

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
  onStatusChange,
}: {
  orderId: number | string;
  currentStatus: string;
  onStatusChange?: (newStatus: string) => void;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  const handleChange = async (newStatus: string) => {
    setSaving(true);
    try {
      await fetch(getApiUrl(`/api/orders/${orderId}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setStatus(newStatus);
      if (onStatusChange) onStatusChange(newStatus);
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setSaving(false);
    }
  };

  const getBadgeStyle = (s: string) => {
    switch (s) {
      case 'DELIVERED': return 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50';
      case 'RETURNED': return 'bg-rose-950/60 text-rose-400 border-rose-800/50';
      case 'PENDING': return 'bg-amber-950/60 text-amber-400 border-amber-800/50';
      case 'PROCESSING': return 'bg-blue-950/60 text-blue-400 border-blue-800/50';
      case 'SHIPPED': return 'bg-purple-950/60 text-purple-400 border-purple-800/50';
      default: return 'bg-[#18130e] text-[#a89f91] border-[#2a2018]';
    }
  };

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={saving}
      className={`border text-xs px-2.5 py-1 rounded transition-colors focus:outline-none disabled:opacity-50 font-medium ${getBadgeStyle(status)}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} className="bg-[#0f0c08] text-white">
          {s.replace(/_/g, ' ')}
        </option>
      ))}
    </select>
  );
}
