import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { customerName, phone, address, city, paymentMethod, total, items } = body;

  if (!customerName || !phone || !address || !city || !paymentMethod || !total || !items) {
    return NextResponse.json({ error: 'Saari details zaruri hain.' }, { status: 400 });
  }

  const orderRef = `GG-${Date.now()}`;

  const order = await prisma.order.create({
    data: {
      orderRef,
      customerName,
      phone,
      address,
      city,
      paymentMethod,
      total,
      items,
      status: 'PLACED',
    },
  });

  return NextResponse.json({ success: true, orderRef: order.orderRef }, { status: 201 });
}
