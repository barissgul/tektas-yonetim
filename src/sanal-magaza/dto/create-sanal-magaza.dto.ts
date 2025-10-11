import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsUrl,
} from 'class-validator';

export class CreateSanalMagazaDto {
  @ApiProperty({ description: 'Mağaza adı', example: 'Trendyol' })
  @IsString()
  @IsNotEmpty()
  magaza_adi: string;

  @ApiProperty({
    description: 'Mağaza kodu (benzersiz)',
    example: 'TRENDYOL',
  })
  @IsString()
  @IsNotEmpty()
  magaza_kodu: string;

  @ApiProperty({
    description: 'API URL',
    example: 'https://api.trendyol.com',
  })
  @IsUrl()
  @IsNotEmpty()
  api_url: string;

  @ApiProperty({
    description: 'API Key',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @IsString()
  @IsNotEmpty()
  api_key: string;

  @ApiProperty({
    description: 'API Secret',
    example: 'xxxxxxxxxxxxxxxxxxxxxxxx',
    required: false,
  })
  @IsString()
  @IsOptional()
  api_secret?: string;

  @ApiProperty({
    description: 'Satıcı ID / Mağaza ID',
    example: '123456',
    required: false,
  })
  @IsString()
  @IsOptional()
  satici_id?: string;

  @ApiProperty({
    description: 'Bağlantı türü',
    example: 'REST',
    required: false,
  })
  @IsString()
  @IsOptional()
  baglanti_turu?: string;

  @ApiProperty({
    description: 'Aktif durumu',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  aktif?: boolean;

  @ApiProperty({
    description: 'Ek notlar',
    example: 'Test ortamı için bağlantı bilgileri',
    required: false,
  })
  @IsString()
  @IsOptional()
  notlar?: string;
}

