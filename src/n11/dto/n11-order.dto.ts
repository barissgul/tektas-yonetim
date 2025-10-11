import { ApiProperty } from '@nestjs/swagger';

export class N11OrderItemDto {
  @ApiProperty({ description: 'Ürün ID' })
  productId: string;

  @ApiProperty({ description: 'Ürün adı' })
  productName: string;

  @ApiProperty({ description: 'Miktar' })
  quantity: number;

  @ApiProperty({ description: 'Fiyat' })
  price: number;

  @ApiProperty({ description: 'İndirim tutarı' })
  discount: number;

  @ApiProperty({ description: 'KDV' })
  taxRate: number;

  @ApiProperty({ description: 'Toplam tutar' })
  totalAmount: number;

  @ApiProperty({ description: 'Barkod' })
  barcode: string;
}

export class N11OrderDto {
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
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    tcIdentityNumber: string;
  };

  @ApiProperty({ description: 'Teslimat adresi' })
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    district: string;
    postalCode: string;
    phone: string;
  };

  @ApiProperty({ description: 'Fatura adresi' })
  billingAddress: {
    fullName: string;
    address: string;
    city: string;
    district: string;
    postalCode: string;
    phone: string;
    taxOffice: string;
    taxNumber: string;
  };

  @ApiProperty({ description: 'Sipariş kalemleri', type: [N11OrderItemDto] })
  items: N11OrderItemDto[];

  @ApiProperty({ description: 'Kargo bilgileri' })
  shipment: {
    company: string;
    trackingNumber: string;
    status: string;
  };
}

export class N11OrderListDto {
  @ApiProperty({ description: 'Sipariş listesi', type: [N11OrderDto] })
  orders: N11OrderDto[];

  @ApiProperty({ description: 'Toplam sayı' })
  totalCount: number;

  @ApiProperty({ description: 'Sayfa numarası' })
  currentPage: number;

  @ApiProperty({ description: 'Sayfa boyutu' })
  pageSize: number;
}

