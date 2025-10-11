import { ApiProperty } from '@nestjs/swagger';

export class TrendyolOrderItemDto {
  @ApiProperty({ description: 'Ürün ID' })
  id: number;

  @ApiProperty({ description: 'Ürün adı' })
  productName: string;

  @ApiProperty({ description: 'Barkod' })
  barcode: string;

  @ApiProperty({ description: 'Miktar' })
  quantity: number;

  @ApiProperty({ description: 'Fiyat' })
  price: number;

  @ApiProperty({ description: 'KDV oranı' })
  vatRate: number;

  @ApiProperty({ description: 'İndirim' })
  discount: number;
}

export class TrendyolOrderDto {
  @ApiProperty({ description: 'Sipariş numarası' })
  orderNumber: string;

  @ApiProperty({ description: 'Sipariş tarihi' })
  orderDate: string;

  @ApiProperty({ description: 'Durum' })
  status: string;

  @ApiProperty({ description: 'Toplam fiyat' })
  totalPrice: number;

  @ApiProperty({ description: 'Müşteri adı' })
  customerFirstName: string;

  @ApiProperty({ description: 'Müşteri soyadı' })
  customerLastName: string;

  @ApiProperty({ description: 'Teslimat adresi' })
  shipmentAddress: {
    fullName: string;
    address: string;
    city: string;
    district: string;
    postalCode: string;
    phone: string;
  };

  @ApiProperty({
    description: 'Sipariş kalemleri',
    type: [TrendyolOrderItemDto],
  })
  lines: TrendyolOrderItemDto[];

  @ApiProperty({ description: 'Kargo firması' })
  cargoProvider: string;

  @ApiProperty({ description: 'Kargo takip numarası' })
  cargoTrackingNumber: string;
}

export class TrendyolOrderListDto {
  @ApiProperty({ description: 'Sipariş listesi', type: [TrendyolOrderDto] })
  content: TrendyolOrderDto[];

  @ApiProperty({ description: 'Toplam sayfa' })
  totalPages: number;

  @ApiProperty({ description: 'Toplam öğe' })
  totalElements: number;

  @ApiProperty({ description: 'Sayfa numarası' })
  page: number;

  @ApiProperty({ description: 'Sayfa boyutu' })
  size: number;
}
