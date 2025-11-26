import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ToggleWishlistDto } from './dto/toggle-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async getWishlist(user: User) {
    const wishList = await this.prisma.wishlist.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        userId: true,
        productId: true,
        createdAt: true,
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
            imageUrl: true,
            categoryId: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: wishList,
      msg: 'Wishlist fetched successfully',
    };
  }

  async clearWishlist(user: User) {
    await this.prisma.wishlist.deleteMany({
      where: { userId: user.id },
    });
    return {
      data: null,
      msg: 'Wishlist cleared successfully',
    };
  }

  async addToWishlist(user: User, productId: string) {
    const exists = await this.prisma.wishlist.findFirst({
      where: { userId: user.id, productId },
    });

    if (exists) {
      return { data: exists, msg: 'Product already in wishlist' };
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const wishlistItem = await this.prisma.wishlist.create({
      data: { userId: user.id, productId },
      select: {
        id: true,
        userId: true,
        productId: true,
        product: {
          select: {
            name: true,
            price: true,
            description: true,
            imageUrl: true,
            categoryId: true,
            category: {
              select: { name: true },
            },
          },
        },
      },
    });

    return {
      data: wishlistItem, // ✔ Return the complete wishlist item
      msg: 'Product added to wishlist successfully',
    };
  }

  async removeFromWishlist(user: User, wishlistId: string) {
    const deleted = await this.prisma.wishlist.deleteMany({
      where: { id: wishlistId, userId: user.id },
    });

    if (deleted.count === 0) {
      throw new NotFoundException('Wishlist item not found');
    }

    return { data: null, msg: 'Product removed from wishlist successfully' };
  }

  async toggle(userId: string, data: { productId: string }) {
    const { productId } = data;

    // Check if item already exists
    const existing = await this.prisma.wishlist.findFirst({
      where: { userId, productId },
    });

    // Remove if exists
    if (existing) {
      await this.prisma.wishlist.delete({
        where: { id: existing.id },
      });

      return {
        status: 'removed',
        item: existing, // return removed item so frontend can update state
      };
    }

    // Otherwise add
    const created = await this.prisma.wishlist.create({
      data: { userId, productId },
      include: { product: true },
    });

    return {
      status: 'added',
      item: created,
    };
  }
}
