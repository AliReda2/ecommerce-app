import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

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
        createdAt: true,
        updatedAt: true,
        isActive: true,
      },
    });

    if (!dbUser) {
      return { data: null, msg: 'User not found' };
    }

    return {
      data: { ...dbUser, fullName: `${dbUser.firstName} ${dbUser.lastName}` },
      msg: 'User fetched successfully',
    };
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      where: {
        role: 'CUSTOMER',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        isActive: true,
      },
    });

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
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    return {
      data: user,
      msg: 'User banned successfully',
    };
  }

  async unbanUser(userId: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
    });

    return {
      data: user,
      msg: 'User unbanned successfully',
    };
  }
}
