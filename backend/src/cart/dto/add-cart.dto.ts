import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class AddCartDto {
  @ApiProperty({
    example: 'prod_12345',
    description: 'The ID of the product to add to the cart',
  })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    example: 29.99,
    description: 'The price of the product to add to the cart',
  })
  @IsNumber()
  @IsNotEmpty()
  productPrice: number;

  @ApiProperty({
    example: 2,
    description: 'The quantity of the product to add to the cart',
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
