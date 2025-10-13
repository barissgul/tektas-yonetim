import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { TrendyolService } from './trendyol.service';
import { CreateTrendyolConfigDto } from './dto/create-trendyol-config.dto';
import { UpdateTrendyolConfigDto } from './dto/update-trendyol-config.dto';
import { TrendyolProductListDto } from './dto/trendyol-product.dto';
import { TrendyolOrderListDto } from './dto/trendyol-order.dto';

@ApiTags('Trendyol')
@Controller('trendyol')
export class TrendyolController {
  constructor(private readonly trendyolService: TrendyolService) {}

  // ==================== CONFIG CRUD ====================

  @Post('config')
  @ApiOperation({ summary: 'Yeni Trendyol config oluştur' })
  @ApiResponse({ status: 201, description: 'Config başarıyla oluşturuldu' })
  createConfig(@Body() createDto: CreateTrendyolConfigDto) {
    return this.trendyolService.createConfig(createDto);
  }

  @Get('config')
  @ApiOperation({ summary: 'Tüm Trendyol configleri getir' })
  @ApiResponse({ status: 200, description: 'Configler başarıyla getirildi' })
  getAllConfigs() {
    return this.trendyolService.getAllConfigs();
  }

  @Get('config/:id')
  @ApiOperation({ summary: 'ID ile Trendyol config getir' })
  @ApiParam({ name: 'id', description: 'Config ID' })
  @ApiResponse({ status: 200, description: 'Config başarıyla getirildi' })
  getConfigById(@Param('id') id: string) {
    return this.trendyolService.getConfigById(+id);
  }

  @Patch('config/:id')
  @ApiOperation({ summary: 'Trendyol config güncelle' })
  @ApiParam({ name: 'id', description: 'Config ID' })
  @ApiResponse({ status: 200, description: 'Config başarıyla güncellendi' })
  updateConfig(
    @Param('id') id: string,
    @Body() updateDto: UpdateTrendyolConfigDto,
  ) {
    return this.trendyolService.updateConfig(+id, updateDto);
  }

  @Delete('config/:id')
  @ApiOperation({ summary: 'Trendyol config sil' })
  @ApiParam({ name: 'id', description: 'Config ID' })
  @ApiResponse({ status: 200, description: 'Config başarıyla silindi' })
  deleteConfig(@Param('id') id: string) {
    return this.trendyolService.deleteConfig(+id);
  }

  // ==================== ÜRÜN İŞLEMLERİ ====================

