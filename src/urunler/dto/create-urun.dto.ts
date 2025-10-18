import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateUrunDto {
  @ApiProperty({
    description: 'Sanal Mağaza ID',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty({ message: 'Sanal mağaza ID zorunludur' })
  sanal_magaza_id: number;

  @ApiProperty({
    description: 'Ürün/Stok Kodu (SKU)',
    example: 'URT001',
  })
  @IsString()
  @IsNotEmpty({ message: 'Ürün kodu zorunludur' })
  @MaxLength(100)
  urun_kodu: string;

  @ApiProperty({
    description: 'Ürün Adı',
    example: 'Tektas Granit Seramik 60x60',
  })
  @IsString()
  @IsNotEmpty({ message: 'Ürün adı zorunludur' })
  @MaxLength(255)
  urun_adi: string;

  @ApiProperty({
    description: 'Ürün Açıklaması',
    example: 'Birinci sınıf granit seramik, mat yüzey',
    required: false,
  })
  @IsString()
  @IsOptional()
  aciklama?: string;

  @ApiProperty({
    description: 'Kategori',
    example: 'Seramik',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  kategori?: string;

  @ApiProperty({
    description: 'Marka',
    example: 'Tektas',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  marka?: string;

  @ApiProperty({
    description: 'Barkod',
    example: '8690123456789',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  barkod?: string;

  @ApiProperty({
    description: 'Satış Fiyatı',
    example: 89.90,
  })
  @IsNumber()
  @IsNotEmpty({ message: 'Fiyat zorunludur' })
  @Min(0, { message: 'Fiyat 0\'dan küçük olamaz' })
  fiyat: number;

  @ApiProperty({
    description: 'Maliyet Fiyatı',
    example: 65.00,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Maliyet 0\'dan küçük olamaz' })
  maliyet?: number;

  @ApiProperty({
    description: 'Stok Miktarı',
    example: 150,
    default: 0,
  })
  @IsInt()
  @IsOptional()
  @Min(0, { message: 'Stok miktarı 0\'dan küçük olamaz' })
  stok_miktari?: number;

  @ApiProperty({
    description: 'Minimum Stok Uyarı Seviyesi',
    example: 20,
    required: false,
  })
  @IsInt()
  @IsOptional()
  @Min(0)
  min_stok_miktari?: number;

  @ApiProperty({
    description: 'Birim',
    example: 'Adet',
    default: 'Adet',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  birim?: string;

  @ApiProperty({
    description: 'Ürün Resim URL',
    example: 'https://example.com/urun.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  resim_url?: string;

  @ApiProperty({
    description: 'Durum (1: Aktif, 0: Pasif)',
    example: 1,
    default: 1,
  })
  @IsInt()
  @IsOptional()
  durum?: number;
}

