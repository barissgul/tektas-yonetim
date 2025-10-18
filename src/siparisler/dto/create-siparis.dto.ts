import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsInt,
  IsArray,
  ValidateNested,
  Min,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSiparisDetayDto {
  @ApiProperty({ description: 'Ürün ID (opsiyonel)', required: false })
  @IsInt()
  @IsOptional()
  urun_id?: number;

  @ApiProperty({ description: 'Ürün Kodu', example: 'URT001', required: false })
  @IsString()
  @IsOptional()
  urun_kodu?: string;

  @ApiProperty({ description: 'Ürün Adı', example: 'Tektas Granit Seramik 60x60' })
  @IsString()
  @IsNotEmpty()
  urun_adi: string;

  @ApiProperty({ description: 'Barkod', required: false })
  @IsString()
  @IsOptional()
  barkod?: string;

  @ApiProperty({ description: 'Varyant Bilgisi', example: 'Gri - Mat', required: false })
  @IsString()
  @IsOptional()
  varyant_bilgisi?: string;

  @ApiProperty({ description: 'Miktar', example: 5 })
  @IsInt()
  @Min(1)
  miktar: number;

  @ApiProperty({ description: 'Birim Fiyat', example: 89.90 })
  @IsNumber()
  @Min(0)
  birim_fiyat: number;

  @ApiProperty({ description: 'İndirim', example: 0.00, default: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  indirim?: number;

  @ApiProperty({ description: 'KDV Oranı (%)', example: 18.00, default: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  kdv_orani?: number;

  @ApiProperty({ description: 'Platform Ürün ID', required: false })
  @IsString()
  @IsOptional()
  platform_urun_id?: string;

  @ApiProperty({ description: 'Platform Kalem ID', required: false })
  @IsString()
  @IsOptional()
  platform_kalem_id?: string;
}

export class CreateSiparisDto {
  @ApiProperty({ description: 'Sipariş Numarası', example: 'SIP-2025-0001' })
  @IsString()
  @IsNotEmpty()
  siparis_no: string;

  @ApiProperty({ description: 'Sanal Mağaza ID', example: 1 })
  @IsInt()
  @IsNotEmpty()
  sanal_magaza_id: number;

  // Müşteri Bilgileri
  @ApiProperty({ description: 'Müşteri Adı', example: 'Ahmet', required: false })
  @IsString()
  @IsOptional()
  musteri_adi?: string;

  @ApiProperty({ description: 'Müşteri Soyadı', example: 'Yılmaz', required: false })
  @IsString()
  @IsOptional()
  musteri_soyadi?: string;

  @ApiProperty({ description: 'Müşteri Email', required: false })
  @IsString()
  @IsOptional()
  musteri_email?: string;

  @ApiProperty({ description: 'Müşteri Telefon', required: false })
  @IsString()
  @IsOptional()
  musteri_telefon?: string;

  // Fiyat Bilgileri
  @ApiProperty({ description: 'Kargo Ücreti', example: 29.90, default: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  kargo_ucreti?: number;

  @ApiProperty({ description: 'İndirim Tutarı', example: 0.00, default: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  indirim_tutari?: number;

  @ApiProperty({ description: 'Para Birimi', example: 'TRY', default: 'TRY' })
  @IsString()
  @IsOptional()
  para_birimi?: string;

  // Kargo Bilgileri
  @ApiProperty({ description: 'Kargo Firması', required: false })
  @IsString()
  @IsOptional()
  kargo_firmasi?: string;

  @ApiProperty({ description: 'Kargo Takip No', required: false })
  @IsString()
  @IsOptional()
  kargo_takip_no?: string;

  @ApiProperty({ description: 'Kargo Takip Link', required: false })
  @IsString()
  @IsOptional()
  kargo_takip_link?: string;

  // Adres Bilgileri
  @ApiProperty({ description: 'Teslimat Adresi (JSON)', required: false })
  @IsObject()
  @IsOptional()
  teslimat_adresi?: any;

  @ApiProperty({ description: 'Fatura Adresi (JSON)', required: false })
  @IsObject()
  @IsOptional()
  fatura_adresi?: any;

  // Durum
  @ApiProperty({ description: 'Durum', example: 'Beklemede', default: 'Beklemede' })
  @IsString()
  @IsOptional()
  durum?: string;

  @ApiProperty({ description: 'Ödeme Durumu', example: 'Ödenmedi', default: 'Ödenmedi' })
  @IsString()
  @IsOptional()
  odeme_durumu?: string;

  @ApiProperty({ description: 'Ödeme Yöntemi', example: 'Kredi Kartı', required: false })
  @IsString()
  @IsOptional()
  odeme_yontemi?: string;

  // Notlar
  @ApiProperty({ description: 'Müşteri Notu', required: false })
  @IsString()
  @IsOptional()
  musteri_notu?: string;

  @ApiProperty({ description: 'Yönetici Notu', required: false })
  @IsString()
  @IsOptional()
  yonetici_notu?: string;

  // Platform
  @ApiProperty({ description: 'Platform Sipariş ID', required: false })
  @IsString()
  @IsOptional()
  platform_siparis_id?: string;

  // Sipariş Kalemleri
  @ApiProperty({
    description: 'Sipariş Detayları/Kalemleri',
    type: [CreateSiparisDetayDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSiparisDetayDto)
  detaylar: CreateSiparisDetayDto[];
}

