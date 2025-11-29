import { Controller, Get, Post, Delete, UseGuards, Body } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import type { User } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { ToggleWishlistDto } from './dto/toggle-wishlist.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Wishlist')
@ApiBearerAuth('access-token')
@UseGuards(AtGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Throttle({ apiBurst: {} })
  @Get()
  @ApiOperation({ summary: 'Get user wishlist' })
  async getWishlist(@GetUser() user: User) {
    return this.wishlistService.getWishlist(user);
  }

  @Throttle({ apiBurst: {} })
  @Delete()
  @ApiOperation({ summary: 'Clear all items from wishlist' })
  async clearWishlist(@GetUser() user: User) {
    return this.wishlistService.clearWishlist(user);
  }

  @Throttle({ apiBurst: {} })
  @Post('toggle')
  async toggleWishlist(@GetUser() user: User, @Body() data: ToggleWishlistDto) {
    return this.wishlistService.toggle(user.id, data);
  }
}
