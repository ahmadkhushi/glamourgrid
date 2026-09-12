const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, slug: true, imageUrl: true },
    orderBy: { id: 'desc' },
    take: 30,
  });
  console.log(JSON.stringify(products, null, 2));
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e.message); prisma.$disconnect(); });
