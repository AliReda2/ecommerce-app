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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { AtGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Roles } from 'src/roles/roles.decorator';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        price: { type: 'number' },
        stock: { type: 'number' },
        description: { type: 'string' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateProductDto,
  ) {
    return this.productService.createProduct(data, file);
  }

  @Patch(':id')
  @UseGuards(AtGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Product Name' },
        description: { type: 'string', example: 'Product Description' },
        price: { type: 'number', example: 19.99 },
        stock: { type: 'number', example: 3 },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async updateProduct(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() data: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, data, file);
  }

  @Delete(':id')
  @UseGuards(AtGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete a product' })
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
