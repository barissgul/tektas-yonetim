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
  HttpException,
  HttpStatus,
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

  @Get(':magazaKodu/products/batch-requests/:batchRequestId')
  @ApiOperation({ summary: 'Toplu işlem sonucunu kontrol et' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiParam({ name: 'batchRequestId', description: 'Batch Request ID' })
  @ApiResponse({
    status: 200,
    description: 'Batch request sonucu başarıyla getirildi',
  })
  getBatchRequestResult(
    @Param('magazaKodu') magazaKodu: string,
    @Param('batchRequestId') batchRequestId: string,
  ) {
    return this.trendyolService.getBatchRequestResult(
      magazaKodu,
      batchRequestId,
    );
  }

  @Get(':magazaKodu/shipment-providers')
  @ApiOperation({ summary: 'Kargo firmalar listesi' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiResponse({
    status: 200,
    description: 'Kargo firmaları başarıyla getirildi',
  })
  getShipmentProviders(@Param('magazaKodu') magazaKodu: string) {
    return this.trendyolService.getShipmentProviders(magazaKodu);
  }

  @Get(':magazaKodu/addresses')
  @ApiOperation({ summary: 'İade ve sevkiyat adres bilgileri' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiResponse({
    status: 200,
    description: 'Adresler başarıyla getirildi',
  })
  getAddresses(@Param('magazaKodu') magazaKodu: string) {
    return this.trendyolService.getAddresses(magazaKodu);
  }

  // ==================== SİPARİŞ İŞLEMLERİ ====================

  @Get(':magazaKodu/orders')
  @ApiOperation({ summary: 'Trendyol siparişleri getir' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Başlangıç tarihi (YYYY-MM-DD) - Timestamp milliseconds GMT+3',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Bitiş tarihi (YYYY-MM-DD) - Timestamp milliseconds GMT+3',
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
    description: 'Sayfa boyutu (Maksimum 200)',
    example: 50,
  })
  @ApiQuery({
    name: 'orderNumber',
    required: false,
    description: 'Belirli sipariş numarası',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Sipariş durumu',
    enum: ['Created', 'Picking', 'Invoiced', 'Shipped', 'Cancelled', 'Delivered', 'UnDelivered', 'Returned', 'AtCollectionPoint', 'UnPacked', 'UnSupplied'],
  })
  @ApiQuery({
    name: 'orderByField',
    required: false,
    description: 'Sıralama alanı',
    example: 'PackageLastModifiedDate',
  })
  @ApiQuery({
    name: 'orderByDirection',
    required: false,
    description: 'Sıralama yönü',
    enum: ['ASC', 'DESC'],
    example: 'DESC',
  })
  @ApiQuery({
    name: 'shipmentPackageIds',
    required: false,
    description: 'Paket numarası ile sorgu',
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
    @Query('orderNumber') orderNumber?: string,
    @Query('status') status?: string,
    @Query('orderByField') orderByField?: string,
    @Query('orderByDirection') orderByDirection?: string,
    @Query('shipmentPackageIds') shipmentPackageIds?: string,
  ) {
    return this.trendyolService.getOrders(
      magazaKodu,
      startDate,
      endDate,
      page,
      size,
      orderNumber,
      status,
      orderByField,
      orderByDirection,
      shipmentPackageIds,
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

  @Put(':magazaKodu/shipment-packages/:shipmentPackageId/tracking-number')
  @ApiOperation({ summary: 'Kargo takip kodu güncelle' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiParam({ name: 'shipmentPackageId', description: 'Shipment Package ID' })
  @ApiResponse({
    status: 200,
    description: 'Kargo takip kodu başarıyla güncellendi',
  })
  updateTrackingNumber(
    @Param('magazaKodu') magazaKodu: string,
    @Param('shipmentPackageId') shipmentPackageId: string,
    @Body('trackingNumber') trackingNumber: string,
  ) {
    return this.trendyolService.updateTrackingNumber(
      magazaKodu,
      shipmentPackageId,
      trackingNumber,
    );
  }

  @Put(':magazaKodu/shipment-packages/:shipmentPackageId')
  @ApiOperation({
    summary: 'Paket statü bildirimi (Picking, Invoiced vb.)',
  })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiParam({ name: 'shipmentPackageId', description: 'Shipment Package ID' })
  @ApiResponse({
    status: 200,
    description: 'Paket statüsü başarıyla güncellendi',
  })
  updatePackageStatus(
    @Param('magazaKodu') magazaKodu: string,
    @Param('shipmentPackageId') shipmentPackageId: string,
    @Body() updateData: any,
  ) {
    return this.trendyolService.updatePackageStatus(
      magazaKodu,
      shipmentPackageId,
      updateData,
    );
  }

  @Post(':magazaKodu/supplier-invoice-links')
  @ApiOperation({ summary: 'Fatura linki gönder' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiResponse({
    status: 201,
    description: 'Fatura linki başarıyla gönderildi',
  })
  sendInvoiceLink(
    @Param('magazaKodu') magazaKodu: string,
    @Body() invoiceData: any,
  ) {
    return this.trendyolService.sendInvoiceLink(magazaKodu, invoiceData);
  }

  @Post(':magazaKodu/shipment-packages/:shipmentPackageId/split-packages')
  @ApiOperation({ summary: 'Sipariş paketlerini böl' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiParam({ name: 'shipmentPackageId', description: 'Shipment Package ID' })
  @ApiResponse({
    status: 201,
    description: 'Paket başarıyla bölündü',
  })
  splitPackage(
    @Param('magazaKodu') magazaKodu: string,
    @Param('shipmentPackageId') shipmentPackageId: string,
    @Body() splitData: any,
  ) {
    return this.trendyolService.splitPackage(
      magazaKodu,
      shipmentPackageId,
      splitData,
    );
  }

  @Post(':magazaKodu/shipment-packages/:shipmentPackageId/cargo-providers')
  @ApiOperation({ summary: 'Paket kargo firması değiştir' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiParam({ name: 'shipmentPackageId', description: 'Shipment Package ID' })
  @ApiResponse({
    status: 200,
    description: 'Kargo firması başarıyla değiştirildi',
  })
  changeCargoProvider(
    @Param('magazaKodu') magazaKodu: string,
    @Param('shipmentPackageId') shipmentPackageId: string,
    @Body('cargoProvider') cargoProvider: string,
  ) {
    return this.trendyolService.changeCargoProvider(
      magazaKodu,
      shipmentPackageId,
      cargoProvider,
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

  // ==================== İADE İŞLEMLERİ ====================

  @Get(':magazaKodu/claims')
  @ApiOperation({ summary: 'İade siparişleri getir' })
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
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Başlangıç tarihi',
  })
  @ApiQuery({ name: 'endDate', required: false, description: 'Bitiş tarihi' })
  @ApiResponse({
    status: 200,
    description: 'İade siparişleri başarıyla getirildi',
  })
  getClaims(
    @Param('magazaKodu') magazaKodu: string,
    @Query('page') page?: number,
    @Query('size') size?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.trendyolService.getClaims(
      magazaKodu,
      page,
      size,
      startDate,
      endDate,
    );
  }

  @Post(':magazaKodu/claims/create')
  @ApiOperation({ summary: 'İade talebi oluştur' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiResponse({
    status: 201,
    description: 'İade talebi başarıyla oluşturuldu',
  })
  createClaim(
    @Param('magazaKodu') magazaKodu: string,
    @Body() claimData: any,
  ) {
    return this.trendyolService.createClaim(magazaKodu, claimData);
  }

  @Put('claims/:claimId/items/approve')
  @ApiOperation({ summary: 'İade siparişini onayla' })
  @ApiParam({ name: 'claimId', description: 'Claim ID' })
  @ApiResponse({
    status: 200,
    description: 'İade başarıyla onaylandı',
  })
  approveClaim(
    @Param('magazaKodu') magazaKodu: string,
    @Param('claimId') claimId: string,
    @Body() approveData: any,
  ) {
    return this.trendyolService.approveClaim(magazaKodu, claimId, approveData);
  }

  @Post('claims/:claimId/issue')
  @ApiOperation({ summary: 'İade siparişinde ret talebi oluştur' })
  @ApiParam({ name: 'claimId', description: 'Claim ID' })
  @ApiQuery({
    name: 'claimIssueReasonId',
    required: true,
    description: 'Red sebep ID',
  })
  @ApiQuery({
    name: 'claimItemIdList',
    required: true,
    description: 'Claim Item ID listesi',
  })
  @ApiQuery({
    name: 'description',
    required: true,
    description: 'Açıklama',
  })
  @ApiResponse({
    status: 201,
    description: 'İade ret talebi başarıyla oluşturuldu',
  })
  rejectClaim(
    @Param('magazaKodu') magazaKodu: string,
    @Param('claimId') claimId: string,
    @Query('claimIssueReasonId') claimIssueReasonId: number,
    @Query('claimItemIdList') claimItemIdList: string,
    @Query('description') description: string,
  ) {
    return this.trendyolService.rejectClaim(
      magazaKodu,
      claimId,
      claimIssueReasonId,
      claimItemIdList,
      description,
    );
  }

  @Get(':magazaKodu/claim-issue-reasons')
  @ApiOperation({ summary: 'İade red sebeplerini getir' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiResponse({
    status: 200,
    description: 'İade red sebepleri başarıyla getirildi',
  })
  getClaimIssueReasons(@Param('magazaKodu') magazaKodu: string) {
    return this.trendyolService.getClaimIssueReasons(magazaKodu);
  }

  // ==================== SORU-CEVAP İŞLEMLERİ ====================

  @Get(':magazaKodu/questions')
  @ApiOperation({ summary: 'Müşteri sorularını getir' })
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
    description: 'Müşteri soruları başarıyla getirildi',
  })
  getQuestions(
    @Param('magazaKodu') magazaKodu: string,
    @Query('page') page?: number,
    @Query('size') size?: number,
  ) {
    return this.trendyolService.getQuestions(magazaKodu, page, size);
  }

  @Post(':magazaKodu/questions/:questionId/answers')
  @ApiOperation({ summary: 'Müşteri sorusunu cevapla' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiParam({ name: 'questionId', description: 'Soru ID' })
  @ApiResponse({
    status: 201,
    description: 'Soru başarıyla cevaplandı',
  })
  answerQuestion(
    @Param('magazaKodu') magazaKodu: string,
    @Param('questionId') questionId: string,
    @Body('text') text: string,
  ) {
    return this.trendyolService.answerQuestion(magazaKodu, questionId, text);
  }

  // ==================== SİPARİŞ VERİTABANI İŞLEMLERİ ====================

  @Post(':magazaKodu/orders/sync')
  @ApiOperation({ summary: 'Trendyol siparişlerini API\'den çek ve veritabanına kaydet' })
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
    description: 'Siparişler başarıyla senkronize edildi',
  })
  async syncOrders(
    @Param('magazaKodu') magazaKodu: string,
    @Query('page') page?: number,
    @Query('size') size?: number,
  ) {
    // API'den siparişleri çek
    const ordersResponse = await this.trendyolService.getOrders(
      magazaKodu,
      undefined, // startDate
      undefined, // endDate
      page || 0,
      size || 50,
    );

    // Veritabanına kaydet
    const result = await this.trendyolService.saveOrdersFromApi(
      magazaKodu,
      ordersResponse.content || [],
    );

    return {
      message: 'Siparişler başarıyla senkronize edildi',
      apiResponse: {
        totalElements: ordersResponse.totalElements,
        totalPages: ordersResponse.totalPages,
        page: ordersResponse.page,
        size: ordersResponse.size,
      },
      dbResult: result,
    };
  }

  @Get(':magazaKodu/orders/db')
  @ApiOperation({ summary: 'Veritabanından Trendyol siparişleri getir' })
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
    description: 'Veritabanından siparişler başarıyla getirildi',
  })
  async getOrdersFromDb(
    @Param('magazaKodu') magazaKodu: string,
    @Query('page') page?: number,
    @Query('size') size?: number,
  ) {
    const result = await this.trendyolService.getOrdersFromDb(
      magazaKodu,
      page || 0,
      size || 50,
    );

    return {
      total: result.total,
      page: page || 0,
      size: size || 50,
      totalPages: Math.ceil(result.total / (size || 50)),
      orders: result.orders,
    };
  }

  @Get(':magazaKodu/orders/db/:orderNumber')
  @ApiOperation({ summary: 'Veritabanından Trendyol sipariş detayı getir' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiParam({ name: 'orderNumber', description: 'Sipariş numarası' })
  @ApiResponse({
    status: 200,
    description: 'Sipariş detayı başarıyla getirildi',
  })
  async getOrderFromDb(
    @Param('magazaKodu') magazaKodu: string,
    @Param('orderNumber') orderNumber: string,
  ) {
    const order = await this.trendyolService.getOrderFromDb(orderNumber);
    
    if (!order) {
      throw new HttpException('Sipariş bulunamadı', HttpStatus.NOT_FOUND);
    }

    return order;
  }

  @Post(':magazaKodu/orders/save')
  @ApiOperation({ summary: 'Trendyol sipariş verilerini manuel olarak kaydet' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiResponse({
    status: 200,
    description: 'Siparişler başarıyla kaydedildi',
  })
  async saveOrders(
    @Param('magazaKodu') magazaKodu: string,
    @Body() ordersData: any[],
  ) {
    const result = await this.trendyolService.saveOrdersFromApi(
      magazaKodu,
      ordersData,
    );

    return {
      message: 'Siparişler başarıyla kaydedildi',
      result,
    };
  }
}
