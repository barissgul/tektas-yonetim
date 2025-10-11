import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('n11_config')
export class N11Config {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  magaza_kodu: string;

  @Column({ type: 'varchar', length: 500 })
  api_key: string;

  @Column({ type: 'varchar', length: 500 })
  api_secret: string;

  @Column({ type: 'varchar', length: 255, default: 'https://api.n11.com' })
  api_base_url: string;

  @Column({ type: 'boolean', default: true })
  aktif: boolean;

  @CreateDateColumn()
  olusturma_tarihi: Date;

  @UpdateDateColumn()
  guncelleme_tarihi: Date;
}

