import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateTrendyolConfigDto {
  @ApiProperty({
    description: 'Mağaza adı',
    example: 'Trendyol',
    required: false,
  })
  @IsString()
  @IsOptional()
  magaza_adi?: string;

  @ApiProperty({ description: 'Mağaza kodu', example: 'TRENDYOL_MAGAZA' })
  @IsString()
  @IsNotEmpty()
  magaza_kodu: string;

  @ApiProperty({
    description: 'API URL',
    example: 'https://api.trendyol.com',
  })
  @IsString()
  @IsNotEmpty()
  api_url: string;

  @ApiProperty({ description: 'Trendyol API Key' })
  @IsString()
  @IsNotEmpty()
  api_key: string;

  @ApiProperty({ description: 'Trendyol API Secret' })
  @IsString()
  @IsNotEmpty()
  api_secret: string;

  @ApiProperty({ description: 'Trendyol Supplier ID', example: '556267' })
  @IsString()
  @IsNotEmpty()
  satici_id: string;

  @ApiProperty({
    description: 'Bağlantı türü',
    required: false,
    default: 'REST',
  })
  @IsString()
  @IsOptional()
  baglanti_turu?: string;

  @ApiProperty({ description: 'Aktif durumu', required: false, default: true })
  @IsBoolean()
  @IsOptional()
  aktif?: boolean;

  @ApiProperty({ description: 'Notlar', required: false })
  @IsString()
  @IsOptional()
  notlar?: string;
}

