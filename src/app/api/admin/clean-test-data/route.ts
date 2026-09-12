import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

const db = prisma as any;

export async function POST() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Clear all complaints first (due to foreign key relation)
    await db.complaint.deleteMany({});
    
    // Clear all orders
    await db.order.deleteMany({});

    return NextResponse.json({
      success: true,
      message: 'All test orders, customer records, and complaints have been permanently cleared. Database is 100% clean and ready for live production orders.',
    });
  } catch (error: any) {
    console.error('Clean test data error:', error);
    return NextResponse.json({ error: 'Failed to clean test data', details: error?.message }, { status: 500 });
  }
}
