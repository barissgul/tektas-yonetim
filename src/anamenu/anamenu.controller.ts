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
import { AnamenuService } from './anamenu.service';
import { CreateAnamenuDto } from './dto/create-anamenu.dto';
import { UpdateAnamenuDto } from './dto/update-anamenu.dto';
import { Anamenu } from './entities/anamenu.entity';

@ApiTags('Anamenu')
@Controller('anamenu')
export class AnamenuController {
  constructor(private readonly anamenuService: AnamenuService) {}

  @Post()
  @ApiOperation({ summary: 'Yeni ana menü oluştur' })
  @ApiResponse({
    status: 201,
    description: 'Ana menü başarıyla oluşturuldu',
    type: Anamenu,
  })
  create(@Body() createAnamenuDto: CreateAnamenuDto): Promise<Anamenu> {
    return this.anamenuService.create(createAnamenuDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm ana menüleri listele' })
  @ApiResponse({
    status: 200,
    description: 'Ana menüler listelendi',
    type: [Anamenu],
  })
  findAll(): Promise<Anamenu[]> {
    return this.anamenuService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ana menü detayını getir' })
  @ApiResponse({ status: 200, description: 'Ana menü detayı', type: Anamenu })
  @ApiResponse({ status: 404, description: 'Ana menü bulunamadı' })
  findOne(@Param('id') id: string): Promise<Anamenu> {
    return this.anamenuService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Ana menü güncelle' })
  @ApiResponse({
    status: 200,
    description: 'Ana menü güncellendi',
    type: Anamenu,
  })
  @ApiResponse({ status: 404, description: 'Ana menü bulunamadı' })
  update(
    @Param('id') id: string,
    @Body() updateAnamenuDto: UpdateAnamenuDto,
  ): Promise<Anamenu> {
    return this.anamenuService.update(+id, updateAnamenuDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Ana menü sil' })
  @ApiResponse({ status: 204, description: 'Ana menü silindi' })
  @ApiResponse({ status: 404, description: 'Ana menü bulunamadı' })
  remove(@Param('id') id: string): Promise<void> {
    return this.anamenuService.remove(+id);
  }
}
