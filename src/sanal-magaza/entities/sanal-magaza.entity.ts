import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('sanal_magaza')
export class SanalMagaza {
  @ApiProperty({ description: 'Sanal Mağaza ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Mağaza adı', example: 'Trendyol' })
  @Column({ type: 'varchar', length: 100 })
  magaza_adi: string;

  @ApiProperty({ description: 'Mağaza kodu', example: 'TRENDYOL' })
  @Column({ type: 'varchar', length: 50, unique: true })
  magaza_kodu: string;

  @ApiProperty({ description: 'API URL', example: 'https://api.trendyol.com' })
  @Column({ type: 'varchar', length: 255 })
  api_url: string;

  @ApiProperty({ description: 'API Key' })
  @Column({ type: 'varchar', length: 255 })
  api_key: string;

  @ApiProperty({ description: 'API Secret', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  api_secret?: string;

  @ApiProperty({ description: 'Satıcı ID / Mağaza ID', required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  satici_id?: string;

  @ApiProperty({
    description: 'Bağlantı türü',
    example: 'REST',
    required: false,
  })
  @Column({ type: 'varchar', length: 50, nullable: true, default: 'REST' })
  baglanti_turu?: string;

  @ApiProperty({ description: 'Aktif durumu', default: true })
  @Column({ type: 'boolean', default: true })
  aktif: boolean;

  @ApiProperty({ description: 'Ek notlar', required: false })
  @Column({ type: 'text', nullable: true })
  notlar?: string;

  @ApiProperty({ description: 'Oluşturma tarihi' })
  @CreateDateColumn({ type: 'timestamp' })
  olusturma_tarihi: Date;

  @ApiProperty({ description: 'Güncelleme tarihi' })
  @UpdateDateColumn({ type: 'timestamp' })
  guncelleme_tarihi: Date;
}

