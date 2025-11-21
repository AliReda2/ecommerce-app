import * as argon from 'argon2';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  await Promise.all([
    prisma.user.upsert({
      where: { email: 'superAdmin@example.com' },
      update: {},
      create: {
        firstName: 'superAdmin',
        lastName: 'User',
        email: 'superAdmin@example.com',
        password: await argon.hash('12345678'),
        role: 'SUPERADMIN',
      },
    }),
    prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: await argon.hash('12345678'),
        role: 'ADMIN',
      },
    }),
    prisma.user.upsert({
      where: { email: 'customer@example.com' },
      update: {},
      create: {
        firstName: 'Customer',
        lastName: 'User',
        email: 'customer@example.com',
        password: await argon.hash('12345678'),
      },
    }),
  ]);

  // Categories to insert
  const categories = [
    'Car Accessories',
    'Phone Accessories',
    'Phone Cases',
    'Watches',
    'Chargers',
    'Headphones',
  ];

  const categoryRecords = {};

  // Seed Categories
  for (const name of categories) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categoryRecords[name] = category.id;
  }

  // Products to insert (2 per category)
  const products = [
    {
      category: 'Car Accessories',
      items: [
        { name: 'Car Air Freshener', price: 5.99 },
        { name: 'Car Phone Holder', price: 12.99 },
      ],
    },
    {
      category: 'Phone Accessories',
      items: [
        { name: 'Screen Protector', price: 7.99 },
        { name: 'Bluetooth Earbuds', price: 19.99 },
      ],
    },
    {
      category: 'Phone Cases',
      items: [
        { name: 'Silicone Case', price: 9.99 },
        { name: 'Shockproof Case', price: 14.99 },
      ],
    },
    {
      category: 'Watches',
      items: [
        { name: 'Digital Watch', price: 29.99 },
        { name: 'Smartwatch Classic', price: 89.99 },
      ],
    },
    {
      category: 'Chargers',
      items: [
        { name: 'Fast Charger 20W', price: 15.99 },
        { name: 'Wireless Charger', price: 25.99 },
      ],
    },
    {
      category: 'Headphones',
      items: [
        { name: 'Wired Headphones', price: 11.99 },
        { name: 'Noise Cancelling Headset', price: 49.99 },
      ],
    },
  ];

  // Seed Products
  for (const group of products) {
    const categoryId = categoryRecords[group.category];

    for (const product of group.items) {
      await prisma.product.upsert({
        where: { name: product.name },
        update: {},
        create: {
          name: product.name,
          price: product.price,
          stock: 50,
          description: `${product.name} description`,
          categoryId,
        },
      });
    }
  }

  console.log('Seed successful');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect().then(() => process.exit(1));
  });
