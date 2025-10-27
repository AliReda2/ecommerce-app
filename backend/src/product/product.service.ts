import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts() {
    const products = await this.prisma.product.findMany({
      where: { stock: { gt: 0 } },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
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

  async createProduct(data: CreateProductDto) {
    const product = await this.prisma.product.create({
      data,
    });

    return {
      data: product,
      msg: 'Product created successfully',
    };
  }

  async updateProduct(productId: string, data: UpdateProductDto) {
    try {
      const product = await this.prisma.product.update({
        where: { id: productId },
        data,
      });

      return {
        data: product,
        msg: 'Product updated successfully',
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Product not found');
      }
      throw error;
    }
  }

  async deleteProduct(productId: string) {
    try {
      const product = await this.prisma.product.delete({
        where: { id: productId },
      });

      return {
        data: product,
        msg: 'Product deleted successfully',
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Product not found');
      }
      throw error;
    }
  }
}
