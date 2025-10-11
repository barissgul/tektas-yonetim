import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sanal_magaza')
export class TrendyolConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, name: 'magaza_adi' })
  magaza_adi: string;

  @Column({ type: 'varchar', length: 50, unique: true, name: 'magaza_kodu' })
  magaza_kodu: string;

  @Column({ type: 'varchar', length: 255, name: 'api_url' })
  api_url: string;

  @Column({ type: 'varchar', length: 255, name: 'api_key' })
  api_key: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'api_secret' })
  api_secret: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'satici_id' })
  satici_id: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    default: 'REST',
    name: 'baglanti_turu',
  })
  baglanti_turu: string;

  @Column({ type: 'boolean', default: true, name: 'aktif' })
  aktif: boolean;

  @Column({ type: 'text', nullable: true, name: 'notlar' })
  notlar: string;

  @CreateDateColumn({ type: 'timestamp', name: 'olusturma_tarihi' })
  olusturma_tarihi: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'guncelleme_tarihi' })
  guncelleme_tarihi: Date;
}
