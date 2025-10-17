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
import { HepsiburadaService } from './hepsiburada.service';
import { CreateHepsiburadaConfigDto } from './dto/create-hepsiburada-config.dto';
import { UpdateHepsiburadaConfigDto } from './dto/update-hepsiburada-config.dto';
import { HepsiburadaProductListDto } from './dto/hepsiburada-product.dto';
import { HepsiburadaOrderListDto } from './dto/hepsiburada-order.dto';

@ApiTags('Hepsiburada')
@Controller('hepsiburada')
export class HepsiburadaController {
  constructor(private readonly hepsiburadaService: HepsiburadaService) {}


  // ==================== ÜRÜN İŞLEMLERİ ====================

  @Get(':magazaKodu/products')
  @ApiOperation({ summary: 'Hepsiburada ürünleri getir' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Başlangıç pozisyonu',
    example: 0,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit',
    example: 50,
  })
  @ApiResponse({
    status: 200,
    description: 'Ürünler başarıyla getirildi',
    type: HepsiburadaProductListDto,
  })
  getProducts(
    @Param('magazaKodu') magazaKodu: string,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
  ) {
    return this.hepsiburadaService.getProducts(magazaKodu, offset, limit);
  }

  @Get(':magazaKodu/products/:merchantSku')
  @ApiOperation({ summary: 'Hepsiburada ürün detayı getir' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiParam({ name: 'merchantSku', description: 'Merchant SKU' })
  @ApiResponse({ status: 200, description: 'Ürün detayı başarıyla getirildi' })
  getProductBySku(
    @Param('magazaKodu') magazaKodu: string,
    @Param('merchantSku') merchantSku: string,
  ) {
    return this.hepsiburadaService.getProductBySku(magazaKodu, merchantSku);
  }

  @Get(':magazaKodu/products/filter/status')
  @ApiOperation({ summary: 'Duruma göre ürünleri filtrele' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiQuery({
    name: 'status',
    required: true,
    description: 'Durum (Active, Passive, Waiting)',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Başlangıç pozisyonu',
    example: 0,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit',
    example: 50,
  })
  @ApiResponse({ status: 200, description: 'Ürünler başarıyla filtrelendi' })
  filterProductsByStatus(
    @Param('magazaKodu') magazaKodu: string,
    @Query('status') status: string,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
  ) {
    return this.hepsiburadaService.filterProductsByStatus(
      magazaKodu,
      status,
      offset,
      limit,
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
    return this.hepsiburadaService.updateStock(magazaKodu, stockUpdateData);
  }

  @Post(':magazaKodu/products/update-price')
  @ApiOperation({ summary: 'Ürün fiyatını güncelle' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiResponse({ status: 200, description: 'Fiyat başarıyla güncellendi' })
  updatePrice(
    @Param('magazaKodu') magazaKodu: string,
    @Body() priceUpdateData: any,
  ) {
    return this.hepsiburadaService.updatePrice(magazaKodu, priceUpdateData);
  }

  // ==================== SİPARİŞ İŞLEMLERİ ====================

  @Get(':magazaKodu/orders')
  @ApiOperation({ summary: 'Hepsiburada siparişleri getir' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiQuery({
    name: 'beginDate',
    required: false,
    description: 'Başlangıç tarihi (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Bitiş tarihi (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Başlangıç pozisyonu',
    example: 0,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit',
    example: 50,
  })
  @ApiResponse({
    status: 200,
    description: 'Siparişler başarıyla getirildi',
    type: HepsiburadaOrderListDto,
  })
  getOrders(
    @Param('magazaKodu') magazaKodu: string,
    @Query('beginDate') beginDate?: string,
    @Query('endDate') endDate?: string,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
  ) {
    return this.hepsiburadaService.getOrders(
      magazaKodu,
      beginDate,
      endDate,
      offset,
      limit,
    );
  }

  @Get(':magazaKodu/orders/:orderNumber')
  @ApiOperation({ summary: 'Hepsiburada sipariş detayı getir' })
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
    return this.hepsiburadaService.getOrderById(magazaKodu, orderNumber);
  }

  @Post(':magazaKodu/orders/acknowledge')
  @ApiOperation({ summary: 'Siparişi onayla' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiResponse({ status: 200, description: 'Sipariş başarıyla onaylandı' })
  acknowledgeOrder(
    @Param('magazaKodu') magazaKodu: string,
    @Body() orderData: any,
  ) {
    return this.hepsiburadaService.acknowledgeOrder(magazaKodu, orderData);
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
    return this.hepsiburadaService.shipOrder(magazaKodu, shipmentData);
  }

  @Post(':magazaKodu/orders/cancel')
  @ApiOperation({ summary: 'Siparişi iptal et' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiResponse({ status: 200, description: 'Sipariş başarıyla iptal edildi' })
  cancelOrder(
    @Param('magazaKodu') magazaKodu: string,
    @Body() cancelData: any,
  ) {
    return this.hepsiburadaService.cancelOrder(magazaKodu, cancelData);
  }

  // ==================== KATEGORİ İŞLEMLERİ ====================

  @Get(':magazaKodu/categories')
  @ApiOperation({ summary: 'Hepsiburada kategorileri getir' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiResponse({ status: 200, description: 'Kategoriler başarıyla getirildi' })
  getCategories(@Param('magazaKodu') magazaKodu: string) {
    return this.hepsiburadaService.getCategories(magazaKodu);
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
    return this.hepsiburadaService.getCategoryAttributes(
      magazaKodu,
      categoryId,
    );
  }

  // ==================== MARKA İŞLEMLERİ ====================

  @Get(':magazaKodu/brands')
  @ApiOperation({ summary: 'Hepsiburada markaları getir' })
  @ApiParam({ name: 'magazaKodu', description: 'Mağaza kodu' })
  @ApiResponse({ status: 200, description: 'Markalar başarıyla getirildi' })
  getBrands(@Param('magazaKodu') magazaKodu: string) {
    return this.hepsiburadaService.getBrands(magazaKodu);
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
    return this.hepsiburadaService.getBrandByName(magazaKodu, brandName);
  }
}
