export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const sale = searchParams.get('sale') === 'true';
  const limit = parseInt(searchParams.get('limit') || '50');

  const where: Record<string, unknown> = { isActive: true };
  if (category) where.category = { slug: category };
  if (sale) where.isSale = true;

  try {
    const products = await prisma.product.findMany({
      where,
      include: {
        category: { select: { name: true, slug: true } },
        reviews: { where: { isApproved: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch {
    return NextResponse.json([], {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { categorySlug, ...productData } = body;

    let categoryId: number | null = null;

    if (categorySlug) {
      // Find or create the category
      let cat = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (!cat) {
        const name = categorySlug
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c: string) => c.toUpperCase());
        cat = await prisma.category.create({
          data: { name, slug: categorySlug },
        });
      }
      categoryId = cat.id;
    }

    const product = await prisma.product.create({
      data: {
        name: productData.name,
        slug: productData.slug,
        description: productData.description ?? null,
        price: productData.price,
        salePrice: productData.salePrice ?? null,
        imageUrl: productData.imageUrl ?? null,
        videoUrl: productData.videoUrl ?? null,
        brand: productData.brand ?? null,
        stock: productData.stock ?? 100,
        isActive: productData.isActive ?? true,
        isNewArrival: productData.isNewArrival ?? false,
        isBestSeller: productData.isBestSeller ?? false,
        isSale: productData.isSale ?? false,
        ...(categoryId ? { categoryId } : {}),
      },
    });

    // On-Demand Revalidation across all affected pages
    try {
      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath('/admin');
      revalidatePath('/admin/products');
      revalidatePath('/shop');
      if (product.slug) {
        revalidatePath(`/products/${product.slug}`);
        revalidatePath(`/product/${product.slug}`);
      }
    } catch (revErr) {
      console.error('Revalidation error on product creation:', revErr);
    }

    return NextResponse.json(product, {
      status: 201,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (err: any) {
    const msg = err?.message ?? 'Server error';
    if (msg.includes('Unique constraint')) {
      return NextResponse.json({ error: 'Slug already exists. Use a different slug.' }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
