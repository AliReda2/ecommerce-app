import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';
import { slugify } from 'src/utility/slugify';

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
        category: {
          select: {
            name: true,
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (products.length === 0) {
      throw new NotFoundException('No products found');
    }

    // Flatten tags to an array of names
    const formattedProducts = products.map((product) => ({
      ...product,
      category: product.category ? product.category.name : null,
      tags: product.tags.map((pt) => pt.tag.name),
    }));

    return {
      data: formattedProducts,
      msg: 'Products fetched successfully',
    };
  }
  async getAllProductsAdmin() {
    const products = await this.prisma.product.findMany({
      include: {
        category: true,
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

  /** CREATE */
  async createProduct(data: CreateProductDto, file: Express.Multer.File) {
    const imageUrl = await this.uploadImageToSupabase(file);

    const product = await this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        imageUrl,
        ...(data.categoryId
          ? { category: { connect: { id: data.categoryId } } }
          : {}),
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
      data: {
        name: updateData.name,
        description: updateData.description,
        price: updateData.price,
        stock: updateData.stock,
        imageUrl: updateData.imageUrl,
        category: {
          connect: { id: updateData.categoryId },
        },
      },
    });

    return {
      msg: 'Product updated successfully',
      data: product,
    };
  }

  /** DELETE */
  async deleteProduct(productId: string) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }
    // Delete image from Supabase storage
    if (existingProduct.imageUrl) {
      const path = existingProduct.imageUrl.split('/products/')[1];
      await this.supabase.storage.from('products').remove([path]);
    }
    const productInCart = await this.prisma.cartItem.findFirst({
      where: { productId },
    });
    if (productInCart) {
      throw new BadRequestException(
        'Cannot delete product that is in a user cart',
      );
    }
    await this.prisma.wishlist.deleteMany({
      where: { productId },
    });
    const product = await this.prisma.product.delete({
      where: { id: productId },
    });

    return {
      data: product,
      msg: 'Product deleted successfully',
    };
  }

  async toggleProductTag(productId: string, tagName: string) {
    // Ensure tag exists
    const tag = await this.prisma.tag.findUnique({ where: { name: tagName } });
    if (!tag) throw new NotFoundException('Tag not found');

    // Ensure product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    // Check if relation already exists
    const existingRelation = await this.prisma.productTag.findUnique({
      where: {
        productId_tagId: {
          productId,
          tagId: tag.id,
        },
      },
    });

    let result;

    if (existingRelation) {
      // Remove tag
      result = await this.prisma.productTag.delete({
        where: {
          productId_tagId: {
            productId,
            tagId: tag.id,
          },
        },
      });
    } else {
      // Add tag
      result = await this.prisma.productTag.create({
        data: {
          productId,
          tagId: tag.id,
        },
      });
    }

    return {
      data: result,
      msg: 'Tag toggled successfully',
    };
  }

  async getProductsByTagName(tagName: string) {
    const tag = await this.prisma.tag.findUnique({ where: { name: tagName } });
    if (!tag) throw new NotFoundException('Tag not found');

    const taggedProducts = await this.prisma.productTag.findMany({
      where: { tagId: tag.id },
      include: {
        product: true, // Get the full product object
      },
    });

    if (!taggedProducts.length)
      throw new NotFoundException('No products found for selected tag');

    // Extract only the product objects
    const products = taggedProducts.map((entry) => entry.product);

    return {
      data: products,
      msg: 'Fetched products of selected tag',
    };
  }
}
