import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateN11ConfigDto {
  @ApiProperty({ description: 'Mağaza kodu', example: 'MAGAZA001' })
  @IsString()
  @IsNotEmpty()
  magaza_kodu: string;

  @ApiProperty({ description: 'N11 API Key' })
  @IsString()
  @IsNotEmpty()
  api_key: string;

  @ApiProperty({ description: 'N11 API Secret' })
  @IsString()
  @IsNotEmpty()
  api_secret: string;

  @ApiProperty({
    description: 'API Base URL',
    required: false,
    example: 'https://api.n11.com',
  })
  @IsString()
  @IsOptional()
  api_base_url?: string;

  @ApiProperty({ description: 'Aktif durumu', required: false, default: true })
  @IsBoolean()
  @IsOptional()
  aktif?: boolean;
}

