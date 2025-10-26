import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnApplicationShutdown
{
  async onModuleInit() {
    await this.$connect();
    console.log('Connected to the database successfully.');
  }

  async onApplicationShutdown(signal?: string) {
    await this.$disconnect();
    console.log('Disconnected from the database', signal || '');
  }
}
