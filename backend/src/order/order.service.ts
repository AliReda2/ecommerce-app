import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartItem, OrderStatus } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: string) {
    // 1. Fetch user and validate address & coordinates
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.address == null || user.coordinates == null) {
      throw new BadRequestException(
        'User must have a valid address and coordinates',
      );
    }

    // 2. Fetch cart items
    const cartItems: CartItem[] = await this.prisma.cartItem.findMany({
      where: { userId },
    });

    if (!cartItems.length) {
      throw new BadRequestException('Cart is empty');
    }

    // 3. Create order and order items atomically
    const order = await this.prisma.$transaction(async (tx) => {
      const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.productPrice * item.quantity,
        0,
      );

      const newOrder = await tx.order.create({
        data: {
          userId,
          totalPrice,
          status: OrderStatus.PENDING,
        },
      });

      const orderItems = await Promise.all(
        cartItems.map((item) =>
          tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.productPrice * item.quantity,
            },
          }),
        ),
      );

      await tx.cartItem.deleteMany({ where: { userId } });

      return { ...newOrder, orderItems };
    });

    return {
      data: order,
      msg: 'Order created successfully',
    };
  }

  async cancelOrder(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });

    return {
      msg: 'Order cancelled successfully',
    };
  }

  async getUserOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      select: {
        id: true,
        totalPrice: true,
        status: true,
        createdAt: true,
        orderItems: {
          select: {
            id: true,
            quantity: true,
            price: true,
            product: {
              select: {
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (orders.length === 0) {
      throw new NotFoundException('No orders found');
    }

    return {
      data: orders,
      msg: 'Orders fetched successfully',
    };
  }

  async getOrderById(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return {
      data: order,
      msg: 'Order fetched successfully',
    };
  }

  async getAllOrders() {
    const orders = await this.prisma.order.findMany({
      include: { orderItems: true },
      orderBy: { createdAt: 'desc' },
    });

    if (orders.length === 0) {
      throw new NotFoundException('No orders found');
    }

    return {
      data: orders,
      msg: 'All orders fetched successfully',
    };
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    try {
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status },
      });

      return {
        msg: 'Order status updated successfully',
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Order not found');
      }
      throw error;
    }
  }
}
