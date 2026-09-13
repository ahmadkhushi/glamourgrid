import { prisma } from '@/lib/prisma';
import { logoutAction } from '@/lib/auth-actions';
import Link from 'next/link';

const db = prisma as any;

export default async function AdminDashboard() {
  let productCount = 0, orderCount = 0, totalRevenue = 0, openComplaints = 0;
  let orders: any[] = [];

  try {
    [productCount, orderCount] = await Promise.all([
      db.product.count({ where: { isActive: true } }),
      db.order.count(),
    ]);
    const revenue = await db.order.aggregate({ _sum: { total: true } });
    totalRevenue = revenue._sum.total ?? 0;
    orders = await db.order.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });
    openComplaints = await db.complaint.count({ where: { status: 'OPEN' } });
  } catch {
    // DB not connected — show defaults
  }

  const statusColor: Record<string, string> = {
    PENDING: 'text-amber-400 bg-amber-400/10',
    PLACED: 'text-yellow-400 bg-yellow-400/10',
    PROCESSING: 'text-blue-400 bg-blue-400/10',
    SHIPPED: 'text-purple-400 bg-purple-400/10',
    DELIVERED: 'text-green-400 bg-green-400/10',
    RETURNED: 'text-rose-400 bg-rose-400/10',
    REPLACE_REQUESTED: 'text-orange-400 bg-orange-400/10',
    CANCELLED: 'text-red-400 bg-red-400/10',
  };

  return (
    <div className="min-h-screen bg-[#0f0c08] px-6 md:px-12 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif text-[#d4af37] tracking-widest">Admin Control Center</h1>
          <p className="text-[#a89f91] text-xs uppercase tracking-widest mt-1">GlamourGrid Real-Time Management</p>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="border border-[#2a2018] text-[#a89f91] px-5 py-2.5 text-xs uppercase tracking-widest hover:border-red-400/40 hover:text-red-400 transition-colors rounded">
            Logout
          </button>
        </form>
      </div>

      {/* Analytics Callout Banner */}
      <div className="mb-10 bg-gradient-to-r from-[#d4af37]/20 via-[#18130e] to-[#d4af37]/10 border border-[#d4af37]/40 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
            New Feature
          </div>
          <h2 className="text-2xl font-serif text-white mt-1">Advanced Real-Time Analytics Engine</h2>
          <p className="text-xs text-[#a89f91] mt-1 max-w-2xl">
            Track daily, weekly, monthly & yearly sales revenue, monitor return rates, review customer complaints, and manage order statuses in real-time.
          </p>
        </div>
        <Link
          href="/admin/analytics"
          className="px-6 py-3 bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-[#d4af37]/20 hover:bg-[#b59226] transition-all whitespace-nowrap"
        >
          Open Analytics Engine 📊 →
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Active Products', value: productCount, icon: '📦', color: 'from-amber-900/20' },
          { label: 'Total Orders', value: orderCount, icon: '🛒', color: 'from-blue-900/20' },
          { label: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, icon: '💰', color: 'from-green-900/20' },
          { label: 'Open Complaints', value: openComplaints, icon: '⚠️', color: 'from-rose-900/20' },
        ].map((stat) => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.color} to-[#16100a] border border-[#2a2018] p-6 flex items-center gap-4 hover:border-[#d4af37]/20 transition-colors rounded-xl`}>
            <span className="text-4xl">{stat.icon}</span>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#a89f91]">{stat.label}</p>
              <p className="text-2xl font-serif text-[#d4af37] mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
        {[
          { label: 'Analytics Dashboard', href: '/admin/analytics', icon: '📊', desc: 'Real-time sales & complaints' },
          { label: 'Manage Orders', href: '/admin/orders', icon: '📋', desc: 'Update order lifecycle' },
          { label: 'Manage Products', href: '/admin/products', icon: '📦', desc: 'Edit, delete, toggle sale' },
          { label: 'Moderate Reviews', href: '/admin/reviews', icon: '⭐', desc: 'Approve & delete reviews' },
          { label: 'Add Product', href: '/admin/products/new', icon: '➕', desc: 'Add new item to catalog' },
        ].map((link) => (
          <Link key={link.href} href={link.href}
            className="bg-[#16100a] border border-[#2a2018] hover:border-[#d4af37]/40 p-5 text-center transition-all duration-300 group hover:bg-[#1a120c] rounded-xl">
            <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform">{link.icon}</span>
            <span className="text-xs uppercase tracking-widest text-[#d4af37] block mb-1">{link.label}</span>
            <span className="text-[10px] text-[#a89f91]/60">{link.desc}</span>
          </Link>
        ))}
      </div>


      {/* Recent Orders Table */}
      <div className="bg-[#16100a] border border-[#2a2018] rounded-xl overflow-hidden shadow-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2018]">
          <h2 className="font-serif text-[#d4af37] tracking-widest">Recent Orders Summary</h2>
          <Link href="/admin/analytics" className="text-xs text-[#a89f91] uppercase tracking-widest hover:text-[#d4af37] transition-colors">
            View Analytics Dashboard →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2018]">
                {['Order Ref', 'Customer', 'City', 'Total', 'Payment', 'Status', 'Date'].map((h) => (
                  <th key={h} className="text-left text-[10px] uppercase tracking-[0.2em] text-[#a89f91] px-6 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-[#2a2018]/50 hover:bg-[#1a120c] transition-colors">
                  <td className="px-6 py-4 text-[#d4af37] text-sm font-mono">{order.orderRef}</td>
                  <td className="px-6 py-4 text-[#FDFBF7] text-sm">{order.customerName}</td>
                  <td className="px-6 py-4 text-[#a89f91] text-sm">{order.city}</td>
                  <td className="px-6 py-4 text-[#d4af37] text-sm">Rs. {order.total.toLocaleString()}</td>
                  <td className="px-6 py-4 text-[#a89f91] text-sm uppercase">{order.paymentMethod}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-sm uppercase tracking-widest ${statusColor[order.status] ?? 'text-[#a89f91]'}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#a89f91] text-xs">
                    {new Date(order.createdAt).toLocaleDateString('en-PK')}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#a89f91] text-sm">
                    No orders recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}