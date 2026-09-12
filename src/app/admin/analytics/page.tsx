'use client';

import { useState, useEffect, useCallback } from 'react';
import OrderStatusUpdater from '../orders/OrderStatusUpdater';

type MetricFilter = 'daily' | 'weekly' | 'monthly' | 'yearly';

export default function AdminAnalyticsDashboard() {
  const [filter, setFilter] = useState<MetricFilter>('daily');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // New complaint form state
  const [showNewComplaintModal, setShowNewComplaintModal] = useState<boolean>(false);
  const [complaintForm, setComplaintForm] = useState({
    customerEmail: '',
    customerName: '',
    orderId: '',
    message: '',
  });
  const [submittingComplaint, setSubmittingComplaint] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/analytics', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch analytics data');
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error loading dashboard metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleStatusChange = () => {
    // Re-fetch analytics immediately when an order status changes
    fetchAnalytics();
  };

  const handleToggleComplaintStatus = async (complaintId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'OPEN' ? 'RESOLVED' : 'OPEN';
    try {
      const res = await fetch(`/api/complaints/${complaintId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        fetchAnalytics();
      }
    } catch (err) {
      console.error('Failed to toggle complaint status', err);
    }
  };

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintForm.customerEmail || !complaintForm.message) return;
    setSubmittingComplaint(true);
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(complaintForm),
      });
      if (res.ok) {
        setComplaintForm({ customerEmail: '', customerName: '', orderId: '', message: '' });
        setShowNewComplaintModal(false);
        fetchAnalytics();
      }
    } catch (err) {
      console.error('Error submitting complaint', err);
    } finally {
      setSubmittingComplaint(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#a89f91] text-sm uppercase tracking-widest">Loading Real-Time Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-rose-950/40 border border-rose-800 text-rose-300 p-6 rounded-lg text-center">
          <h2 className="font-serif text-xl mb-2">Analytics Engine Unavailable</h2>
          <p className="text-sm mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="px-6 py-2 bg-rose-800 hover:bg-rose-700 text-white font-medium rounded text-xs uppercase tracking-wider transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const currentMetric = metrics[filter] || { sales: 0, count: 0, validCount: 0 };
  const returns = metrics.returns || { count: 0, totalValue: 0 };
  const statusCounts = metrics.statusCounts || {};
  const complaints = data?.complaints || { total: 0, open: 0, resolved: 0, items: [] };
  const recentOrders = data?.recentOrders || [];

  const getFilterLabel = (f: MetricFilter) => {
    switch (f) {
      case 'daily': return "Today's Performance";
      case 'weekly': return 'Last 7 Days';
      case 'monthly': return 'Current Month';
      case 'yearly': return 'Current Year';
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      {/* Dashboard Title & Timeframe Selector */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[#2a2018] pb-6">
        <div>
          <span className="text-[#d4af37] text-xs uppercase tracking-[0.3em] font-semibold">Real-Time Intelligence</span>
          <h1 className="text-3xl md:text-4xl font-serif text-white mt-1">Analytics & Order Management</h1>
        </div>

        {/* Dynamic Filter Buttons */}
        <div className="flex items-center bg-[#14100b] p-1.5 rounded-lg border border-[#2a2018]">
          {(['daily', 'weekly', 'monthly', 'yearly'] as MetricFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs uppercase tracking-wider rounded-md font-semibold transition-all ${
                filter === f
                  ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
                  : 'text-[#a89f91] hover:text-white hover:bg-white/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Selected Timeframe Revenue */}
        <div className="bg-[#14100b] border border-[#2a2018] rounded-xl p-6 relative overflow-hidden group hover:border-[#d4af37]/50 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 text-4xl text-[#d4af37]">
            💰
          </div>
          <span className="text-xs uppercase tracking-widest text-[#a89f91] font-medium">
            {getFilterLabel(filter)} Sales
          </span>
          <div className="text-3xl font-serif text-[#d4af37] mt-3">
            Rs {currentMetric.sales.toLocaleString('en-PK')}
          </div>
          <p className="text-xs text-[#8c8275] mt-2">
            From {currentMetric.validCount} verified orders
          </p>
        </div>

        {/* Selected Timeframe Total Orders */}
        <div className="bg-[#14100b] border border-[#2a2018] rounded-xl p-6 relative overflow-hidden group hover:border-[#d4af37]/50 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 text-4xl text-[#d4af37]">
            📦
          </div>
          <span className="text-xs uppercase tracking-widest text-[#a89f91] font-medium">
            {getFilterLabel(filter)} Orders
          </span>
          <div className="text-3xl font-serif text-white mt-3">
            {currentMetric.count} <span className="text-sm font-sans text-[#a89f91]">orders</span>
          </div>
          <p className="text-xs text-[#8c8275] mt-2">
            Includes all order statuses
          </p>
        </div>

        {/* Returns Counter Card */}
        <div className="bg-[#14100b] border border-rose-900/40 rounded-xl p-6 relative overflow-hidden group hover:border-rose-700/60 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 text-4xl text-rose-500">
            🔄
          </div>
          <span className="text-xs uppercase tracking-widest text-rose-400 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            Returns Counter
          </span>
          <div className="text-3xl font-serif text-rose-400 mt-3">
            {returns.count} <span className="text-xs text-rose-300/70 font-sans">Returned</span>
          </div>
          <p className="text-xs text-rose-300/80 mt-2 font-mono">
            Value: Rs {returns.totalValue.toLocaleString('en-PK')}
          </p>
        </div>

        {/* Customer Complaints Overview Card */}
        <div className="bg-[#14100b] border border-amber-900/40 rounded-xl p-6 relative overflow-hidden group hover:border-amber-700/60 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 text-4xl text-amber-500">
            ⚠️
          </div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-medium">
            Complaints Overview
          </span>
          <div className="text-3xl font-serif text-amber-400 mt-3 flex items-baseline gap-2">
            {complaints.open} <span className="text-xs text-amber-200/70 font-sans">Open Tickets</span>
          </div>
          <p className="text-xs text-amber-300/70 mt-2">
            {complaints.resolved} Resolved / {complaints.total} Total
          </p>
        </div>
      </div>

      {/* Status Breakdown Grid */}
      <div className="bg-[#14100b] border border-[#2a2018] rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-serif uppercase tracking-widest text-[#d4af37] border-b border-[#2a2018] pb-3">
          Orders Status Lifecycle Breakdown
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { key: 'PENDING', label: 'Pending', color: 'text-amber-400 border-amber-800/40 bg-amber-950/30' },
            { key: 'PLACED', label: 'Placed', color: 'text-[#a89f91] border-[#2a2018] bg-[#18130e]' },
            { key: 'PROCESSING', label: 'Processing', color: 'text-blue-400 border-blue-800/40 bg-blue-950/30' },
            { key: 'SHIPPED', label: 'Shipped', color: 'text-purple-400 border-purple-800/40 bg-purple-950/30' },
            { key: 'DELIVERED', label: 'Delivered', color: 'text-emerald-400 border-emerald-800/40 bg-emerald-950/30' },
            { key: 'RETURNED', label: 'Returned', color: 'text-rose-400 border-rose-800/40 bg-rose-950/30' },
            { key: 'REPLACE_REQUESTED', label: 'Replace Req', color: 'text-cyan-400 border-cyan-800/40 bg-cyan-950/30' },
            { key: 'CANCELLED', label: 'Cancelled', color: 'text-slate-400 border-slate-800/40 bg-slate-900/30' },
          ].map((st) => (
            <div key={st.key} className={`border rounded-lg p-3 text-center ${st.color}`}>
              <div className="text-xl font-bold font-serif">{statusCounts[st.key] || 0}</div>
              <div className="text-[10px] uppercase tracking-wider mt-1">{st.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Orders Management Table with Real-Time Status Updater */}
      <div className="bg-[#14100b] border border-[#2a2018] rounded-xl overflow-hidden shadow-xl space-y-4">
        <div className="p-6 border-b border-[#2a2018] flex items-center justify-between">
          <div>
            <h3 className="text-lg font-serif text-white">Live Orders Management</h3>
            <p className="text-xs text-[#a89f91] mt-1">Change order status to recalculate analytics real-time</p>
          </div>
          <span className="text-xs text-[#d4af37] bg-[#d4af37]/10 px-3 py-1 rounded border border-[#d4af37]/30">
            {recentOrders.length} Recent Orders
          </span>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center text-[#8c8275]">
            <p>No orders found in database yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0a0805] text-[#d4af37] uppercase tracking-wider border-b border-[#2a2018]">
                <tr>
                  <th className="p-4 font-normal">Order Ref</th>
                  <th className="p-4 font-normal">Customer</th>
                  <th className="p-4 font-normal">Contact</th>
                  <th className="p-4 font-normal">Total</th>
                  <th className="p-4 font-normal">Date</th>
                  <th className="p-4 font-normal">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2018]/50 text-[#c8bfb0]">
                {recentOrders.map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-[#18130e] transition-colors">
                    <td className="p-4 font-mono text-[#d4af37]">{ord.orderRef}</td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{ord.customerName}</div>
                      <div className="text-[10px] text-[#8c8275] truncate max-w-xs">{ord.address}</div>
                    </td>
                    <td className="p-4">{ord.phone}</td>
                    <td className="p-4 font-semibold text-white">Rs {Number(ord.total).toLocaleString('en-PK')}</td>
                    <td className="p-4 text-[#8c8275]">
                      {new Date(ord.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-4">
                      <OrderStatusUpdater
                        orderId={ord.id}
                        currentStatus={ord.status}
                        onStatusChange={handleStatusChange}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Complaints Overview Section */}
      <div className="bg-[#14100b] border border-[#2a2018] rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2018] pb-4">
          <div>
            <h3 className="text-lg font-serif text-white flex items-center gap-2">
              <span>📩</span> Customer Complaints & Tickets
            </h3>
            <p className="text-xs text-[#a89f91] mt-1">Review customer tickets and mark as Resolved or Open</p>
          </div>
          <button
            onClick={() => setShowNewComplaintModal(true)}
            className="px-4 py-2 bg-[#d4af37] hover:bg-[#b59226] text-black font-semibold text-xs rounded uppercase tracking-wider transition-colors self-start sm:self-auto"
          >
            + Add Test Complaint
          </button>
        </div>

        {complaints.items.length === 0 ? (
          <div className="p-8 text-center text-[#8c8275] border border-dashed border-[#2a2018] rounded-lg">
            <p>No customer complaints recorded.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {complaints.items.map((comp: any) => (
              <div
                key={comp.id}
                className={`p-4 rounded-lg border transition-all ${
                  comp.status === 'OPEN'
                    ? 'bg-amber-950/20 border-amber-800/40 hover:border-amber-700'
                    : 'bg-emerald-950/20 border-emerald-800/40 hover:border-emerald-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-white text-sm">
                      {comp.customerName || 'Anonymous Customer'}
                    </div>
                    <div className="text-xs text-[#d4af37]">{comp.customerEmail}</div>
                  </div>
                  <button
                    onClick={() => handleToggleComplaintStatus(comp.id, comp.status)}
                    className={`px-3 py-1 text-[10px] font-bold rounded uppercase tracking-wider border transition-colors ${
                      comp.status === 'OPEN'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                    }`}
                  >
                    {comp.status === 'OPEN' ? 'Mark Resolved' : 'Reopen Ticket'}
                  </button>
                </div>

                {comp.orderId && (
                  <div className="text-[11px] text-[#8c8275] mt-2 font-mono">
                    Related Order ID: #{comp.orderId}
                  </div>
                )}

                <p className="text-xs text-[#c8bfb0] mt-2 bg-black/40 p-3 rounded border border-white/5 whitespace-pre-wrap">
                  "{comp.message}"
                </p>

                <div className="text-[10px] text-[#8c8275] mt-3 text-right">
                  {new Date(comp.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Adding Test Complaint */}
      {showNewComplaintModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#14100b] border border-[#2a2018] rounded-xl p-6 max-w-md w-full space-y-4 text-white">
            <h3 className="text-lg font-serif text-[#d4af37]">Log Customer Complaint</h3>
            <form onSubmit={handleCreateComplaint} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#a89f91] mb-1">Customer Email *</label>
                <input
                  type="email"
                  required
                  value={complaintForm.customerEmail}
                  onChange={(e) => setComplaintForm({ ...complaintForm, customerEmail: e.target.value })}
                  placeholder="customer@example.com"
                  className="w-full bg-[#0a0805] border border-[#2a2018] p-2.5 rounded text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-[#a89f91] mb-1">Customer Name</label>
                <input
                  type="text"
                  value={complaintForm.customerName}
                  onChange={(e) => setComplaintForm({ ...complaintForm, customerName: e.target.value })}
                  placeholder="Sarah Khan"
                  className="w-full bg-[#0a0805] border border-[#2a2018] p-2.5 rounded text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-[#a89f91] mb-1">Order ID (Optional)</label>
                <input
                  type="number"
                  value={complaintForm.orderId}
                  onChange={(e) => setComplaintForm({ ...complaintForm, orderId: e.target.value })}
                  placeholder="101"
                  className="w-full bg-[#0a0805] border border-[#2a2018] p-2.5 rounded text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-[#a89f91] mb-1">Complaint Details *</label>
                <textarea
                  required
                  rows={3}
                  value={complaintForm.message}
                  onChange={(e) => setComplaintForm({ ...complaintForm, message: e.target.value })}
                  placeholder="Item received was shade rose gold instead of bronze..."
                  className="w-full bg-[#0a0805] border border-[#2a2018] p-2.5 rounded text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewComplaintModal(false)}
                  className="px-4 py-2 text-[#a89f91] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingComplaint}
                  className="px-5 py-2 bg-[#d4af37] text-black font-semibold rounded hover:bg-[#b59226] disabled:opacity-50"
                >
                  {submittingComplaint ? 'Submitting...' : 'Save Complaint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
