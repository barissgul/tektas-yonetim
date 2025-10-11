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
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { N11Service } from './n11.service';
import { CreateN11ConfigDto } from './dto/create-n11-config.dto';
import { UpdateN11ConfigDto } from './dto/update-n11-config.dto';
import { N11ProductListDto } from './dto/n11-product.dto';
import { N11OrderListDto } from './dto/n11-order.dto';

@ApiTags('N11')
@Controller('n11')
export class N11Controller {
  constructor(private readonly n11Service: N11Service) {}

  // ==================== CONFIG CRUD ====================

  @Post('config')
  @ApiOperation({ summary: 'Yeni N11 config oluştur' })
  @ApiResponse({ status: 201, description: 'Config başarıyla oluşturuldu' })
  createConfig(@Body() createDto: CreateN11ConfigDto) {
    return this.n11Service.createConfig(createDto);
  }

  @Get('config')
  @ApiOperation({ summary: 'Tüm N11 configleri getir' })
  @ApiResponse({ status: 200, description: 'Configler başarıyla getirildi' })
  getAllConfigs() {
    return this.n11Service.getAllConfigs();
  }

  @Get('config/:id')
  @ApiOperation({ summary: 'ID ile N11 config getir' })
  @ApiParam({ name: 'id', description: 'Config ID' })
  @ApiResponse({ status: 200, description: 'Config başarıyla getirildi' })
  getConfigById(@Param('id') id: string) {
    return this.n11Service.getConfigById(+id);
  }

  @Patch('config/:id')
  @ApiOperation({ summary: 'N11 config güncelle' })
  @ApiParam({ name: 'id', description: 'Config ID' })
  @ApiResponse({ status: 200, description: 'Config başarıyla güncellendi' })
  updateConfig(@Param('id') id: string, @Body() updateDto: UpdateN11ConfigDto) {
    return this.n11Service.updateConfig(+id, updateDto);
  }

  @Delete('config/:id')
  @ApiOperation({ summary: 'N11 config sil' })
  @ApiParam({ name: 'id', description: 'Config ID' })
  @ApiResponse({ status: 200, description: 'Config başarıyla silindi' })
  deleteConfig(@Param('id') id: string) {
    return this.n11Service.deleteConfig(+id);
  }

  // ==================== ÜRÜN İŞLEMLERİ ====================

