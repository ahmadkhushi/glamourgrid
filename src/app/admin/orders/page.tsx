import { prisma } from '@/lib/prisma';
import { logoutAction } from '@/lib/auth-actions';
import Link from 'next/link';
import OrderStatusUpdater from './OrderStatusUpdater';

export default async function AdminOrdersPage() {
  let orders: any[] = [];
  try {
    orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
  } catch {
    // DB offline
  }

  const statusColor: Record<string, string> = {
    PLACED: 'text-yellow-400',
    PROCESSING: 'text-blue-400',
    SHIPPED: 'text-purple-400',
    DELIVERED: 'text-green-400',
    REPLACE_REQUESTED: 'text-orange-400',
    CANCELLED: 'text-red-400',
  };

  return (
    <div className="min-h-screen bg-[#0f0c08] pt-8 px-6 md:px-12 pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-[#a89f91] text-xs uppercase tracking-widest hover:text-[#d4af37] transition-colors">← Dashboard</Link>
          <h1 className="text-3xl font-serif text-[#d4af37] tracking-widest mt-2">All Orders ({orders.length})</h1>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="border border-[#2a2018] text-[#a89f91] px-5 py-2 text-xs uppercase tracking-widest hover:text-red-400 transition-colors">Logout</button>
        </form>
      </div>

      <div className="bg-[#16100a] border border-[#2a2018] overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-[#2a2018]">
              {['Order Ref', 'Customer', 'Phone', 'City', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Update Status'].map((h) => (
                <th key={h} className="text-left text-[10px] uppercase tracking-widest text-[#a89f91] px-4 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const items = order.items as Array<{ name: string; quantity: number }>;
              return (
                <tr key={order.id} className="border-b border-[#2a2018]/50 hover:bg-[#1a120c] transition-colors">
                  <td className="px-4 py-4 text-[#d4af37] text-xs font-mono">{order.orderRef}</td>
                  <td className="px-4 py-4 text-[#FDFBF7] text-sm">{order.customerName}</td>
                  <td className="px-4 py-4 text-[#a89f91] text-sm">{order.phone}</td>
                  <td className="px-4 py-4 text-[#a89f91] text-sm">{order.city}</td>
                  <td className="px-4 py-4 text-[#a89f91] text-xs">
                    {items.slice(0, 2).map((i) => `${i.name} ×${i.quantity}`).join(', ')}
                    {items.length > 2 && ` +${items.length - 2} more`}
                  </td>
                  <td className="px-4 py-4 text-[#d4af37] text-sm font-semibold">Rs. {order.total.toLocaleString()}</td>
                  <td className="px-4 py-4 text-[#a89f91] text-xs uppercase">{order.paymentMethod}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs uppercase tracking-widest ${statusColor[order.status] ?? 'text-[#a89f91]'}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[#a89f91] text-xs">
                    {new Date(order.createdAt).toLocaleDateString('en-PK')}
                  </td>
                  <td className="px-4 py-4">
                    <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr><td colSpan={10} className="px-6 py-12 text-center text-[#a89f91]">Koi orders nahi hain abhi tak.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
