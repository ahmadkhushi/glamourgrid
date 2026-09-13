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
  console.log('=== POST /api/orders TRIGGERED ===');
  try {
    const body = await request.json();
    console.log('Order request payload:', JSON.stringify(body));

    const customerName = body.customerName || body.name;
    const customerEmail = body.customerEmail || body.email || null;
    const { phone, address, city, paymentMethod, total, items } = body;

    if (!customerName || !phone || !address || !city || !paymentMethod || total === undefined || !items) {
      console.error('Validation failed for order creation payload');
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
      console.log('Order successfully created in DB with ID:', order.id, 'Ref:', order.orderRef);
    } catch (dbErr: any) {
      console.error('Database insertion error creating order:', dbErr);
      return NextResponse.json({ error: dbErr.message || 'Database error creating order' }, { status: 500 });
    }

    // STEP 2: BLOCKING AWAIT on Email Sending BEFORE returning NextResponse.json
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

      console.log('=== STARTING BLOCKING EMAIL DISPATCH ===');

      // Await Admin Notification Email
      try {
        console.log('Awaiting sendAdminNewOrderNotification...');
        const adminEmailSuccess = await sendAdminNewOrderNotification(emailPayload);
        console.log('Admin Email Dispatch Result:', adminEmailSuccess);
      } catch (adminErr) {
        console.error('Admin Email Error:', adminErr);
      }

      // Await Customer Confirmation Email if email provided
      if (emailPayload.customerEmail) {
        try {
          console.log('Awaiting sendOrderConfirmationEmail to:', emailPayload.customerEmail);
          const customerEmailSuccess = await sendOrderConfirmationEmail(emailPayload);
          console.log('Customer Email Dispatch Result:', customerEmailSuccess);
        } catch (custErr) {
          console.error('Customer Email Error:', custErr);
        }
      } else {
        console.log('No customer email provided in order, skipping customer confirmation email.');
      }

      console.log('=== EMAIL DISPATCH COMPLETED ===');
    } catch (emailErr) {
      console.error('Nodemailer Outer Catch Error in order route:', emailErr);
    }

    // STEP 3: Return success response AFTER emails have been awaited
    return NextResponse.json({ success: true, orderRef: order.orderRef, order }, { status: 201 });
  } catch (err: any) {
    console.error('Unhandled error in order creation API:', err);
    return NextResponse.json({ error: err.message || 'Order creation failed' }, { status: 500 });
  }
}
