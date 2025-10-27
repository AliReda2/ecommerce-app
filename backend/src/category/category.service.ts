import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

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

  async createCategory(data: CreateCategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { name: data.name },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    const newCategory = await this.prisma.category.create({
      data,
    });

    return {
      data: newCategory,
      msg: 'Category created successfully',
    };
  }

  async updateCategory(categoryId: string, data: UpdateCategoryDto) {
    try {
      const updatedCategory = await this.prisma.category.update({
        where: { id: categoryId },
        data,
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
}
