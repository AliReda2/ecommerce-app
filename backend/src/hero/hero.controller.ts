import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { HeroService } from './hero.service';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { AtGuard } from 'src/auth/guard';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@Controller('hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) { }


  @Get()
  @ApiOperation({ summary: 'Get all heros' })
  async findAll() {
    return await this.heroService.findAll();
  }

  @Post()
  @UseGuards(AtGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new hero' })
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateHeroDto,
  })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateHeroDto,
  ) {
    return await this.heroService.create(data, file);
  }

  @Patch('reorder')
  @UseGuards(AtGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'reorder hero cards' })
  async reorder(@Body() items: { id: string; order: number }[]) {
    return this.heroService.reorder(items);
  }

  @Patch(':id')
  @UseGuards(AtGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update an existing hero' })
  @ApiBody({
    type: UpdateHeroDto,
    required: true,
    description: 'Data for updating the hero',
  })
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() body: UpdateHeroDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.heroService.update(id, body, file);
  }

  @Delete(':id')
  @UseGuards(AtGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a hero' })
  async remove(@Param('id') id: string) {
    return await this.heroService.delete(id);
  }
}
