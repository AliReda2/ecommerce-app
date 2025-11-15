import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AddCartDto } from './dto/add-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async clearCart(userId: string) {
    await this.prisma.cartItem.deleteMany({
      where: { userId },
    });

    return {
      msg: 'Cart cleared successfully',
    };
  }

  async getCartItems(userId: string) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      select: {
        id: true,
        quantity: true,
        productId: true,
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            imageUrl: true,
          },
        },
      },
    });

    return {
      data: cartItems,
      msg: 'Cart items fetched successfully',
    };
  }

  async addToCart(userId: string, data: AddCartDto) {
    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: { userId, productId: data.productId },
    });

    if (existingCartItem) {
      const updatedCartItem = await this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + data.quantity },
      });

      return {
        data: updatedCartItem,
        msg: 'Cart item quantity updated successfully',
      };
    }

    const product = await this.prisma.product.findUnique({
      where: { id: data.productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const newCartItem = await this.prisma.cartItem.create({
      data: {
        userId,
        productId: data.productId,
        productPrice: product.price,
        quantity: data.quantity,
      },
    });

    return {
      data: newCartItem,
      msg: 'Product added to cart successfully',
    };
  }

  async removeFromCart(userId: string, cartItemId: string) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (cartItem.userId !== userId) {
      throw new ForbiddenException('You are not allowed to remove this item');
    }

    try {
      await this.prisma.cartItem.delete({
        where: { id: cartItemId },
      });

      return {
        msg: 'Cart item removed successfully',
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Cart item not found');
      }
      throw error;
    }
  }

  async updateCartItemQuantity(
    userId: string,
    cartItemId: string,
    quantity: number,
  ) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });
    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }
    if (cartItem.userId !== userId) {
      throw new ForbiddenException('You are not allowed to update this item');
    }
    const updatedCartItem = await this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    return {
      data: updatedCartItem,
      msg: 'Cart item quantity updated successfully',
    };
  }
}
