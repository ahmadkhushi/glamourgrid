const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const p = await prisma.product.findUnique({
    where: { id: 24 },
    include: { category: { select: { name: true } } },
  });
  console.log('\n✅ VERIFIED PRODUCT RECORD:');
  console.log('   ID:          ', p.id);
  console.log('   Name:        ', p.name);
  console.log('   Slug:        ', p.slug);
  console.log('   Brand:       ', p.brand);
  console.log('   Price:       ', 'Rs.', p.price);
  console.log('   imageUrl:    ', p.imageUrl);
  console.log('   Category:    ', p.category?.name);
  console.log('   isActive:    ', p.isActive);
  console.log('   Colors:      ', JSON.stringify(p.colors));
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e.message); prisma.$disconnect(); });
