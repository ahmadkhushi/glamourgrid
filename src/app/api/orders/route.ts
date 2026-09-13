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

    // Safely embed customerEmail inside items JSON array so it persists in DB without requiring schema changes
    const processedItems = Array.isArray(items)
      ? items.map((item: any) => ({
          ...item,
          customerEmail: customerEmail || item.customerEmail || undefined,
        }))
      : items;

    // STEP 1: Database Insertion (Prisma/TiDB) happens FIRST
    let order: any;
    try {
      order = await prisma.order.create({
        data: {
          orderRef,
          customerName,
          phone,
          address,
          city,
          paymentMethod: paymentMethod || 'cod',
          total: parseFloat(total),
          items: processedItems,
          status: 'PLACED',
        },
      });
    } catch (dbErr: any) {
      console.error('Database insertion error creating order:', dbErr);
      return NextResponse.json({ error: dbErr.message || 'Database error creating order' }, { status: 500 });
    }

    // STEP 2: Email Sending in isolated try/catch — MUST be awaited on Vercel serverless runtime
    try {
      const emailPayload = {
        orderRef: order.orderRef,
        customerName: order.customerName,
        customerEmail: customerEmail || (Array.isArray(order.items) && (order.items as any)[0]?.customerEmail),
        phone: order.phone,
        address: order.address,
        city: order.city,
        paymentMethod: order.paymentMethod,
        total: order.total,
        items: order.items,
      };

      console.log('Initiating email notifications for orderRef:', order.orderRef, 'Target Customer Email:', emailPayload.customerEmail);

      const emailResults = await Promise.allSettled([
        sendOrderConfirmationEmail(emailPayload),
        sendAdminNewOrderNotification(emailPayload),
      ]);

      console.log('Email settlement results:', JSON.stringify(emailResults, null, 2));
    } catch (emailErr) {
      console.error('Nodemailer Error in order route:', emailErr);
    }

    // STEP 3: Return success response so order is placed and displayed in Admin Dashboard
    return NextResponse.json({ success: true, orderRef: order.orderRef, order }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating order:', err);
    return NextResponse.json({ error: err.message || 'Order creation failed' }, { status: 500 });
  }
}
