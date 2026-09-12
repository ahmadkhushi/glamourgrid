import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const db = prisma as any;

export async function GET() {
  try {
    const complaints = await db.complaint.findMany({
      orderBy: { createdAt: 'desc' },
      include: { order: true },
    });
    return NextResponse.json(complaints);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerEmail, customerName, orderId, message } = body;

    if (!customerEmail || !message) {
      return NextResponse.json({ error: 'Customer email and message are required.' }, { status: 400 });
    }

    const complaint = await db.complaint.create({
      data: {
        customerEmail,
        customerName: customerName || null,
        orderId: orderId ? Number(orderId) : null,
        message,
        status: 'OPEN',
      },
    });

    return NextResponse.json({ success: true, complaint });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
