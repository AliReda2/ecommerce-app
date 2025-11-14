import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

@Injectable()
export class CategoryService {
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

  async getAllCategories() {
    const categories = await this.prisma.category.findMany();

    if (categories.length === 0) {
      throw new NotFoundException('No categories found');
    }

    return {
      data: categories,
      msg: 'Categories fetched successfully',
    };
  }

  async getCategoryById(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return {
      data: category,
      msg: 'Category fetched successfully',
    };
  }

  async createCategory(data: CreateCategoryDto, file: Express.Multer.File) {
    const imageUrl = await this.uploadImageToSupabase(file);

    const existingCategory = await this.prisma.category.findUnique({
      where: { name: data.name },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    const newCategory = await this.prisma.category.create({
      data: {
        ...data,
        imageUrl,
      },
    });

    return {
      data: newCategory,
      msg: 'Category created successfully',
    };
  }

  async updateCategory(
    categoryId: string,
    data: UpdateCategoryDto,
    file?: Express.Multer.File,
  ) {
    try {
      const existingCategory = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!existingCategory) {
        throw new NotFoundException('Category not found');
      }

      let imageUrl: string | null = existingCategory.imageUrl;

      // 2. If new file provided → delete old file → upload new file
      if (file) {
        // ✅ Delete old image if exists
        if (existingCategory.imageUrl) {
          // Extract only the path after /products/
          const path = existingCategory.imageUrl.split('/products/')[1];

          await this.supabase.storage.from('products').remove([path]);
        }

        // ✅ Upload new image
        imageUrl = await this.uploadImageToSupabase(file);
      }

      const updatedCategory = await this.prisma.category.update({
        where: { id: categoryId },
        data: {
          ...data,
          imageUrl,
        },
      });

      return {
        data: updatedCategory,
        msg: 'Category updated successfully',
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Category not found');
      }
      throw error;
    }
  }

  async deleteCategory(categoryId: string) {
    try {
      const existingCategory = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!existingCategory) {
        throw new NotFoundException('Category not found');
      }

      // Delete image from Supabase storage
      if (existingCategory.imageUrl) {
        const path = existingCategory.imageUrl.split('/products/')[1];
        await this.supabase.storage.from('products').remove([path]);
      }

      const deletedCategory = await this.prisma.category.delete({
        where: { id: categoryId },
      });

      return {
        data: deletedCategory,
        msg: 'Category deleted successfully',
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Category not found');
      }
      throw error;
    }
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
}
