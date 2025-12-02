import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AtGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) { }


  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  async getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }

  @Post()
  @UseGuards(AtGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({
    type: CreateCategoryDto,
    required: true,
    description: 'Data for creating a new category',
  })
  @UseInterceptors(FileInterceptor('image'))
  async createCategory(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateCategoryDto,
  ) {
    return this.categoryService.createCategory(data, file);
  }

  @Patch(':id')
  @UseGuards(AtGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update an existing category' })
  @ApiBody({
    type: UpdateCategoryDto,
    required: true,
    description: 'Data for updating the category',
  })
  @UseInterceptors(FileInterceptor('image'))
  async updateCategory(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,

    @Body() data: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, data, file);
  }

  @Delete(':id')
  @UseGuards(AtGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a category' })
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
