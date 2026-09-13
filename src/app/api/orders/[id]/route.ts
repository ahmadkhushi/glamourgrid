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
  console.log('=== PATCH /api/orders/[id] TRIGGERED ===');
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();
    const numericId = parseInt(id);

    const whereClause = !isNaN(numericId) ? { id: numericId } : { orderRef: id };

    // STEP 1: DB update MUST happen first
    const order = await prisma.order.update({
      where: whereClause,
      data: { status },
    });
    console.log('Order status updated in DB to:', status, 'for orderRef:', order.orderRef);

    // STEP 2: BLOCKING AWAIT on status update email sending BEFORE returning NextResponse.json
    try {
      const itemsList = Array.isArray(order.items) ? (order.items as any[]) : [];
      const customerEmail = itemsList.find((i) => i.customerEmail)?.customerEmail || (order as any).customerEmail || null;

      if (customerEmail) {
        console.log('=== AWAITING STATUS UPDATE EMAIL to:', customerEmail, 'Status:', order.status, '===');
        const emailResult = await sendOrderStatusUpdateEmail(
          {
            orderRef: order.orderRef,
            customerName: order.customerName,
            customerEmail,
            phone: order.phone,
            address: order.address,
            city: order.city,
            paymentMethod: order.paymentMethod,
            total: order.total,
            items: order.items,
          },
          order.status
        );
        console.log('Status Update Email Dispatch Result:', emailResult);
      } else {
        console.log('No customer email found in order items, skipping status update email.');
      }
    } catch (emailErr) {
      console.error('Error sending order status update email:', emailErr);
    }

    // STEP 3: Return updated order AFTER email sending has been awaited
    return NextResponse.json(order);
  } catch (err: any) {
    console.error('Error updating order status:', err);
    return NextResponse.json({ error: err.message || 'Failed to update order' }, { status: 500 });
  }
}
