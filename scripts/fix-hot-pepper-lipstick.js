const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Fix product ID 24: correct name + point to the local public image
  const updated = await prisma.product.update({
    where: { id: 24 },
    data: {
      name: 'Hannaier Hot Pepper Stunning Kiss Lipstick',
      slug: 'hot-pepper-lipstick',
      imageUrl: '/hot-pepper-lipstick.jpg',
      brand: 'Hannaier',
      description: 'Bold colour, smooth texture, all-day wear. Rich pigment formula with moisturising ingredients. Available in 4 stunning shades: Red Charm, Rose Blush, Berry Love & Nude Vibe.',
      isActive: true,
    },
  });
  console.log('Updated:', JSON.stringify(updated, null, 2));
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e.message); prisma.$disconnect(); });
