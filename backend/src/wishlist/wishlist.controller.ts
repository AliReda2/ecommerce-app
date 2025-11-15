import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import type { User } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';

@ApiTags('Wishlist')
@ApiBearerAuth('access-token')
@UseGuards(AtGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'Get user wishlist' })
  async getWishlist(@GetUser() user: User) {
    return this.wishlistService.getWishlist(user);
  }

  @Post(':productId')
  @ApiOperation({ summary: 'Add a product to wishlist' })
  async addToWishlist(
    @GetUser() user: User,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.addToWishlist(user, productId);
  }

  @Delete(':wishlistId')
  @ApiOperation({ summary: 'Remove a wishlist item by ID' })
  async removeFromWishlist(
    @GetUser() user: User,
    @Param('wishlistId') wishlistId: string,
  ) {
    return this.wishlistService.removeFromWishlist(user, wishlistId);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear all items from wishlist' })
  async clearWishlist(@GetUser() user: User) {
    return this.wishlistService.clearWishlist(user);
  }
}
