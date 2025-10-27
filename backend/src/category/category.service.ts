import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getAllCategories() {
    const categories = await this.prisma.category.findMany({});

    if (categories.length == 0) {
      throw new Error('No categories found');
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
      throw new Error('Category not found');
    }
    return {
      data: category,
      msg: 'Category fetched successfully',
    };
  }

  async createCategory(data: CreateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { name: data.name },
    });
    if (category) {
      throw new Error('Category with this name already exists');
    }
    const newCategory = await this.prisma.category.create({
      data,
    });
    return {
      data: newCategory,
      msg: 'Category created successfully',
    };
  }

  async deleteCategory(categoryId: string) {
    const category = this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new Error('Category not found');
    }
    const deletedCategory = await this.prisma.category.delete({
      where: { id: categoryId },
    });
    return {
      data: deletedCategory,
      msg: 'Category deleted successfully',
    };
  }

  async updateCategory(categoryId: string, data: UpdateCategoryDto) {
    const category = this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new Error('Category not found');
    }
    const updatedCategory = await this.prisma.category.update({
      where: { id: categoryId },
      data,
    });
    return {
      data: updatedCategory,
      msg: 'Category updated successfully',
    };
  }
}
