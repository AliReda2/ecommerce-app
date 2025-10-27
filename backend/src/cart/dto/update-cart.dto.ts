import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCartDto {
  @ApiProperty({
    example: 'cartItem_12345',
    description: 'The ID of the cart item to update',
  })
  @IsString()
  @IsNotEmpty()
  cartItemId: string;

  @ApiProperty({
    example: 2,
    description: 'The quantity of the cart item to update',
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
