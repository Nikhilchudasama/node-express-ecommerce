require('dotenv').config({ path: `${process.cwd()}/.env` });

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

function toSlug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function main() {
  const adminPasswordHash = await bcrypt.hash('Admin@1234', 10);

  let admin = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  });

  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        passwordHash: adminPasswordHash,
        name: 'Admin User',
        role: 'ADMIN',
      },
    });
  }

  const existingCart = await prisma.cart.findUnique({
    where: { userId: admin.id },
  });

  if (!existingCart) {
    await prisma.cart.create({
      data: { userId: admin.id },
    });
  }

  const generalCategory =
    (await prisma.category.findUnique({
      where: { name: 'General' },
    })) ||
    (await prisma.category.create({
      data: {
        name: 'General',
        slug: 'general',
        description: 'Default development category',
      },
    }));

  const electronicsCategory =
    (await prisma.category.findUnique({
      where: { name: 'Electronics' },
    })) ||
    (await prisma.category.create({
      data: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Devices and accessories',
      },
    }));

  const existingProduct = await prisma.product.findUnique({
    where: { id: 1 },
  });

  if (!existingProduct) {
    await prisma.product.create({
      data: {
        name: 'Sample Product',
        slug: 'sample-product',
        description: 'Starter product for development',
        price: '99.99',
        imageUrl: 'https://example.com/sample-product.png',
        categoryId: generalCategory.id ?? electronicsCategory.id,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
