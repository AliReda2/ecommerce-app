import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHeroDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  titleColor?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subtitle: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subtitleColor?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descriptionColor?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  buttonText: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  buttonColor?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  image: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageAlt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @IsNotEmpty()
  order: number;

  @ApiPropertyOptional()
  @IsOptional()
  isActive: boolean;
}
