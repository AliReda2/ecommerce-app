import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ToggleProductTag {
  @ApiProperty({
    description: 'Id of the product',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'name of the Tag',
  })
  @IsString()
  @IsNotEmpty()
  tagName: string;
}
