import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('parca_marka')
export class ParcaMarka {
  @ApiProperty({ description: 'Parça Marka ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Parça marka adı' })
  @Column({ type: 'varchar', length: 255 })
  parca_marka: string;

  @ApiProperty({ description: 'Menşei (Köken ülke)', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  mensei?: string;

  @ApiProperty({ description: 'Parça türü', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  parca_turu?: string;

  @ApiProperty({ description: 'Durum (1: Aktif, 0: Pasif)', default: 1 })
  @Column({ type: 'tinyint', default: 1 })
  durum: number;
}

