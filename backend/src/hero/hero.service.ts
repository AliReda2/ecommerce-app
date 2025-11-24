import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import sharp from 'sharp';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class HeroService {
  private supabase;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY')!,
    );
  }
  async findAll() {
    const heros = await this.prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    return {
      data: heros,
      msg: 'Hero slides retrieved successfully',
    };
  }

  async create(data: CreateHeroDto, file: Express.Multer.File) {
    const imageUrl = await this.uploadImageToSupabase(file);

    const created = await this.prisma.heroSlide.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        titleColor: data.title,
        subtitleColor: data.subtitleColor,
        descriptionColor: data.descriptionColor,
        buttonText: data.buttonText,
        buttonColor: data.buttonColor,
        backgroundColor: data.backgroundColor,
        order: Number(data.order),
        isActive: data.isActive,
        imageAlt: data.imageAlt,
        imageUrl,
      },
    });
    return {
      data: created,
      msg: 'Hero slide created successfully',
    };
  }

  async update(id: string, data: UpdateHeroDto, file?: Express.Multer.File) {
    // 1. Get existing hero (we need current image URL to delete it)
    const existingHero = await this.prisma.heroSlide.findUnique({
      where: { id },
    });

    if (!existingHero) {
      throw new Error('hero not found');
    }

    let imageUrl: string | null = existingHero.imageUrl;

    // 2. If new file provided → delete old file → upload new file
    if (file) {
      // ✅ Delete old image if exists
      if (existingHero.imageUrl) {
        // Extract only the path after /heros/
        const path = existingHero.imageUrl.split('/products/')[1];

        await this.supabase.storage.from('products').remove([path]);
      }

      // ✅ Upload new image
      imageUrl = await this.uploadImageToSupabase(file);
    }
    const update = await this.prisma.heroSlide.update({
      where: { id },
      data: {
        ...data,
        order: Number(data.order),
        imageUrl,
      },
    });
    return {
      data: update,
      msg: 'Hero slide updated successfully',
    };
  }

  async delete(id: string) {
    const existingHero = await this.prisma.heroSlide.findUnique({
      where: {
        id,
      },
    });
    if (!existingHero) throw new NotFoundException('hero not found');

    if (existingHero.imageUrl) {
      const path = existingHero.imageUrl.split('/products/')[1];
      await this.supabase.storage.from('products').remove([path]);
    }

    const deleted = await this.prisma.heroSlide.delete({ where: { id } });
    return {
      data: deleted,
      msg: 'Hero slide deleted successfully',
    };
  }

  private async uploadImageToSupabase(
    file: Express.Multer.File,
  ): Promise<string | null> {
    if (!file) return null;

    try {
      // Convert file to webp format
      const webpBuffer = await sharp(file.buffer)
        .webp({ quality: 80 })
        .toBuffer();

      const filePath = `products/${Date.now()}.webp`;

      const { error } = await this.supabase.storage
        .from('products')
        .upload(filePath, webpBuffer, {
          contentType: 'image/webp',
        });

      if (error) {
        console.error('❌ Supabase upload error:', error); // <-- detailed logging
        throw new BadRequestException(
          `Failed to upload file: ${error.message}`,
        );
      }

      const { data, error: urlError } = this.supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      if (urlError) {
        console.error('❌ Supabase getPublicUrl error:', urlError);
        throw new BadRequestException(
          `Failed to generate public URL: ${urlError.message}`,
        );
      }

      return data.publicUrl;
    } catch (err: any) {
      console.error('❌ Unexpected upload error:', err); // <-- logs sharp errors, network errors, etc.
      throw new InternalServerErrorException(
        err?.message || 'Unexpected error occurred while uploading image.',
      );
    }
  }

  async reorder(items: { id: string; order: number }[]) {
    if (!items || items.length === 0) {
      throw new Error('No items to reorder');
    }

    // Log the incoming items to verify the structure
    console.log('Reorder items:', items);

    // Get existing heroes by the provided IDs
    const existingHeroes = await this.prisma.heroSlide.findMany({
      where: {
        id: { in: items.map((item) => item.id) },
      },
      select: { id: true },
    });

    // Log the existing heroes to confirm if any IDs don't exist
    console.log(
      'Existing heroes in database:',
      existingHeroes.map((hero) => hero.id),
    );

    // Create a Set of valid IDs from the existing heroes
    const existingIds = new Set(existingHeroes.map((h) => h.id));
    const missingIds = items.filter((item) => !existingIds.has(item.id));

    // Log missing IDs
    if (missingIds.length > 0) {
      console.log('Missing heroes (IDs not found):', missingIds);
      throw new Error(
        `Heroes not found: ${missingIds.map((item) => item.id).join(', ')}`,
      );
    }

    // If all IDs are valid, proceed with the reordering
    const queries = items.map((item) =>
      this.prisma.heroSlide.update({
        where: { id: item.id },
        data: { order: item.order },
      }),
    );

    await this.prisma.$transaction(queries);

    return { msg: 'Reordered successfully' };
  }
}
