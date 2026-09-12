import { NextRequest, NextResponse } from 'next/server';
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
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json([]);
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
    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    const msg = err?.message ?? 'Server error';
    if (msg.includes('Unique constraint')) {
      return NextResponse.json({ error: 'Slug already exists. Use a different slug.' }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
