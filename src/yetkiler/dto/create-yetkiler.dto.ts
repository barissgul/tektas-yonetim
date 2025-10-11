import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateYetkilerDto {
  @ApiProperty({ description: 'Yetki adı', example: 'Kullanıcı Görüntüleme' })
  @IsString()
  @IsNotEmpty()
  yetki: string;

  @ApiProperty({
    description: 'Durum (1: Aktif, 0: Pasif)',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  durum?: number;
}
