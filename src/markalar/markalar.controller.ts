import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { MarkalarService } from './markalar.service';
import { CreateMarkaDto } from './dto/create-marka.dto';
import { UpdateMarkaDto } from './dto/update-marka.dto';
import { Marka } from './entities/marka.entity';

@ApiTags('Markalar')
@Controller('markalar')
export class MarkalarController {
  constructor(private readonly markalarService: MarkalarService) {}

  @Post()
  @ApiOperation({ summary: 'Yeni marka oluştur' })
  @ApiResponse({
    status: 201,
    description: 'Marka başarıyla oluşturuldu.',
    type: Marka,
  })
  @ApiResponse({ status: 400, description: 'Geçersiz veri.' })
  create(@Body() createMarkaDto: CreateMarkaDto) {
    return this.markalarService.create(createMarkaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm markaları getir' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Marka adında arama yap',
  })
  @ApiResponse({
    status: 200,
    description: 'Markalar başarıyla getirildi.',
    type: [Marka],
  })
  findAll(@Query('search') search?: string) {
    return this.markalarService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID ile marka getir' })
  @ApiParam({ name: 'id', description: 'Marka ID' })
  @ApiResponse({
    status: 200,
    description: 'Marka başarıyla getirildi.',
    type: Marka,
  })
  @ApiResponse({ status: 404, description: 'Marka bulunamadı.' })
  findOne(@Param('id') id: string) {
    return this.markalarService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Marka güncelle' })
  @ApiParam({ name: 'id', description: 'Marka ID' })
  @ApiResponse({
    status: 200,
    description: 'Marka başarıyla güncellendi.',
    type: Marka,
  })
  @ApiResponse({ status: 404, description: 'Marka bulunamadı.' })
  update(@Param('id') id: string, @Body() updateMarkaDto: UpdateMarkaDto) {
    return this.markalarService.update(+id, updateMarkaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Marka sil' })
  @ApiParam({ name: 'id', description: 'Marka ID' })
  @ApiResponse({ status: 200, description: 'Marka başarıyla silindi.' })
  @ApiResponse({ status: 404, description: 'Marka bulunamadı.' })
  remove(@Param('id') id: string) {
    return this.markalarService.remove(+id);
  }
}
