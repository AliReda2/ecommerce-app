import { Injectable, NotFoundException } from '@nestjs/common';
import { not } from 'rxjs/internal/util/not';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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
    if (products.length == 0) throw new NotFoundException('No products found');
    return {
      data: products,
      msg: 'Products fetched successfully',
    };
  }

  async getProductById(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');
    return {
      data: product,
      msg: 'Product fetched successfully',
    };
  }

  async createProduct(data: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: data,
    });
    return {
      data: product,
      msg: 'Product created successfully',
    };
  }
  async updateProduct(productId: string, data: UpdateProductDto) {
    const product = await this.prisma.product.update({
      where: { id: productId },
      data: data,
    });
    if (!product) throw new NotFoundException('Product not found');
    return {
      data: product,
      msg: 'Product updated successfully',
    };
  }

  async deleteProduct(productId: string) {
    const product = await this.prisma.product.delete({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');
    return {
      data: product,
      msg: 'Product deleted successfully',
    };
  }
}
