import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AtGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Roles } from 'src/roles/roles.decorator';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiBearerAuth('access-token')
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get products by category ID' })
  async getProductsByCategory(@Param('categoryId') categoryId: string) {
    return this.productService.getProductsByCategory(categoryId);
  }

  @Post()
  @UseGuards(AtGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({
    type: CreateProductDto,
    required: true,
    description: 'Data for creating a new product',
  })
  async createProduct(@Body() data: CreateProductDto) {
    return this.productService.createProduct(data);
  }

  @Patch(':id')
  @UseGuards(AtGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiBody({
    type: UpdateProductDto,
    required: true,
    description: 'Data for updating the product',
  })
  async updateProduct(@Param('id') id: string, @Body() data: UpdateProductDto) {
    return this.productService.updateProduct(id, data);
  }

  @Delete(':id')
  @UseGuards(AtGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete a product' })
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
