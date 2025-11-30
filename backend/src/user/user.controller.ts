import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AtGuard } from 'src/auth/guard';
import { GetUser } from '../auth/decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';
import type { User } from '@prisma/client';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@ApiBearerAuth('access-token')
@UseGuards(AtGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Throttle({ apiBurst: {} })
  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  async getMe(@GetUser() user: User) {
    return this.userService.getCurrentUser(user);
  }

  @Throttle({ apiBurst: {} })
  @Patch('me')
  @ApiOperation({ summary: 'Update current user' })
  async updateMe(@GetUser('id') userId: string, @Body() data: UpdateUserDto) {
    return this.userService.updateCurrentUser(userId, data);
  }

  @SkipThrottle()
  @Roles('ADMIN', 'SUPERADMIN')
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @SkipThrottle()
  @Roles('SUPERADMIN')
  @Get('ban/:userId')
  @ApiOperation({ summary: 'Ban a user' })
  async banUser(@Param('userId') userId: string) {
    return this.userService.banUser(userId);
  }

  @SkipThrottle()
  @Roles('SUPERADMIN')
  @Get('unban/:userId')
  @ApiOperation({ summary: 'Unban a user' })
  async unbanUser(@Param('userId') userId: string) {
    return this.userService.unbanUser(userId);
  }

  @SkipThrottle()
  @Roles('SUPERADMIN')
  @Delete(':userId')
  @ApiOperation({ summary: 'Delete a user' })
  async deleteUser(@Param('userId') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
