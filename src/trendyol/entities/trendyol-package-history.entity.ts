import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TrendyolOrder } from './trendyol-order.entity';

@Entity('trendyol_package_histories')
export class TrendyolPackageHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  orderId: number;

  @Column({ type: 'varchar', length: 50 })
  orderNumber: string;

  @Column({ type: 'bigint', nullable: true })
  createdDate: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status: string;

  // İlişki
  @ManyToOne(() => TrendyolOrder, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: TrendyolOrder;

  // Sistem alanları
  @CreateDateColumn()
  createdAt: Date;
}

