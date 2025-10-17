import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { TrendyolOrderLine } from './trendyol-order-line.entity';

@Entity('trendyol_orders')
export class TrendyolOrder {
  @PrimaryColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  orderNumber: string;

  @Column({ type: 'bigint', nullable: true })
  customerId: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  customerFirstName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  customerLastName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customerEmail: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  grossAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalDiscount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalTyDiscount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalPrice: number;

  @Column({ type: 'varchar', length: 3, default: 'TRY' })
  currencyCode: string;

  @Column({ type: 'bigint', nullable: true })
  orderDate: number;

  @Column({ type: 'varchar', length: 11, nullable: true })
  identityNumber: string;

  @Column({ type: 'bigint', nullable: true })
  cargoTrackingNumber: number;

  @Column({ type: 'text', nullable: true })
  cargoTrackingLink: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cargoProviderName: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  cargoDeci: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  shipmentPackageStatus: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  deliveryType: string;

  @Column({ type: 'int', default: 0 })
  timeSlotId: number;

  @Column({ type: 'bigint', nullable: true })
  estimatedDeliveryStartDate: number;

  @Column({ type: 'bigint', nullable: true })
  estimatedDeliveryEndDate: number;

  @Column({ type: 'bigint', nullable: true })
  agreedDeliveryDate: number;

  @Column({ type: 'boolean', default: false })
  fastDelivery: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  fastDeliveryType: string;

  @Column({ type: 'bigint', nullable: true })
  originShipmentDate: number;

  @Column({ type: 'bigint', nullable: true })
  lastModifiedDate: number;

  @Column({ type: 'boolean', default: false })
  commercial: boolean;

  @Column({ type: 'boolean', default: false })
  deliveredByService: boolean;

  @Column({ type: 'boolean', default: false })
  agreedDeliveryDateExtendible: boolean;

  @Column({ type: 'bigint', default: 0 })
  extendedAgreedDeliveryDate: number;

  @Column({ type: 'bigint', default: 0 })
  agreedDeliveryExtensionEndDate: number;

  @Column({ type: 'bigint', default: 0 })
  agreedDeliveryExtensionStartDate: number;

  @Column({ type: 'bigint', nullable: true })
  warehouseId: number;

  @Column({ type: 'boolean', default: false })
  groupDeal: boolean;

  @Column({ type: 'text', nullable: true })
  invoiceLink: string;

  @Column({ type: 'boolean', default: false })
  micro: boolean;

  @Column({ type: 'boolean', default: false })
  giftBoxRequested: boolean;

  @Column({ type: 'boolean', default: false })
  is3pByTrendyol: boolean;

  @Column({ type: 'boolean', default: false })
  containsDangerousProduct: boolean;

  @Column({ type: 'boolean', default: false })
  isCod: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  createdBy: string;

  @Column({ type: 'text', nullable: true })
  originPackageIds: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  taxNumber: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  deliveryAddressType: string;

  // Adres bilgileri JSON olarak
  @Column({ type: 'json', nullable: true })
  shipmentAddress: any;

  @Column({ type: 'json', nullable: true })
  invoiceAddress: any;

  // Sipariş detayları
  @OneToMany(() => TrendyolOrderLine, (orderLine) => orderLine.order)
  lines: TrendyolOrderLine[];

  // Sistem alanları
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  magazaKodu: string;
}

