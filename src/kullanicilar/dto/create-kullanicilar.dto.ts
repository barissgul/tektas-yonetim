import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsNumber,
  MinLength,
} from 'class-validator';

export class CreateKullanicilarDto {
  @ApiProperty({ description: 'Ad', example: 'Barış' })
  @IsString()
  @IsNotEmpty()
  ad: string;

  @ApiProperty({ description: 'Soyad', example: 'Gül' })
  @IsString()
  @IsNotEmpty()
  soyad: string;

  @ApiProperty({ description: 'E-posta', example: 'baris@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Kullanıcı adı', example: 'barisgul' })
  @IsString()
  @IsNotEmpty()
  kullanici_adi: string;

  @ApiProperty({ description: 'Şifre (min 6 karakter)', example: '123456' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  sifre: string;

  @ApiProperty({
    description: 'Telefon',
    example: '0532 123 45 67',
    required: false,
  })
  @IsString()
  @IsOptional()
  telefon?: string;

  @ApiProperty({
    description: 'Profil resmi URL',
    example: '/uploads/avatar.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  resim?: string;

  @ApiProperty({
    description: 'Durum (1: Aktif, 0: Pasif)',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  durum?: number;

  @ApiProperty({
    description: "Yetki ID'leri (virgülle ayrılmış)",
    example: '1,2,3',
    required: false,
  })
  @IsString()
  @IsOptional()
  yetki_ids?: string;
}
