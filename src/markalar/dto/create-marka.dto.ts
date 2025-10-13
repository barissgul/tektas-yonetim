import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsNotEmpty, IsIn } from 'class-validator';

export class CreateMarkaDto {
  @ApiProperty({ description: 'Marka adı' })
  @IsString()
  @IsNotEmpty()
  marka: string;

  @ApiProperty({ description: 'Resim URL', required: false })
  @IsString()
  @IsOptional()
  resim_url?: string;

  @ApiProperty({ description: 'Durum (1: Aktif, 0: Pasif)', required: false, default: 1 })
  @IsNumber()
  @IsOptional()
  @IsIn([0, 1])
  durum?: number;
}


