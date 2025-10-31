import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async getWishlist(user: User) {
    const products = await this.prisma.wishlist.findMany({
      where: { userId: user.id },
      include: { product: true },
    });
    return {
      data: products.map((item) => item.product),
      msg: 'Wishlist fetched successfully',
    };
  }

  async clearWishlist(user: User) {
    await this.prisma.wishlist.deleteMany({
      where: { userId: user.id },
    });
    return {
      msg: 'Wishlist cleared successfully',
    };
  }

  async addToWishlist(user: User, productId: string) {
    const wishlistItem = await this.prisma.wishlist.create({
      data: { userId: user.id, productId },
      include: { product: true },
    });
    return {
      data: wishlistItem.product,
      msg: 'Product added to wishlist successfully',
    };
  }
  async removeFromWishlist(user: User, productId: string) {
    await this.prisma.wishlist.deleteMany({
      where: { userId: user.id, productId },
    });
    return {
      msg: 'Product removed from wishlist successfully',
    };
  }
}
