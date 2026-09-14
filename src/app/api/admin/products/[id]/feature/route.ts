export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    
    // Find current product
    const current = await prisma.product.findUnique({
      where: { id: numericId },
      select: { id: true, name: true, slug: true, isFeatured: true },
    });

    if (!current) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // If isFeatured explicitly provided in body, set it; otherwise toggle
    const newFeaturedState =
      typeof body.isFeatured === 'boolean' ? body.isFeatured : !current.isFeatured;

    const updated = await prisma.product.update({
      where: { id: numericId },
      data: { isFeatured: newFeaturedState },
    });

    // Revalidate paths affected by featured products
    try {
      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath('/admin');
      revalidatePath('/admin/products');
      revalidatePath('/shop');
    } catch (revErr) {
      console.error('Revalidation error on feature toggle:', revErr);
    }

    return NextResponse.json({
      success: true,
      id: updated.id,
      name: updated.name,
      isFeatured: updated.isFeatured,
      message: updated.isFeatured
        ? '✓ Added to Side-Scroll'
        : '✓ Removed from Side-Scroll',
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error: any) {
    console.error('Error toggling featured product state:', error);
    return NextResponse.json(
      { error: 'Failed to update featured state', details: error?.message },
      { status: 500 }
    );
  }
}
