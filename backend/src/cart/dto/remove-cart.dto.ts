import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveCartDto {
  @ApiProperty({
    example: 'cartitem_12345',
    description: 'The ID of the cart item to remove from the cart',
  })
  @IsString()
  @IsNotEmpty()
  cartItemId: string;
}
