import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { YetkilerService } from './yetkiler.service';
import { CreateYetkilerDto } from './dto/create-yetkiler.dto';
import { UpdateYetkilerDto } from './dto/update-yetkiler.dto';
import { Yetkiler } from './entities/yetkiler.entity';

@ApiTags('Yetkiler')
@Controller('yetkiler')
export class YetkilerController {
  constructor(private readonly yetkilerService: YetkilerService) {}

  @Post()
  @ApiOperation({ summary: 'Yeni yetki oluştur' })
  @ApiResponse({
    status: 201,
    description: 'Yetki başarıyla oluşturuldu',
    type: Yetkiler,
  })
  create(@Body() createYetkilerDto: CreateYetkilerDto): Promise<Yetkiler> {
    return this.yetkilerService.create(createYetkilerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm yetkileri listele' })
  @ApiResponse({
    status: 200,
    description: 'Yetkiler listelendi',
    type: [Yetkiler],
  })
  findAll(): Promise<Yetkiler[]> {
    return this.yetkilerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Yetki detayını getir' })
  @ApiResponse({ status: 200, description: 'Yetki detayı', type: Yetkiler })
  @ApiResponse({ status: 404, description: 'Yetki bulunamadı' })
  findOne(@Param('id') id: string): Promise<Yetkiler> {
    return this.yetkilerService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Yetki güncelle' })
  @ApiResponse({
    status: 200,
    description: 'Yetki güncellendi',
    type: Yetkiler,
  })
  @ApiResponse({ status: 404, description: 'Yetki bulunamadı' })
  update(
    @Param('id') id: string,
    @Body() updateYetkilerDto: UpdateYetkilerDto,
  ): Promise<Yetkiler> {
    return this.yetkilerService.update(+id, updateYetkilerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Yetki sil' })
  @ApiResponse({ status: 204, description: 'Yetki silindi' })
  @ApiResponse({ status: 404, description: 'Yetki bulunamadı' })
  remove(@Param('id') id: string): Promise<void> {
    return this.yetkilerService.remove(+id);
  }
}
