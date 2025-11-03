import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { GetUser } from 'src/auth/decorator';
import type { User } from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AddCartDto } from './dto/add-cart.dto';
import { RemoveCartDto } from './dto/remove-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AtGuard } from 'src/auth/guard';

@Controller('cart')
@ApiBearerAuth('access-token')
@UseGuards(AtGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get cart items' })
  async getCartItems(@GetUser() user: User) {
    return this.cartService.getCartItems(user.id);
  }
  @Delete('clear')
  @ApiOperation({ summary: 'Clear cart' })
  async clearCart(@GetUser() user: User) {
    return this.cartService.clearCart(user.id);
  }

  @Post('add')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiBody({
    type: AddCartDto,
    required: true,
    description: 'Data for adding an item to the cart',
  })
  async addToCart(@GetUser() user: User, @Body() data: AddCartDto) {
    return this.cartService.addToCart(user.id, data);
  }

  @Delete('remove')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiBody({
    type: RemoveCartDto,
    required: true,
    description: 'Data for removing an item from the cart',
  })
  async removeFromCart(@GetUser() user: User, @Body() data: RemoveCartDto) {
    return this.cartService.removeFromCart(user.id, data.cartItemId);
  }

  @Patch('update')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiBody({
    type: UpdateCartDto,
    required: true,
    description: 'Data for updating an item quantity in the cart',
  })
  async updateCartItem(@GetUser() user: User, @Body() data: UpdateCartDto) {
    return this.cartService.updateCartItemQuantity(
      user.id,
      data.cartItemId,
      data.quantity,
    );
  }
}
