"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const argon = __importStar(require("argon2"));
async function main() {
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
//# sourceMappingURL=seed.js.map