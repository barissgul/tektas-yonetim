import { ApiProperty } from '@nestjs/swagger';

export class TrendyolProductDto {
  @ApiProperty({ description: 'Ürün ID' })
  id: string;

  @ApiProperty({ description: 'Ürün başlığı' })
  title: string;

  @ApiProperty({ description: 'Ürün açıklaması' })
  description: string;

  @ApiProperty({ description: 'Barkod' })
  barcode: string;

  @ApiProperty({ description: 'Marka' })
  brand: string;

  @ApiProperty({ description: 'Kategori ID' })
  categoryId: number;

  @ApiProperty({ description: 'Fiyat' })
  salePrice: number;

  @ApiProperty({ description: 'Liste fiyatı' })
  listPrice: number;

  @ApiProperty({ description: 'Stok miktarı' })
  quantity: number;

  @ApiProperty({ description: 'Ürün kodu' })
  productCode: string;

  @ApiProperty({ description: 'Stok kodu' })
  stockCode: string;

  @ApiProperty({ description: 'Ürün görselleri' })
  images: { url: string }[];
}

export class TrendyolProductListDto {
  @ApiProperty({ description: 'Ürün listesi', type: [TrendyolProductDto] })
  content: TrendyolProductDto[];

  @ApiProperty({ description: 'Toplam sayfa' })
  totalPages: number;

  @ApiProperty({ description: 'Toplam öğe' })
  totalElements: number;

  @ApiProperty({ description: 'Sayfa numarası' })
  page: number;

  @ApiProperty({ description: 'Sayfa boyutu' })
  size: number;
}
