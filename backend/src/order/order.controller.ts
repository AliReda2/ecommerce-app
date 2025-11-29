import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { AtGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { OrderService } from './order.service';
import { OrderStatus, type User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { Throttle } from '@nestjs/throttler';

@ApiBearerAuth('access-token')
@UseGuards(AtGuard, RolesGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Throttle({ authSensitive: {} })
  @Post('create')
  @ApiOperation({ summary: 'Create a new order from cart items' })
  async createOrder(@GetUser() user: User) {
    return this.orderService.createOrder(user.id);
  }

  @Throttle({ apiBurst: {} })
  @Get('me')
  @ApiOperation({ summary: 'Get all of my orders' })
  async getUserOrders(@GetUser() user: User) {
    return this.orderService.getUserOrders(user.id);
  }

  @Throttle({ apiBurst: {} })
  @Get(':id')
  @ApiOperation({ summary: 'Get order details by ID' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  async getOrderById(@GetUser() user: User, @Param('id') id: string) {
    return this.orderService.getOrderById(id, user.id);
  }

  @Throttle({ apiBurst: {} })
  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a pending order (for user)' })
  async cancelOrder(@GetUser() user: User, @Param('id') id: string) {
    return this.orderService.cancelOrder(id, user.id);
  }

  // ---------- ADMIN ROUTES ----------

  @Roles('ADMIN', 'SUPERADMIN')
  @Get()
  @ApiOperation({ summary: 'Get all orders (admin only)' })
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Roles('ADMIN', 'SUPERADMIN')
  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status (admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: Object.values(OrderStatus) },
      },
      required: ['status'],
    },
  })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.orderService.updateOrderStatus(id, status);
  }
}
