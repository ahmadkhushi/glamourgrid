export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { sendOrderConfirmationEmail, sendAdminNewOrderNotification } from '@/lib/email';


export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (err: any) {
    console.error('Error fetching orders:', err);
    return NextResponse.json({ error: err.message || 'Database error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const customerName = body.customerName || body.name;
    const customerEmail = body.customerEmail || body.email || null;
    const { phone, address, city, paymentMethod, total, items } = body;

    if (!customerName || !phone || !address || !city || !paymentMethod || total === undefined || !items) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }


    const orderRef = body.id || `GG-${Date.now()}`;

    const order = await prisma.order.create({
      data: {
        orderRef,
        customerName,
        customerEmail,
        phone,
        address,
        city,
        paymentMethod: paymentMethod || 'cod',
        total: parseFloat(total),
        items,
        status: 'PLACED',
      },
    });

    // Send emails in try/catch to ensure order completion never fails
    try {
      const emailPayload = {
        orderRef: order.orderRef,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        phone: order.phone,
        address: order.address,
        city: order.city,
        paymentMethod: order.paymentMethod,
        total: order.total,
        items: order.items,
      };
      await Promise.allSettled([
        sendOrderConfirmationEmail(emailPayload),
        sendAdminNewOrderNotification(emailPayload),
      ]);
    } catch (emailErr) {
      console.error('Error triggering order emails:', emailErr);
    }

    return NextResponse.json({ success: true, orderRef: order.orderRef, order }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating order:', err);
    return NextResponse.json({ error: err.message || 'Order creation failed' }, { status: 500 });
  }
}
