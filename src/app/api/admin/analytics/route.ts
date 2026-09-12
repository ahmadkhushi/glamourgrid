import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const db = prisma as any;

export async function GET() {
  try {
    const now = new Date();

    // ── 1. Date boundaries ─────────────────────────────────
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // ── 2. Fetch all orders & complaints safely ────────────
    const orders = await db.order.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const complaints = await db.complaint.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Helper to calculate total revenue for non-cancelled orders in date range
    const calcMetrics = (fromDate: Date) => {
      const filtered = orders.filter((o: any) => new Date(o.createdAt) >= fromDate);
      const validOrders = filtered.filter((o: any) => o.status !== 'CANCELLED');
      const sales = validOrders.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);
      return {
        count: filtered.length,
        validCount: validOrders.length,
        sales,
      };
    };

    const daily = calcMetrics(startOfToday);
    const weekly = calcMetrics(startOfWeek);
    const monthly = calcMetrics(startOfMonth);
    const yearly = calcMetrics(startOfYear);

    // ── 3. Returns Counter ─────────────────────────────────
    const returnedOrders = orders.filter((o: any) => o.status === 'RETURNED');
    const returnsCounter = {
      count: returnedOrders.length,
      totalValue: returnedOrders.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0),
    };

    // ── 4. Orders by Status Breakdown ───────────────────────
    const statusCounts: Record<string, number> = {
      PENDING: 0,
      PLACED: 0,
      PROCESSING: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      RETURNED: 0,
      REPLACE_REQUESTED: 0,
      CANCELLED: 0,
    };

    orders.forEach((o: any) => {
      if (statusCounts[o.status] !== undefined) {
        statusCounts[o.status]++;
      } else {
        statusCounts[o.status] = 1;
      }
    });

    // ── 5. Complaints Summary ───────────────────────────────
    const complaintsSummary = {
      total: complaints.length,
      open: complaints.filter((c: any) => c.status === 'OPEN').length,
      resolved: complaints.filter((c: any) => c.status === 'RESOLVED').length,
      items: complaints,
    };

    return NextResponse.json({
      success: true,
      metrics: {
        daily,
        weekly,
        monthly,
        yearly,
        returns: returnsCounter,
        statusCounts,
      },
      complaints: complaintsSummary,
      recentOrders: orders.slice(0, 15),
    });
  } catch (error: any) {
    console.error('Analytics API Error:', error);
    return NextResponse.json({ error: 'Analytics calculation failed', details: error?.message }, { status: 500 });
  }
}
