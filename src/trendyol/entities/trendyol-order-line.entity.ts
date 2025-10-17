import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TrendyolOrder } from './trendyol-order.entity';

@Entity('trendyol_order_lines')
export class TrendyolOrderLine {
  @PrimaryColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  orderId: number;

  @Column({ type: 'varchar', length: 50 })
  orderNumber: string;

  @Column({ type: 'int', nullable: true })
  quantity: number;

  @Column({ type: 'bigint', nullable: true })
  salesCampaignId: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  productSize: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  merchantSku: string;

  @Column({ type: 'text', nullable: true })
  productName: string;

  @Column({ type: 'bigint', nullable: true })
  productCode: number;

  @Column({ type: 'bigint', nullable: true })
  merchantId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  tyDiscount: number;

  @Column({ type: 'varchar', length: 3, default: 'TRY' })
  currencyCode: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  productColor: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  sku: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  vatBaseAmount: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  barcode: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  orderLineItemStatusName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'bigint', nullable: true })
  productCategoryId: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  commission: number;

  // JSON alanları
  @Column({ type: 'json', nullable: true })
  discountDetails: any;

  @Column({ type: 'json', nullable: true })
  fastDeliveryOptions: any;

  // İlişki
  @ManyToOne(() => TrendyolOrder, (order) => order.lines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: TrendyolOrder;

  // Sistem alanları
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

