import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const db = prisma as any;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const complaintId = Number(id);
    const body = await request.json();
    const { status } = body;

    if (!['OPEN', 'RESOLVED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid complaint status' }, { status: 400 });
    }

    const updated = await db.complaint.update({
      where: { id: complaintId },
      data: { status },
    });

    return NextResponse.json({ success: true, complaint: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
