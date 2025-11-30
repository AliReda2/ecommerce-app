import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async create(name: string) {
    const existingTag = await this.prisma.tag.findUnique({
      where: {
        name,
      },
    });

    if (existingTag) throw new ConflictException();
    const tag = await this.prisma.tag.create({
      data: {
        name,
      },
    });
    return {
      data: tag,
      msg: 'tag created succesfuly',
    };
  }

  async fetchAll() {
    const tags = await this.prisma.tag.findMany();
    return {
      data: tags,
      msg: 'tags fetched succesfuly',
    };
  }
  async update(id: string, name: string) {
    const existingTag = await this.prisma.tag.findUnique({
      where: {
        id,
      },
    });

    if (existingTag) throw new NotFoundException('Tag not found');
    const tag = await this.prisma.tag.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
    return {
      data: tag,
      msg: 'tag updated succesfuly',
    };
  }

  async delete(id: string) {
    const existingTag = await this.prisma.tag.findUnique({
      where: {
        id,
      },
    });

    if (existingTag) throw new NotFoundException('Tag not found');

    const tag = await this.prisma.tag.delete({
      where: {
        id,
      },
    });
    return {
      data: tag,
      msg: 'tag deleted succesfuly',
    };
  }
}
