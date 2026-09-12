const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Fix color swatches to match the 4 real shades shown on the product image
  const updated = await prisma.product.update({
    where: { id: 24 },
    data: {
      colors: [
        { name: 'Red Charm (#01)',   hex: '#c0152b', inStock: true  },
        { name: 'Rose Blush (#02)',  hex: '#c8576e', inStock: true  },
        { name: 'Berry Love (#03)', hex: '#8b1a5a', inStock: true  },
        { name: 'Nude Vibe (#04)',  hex: '#c4846b', inStock: true  },
      ],
      keywords: 'lipstick, hannaier, hot pepper, stunning kiss, bold colour, matte, long lasting, moisturising, red, rose, berry, nude',
    },
  });
  console.log('Color swatches & keywords updated:', updated.name);
  console.log('Colors:', JSON.stringify(updated.colors, null, 2));
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e.message); prisma.$disconnect(); });
