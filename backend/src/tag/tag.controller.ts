import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tag' })
  create(@Body() dto: CreateTagDto) {
    return this.tagService.create(dto.name);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all tags' })
  fetchAll() {
    return this.tagService.fetchAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing tag' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTagDto,
  ) {
    return this.tagService.update(id, dto.name);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tag' })
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.tagService.delete(id);
  }
}
