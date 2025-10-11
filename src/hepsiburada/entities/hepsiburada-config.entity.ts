import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('hepsiburada_config')
export class HepsiburadaConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  magaza_kodu: string;

  @Column({ type: 'varchar', length: 255 })
  merchant_id: string;

  @Column({ type: 'varchar', length: 500 })
  username: string;

  @Column({ type: 'varchar', length: 500 })
  password: string;

  @Column({
    type: 'varchar',
    length: 255,
    default: 'https://mpop.hepsiburada.com',
  })
  api_base_url: string;

  @Column({ type: 'boolean', default: true })
  aktif: boolean;

  @CreateDateColumn()
  olusturma_tarihi: Date;

  @UpdateDateColumn()
  guncelleme_tarihi: Date;
}
