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
import { Siparis } from './siparis.entity';
import { Urun } from '../../urunler/entities/urun.entity';

@Entity('siparis_detaylari')
export class SiparisDetay {
  @ApiProperty({ description: 'Detay ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Sipariş ID' })
  @Column({ type: 'int' })
  siparis_id: number;

  // Ürün Bilgileri
  @ApiProperty({ description: 'Ürün ID (urunler tablosundan)' })
  @Column({ type: 'int', nullable: true })
  urun_id?: number;

  @ApiProperty({ description: 'Ürün Kodu', example: 'URT001' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  urun_kodu?: string;

  @ApiProperty({ description: 'Ürün Adı', example: 'Tektas Granit Seramik 60x60' })
  @Column({ type: 'varchar', length: 255 })
  urun_adi: string;

  @ApiProperty({ description: 'Barkod' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  barkod?: string;

  // Varyant Bilgileri
  @ApiProperty({ description: 'Varyant (Renk, Beden vb.)', example: 'Gri - Mat' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  varyant_bilgisi?: string;

  // Miktar ve Fiyat
  @ApiProperty({ description: 'Miktar', example: 5 })
  @Column({ type: 'int', default: 1 })
  miktar: number;

  @ApiProperty({ description: 'Birim Fiyat', example: 89.90 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  birim_fiyat: number;

  @ApiProperty({ description: 'İndirim', example: 0.00 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  indirim: number;

  @ApiProperty({ description: 'Toplam', example: 449.50 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  toplam: number;

  // Vergi Bilgileri
  @ApiProperty({ description: 'KDV Oranı (%)', example: 18.00 })
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  kdv_orani: number;

  @ApiProperty({ description: 'KDV Tutarı', example: 80.91 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  kdv_tutari: number;

  // Platform Bilgisi
  @ApiProperty({ description: 'Platform Ürün ID' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  platform_urun_id?: string;

  @ApiProperty({ description: 'Platform Kalem ID' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  platform_kalem_id?: string;

  // Durum
  @ApiProperty({ description: 'Kalem Durumu', example: 'Onaylandı' })
  @Column({ type: 'varchar', length: 50, default: 'Beklemede' })
  durum: string;

  // Sistem Alanları
  @ApiProperty({ description: 'Oluşturma Tarihi' })
  @CreateDateColumn({ type: 'timestamp' })
  olusturma_tarihi: Date;

  @ApiProperty({ description: 'Güncelleme Tarihi' })
  @UpdateDateColumn({ type: 'timestamp' })
  guncelleme_tarihi: Date;

  // İlişkiler
  @ManyToOne(() => Siparis, (siparis) => siparis.detaylar, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'siparis_id' })
  siparis?: Siparis;

  @ManyToOne(() => Urun, { nullable: true })
  @JoinColumn({ name: 'urun_id' })
  urun?: Urun;
}

