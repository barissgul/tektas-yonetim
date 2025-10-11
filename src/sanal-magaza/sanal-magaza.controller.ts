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
import { SanalMagazaService } from './sanal-magaza.service';
import { CreateSanalMagazaDto } from './dto/create-sanal-magaza.dto';
import { UpdateSanalMagazaDto } from './dto/update-sanal-magaza.dto';
import { SanalMagaza } from './entities/sanal-magaza.entity';

@ApiTags('Sanal Mağaza')
@Controller('sanal-magaza')
export class SanalMagazaController {
  constructor(private readonly sanalMagazaService: SanalMagazaService) {}

  @Post()
  @ApiOperation({ summary: 'Yeni sanal mağaza bağlantısı oluştur' })
  @ApiResponse({
    status: 201,
    description: 'Sanal mağaza başarıyla oluşturuldu',
    type: SanalMagaza,
  })
  create(@Body() createSanalMagazaDto: CreateSanalMagazaDto): Promise<SanalMagaza> {
    return this.sanalMagazaService.create(createSanalMagazaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm sanal mağazaları listele' })
  @ApiResponse({
    status: 200,
    description: 'Sanal mağazalar listelendi',
    type: [SanalMagaza],
  })
  findAll(): Promise<SanalMagaza[]> {
    return this.sanalMagazaService.findAll();
  }

  @Get('aktif')
  @ApiOperation({ summary: 'Aktif sanal mağazaları listele' })
  @ApiResponse({
    status: 200,
    description: 'Aktif sanal mağazalar listelendi',
    type: [SanalMagaza],
  })
  findAllActive(): Promise<SanalMagaza[]> {
    return this.sanalMagazaService.findAllActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Sanal mağaza detayını getir' })
  @ApiResponse({
    status: 200,
    description: 'Sanal mağaza detayı',
    type: SanalMagaza,
  })
  @ApiResponse({ status: 404, description: 'Sanal mağaza bulunamadı' })
  findOne(@Param('id') id: string): Promise<SanalMagaza> {
    return this.sanalMagazaService.findOne(+id);
  }

  @Get('kod/:magaza_kodu')
  @ApiOperation({ summary: 'Mağaza koduna göre sanal mağaza getir' })
  @ApiResponse({
    status: 200,
    description: 'Sanal mağaza detayı',
    type: SanalMagaza,
  })
  @ApiResponse({ status: 404, description: 'Sanal mağaza bulunamadı' })
  findByMagazaKodu(@Param('magaza_kodu') magaza_kodu: string): Promise<SanalMagaza> {
    return this.sanalMagazaService.findByMagazaKodu(magaza_kodu);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Sanal mağaza güncelle' })
  @ApiResponse({
    status: 200,
    description: 'Sanal mağaza güncellendi',
    type: SanalMagaza,
  })
  @ApiResponse({ status: 404, description: 'Sanal mağaza bulunamadı' })
  update(
    @Param('id') id: string,
    @Body() updateSanalMagazaDto: UpdateSanalMagazaDto,
  ): Promise<SanalMagaza> {
    return this.sanalMagazaService.update(+id, updateSanalMagazaDto);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Sanal mağaza aktif/pasif durumunu değiştir' })
  @ApiResponse({
    status: 200,
    description: 'Sanal mağaza durumu değiştirildi',
    type: SanalMagaza,
  })
  @ApiResponse({ status: 404, description: 'Sanal mağaza bulunamadı' })
  toggleActive(@Param('id') id: string): Promise<SanalMagaza> {
    return this.sanalMagazaService.toggleActive(+id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Sanal mağaza sil' })
  @ApiResponse({ status: 204, description: 'Sanal mağaza silindi' })
  @ApiResponse({ status: 404, description: 'Sanal mağaza bulunamadı' })
  remove(@Param('id') id: string): Promise<void> {
    return this.sanalMagazaService.remove(+id);
  }
}

