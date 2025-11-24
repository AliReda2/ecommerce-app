import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsString,
} from 'class-validator';

export class UpdateHeroDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  titleColor: string;

  @ApiProperty()
  @IsString()
  subtitle: string;

  @ApiProperty()
  @IsString()
  subtitleColor: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  descriptionColor: string;

  @ApiProperty()
  @IsString()
  buttonText: string;

  @ApiProperty()
  @IsString()
  buttonColor: string;

  @ApiProperty()
  @IsString()
  imageUrl: string;

  @ApiProperty()
  @IsString()
  imageAlt: string;

  @ApiProperty()
  @IsString()
  backgroundColor: string;

  @ApiProperty()
  @IsNumber()
  order: number;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}
