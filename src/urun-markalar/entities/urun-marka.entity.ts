import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('urun_marka')
export class UrunMarka {
  @ApiProperty({ description: 'Ürün Marka ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Ürün marka adı' })
  @Column({ type: 'varchar', length: 255 })
  urun_marka: string;

  @ApiProperty({ description: 'Menşei (Köken ülke)', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  mensei?: string;

  @ApiProperty({ description: 'Ürün türü', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  urun_turu?: string;

  @ApiProperty({ description: 'Durum (1: Aktif, 0: Pasif)', default: 1 })
  @Column({ type: 'tinyint', default: 1 })
  durum: number;
}

