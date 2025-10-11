import { ApiProperty } from '@nestjs/swagger';

export class HepsiburadaOrderItemDto {
  @ApiProperty({ description: 'Line item ID' })
  lineItemId: string;

  @ApiProperty({ description: 'Merchant SKU' })
  merchantSku: string;

  @ApiProperty({ description: 'Ürün adı' })
  productName: string;

  @ApiProperty({ description: 'Miktar' })
  quantity: number;

  @ApiProperty({ description: 'Fiyat' })
  price: number;

  @ApiProperty({ description: 'KDV tutarı' })
  vatAmount: number;

  @ApiProperty({ description: 'Toplam tutar' })
  totalAmount: number;
}

export class HepsiburadaOrderDto {
  @ApiProperty({ description: 'Sipariş numarası' })
  orderNumber: string;

  @ApiProperty({ description: 'Sipariş tarihi' })
  orderDate: string;

  @ApiProperty({ description: 'Durum' })
  status: string;

  @ApiProperty({ description: 'Toplam tutar' })
  totalAmount: number;

  @ApiProperty({ description: 'Müşteri bilgileri' })
  customer: {
    name: string;
    email: string;
    phone: string;
  };

  @ApiProperty({ description: 'Teslimat adresi' })
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    district: string;
    postalCode: string;
    phone: string;
  };

  @ApiProperty({
    description: 'Sipariş kalemleri',
    type: [HepsiburadaOrderItemDto],
  })
  items: HepsiburadaOrderItemDto[];

  @ApiProperty({ description: 'Kargo firması' })
  cargoCompany: string;

  @ApiProperty({ description: 'Kargo takip numarası' })
  trackingNumber: string;
}

export class HepsiburadaOrderListDto {
  @ApiProperty({ description: 'Sipariş listesi', type: [HepsiburadaOrderDto] })
  orders: HepsiburadaOrderDto[];

  @ApiProperty({ description: 'Toplam sayı' })
  totalCount: number;

  @ApiProperty({ description: 'Sayfa numarası' })
  offset: number;

  @ApiProperty({ description: 'Sayfa boyutu' })
  limit: number;
}