  @Post(':magazaKodu/products')
  @ApiOperation({ summary: 'Trendyol\'a ürün aktar' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiResponse({ status: 201, description: 'Ürün başarıyla oluşturuldu' })
  createProduct(
    @Param('magazaKodu') magazaKodu: string,
    @Body() productData: any,
  ) {
    return this.trendyolService.createProduct(magazaKodu, productData);
  }

  @Put(':magazaKodu/products')
  @ApiOperation({ summary: 'Trendyol ürün bilgilerini güncelle' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiResponse({ status: 200, description: 'Ürün başarıyla güncellendi' })
  updateProduct(
    @Param('magazaKodu') magazaKodu: string,
    @Body() productData: any,
  ) {
    return this.trendyolService.updateProduct(magazaKodu, productData);
  }

  @Get(':magazaKodu/products')
  @ApiOperation({ summary: 'Trendyol ürünleri getir' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Sayfa numarası',
    example: 0,
  })
  @ApiQuery({
    name: 'size',
    required: false,
    description: 'Sayfa boyutu',
    example: 50,
  })
  @ApiResponse({
    status: 200,
    description: 'Ürünler başarıyla getirildi',
    type: TrendyolProductListDto,
  })
  getProducts(
    @Param('magazaKodu') magazaKodu: string,
    @Query('page') page?: number,
    @Query('size') size?: number,
  ) {
    return this.trendyolService.getProducts(magazaKodu, page, size);
  }

  @Get(':magazaKodu/products/:productId')
  @ApiOperation({ summary: 'Trendyol ürün detayı getir' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiParam({ name: 'productId', description: 'Ürün ID' })
  @ApiResponse({ status: 200, description: 'Ürün detayı başarıyla getirildi' })
  getProductById(
    @Param('magazaKodu') magazaKodu: string,
    @Param('productId') productId: string,
  ) {
    return this.trendyolService.getProductById(magazaKodu, productId);
  }

  @Get(':magazaKodu/products/filter/brand')
  @ApiOperation({ summary: 'Markaya göre ürünleri filtrele' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiQuery({ name: 'brandName', required: true, description: 'Marka adı' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Sayfa numarası',
    example: 0,
  })
  @ApiQuery({
    name: 'size',
    required: false,
    description: 'Sayfa boyutu',
    example: 50,
  })
  @ApiResponse({ status: 200, description: 'Ürünler başarıyla filtrelendi' })
  filterProductsByBrand(
    @Param('magazaKodu') magazaKodu: string,
    @Query('brandName') brandName: string,
    @Query('page') page?: number,
    @Query('size') size?: number,
  ) {
    return this.trendyolService.filterProductsByBrand(
      magazaKodu,
      brandName,
      page,
      size,
    );
  }

  // ==================== STOK VE FİYAT GÜNCELLEMESİ ====================

  @Post(':magazaKodu/products/update-stock')
  @ApiOperation({ summary: 'Ürün stoğunu güncelle' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiResponse({ status: 200, description: 'Stok başarıyla güncellendi' })
  updateStock(
    @Param('magazaKodu') magazaKodu: string,
    @Body() stockUpdateData: any,
  ) {
    return this.trendyolService.updateStock(magazaKodu, stockUpdateData);
  }

  @Post(':magazaKodu/products/update-price')
  @ApiOperation({ summary: 'Ürün fiyatını güncelle' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiResponse({ status: 200, description: 'Fiyat başarıyla güncellendi' })
  updatePrice(
    @Param('magazaKodu') magazaKodu: string,
    @Body() priceUpdateData: any,
  ) {
    return this.trendyolService.updatePrice(magazaKodu, priceUpdateData);
  }

  // ==================== SİPARİŞ İŞLEMLERİ ====================

  @Get(':magazaKodu/orders')
  @ApiOperation({ summary: 'Trendyol siparişleri getir' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Başlangıç tarihi (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Bitiş tarihi (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Sayfa numarası',
    example: 0,
  })
  @ApiQuery({
    name: 'size',
    required: false,
    description: 'Sayfa boyutu',
    example: 50,
  })
  @ApiResponse({
    status: 200,
    description: 'Siparişler başarıyla getirildi',
    type: TrendyolOrderListDto,
  })
  getOrders(
    @Param('magazaKodu') magazaKodu: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: number,
    @Query('size') size?: number,
  ) {
    return this.trendyolService.getOrders(
      magazaKodu,
      startDate,
      endDate,
      page,
      size,
    );
  }

  @Get(':magazaKodu/orders/:orderNumber')
  @ApiOperation({ summary: 'Trendyol sipariş detayı getir' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiParam({ name: 'orderNumber', description: 'Sipariş numarası' })
  @ApiResponse({
    status: 200,
    description: 'Sipariş detayı başarıyla getirildi',
  })
  getOrderById(
    @Param('magazaKodu') magazaKodu: string,
    @Param('orderNumber') orderNumber: string,
  ) {
    return this.trendyolService.getOrderById(magazaKodu, orderNumber);
  }

  @Put(':magazaKodu/orders/:orderNumber/status')
  @ApiOperation({ summary: 'Sipariş durumunu güncelle' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiParam({ name: 'orderNumber', description: 'Sipariş numarası' })
  @ApiResponse({
    status: 200,
    description: 'Sipariş durumu başarıyla güncellendi',
  })
  updateOrderStatus(
    @Param('magazaKodu') magazaKodu: string,
    @Param('orderNumber') orderNumber: string,
    @Body('status') status: string,
  ) {
    return this.trendyolService.updateOrderStatus(
      magazaKodu,
      orderNumber,
      status,
    );
  }

  @Post(':magazaKodu/orders/:orderNumber/shipment')
  @ApiOperation({ summary: 'Sipariş için kargo bildirimi yap' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiParam({ name: 'orderNumber', description: 'Sipariş numarası' })
  @ApiResponse({
    status: 200,
    description: 'Kargo bildirimi başarıyla yapıldı',
  })
  shipOrder(
    @Param('magazaKodu') magazaKodu: string,
    @Param('orderNumber') orderNumber: string,
    @Body() shipmentData: any,
  ) {
    return this.trendyolService.shipOrder(
      magazaKodu,
      orderNumber,
      shipmentData,
    );
  }

  // ==================== KATEGORİ İŞLEMLERİ ====================

  @Get(':magazaKodu/categories')
  @ApiOperation({ summary: 'Trendyol kategorileri getir' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiResponse({ status: 200, description: 'Kategoriler başarıyla getirildi' })
  getCategories(@Param('magazaKodu') magazaKodu: string) {
    return this.trendyolService.getCategories(magazaKodu);
  }

  @Get(':magazaKodu/categories/:categoryId/attributes')
  @ApiOperation({ summary: 'Kategori özelliklerini getir' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiParam({ name: 'categoryId', description: 'Kategori ID' })
  @ApiResponse({
    status: 200,
    description: 'Kategori özellikleri başarıyla getirildi',
  })
  getCategoryAttributes(
    @Param('magazaKodu') magazaKodu: string,
    @Param('categoryId') categoryId: string,
  ) {
    return this.trendyolService.getCategoryAttributes(magazaKodu, +categoryId);
  }

  // ==================== MARKA İŞLEMLERİ ====================

  @Get(':magazaKodu/brands')
  @ApiOperation({ summary: 'Trendyol markaları getir' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Sayfa numarası',
    example: 0,
  })
  @ApiQuery({
    name: 'size',
    required: false,
    description: 'Sayfa boyutu',
    example: 100,
  })
  @ApiResponse({ status: 200, description: 'Markalar başarıyla getirildi' })
  getBrands(
    @Param('magazaKodu') magazaKodu: string,
    @Query('page') page?: number,
    @Query('size') size?: number,
  ) {
    return this.trendyolService.getBrands(magazaKodu, page, size);
  }

  @Get(':magazaKodu/brands/search')
  @ApiOperation({ summary: 'Marka adına göre ara' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiQuery({ name: 'name', required: true, description: 'Marka adı' })
  @ApiResponse({ status: 200, description: 'Marka başarıyla bulundu' })
  getBrandByName(
    @Param('magazaKodu') magazaKodu: string,
    @Query('name') brandName: string,
  ) {
    return this.trendyolService.getBrandByName(magazaKodu, brandName);
  }
}
