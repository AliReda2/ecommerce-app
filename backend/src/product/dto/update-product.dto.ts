import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'Wireless Mouse',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'A high-precision wireless mouse with ergonomic design.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 29.99,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Available stock of the product',
    example: 150,
  })
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @ApiProperty()
  @IsString()
  imageUrl?: string;

  @ApiProperty()
  @IsString()
  categoryId?: string;
}
