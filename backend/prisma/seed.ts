import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import * as argon from 'argon2';

async function main() {
  // Create Users
  await Promise.all([
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

 await Promise.all([
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
