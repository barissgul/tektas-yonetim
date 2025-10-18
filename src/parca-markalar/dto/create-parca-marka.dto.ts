import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreateParcaMarkaDto {
  @ApiProperty({ description: 'Parça marka adı', example: 'FAE' })
  @IsString()
  parca_marka: string;

  @ApiProperty({
    description: 'Menşei (Köken ülke)',
    example: 'İspanya',
    required: false,
  })
  @IsString()
  @IsOptional()
  mensei?: string;

  @ApiProperty({
    description: 'Parça türü',
    example: 'Elektrik Parçaları',
    required: false,
  })
  @IsString()
  @IsOptional()
  parca_turu?: string;

  @ApiProperty({
    description: 'Durum (1: Aktif, 0: Pasif)',
    example: 1,
    default: 1,
  })
  @IsInt()
  @Min(0)
  @Max(1)
  @IsOptional()
  durum?: number;
}

