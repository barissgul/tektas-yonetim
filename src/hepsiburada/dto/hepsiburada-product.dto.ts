import { ApiProperty } from '@nestjs/swagger';

export class HepsiburadaProductDto {
  @ApiProperty({ description: 'Ürün ID' })
  productId: string;

  @ApiProperty({ description: 'HepsiBurada SKU' })
  hbSku: string;

  @ApiProperty({ description: 'Merchant SKU' })
  merchantSku: string;

  @ApiProperty({ description: 'Ürün adı' })
  productName: string;

  @ApiProperty({ description: 'Barkod' })
  barcode: string;

  @ApiProperty({ description: 'Marka' })
  brand: string;

  @ApiProperty({ description: 'Kategori' })
  category: string;

  @ApiProperty({ description: 'Satış fiyatı' })
  price: number;

  @ApiProperty({ description: 'Liste fiyatı' })
  listPrice: number;

  @ApiProperty({ description: 'Stok miktarı' })
  stockQuantity: number;

  @ApiProperty({ description: 'Durum' })
  status: string;

  @ApiProperty({ description: 'Ürün görselleri' })
  images: string[];
}

export class HepsiburadaProductListDto {
  @ApiProperty({ description: 'Ürün listesi', type: [HepsiburadaProductDto] })
  listings: HepsiburadaProductDto[];

  @ApiProperty({ description: 'Toplam sayfa' })
  totalCount: number;

  @ApiProperty({ description: 'Sayfa numarası' })
  offset: number;

  @ApiProperty({ description: 'Sayfa boyutu' })
  limit: number;
}
