import { ApiProperty } from '@nestjs/swagger';

export class N11ProductDto {
  @ApiProperty({ description: 'Ürün ID' })
  id: string;

  @ApiProperty({ description: 'Ürün adı' })
  title: string;

  @ApiProperty({ description: 'Ürün kodu' })
  productCode: string;

  @ApiProperty({ description: 'Stok kodu' })
  stockCode: string;

  @ApiProperty({ description: 'Barkod' })
  barcode: string;

  @ApiProperty({ description: 'Marka' })
  brand: string;

  @ApiProperty({ description: 'Kategori ID' })
  categoryId: number;

  @ApiProperty({ description: 'Kategori adı' })
  categoryName: string;

  @ApiProperty({ description: 'Satış fiyatı' })
  price: number;

  @ApiProperty({ description: 'Liste fiyatı' })
  listPrice: number;

  @ApiProperty({ description: 'İndirimli fiyat' })
  discountPrice: number;

  @ApiProperty({ description: 'Stok miktarı' })
  quantity: number;

  @ApiProperty({ description: 'Durum' })
  status: string;

  @ApiProperty({ description: 'Ürün görselleri' })
  images: { url: string }[];
}

export class N11ProductListDto {
  @ApiProperty({ description: 'Ürün listesi', type: [N11ProductDto] })
  products: N11ProductDto[];

  @ApiProperty({ description: 'Toplam sayı' })
  totalCount: number;

  @ApiProperty({ description: 'Sayfa numarası' })
  currentPage: number;

  @ApiProperty({ description: 'Sayfa boyutu' })
  pageSize: number;
}