  @Get(':magazaKodu/products')
  @ApiOperation({ summary: 'N11 ürünleri getir' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiQuery({
    name: 'currentPage',
    required: false,
    description: 'Sayfa numarası',
    example: 0,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Sayfa boyutu',
    example: 100,
  })
  @ApiResponse({
    status: 200,
    description: 'Ürünler başarıyla getirildi',
    type: N11ProductListDto,
  })
  getProducts(
    @Param('magazaKodu') magazaKodu: string,
    @Query('currentPage') currentPage?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.n11Service.getProducts(magazaKodu, currentPage, pageSize);
  }

  @Get(':magazaKodu/products/:productId')
  @ApiOperation({ summary: 'N11 ürün detayı getir' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiParam({ name: 'productId', description: 'Ürün ID' })
  @ApiResponse({ status: 200, description: 'Ürün detayı başarıyla getirildi' })
  getProductById(
    @Param('magazaKodu') magazaKodu: string,
    @Param('productId') productId: string,
  ) {
    return this.n11Service.getProductById(magazaKodu, productId);
  }

  @Get(':magazaKodu/products/stockCode/:stockCode')
  @ApiOperation({ summary: 'Stok koduna göre ürün getir' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiParam({ name: 'stockCode', description: 'Stok kodu' })
  @ApiResponse({ status: 200, description: 'Ürün başarıyla bulundu' })
  getProductByStockCode(
    @Param('magazaKodu') magazaKodu: string,
    @Param('stockCode') stockCode: string,
  ) {
    return this.n11Service.getProductByStockCode(magazaKodu, stockCode);
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
    return this.n11Service.updateStock(magazaKodu, stockUpdateData);
  }

  @Post(':magazaKodu/products/update-price')
  @ApiOperation({ summary: 'Ürün fiyatını güncelle' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiResponse({ status: 200, description: 'Fiyat başarıyla güncellendi' })
  updatePrice(
    @Param('magazaKodu') magazaKodu: string,
    @Body() priceUpdateData: any,
  ) {
    return this.n11Service.updatePrice(magazaKodu, priceUpdateData);
  }

  // ==================== SİPARİŞ İŞLEMLERİ ====================

  @Get(':magazaKodu/orders')
  @ApiOperation({ summary: 'N11 siparişleri getir' })
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
    name: 'status',
    required: false,
    description: 'Sipariş durumu (Created, Approved, etc.)',
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
    example: 100,
  })
  @ApiResponse({
    status: 200,
    description: 'Siparişler başarıyla getirildi',
    type: N11OrderListDto,
  })
  getOrders(
    @Param('magazaKodu') magazaKodu: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('size') size?: number,
  ) {
    return this.n11Service.getOrders(
      magazaKodu,
      startDate,
      endDate,
      status,
      page,
      size,
    );
  }

  @Get(':magazaKodu/orders/:orderNumber')
  @ApiOperation({ summary: 'N11 sipariş detayı getir' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiParam({ name: 'orderNumber', description: 'Sipariş numarası' })
  @ApiResponse({
    status: 200,
    description: 'Sipariş detayı başarıyla getirildi',
  })
  getOrderDetail(
    @Param('magazaKodu') magazaKodu: string,
    @Param('orderNumber') orderNumber: string,
  ) {
    return this.n11Service.getOrderDetail(magazaKodu, orderNumber);
  }

  @Post(':magazaKodu/orders/accept')
  @ApiOperation({ summary: 'Siparişi kabul et' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiResponse({ status: 200, description: 'Sipariş başarıyla kabul edildi' })
  acceptOrder(@Param('magazaKodu') magazaKodu: string, @Body() orderData: any) {
    return this.n11Service.acceptOrder(magazaKodu, orderData);
  }

  @Post(':magazaKodu/orders/reject')
  @ApiOperation({ summary: 'Siparişi reddet' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiResponse({ status: 200, description: 'Sipariş başarıyla reddedildi' })
  rejectOrder(
    @Param('magazaKodu') magazaKodu: string,
    @Body() rejectData: any,
  ) {
    return this.n11Service.rejectOrder(magazaKodu, rejectData);
  }

  @Post(':magazaKodu/orders/shipment')
  @ApiOperation({ summary: 'Sipariş için kargo bildirimi yap' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiResponse({
    status: 200,
    description: 'Kargo bildirimi başarıyla yapıldı',
  })
  shipOrder(
    @Param('magazaKodu') magazaKodu: string,
    @Body() shipmentData: any,
  ) {
    return this.n11Service.shipOrder(magazaKodu, shipmentData);
  }

  // ==================== KATEGORİ İŞLEMLERİ ====================

  @Get(':magazaKodu/categories')
  @ApiOperation({ summary: 'N11 kategorileri getir' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiResponse({ status: 200, description: 'Kategoriler başarıyla getirildi' })
  getCategories(@Param('magazaKodu') magazaKodu: string) {
    return this.n11Service.getCategories(magazaKodu);
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
    return this.n11Service.getCategoryAttributes(magazaKodu, +categoryId);
  }

  // ==================== MARKA İŞLEMLERİ ====================

  @Get(':magazaKodu/brands')
  @ApiOperation({ summary: 'N11 markaları getir' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiResponse({ status: 200, description: 'Markalar başarıyla getirildi' })
  getBrands(@Param('magazaKodu') magazaKodu: string) {
    return this.n11Service.getBrands(magazaKodu);
  }

  @Get(':magazaKodu/brands/search')
  @ApiOperation({ summary: 'Marka adına göre ara' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiQuery({ name: 'name', required: true, description: 'Marka adı' })
  @ApiResponse({ status: 200, description: 'Marka başarıyla bulundu' })
  searchBrands(
    @Param('magazaKodu') magazaKodu: string,
    @Query('name') brandName: string,
  ) {
    return this.n11Service.searchBrands(magazaKodu, brandName);
  }
}
