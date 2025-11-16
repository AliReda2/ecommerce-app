import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getCurrentUser(user: User) {
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        address: true,
        coordinates: true,
        phone: true,
      },
    });

    if (!dbUser) {
      throw new NotFoundException('User not found');
    }

    return {
      data: { ...dbUser, fullName: `${dbUser.firstName} ${dbUser.lastName}` },
      msg: 'User fetched successfully',
    };
  }

  async updateCurrentUser(userId: string, data: UpdateUserDto) {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.firstName && { firstName: data.firstName }),
        ...(data.lastName && { lastName: data.lastName }),
        ...(data.address && { address: data.address }),
        ...(data.phone && { phone: data.phone }),
        ...(data.coordinates && { coordinates: data.coordinates }),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        address: true,
        phone: true,
        coordinates: true,
      },
    });

    return {
      data: {
        ...updatedUser,
        fullName: `${updatedUser.firstName} ${updatedUser.lastName}`,
      },
      msg: 'User updated successfully',
    };
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        isActive: true,
        isVerified: true,
      },
    });

    if (users.length === 0) {
      throw new NotFoundException('No users found');
    }

    const data = users.map((u) => ({
      ...u,
      fullName: `${u.firstName} ${u.lastName}`,
    }));

    return {
      data,
      msg: 'Users fetched successfully',
    };
  }

  async banUser(userId: string) {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { isActive: false },
      });

      return {
        data: user,
        msg: 'User banned successfully',
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  async unbanUser(userId: string) {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { isActive: true },
      });

      return {
        data: user,
        msg: 'User unbanned successfully',
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createUser(data: CreateUserDto) {
    return this.prisma.user.create({
      data,
    });
  }

  async deleteUser(userId: string) {
    try {
      // Delete email verification records associated with the user
      await this.prisma.emailVerification.deleteMany({
        where: { userId },
      });
      // Delete Cart records associated with the user
      await this.prisma.cartItem.deleteMany({
        where: { userId },
      });

      // Delete Orders associated with the user
      await this.prisma.order.deleteMany({
        where: { userId },
      });
      // Delete Reviews associated with the user
      await this.prisma.review.deleteMany({
        where: { userId },
      });
      // Delete Wishlists associated with the user
      await this.prisma.wishlist.deleteMany({
        where: { userId },
      });

      // Now delete the user
      await this.prisma.user.delete({
        where: { id: userId },
      });

      return { message: 'User deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}
