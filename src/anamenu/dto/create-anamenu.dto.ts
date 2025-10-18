import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateAnamenuDto {
  @ApiProperty({ description: 'Ana menü adı', example: 'Yönetim' })
  @IsString()
  @IsNotEmpty()
  anamenu: string;

  @ApiProperty({ description: 'İkon adı', example: 'PiGear', required: false })
  @IsString()
  @IsOptional()
  ikon?: string;

  @ApiProperty({ description: 'Sıra numarası', example: 1, required: false })
  @IsNumber()
  @IsOptional()
  sira?: number;

  @ApiProperty({
    description: "Yetki ID'leri (virgülle ayrılmış)",
    example: '1,2,3',
    required: false,
  })
  @IsString()
  @IsOptional()
  yetki_ids?: string;
}
