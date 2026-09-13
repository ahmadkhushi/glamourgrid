export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const db = prisma as any;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderRef, phone } = body;

    if (!orderRef || !phone) {
      return NextResponse.json(
        { error: 'Both Order ID and Phone Number are required.' },
        { status: 400 }
      );
    }

    const cleanOrderRef = String(orderRef).trim();
    const cleanPhone = String(phone).trim().replace(/\D/g, ''); // normalize phone digits

    const numericId = parseInt(cleanOrderRef);

    // Fetch all orders matching phone number digits
    const orders = await db.order.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const matchingOrder = orders.find((o: any) => {
      const oPhoneDigits = String(o.phone || '').replace(/\D/g, '');
      const phoneMatches = oPhoneDigits.endsWith(cleanPhone.slice(-7)) || cleanPhone.endsWith(oPhoneDigits.slice(-7));

      const refMatches =
        o.orderRef?.toLowerCase() === cleanOrderRef.toLowerCase() ||
        (!isNaN(numericId) && o.id === numericId);

      return refMatches && phoneMatches;
    });

    if (!matchingOrder) {
      return NextResponse.json(
        { error: 'No matching order found. Please check your Order ID and Phone Number.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        id: matchingOrder.id,
        orderRef: matchingOrder.orderRef,
        customerName: matchingOrder.customerName,
        status: matchingOrder.status,
        total: matchingOrder.total,
        paymentMethod: matchingOrder.paymentMethod,
        address: matchingOrder.address,
        city: matchingOrder.city,
        items: matchingOrder.items,
        createdAt: matchingOrder.createdAt,
        updatedAt: matchingOrder.updatedAt,
      },
    });
  } catch (err: any) {
    console.error('Error tracking order:', err);
    return NextResponse.json(
      { error: 'An error occurred while tracking your order. Please try again.' },
      { status: 500 }
    );
  }
}
