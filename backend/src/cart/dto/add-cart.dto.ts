import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddCartDto {
  @ApiProperty({
    example: 'prod_12345',
    description: 'The ID of the product to add to the cart',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    example: 2,
    description: 'The quantity of the product to add to the cart',
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
