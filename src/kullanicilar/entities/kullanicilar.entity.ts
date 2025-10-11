import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('kullanicilar')
export class Kullanicilar {
  @ApiProperty({ description: 'Kullanıcı ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Ad' })
  @Column({ type: 'varchar', length: 100 })
  ad: string;

  @ApiProperty({ description: 'Soyad' })
  @Column({ type: 'varchar', length: 100 })
  soyad: string;

  @ApiProperty({ description: 'E-posta' })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({ description: 'Kullanıcı adı' })
  @Column({ type: 'varchar', length: 100, unique: true })
  kullanici_adi: string;

  @ApiProperty({ description: 'Şifre (hash)' })
  @Column({ type: 'varchar', length: 255 })
  sifre: string;

  @ApiProperty({ description: 'Telefon', required: false })
  @Column({ type: 'varchar', length: 20, nullable: true })
  telefon?: string;

  @ApiProperty({ description: 'Profil resmi', required: false })
  @Column({ type: 'varchar', length: 500, nullable: true })
  resim?: string;

  @ApiProperty({ description: 'Durum (1: Aktif, 0: Pasif)' })
  @Column({ type: 'tinyint', default: 1 })
  durum: number;

  @ApiProperty({
    description: "Yetki ID'leri (virgülle ayrılmış)",
    required: false,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  yetki_ids?: string;

  @ApiProperty({ description: 'Oluşturma tarihi' })
  @CreateDateColumn()
  olusturma_tarihi: Date;

  @ApiProperty({ description: 'Güncellenme tarihi' })
  @UpdateDateColumn()
  guncelleme_tarihi: Date;
}
