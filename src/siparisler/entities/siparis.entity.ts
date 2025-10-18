import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SanalMagaza } from '../../sanal-magaza/entities/sanal-magaza.entity';
import { SiparisDetay } from './siparis-detay.entity';

@Entity('siparisler')
export class Siparis {
  @ApiProperty({ description: 'Sipariş ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Sipariş Numarası', example: 'SIP-2025-0001' })
  @Column({ type: 'varchar', length: 50, unique: true })
  siparis_no: string;

  @ApiProperty({ description: 'Sanal Mağaza ID' })
  @Column({ type: 'int' })
  sanal_magaza_id: number;

  // Müşteri Bilgileri
  @ApiProperty({ description: 'Müşteri Adı', example: 'Ahmet' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  musteri_adi?: string;

  @ApiProperty({ description: 'Müşteri Soyadı', example: 'Yılmaz' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  musteri_soyadi?: string;

  @ApiProperty({ description: 'Müşteri Email' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  musteri_email?: string;

  @ApiProperty({ description: 'Müşteri Telefon' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  musteri_telefon?: string;

  // Fiyat Bilgileri
  @ApiProperty({ description: 'Ara Toplam', example: 450.00 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  ara_toplam: number;

  @ApiProperty({ description: 'Kargo Ücreti', example: 29.90 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  kargo_ucreti: number;

  @ApiProperty({ description: 'İndirim Tutarı', example: 50.00 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  indirim_tutari: number;

  @ApiProperty({ description: 'Toplam Tutar', example: 479.90 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  toplam_tutar: number;

  @ApiProperty({ description: 'Para Birimi', example: 'TRY' })
  @Column({ type: 'varchar', length: 3, default: 'TRY' })
  para_birimi: string;

  // Kargo Bilgileri
  @ApiProperty({ description: 'Kargo Firması' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  kargo_firmasi?: string;

  @ApiProperty({ description: 'Kargo Takip No' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  kargo_takip_no?: string;

  @ApiProperty({ description: 'Kargo Takip Link' })
  @Column({ type: 'text', nullable: true })
  kargo_takip_link?: string;

  // Adres Bilgileri (JSON)
  @ApiProperty({ description: 'Teslimat Adresi (JSON)' })
  @Column({ type: 'json', nullable: true })
  teslimat_adresi?: any;

  @ApiProperty({ description: 'Fatura Adresi (JSON)' })
  @Column({ type: 'json', nullable: true })
  fatura_adresi?: any;

  // Sipariş Durumu
  @ApiProperty({ description: 'Durum', example: 'Beklemede' })
  @Column({ type: 'varchar', length: 50, default: 'Beklemede' })
  durum: string;

  @ApiProperty({ description: 'Ödeme Durumu', example: 'Ödendi' })
  @Column({ type: 'varchar', length: 50, default: 'Ödenmedi' })
  odeme_durumu: string;

  @ApiProperty({ description: 'Ödeme Yöntemi', example: 'Kredi Kartı' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  odeme_yontemi?: string;

  // Tarih Bilgileri
  @ApiProperty({ description: 'Sipariş Tarihi' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  siparis_tarihi: Date;

  @ApiProperty({ description: 'Onay Tarihi' })
  @Column({ type: 'timestamp', nullable: true })
  onay_tarihi?: Date;

  @ApiProperty({ description: 'Kargoya Verilme Tarihi' })
  @Column({ type: 'timestamp', nullable: true })
  kargo_tarihi?: Date;

  @ApiProperty({ description: 'Teslim Edilme Tarihi' })
  @Column({ type: 'timestamp', nullable: true })
  teslim_tarihi?: Date;

  // Notlar
  @ApiProperty({ description: 'Müşteri Notu' })
  @Column({ type: 'text', nullable: true })
  musteri_notu?: string;

  @ApiProperty({ description: 'Yönetici/İç Not' })
  @Column({ type: 'text', nullable: true })
  yonetici_notu?: string;

  // Platform Bilgisi
  @ApiProperty({ description: 'Platform Sipariş ID (Trendyol, N11 vb.)' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  platform_siparis_id?: string;

  // Sistem Alanları
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

  @OneToMany(() => SiparisDetay, (detay) => detay.siparis, { cascade: true })
  detaylar?: SiparisDetay[];
}

