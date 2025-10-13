import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateAltAnamenuDto {
  @ApiProperty({ description: 'Alt Ana menü adı' })
  @IsString()
  @IsNotEmpty()
  alt_anamenu: string;

  @ApiProperty({ description: 'Ana menü ID' })
  @IsNumber()
  @IsNotEmpty()
  anamenu_id: number;

  @ApiProperty({ description: 'İkon adı', required: false })
  @IsString()
  @IsOptional()
  ikon?: string;

  @ApiProperty({ description: 'Sıra numarası', required: false, default: 0 })
  @IsNumber()
  @IsOptional()
  sira?: number;

  @ApiProperty({
    description: "Yetki ID'leri (virgülle ayrılmış)",
    required: false,
  })
  @IsString()
  @IsOptional()
  yetki_ids?: string;
}
