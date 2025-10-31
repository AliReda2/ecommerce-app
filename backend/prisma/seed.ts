import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import * as argon from 'argon2';

async function main() {
  // Create Users
  const [user1, user2] = await Promise.all([
    prisma.user.upsert({
      where: {
        email: 'admin@example.com',
      },
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
      where: {
        email: 'customer@example.com',
      },
      update: {},
      create: {
        firstName: 'Customer',
        lastName: 'User',
        email: 'customer@example.com',
        password: await argon.hash('12345678'),
      },
    }),
  ]);

  // Create Categories
  const [category1, category2] = await Promise.all([
    prisma.category.upsert({
      where: {
        name: 'Electronics',
      },
      update: {},
      create: { name: 'Electronics' },
    }),
    prisma.category.upsert({
      where: {
        name: 'Books',
      },
      update: {},
      create: { name: 'Books' },
    }),
  ]);

  // Create Products
  await Promise.all([
    prisma.product.upsert({
      where: {
        name: 'Smartphone',
      },
      update: {},
      create: {
        name: 'Smartphone',
        description: 'A high-end smartphone with a great camera.',
        price: 699.99,
        categoryId: category1.id,
      },
    }),
    prisma.product.upsert({
      where: {
        name: 'Phone Charger',
      },
      update: {},
      create: {
        name: 'Phone Charger',
        description: 'A fast-charging USB-C phone charger.',
        price: 29.99,
        categoryId: category1.id,
      },
    }),
    prisma.product.upsert({
      where: {
        name: 'Science Fiction Novel',
      },
      update: {},
      create: {
        name: 'Science Fiction Novel',
        description: 'An exciting science fiction novel set in space.',
        price: 19.99,
        categoryId: category2.id,
      },
    }),
  ]);
}

main()
  .then(() => {
    console.log('Seed successful');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect().then(() => process.exit(1));
  });
