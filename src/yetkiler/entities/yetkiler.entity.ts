import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('yetkiler')
export class Yetkiler {
  @ApiProperty({ description: 'Yetki ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Yetki adı' })
  @Column({ type: 'varchar', length: 255 })
  yetki: string;

  @ApiProperty({ description: 'Durum (aktif/pasif)' })
  @Column({ type: 'tinyint', default: 1 })
  durum: number;
}
