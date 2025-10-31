import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';

@Injectable()
export class ProductService {
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

  async getAllProducts() {
    const products = await this.prisma.product.findMany({
      where: { stock: { gt: 0 } },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        imageUrl: true,
        categoryId: true,
        createdAt: true,
      },
    });

    if (products.length === 0) {
      throw new NotFoundException('No products found');
    }

    return {
      data: products,
      msg: 'Products fetched successfully',
    };
  }

  async getProductById(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return {
      data: product,
      msg: 'Product fetched successfully',
    };
  }

  async getProductsByCategory(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const products = await this.prisma.product.findMany({
      where: { categoryId, stock: { gt: 0 } },
    });

    if (products.length === 0) {
      throw new NotFoundException('No products found in this category');
    }

    return {
      data: products,
      msg: 'Products fetched successfully',
    };
  }

  private async uploadImageToSupabase(
    file: Express.Multer.File,
  ): Promise<string | null> {
    if (!file) return null;

    // Convert incoming to webp
    const webpBuffer = await sharp(file.buffer)
      .webp({ quality: 80 })
      .toBuffer();

    const filePath = `products/${Date.now()}.webp`;

    const { error } = await this.supabase.storage
      .from('products')
      .upload(filePath, webpBuffer, {
        contentType: 'image/webp',
      });

    if (error) throw new Error(error.message);

    const {
      data: { publicUrl },
    } = this.supabase.storage.from('products').getPublicUrl(filePath);

    return publicUrl;
  }

  /** CREATE */
  async createProduct(data: CreateProductDto, file: Express.Multer.File) {
    const imageUrl = await this.uploadImageToSupabase(file);

    const product = await this.prisma.product.create({
      data: {
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
        imageUrl,
      },
    });

    return {
      data: product,
      msg: 'Product created successfully',
    };
  }

  /** UPDATE */
  async updateProduct(
    productId: string,
    data: UpdateProductDto,
    file?: Express.Multer.File,
  ) {
    // 1. Get existing product (we need current image URL to delete it)
    const existingProduct = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    let imageUrl: string | null = existingProduct.imageUrl;

    // 2. If new file provided → delete old file → upload new file
    if (file) {
      // ✅ Delete old image if exists
      if (existingProduct.imageUrl) {
        // Extract only the path after /products/
        const path = existingProduct.imageUrl.split('/products/')[1];

        await this.supabase.storage.from('products').remove([path]);
      }

      // ✅ Upload new image
      imageUrl = await this.uploadImageToSupabase(file);
    }

    // 3. Build updateData with proper numeric conversion
    const updateData: any = {
      ...data,
      price: data.price ? Number(data.price) : undefined,
      stock: data.stock ? Number(data.stock) : undefined,
      imageUrl,
    };

    // 4. Update product
    const product = await this.prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    return {
      msg: 'Product updated successfully',
      data: product,
    };
  }

  /** DELETE */
  async deleteProduct(productId: string) {
    const product = await this.prisma.product.delete({
      where: { id: productId },
    });

    return {
      data: product,
      msg: 'Product deleted successfully',
    };
  }
}
