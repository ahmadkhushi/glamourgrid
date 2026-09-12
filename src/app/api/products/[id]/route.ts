export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

const db = prisma as any;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id);

    const product = await db.product.findFirst({
      where: !isNaN(numericId)
        ? { OR: [{ id: numericId }, { slug: id }] }
        : { slug: id },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Fetch product error:', error);
    return NextResponse.json({ error: 'Failed to fetch product', details: error?.message }, { status: 500 });
  }
}


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

    const updateData: any = { ...body };
    if (updateData.price !== undefined) updateData.price = parseFloat(updateData.price);
    if (updateData.salePrice !== undefined) updateData.salePrice = updateData.salePrice ? parseFloat(updateData.salePrice) : null;
    if (updateData.stock !== undefined) updateData.stock = parseInt(updateData.stock);
    if (updateData.colors !== undefined) {
      if (typeof updateData.colors === 'string') {
        try {
          updateData.colors = JSON.parse(updateData.colors);
        } catch {}
      }
    }

    const updated = await db.product.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Failed to update product', details: error?.message }, { status: 500 });
  }
}

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
    await db.product.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete product', details: error?.message }, { status: 500 });
  }
}
