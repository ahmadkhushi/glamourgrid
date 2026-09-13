export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { sendOrderStatusUpdateEmail } from '@/lib/email';


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id);

    const order = await prisma.order.findFirst({
      where: !isNaN(numericId)
        ? { OR: [{ id: numericId }, { orderRef: id }] }
        : { orderRef: id },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (err: any) {
    console.error('Error getting order:', err);
    return NextResponse.json({ error: err.message || 'Error fetching order' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();
    const numericId = parseInt(id);

    const whereClause = !isNaN(numericId) ? { id: numericId } : { orderRef: id };

    const order = await prisma.order.update({
      where: whereClause,
      data: { status },
    });

    // Send email notification to customer when status changes
    try {
      await sendOrderStatusUpdateEmail(
        {
          orderRef: order.orderRef,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          phone: order.phone,
          address: order.address,
          city: order.city,
          paymentMethod: order.paymentMethod,
          total: order.total,
          items: order.items,
        },
        order.status
      );
    } catch (emailErr) {
      console.error('Error sending order status update email:', emailErr);
    }

    return NextResponse.json(order);
  } catch (err: any) {
    console.error('Error updating order status:', err);
    return NextResponse.json({ error: err.message || 'Failed to update order' }, { status: 500 });
  }
}
