import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AtGuard } from 'src/auth/guard';
import { GetUser } from '../auth/decorator';
import { ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';
import type { User } from '@prisma/client';

@UseGuards(AtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  async getMe(@GetUser() user: User) {
    return this.userService.getCurrentUser(user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('ban/:userId')
  @ApiOperation({ summary: 'Ban a user' })
  async banUser(@Param('userId') userId: string) {
    return this.userService.banUser(userId);
  }

  @Get('unban/:userId')
  @ApiOperation({ summary: 'Unban a user' })
  async unbanUser(@Param('userId') userId: string) {
    return this.userService.unbanUser(userId);
  }
}
