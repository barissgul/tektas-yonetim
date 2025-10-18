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
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SiparislerService } from './siparisler.service';
import { CreateSiparisDto } from './dto/create-siparis.dto';
import { UpdateSiparisDto } from './dto/update-siparis.dto';
import { Siparis } from './entities/siparis.entity';

@ApiTags('Siparişler')
@Controller('siparisler')
export class SiparislerController {
  constructor(private readonly siparislerService: SiparislerService) {}

  @Post()
  @ApiOperation({ summary: 'Yeni sipariş oluştur' })
  @ApiResponse({
    status: 201,
    description: 'Sipariş başarıyla oluşturuldu',
    type: Siparis,
  })
  @ApiResponse({
    status: 409,
    description: 'Bu sipariş numarası zaten kullanılıyor',
  })
  create(@Body() createSiparisDto: CreateSiparisDto): Promise<Siparis> {
    return this.siparislerService.create(createSiparisDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm siparişleri listele' })
  @ApiResponse({
    status: 200,
    description: 'Siparişler listelendi',
    type: [Siparis],
  })
  findAll(): Promise<Siparis[]> {
    return this.siparislerService.findAll();
  }

  @Get('magaza/:sanalMagazaId')
  @ApiOperation({ summary: 'Mağazaya göre siparişleri listele' })
  @ApiResponse({
    status: 200,
    description: 'Mağaza siparişleri listelendi',
    type: [Siparis],
  })
  findByMagaza(
    @Param('sanalMagazaId') sanalMagazaId: string,
  ): Promise<Siparis[]> {
    return this.siparislerService.findByMagaza(+sanalMagazaId);
  }

  @Get('durum/:durum')
  @ApiOperation({ summary: 'Duruma göre siparişleri listele' })
  @ApiQuery({
    name: 'durum',
    example: 'Beklemede',
    description: 'Sipariş durumu',
  })
  @ApiResponse({
    status: 200,
    description: 'Siparişler listelendi',
    type: [Siparis],
  })
  findByDurum(@Param('durum') durum: string): Promise<Siparis[]> {
    return this.siparislerService.findByDurum(durum);
  }

  @Get('tarih-araligi')
  @ApiOperation({ summary: 'Tarih aralığına göre siparişleri listele' })
  @ApiQuery({ name: 'baslangic', example: '2025-10-01' })
  @ApiQuery({ name: 'bitis', example: '2025-10-31' })
  @ApiResponse({
    status: 200,
    description: 'Siparişler listelendi',
    type: [Siparis],
  })
  findByTarihAraligi(
    @Query('baslangic') baslangic: string,
    @Query('bitis') bitis: string,
  ): Promise<Siparis[]> {
    return this.siparislerService.findByTarihAraligi(
      new Date(baslangic),
      new Date(bitis),
    );
  }

  @Get('istatistikler')
  @ApiOperation({ summary: 'Sipariş istatistiklerini getir' })
  @ApiResponse({
    status: 200,
    description: 'İstatistikler',
  })
  getIstatistikler(): Promise<any> {
    return this.siparislerService.getIstatistikler();
  }

  @Get('bugun')
  @ApiOperation({ summary: "Bugünün siparişlerini listele" })
  @ApiResponse({
    status: 200,
    description: 'Bugünün siparişleri',
    type: [Siparis],
  })
  getBugunSiparisler(): Promise<Siparis[]> {
    return this.siparislerService.getBugunSiparisler();
  }

  @Get('siparis-no/:siparisNo')
  @ApiOperation({ summary: 'Sipariş numarasına göre sipariş getir' })
  @ApiResponse({
    status: 200,
    description: 'Sipariş detayı',
    type: Siparis,
  })
  @ApiResponse({ status: 404, description: 'Sipariş bulunamadı' })
  findBySiparisNo(@Param('siparisNo') siparisNo: string): Promise<Siparis> {
    return this.siparislerService.findBySiparisNo(siparisNo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Sipariş detayını getir' })
  @ApiResponse({
    status: 200,
    description: 'Sipariş detayı',
    type: Siparis,
  })
  @ApiResponse({ status: 404, description: 'Sipariş bulunamadı' })
  findOne(@Param('id') id: string): Promise<Siparis> {
    return this.siparislerService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Sipariş güncelle' })
  @ApiResponse({
    status: 200,
    description: 'Sipariş güncellendi',
    type: Siparis,
  })
  @ApiResponse({ status: 404, description: 'Sipariş bulunamadı' })
  update(
    @Param('id') id: string,
    @Body() updateSiparisDto: UpdateSiparisDto,
  ): Promise<Siparis> {
    return this.siparislerService.update(+id, updateSiparisDto);
  }

  @Patch(':id/durum')
  @ApiOperation({ summary: 'Sipariş durumunu güncelle' })
  @ApiResponse({
    status: 200,
    description: 'Durum güncellendi',
    type: Siparis,
  })
  @ApiResponse({ status: 404, description: 'Sipariş bulunamadı' })
  updateDurum(
    @Param('id') id: string,
    @Body('durum') durum: string,
  ): Promise<Siparis> {
    return this.siparislerService.updateDurum(+id, durum);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Sipariş sil' })
  @ApiResponse({ status: 204, description: 'Sipariş silindi' })
  @ApiResponse({ status: 404, description: 'Sipariş bulunamadı' })
  remove(@Param('id') id: string): Promise<void> {
    return this.siparislerService.remove(+id);
  }
}





