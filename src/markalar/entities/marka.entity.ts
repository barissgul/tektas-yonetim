import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('marka')
export class Marka {
  @ApiProperty({ description: 'Marka ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Marka adı' })
  @Column({ type: 'varchar', length: 255 })
  marka: string;

  @ApiProperty({ description: 'Resim URL', required: false })
  @Column({ type: 'varchar', length: 500, nullable: true })
  resim_url?: string;

  @ApiProperty({ description: 'Durum (1: Aktif, 0: Pasif)', default: 1 })
  @Column({ type: 'tinyint', default: 1 })
  durum: number;
}
