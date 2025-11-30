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
        isVerified: true,
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
        isVerified: true,
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

  // Categories to insert with image URLs
  const categories = [
    {
      name: 'Car Accessories',
      imageUrl:
        'https://jeobmgaazjoevrncujqn.storage.supabase.co/storage/v1/object/public/products/products/car%20accessories-Photoroom.webp',
    },
    {
      name: 'Phone Accessories',
      imageUrl:
        'https://jeobmgaazjoevrncujqn.storage.supabase.co/storage/v1/object/public/products/products/electronics-Photoroom.webp',
    },
    {
      name: 'Phone Cases',
      imageUrl:
        'https://jeobmgaazjoevrncujqn.storage.supabase.co/storage/v1/object/public/products/products/phone%20cases-Photoroom.webp',
    },
    {
      name: 'Watches',
      imageUrl:
        'https://jeobmgaazjoevrncujqn.storage.supabase.co/storage/v1/object/public/products/products/smart%20watches-Photoroom.webp',
    },
    {
      name: 'Chargers',
      imageUrl:
        'https://jeobmgaazjoevrncujqn.storage.supabase.co/storage/v1/object/public/products/products/phone%20charger-Photoroom.webp',
    },
  ];

  const categoryRecords: Record<string, string> = {}; // id is string

  for (const { name, imageUrl } of categories) {
    const category = await prisma.category.upsert({
      where: { name },
      update: { imageUrl },
      create: { name, imageUrl },
    });
    categoryRecords[name] = category.id; // now matches string type
  }

  // Products to insert (2 per category)
  const products = [
    {
      category: 'Car Accessories',
      items: [
        {
          name: 'Car Air Freshener',
          price: 5.99,
          imageUrl:
            'https://jeobmgaazjoevrncujqn.storage.supabase.co/storage/v1/object/public/products/products/WhatsApp Image 2025-11-30 at 18.14.19_ff4bf708.png',
        },
        {
          name: 'Car Phone Holder',
          price: 12.99,
          imageUrl:
            'https://jeobmgaazjoevrncujqn.storage.supabase.co/storage/v1/object/public/products/products/pngtree-mobile-phone-holder-smart-device-convenient-adjustment-and-portability-png-image_4006204.png',
        },
      ],
    },
    {
      category: 'Phone Accessories',
      items: [
        {
          name: 'Screen Protector',
          price: 7.99,
          imageUrl:
            'https://jeobmgaazjoevrncujqn.storage.supabase.co/storage/v1/object/public/products/products/WhatsApp Image 2025-11-30 at 18.19.49_c90b0058.png',
        },
        {
          name: 'Bluetooth Earbuds',
          price: 19.99,
          imageUrl:
            'https://jeobmgaazjoevrncujqn.storage.supabase.co/storage/v1/object/public/products/products/pngtree-wireless-bluetooth-headphones-with-transparent-background-png-image_14789479.png',
        },
      ],
    },
    {
      category: 'Phone Cases',
      items: [
        {
          name: 'Silicone Case',
          price: 9.99,
          imageUrl:
            'https://jeobmgaazjoevrncujqn.storage.supabase.co/storage/v1/object/public/products/products/pngtree-pure-color-silicone-phone-case-for-iphone-soft-and-durable-cover-png-image_15880662.png',
        },
        {
          name: 'Shockproof Case',
          price: 14.99,
          imageUrl:
            'https://jeobmgaazjoevrncujqn.storage.supabase.co/storage/v1/object/public/products/products/WhatsApp Image 2025-11-30 at 18.27.24_bf1e83e5.png',
        },
      ],
    },
    {
      category: 'Watches',
      items: [
        {
          name: 'Digital Watch',
          price: 29.99,
          imageUrl:
            'https://jeobmgaazjoevrncujqn.storage.supabase.co/storage/v1/object/public/products/products/black-resourcesforbitches-square-black-casio-digital-watch.png',
        },
        {
          name: 'Smartwatch Classic',
          price: 89.99,
          imageUrl:
            'https://jeobmgaazjoevrncujqn.storage.supabase.co/storage/v1/object/public/products/products/smartwatch-apple-watch-wearable-technology-watch.png',
        },
      ],
    },
    {
      category: 'Chargers',
      items: [
        {
          name: 'Fast Charger 20W',
          price: 15.99,
          imageUrl:
            'https://jeobmgaazjoevrncujqn.storage.supabase.co/storage/v1/object/public/products/products/acefast-a119-pd45w-gan-usbc-charger-eu.webp',
        },
        {
          name: 'Wireless Charger',
          price: 25.99,
          imageUrl:
            'https://jeobmgaazjoevrncujqn.storage.supabase.co/storage/v1/object/public/products/products/WhatsApp Image 2025-11-30 at 18.36.13_ad36c259.png',
        },
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
          imageUrl: product.imageUrl,
          categoryId,
        },
      });
    }
  }

  const slides = [
    {
      title: 'Power Up Your Devices',
      subtitle: 'Premium Tech',
      description:
        'Premium tech accessories for your daily needs. Quality products designed to power up your devices.',
      buttonText: 'Shop Now',
      imageUrl:
        'https://jeobmgaazjoevrncujqn.storage.supabase.co/storage/v1/object/public/products/products/powerbank.webp',
      imageAlt: 'Powerbank',
      backgroundColor: 'bg-blue-100',
      order: 1,
      isActive: true,
    },
    {
      title: 'Premium Tech Accessories',
      subtitle: 'Wireless Audio',
      description:
        'Premium tech accessories for your daily needs. Quality products designed to power up your devices.',
      buttonText: 'Shop Collection',
      imageUrl:
        'https://jeobmgaazjoevrncujqn.storage.supabase.co/storage/v1/object/public/products/products/headset.webp',
      imageAlt: 'Headset',
      backgroundColor: 'bg-blue-100',
      order: 2,
      isActive: true,
    },
    {
      title: 'Essential Tech Solutions',
      subtitle: 'Fast Charging',
      description:
        'Premium tech accessories for your daily needs. Quality products designed to power up your devices.',
      buttonText: 'Shop Collection',
      imageUrl:
        'https://jeobmgaazjoevrncujqn.storage.supabase.co/storage/v1/object/public/products/products/wireless.webp',
      imageAlt: 'Airpods',
      backgroundColor: 'bg-blue-100',
      order: 3,
      isActive: true,
    },
    {
      title: 'Wireless Audio',
      subtitle: '20% off',
      description: null,
      buttonText: 'Shop Collection',
      imageUrl:
        'https://jeobmgaazjoevrncujqn.storage.supabase.co/storage/v1/object/public/products/products/headset.webp',
      imageAlt: 'Headset',
      backgroundColor: 'bg-green-100',
      order: 4,
      isActive: true,
    },
    {
      title: 'Power & Charging',
      subtitle: '20% off',
      description: null,
      buttonText: 'Shop Collection',
      imageUrl:
        'https://jeobmgaazjoevrncujqn.storage.supabase.co/storage/v1/object/public/products/products/wireless.webp',
      imageAlt: 'Wireless',
      backgroundColor: 'bg-orange-100',
      order: 5,
      isActive: true,
    },
  ];

  for (const slide of slides) {
    await prisma.heroSlide.create({
      data: slide,
    });
  }

  console.log('Seed successful');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect().then(() => process.exit(1));
  });
