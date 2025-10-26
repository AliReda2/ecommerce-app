import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AtGuard } from 'src/auth/guard';
import { GetUser } from '../auth/decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';
import type { User } from '@prisma/client';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';

@ApiBearerAuth('access-token')
@UseGuards(AtGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  async getMe(@GetUser() user: User) {
    return this.userService.getCurrentUser(user);
  }

  @Roles('ADMIN')
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Roles('ADMIN')
  @Get('ban/:userId')
  @ApiOperation({ summary: 'Ban a user' })
  async banUser(@Param('userId') userId: string) {
    return this.userService.banUser(userId);
  }

  @Roles('ADMIN')
  @Get('unban/:userId')
  @ApiOperation({ summary: 'Unban a user' })
  async unbanUser(@Param('userId') userId: string) {
    return this.userService.unbanUser(userId);
  }
}
