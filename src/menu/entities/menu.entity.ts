import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Anamenu } from '../../anamenu/entities/anamenu.entity';
import { AltAnamenu } from '../../alt-anamenu/entities/alt-anamenu.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('menu')
export class Menu {
  @ApiProperty({ description: 'Menu ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Menü adı' })
  @Column({ type: 'varchar', length: 255 })
  menu: string;

  @ApiProperty({ description: 'Ana menü ID', required: false })
  @Column({ name: 'anamenu_id', nullable: true })
  anamenu_id?: number;

  @ApiProperty({ description: 'Alt ana menü ID', required: false })
  @Column({ name: 'alt_anamenu_id', nullable: true })
  alt_anamenu_id?: number;

  @ApiProperty({ description: 'Rota bilgisi' })
  @Column({ type: 'varchar', length: 255 })
  rota: string;

  @ApiProperty({ description: 'İkon adı', required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  ikon?: string;

  @ApiProperty({ description: 'Sıra numarası', required: false })
  @Column({ type: 'int', default: 0 })
  sira: number;

  @ApiProperty({
    description: "Yetki ID'leri (virgülle ayrılmış)",
    required: false,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  yetki_ids?: string;

  @ApiProperty({ description: 'Ana menü', type: () => Anamenu, required: false })
  @ManyToOne(() => Anamenu, (anamenu) => anamenu.menuler, { nullable: true })
  @JoinColumn({ name: 'anamenu_id' })
  anamenu?: Anamenu;

  @ApiProperty({ description: 'Alt ana menü', type: () => AltAnamenu, required: false })
  @ManyToOne(() => AltAnamenu, (altAnamenu) => altAnamenu.menuler, { nullable: true })
  @JoinColumn({ name: 'alt_anamenu_id' })
  altAnamenu?: AltAnamenu;
}
