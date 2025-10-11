import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ description: 'Menü adı', example: 'Kullanıcılar' })
  @IsString()
  @IsNotEmpty()
  menu: string;

  @ApiProperty({ description: 'Ana menü ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  anamenu_id: number;

  @ApiProperty({
    description: 'Rota bilgisi',
    example: '/yonetim/kullanicilar',
  })
  @IsString()
  @IsNotEmpty()
  rota: string;

  @ApiProperty({ description: 'İkon adı', example: 'PiUsers', required: false })
  @IsString()
  @IsOptional()
  ikon?: string;

  @ApiProperty({ description: 'Sıra numarası', example: 1, required: false })
  @IsNumber()
  @IsOptional()
  sira?: number;

  @ApiProperty({
    description: "Yetki ID'leri (virgülle ayrılmış)",
    example: '1,3,6',
    required: false,
  })
  @IsString()
  @IsOptional()
  yetki_ids?: string;
}
