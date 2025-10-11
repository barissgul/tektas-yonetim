import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateHepsiburadaConfigDto {
  @ApiProperty({ description: 'Mağaza kodu', example: 'MAGAZA001' })
  @IsString()
  @IsNotEmpty()
  magaza_kodu: string;

  @ApiProperty({ description: 'Hepsiburada Merchant ID', example: '123456' })
  @IsString()
  @IsNotEmpty()
  merchant_id: string;

  @ApiProperty({ description: 'Hepsiburada API Username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Hepsiburada API Password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'API Base URL',
    required: false,
    example: 'https://mpop.hepsiburada.com',
  })
  @IsString()
  @IsOptional()
  api_base_url?: string;

  @ApiProperty({ description: 'Aktif durumu', required: false, default: true })
  @IsBoolean()
  @IsOptional()
  aktif?: boolean;
}
