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
import { UrunlerService } from './urunler.service';
import { CreateUrunDto } from './dto/create-urun.dto';
import { UpdateUrunDto } from './dto/update-urun.dto';
import { Urun } from './entities/urun.entity';

@ApiTags('Ürünler')
@Controller('urunler')
export class UrunlerController {
  constructor(private readonly urunlerService: UrunlerService) {}

  @Post()
  @ApiOperation({ summary: 'Yeni ürün oluştur' })
  @ApiResponse({
    status: 201,
    description: 'Ürün başarıyla oluşturuldu',
    type: Urun,
  })
  @ApiResponse({
    status: 409,
    description: 'Bu mağazada aynı ürün kodu zaten kullanılıyor',
  })
  create(@Body() createUrunDto: CreateUrunDto): Promise<Urun> {
    return this.urunlerService.create(createUrunDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm ürünleri listele' })
  @ApiResponse({
    status: 200,
    description: 'Ürünler listelendi',
    type: [Urun],
  })
  findAll(): Promise<Urun[]> {
    return this.urunlerService.findAll();
  }

  @Get('magaza/:sanalMagazaId')
  @ApiOperation({ summary: 'Belirli bir mağazanın ürünlerini listele' })
  @ApiResponse({
    status: 200,
    description: 'Mağaza ürünleri listelendi',
    type: [Urun],
  })
  findByMagaza(
    @Param('sanalMagazaId') sanalMagazaId: string,
  ): Promise<Urun[]> {
    return this.urunlerService.findByMagaza(+sanalMagazaId);
  }

  @Get('dusuk-stok')
  @ApiOperation({ summary: 'Düşük stoklu ürünleri listele' })
  @ApiResponse({
    status: 200,
    description: 'Düşük stoklu ürünler listelendi',
    type: [Urun],
  })
  getDusukStokUrunler(): Promise<Urun[]> {
    return this.urunlerService.getDusukStokUrunler();
  }

  @Get('ara')
  @ApiOperation({ summary: 'Ürün ara (ad, kod, barkod)' })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Arama terimi',
    example: 'granit',
  })
  @ApiResponse({
    status: 200,
    description: 'Arama sonuçları',
    type: [Urun],
  })
  search(@Query('q') searchTerm: string): Promise<Urun[]> {
    return this.urunlerService.search(searchTerm);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ürün detayını getir' })
  @ApiResponse({
    status: 200,
    description: 'Ürün detayı',
    type: Urun,
  })
  @ApiResponse({ status: 404, description: 'Ürün bulunamadı' })
  findOne(@Param('id') id: string): Promise<Urun> {
    return this.urunlerService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Ürün güncelle' })
  @ApiResponse({
    status: 200,
    description: 'Ürün güncellendi',
    type: Urun,
  })
  @ApiResponse({ status: 404, description: 'Ürün bulunamadı' })
  @ApiResponse({
    status: 409,
    description: 'Bu mağazada aynı ürün kodu zaten kullanılıyor',
  })
  update(
    @Param('id') id: string,
    @Body() updateUrunDto: UpdateUrunDto,
  ): Promise<Urun> {
    return this.urunlerService.update(+id, updateUrunDto);
  }

  @Patch(':id/stok')
  @ApiOperation({ summary: 'Ürün stoğunu güncelle (artır/azalt)' })
  @ApiResponse({
    status: 200,
    description: 'Stok güncellendi',
    type: Urun,
  })
  @ApiResponse({ status: 404, description: 'Ürün bulunamadı' })
  @ApiResponse({ status: 400, description: 'Yetersiz stok' })
  updateStok(
    @Param('id') id: string,
    @Body('miktar') miktar: number,
  ): Promise<Urun> {
    return this.urunlerService.updateStok(+id, miktar);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Ürün sil' })
  @ApiResponse({ status: 204, description: 'Ürün silindi' })
  @ApiResponse({ status: 404, description: 'Ürün bulunamadı' })
  remove(@Param('id') id: string): Promise<void> {
    return this.urunlerService.remove(+id);
  }
}

