import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SanalMagaza } from '../../sanal-magaza/entities/sanal-magaza.entity';

@Entity('urunler')
export class Urun {
  @ApiProperty({ description: 'Ürün ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Sanal Mağaza ID' })
  @Column({ type: 'int' })
  sanal_magaza_id: number;

  @ApiProperty({ description: 'Ürün/Stok Kodu (SKU)', example: 'URT001' })
  @Column({ type: 'varchar', length: 100 })
  urun_kodu: string;

  @ApiProperty({ description: 'Ürün Adı', example: 'Tektas Granit Seramik 60x60' })
  @Column({ type: 'varchar', length: 255 })
  urun_adi: string;

  @ApiProperty({ description: 'Ürün Açıklaması', required: false })
  @Column({ type: 'text', nullable: true })
  aciklama?: string;

  @ApiProperty({ description: 'Kategori', example: 'Seramik', required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  kategori?: string;

  @ApiProperty({ description: 'Marka', example: 'Tektas', required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  marka?: string;

  @ApiProperty({ description: 'Barkod', required: false })
  @Column({ type: 'varchar', length: 50, nullable: true })
  barkod?: string;

  @ApiProperty({ description: 'Satış Fiyatı', example: 89.90 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fiyat: number;

  @ApiProperty({ description: 'Maliyet Fiyatı', required: false })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maliyet?: number;

  @ApiProperty({ description: 'Stok Miktarı', example: 150 })
  @Column({ type: 'int', default: 0 })
  stok_miktari: number;

  @ApiProperty({ description: 'Minimum Stok Uyarı Seviyesi', required: false })
  @Column({ type: 'int', nullable: true, default: 0 })
  min_stok_miktari?: number;

  @ApiProperty({ description: 'Birim', example: 'Adet', required: false })
  @Column({ type: 'varchar', length: 20, nullable: true, default: 'Adet' })
  birim?: string;

  @ApiProperty({ description: 'Ürün Resim URL', required: false })
  @Column({ type: 'varchar', length: 500, nullable: true })
  resim_url?: string;

  @ApiProperty({ description: 'Durum (1: Aktif, 0: Pasif)', example: 1 })
  @Column({ type: 'tinyint', default: 1 })
  durum: number;

  @ApiProperty({ description: 'Oluşturma Tarihi' })
  @CreateDateColumn({ type: 'timestamp' })
  olusturma_tarihi: Date;

  @ApiProperty({ description: 'Güncelleme Tarihi' })
  @UpdateDateColumn({ type: 'timestamp' })
  guncelleme_tarihi: Date;

  // İlişkiler
  @ManyToOne(() => SanalMagaza)
  @JoinColumn({ name: 'sanal_magaza_id' })
  sanal_magaza?: SanalMagaza;
}

