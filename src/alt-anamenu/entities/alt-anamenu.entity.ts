import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Anamenu } from '../../anamenu/entities/anamenu.entity';
import { Menu } from '../../menu/entities/menu.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('alt_anamenu')
export class AltAnamenu {
  @ApiProperty({ description: 'Alt Ana Menü ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Alt Ana menü adı' })
  @Column({ type: 'varchar', length: 255 })
  alt_anamenu: string;

  @ApiProperty({ description: 'Ana menü ID' })
  @Column({ name: 'anamenu_id' })
  anamenu_id: number;

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

  @ApiProperty({ description: 'Ana menü', type: () => Anamenu })
  @ManyToOne(() => Anamenu, (anamenu) => anamenu.altAnamenuler)
  @JoinColumn({ name: 'anamenu_id' })
  anamenu: Anamenu;

  @ApiProperty({ description: 'Alt menüler', type: () => [Menu] })
  @OneToMany(() => Menu, (menu) => menu.altAnamenu)
  menuler: Menu[];
}
