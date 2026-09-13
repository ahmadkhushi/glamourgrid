export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

const db = prisma as any;

// DELETE /api/reviews/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await db.review.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting review:', err);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}

// PATCH /api/reviews/[id] (Toggle approval/visibility)
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
    const body = await request.json();
    const { isApproved } = body;

    const updated = await db.review.update({
      where: { id: parseInt(id) },
      data: { isApproved: Boolean(isApproved) },
    });

    return NextResponse.json({ success: true, review: updated });
  } catch (err: any) {
    console.error('Error updating review:', err);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}
