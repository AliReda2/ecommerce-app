import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ToggleWishlistDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId: string;
}
