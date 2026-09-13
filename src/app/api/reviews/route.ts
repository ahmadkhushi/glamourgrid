export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

const db = prisma as any;

// GET /api/reviews?productId=123
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const all = searchParams.get('all') === 'true';

    const session = await getSession();
    const isAdmin = session?.role === 'ADMIN';

    const where: any = {};
    if (productId) {
      where.productId = parseInt(productId);
    }
    if (!all && !isAdmin) {
      where.isApproved = true;
    }

    const reviews = await db.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { id: true, name: true, slug: true, imageUrl: true } },
      },
    });

    return NextResponse.json(reviews);
  } catch (err: any) {
    console.error('Error fetching reviews:', err);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST /api/reviews
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, authorName, rating, comment } = body;

    if (!productId || !authorName || !rating || !comment) {
      return NextResponse.json({ error: 'All fields (name, rating, comment) are required.' }, { status: 400 });
    }

    const numericRating = Math.min(5, Math.max(1, parseInt(rating)));

    const review = await db.review.create({
      data: {
        productId: parseInt(productId),
        authorName: String(authorName).trim(),
        rating: numericRating,
        comment: String(comment).trim(),
        isApproved: true, // auto-approve customer reviews
      },
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating review:', err);
    return NextResponse.json({ error: 'Failed to post review' }, { status: 500 });
  }
}
