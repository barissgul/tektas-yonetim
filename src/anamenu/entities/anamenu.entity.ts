import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Menu } from '../../menu/entities/menu.entity';
import { AltAnamenu } from '../../alt-anamenu/entities/alt-anamenu.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('anamenu')
export class Anamenu {
  @ApiProperty({ description: 'Anamenu ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Ana menü adı' })
  @Column({ type: 'varchar', length: 255 })
  anamenu: string;

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

  @ApiProperty({ description: 'Alt menüler', type: () => [Menu] })
  @OneToMany(() => Menu, (menu) => menu.anamenu)
  menuler: Menu[];

  @ApiProperty({ description: 'Alt ana menüler', type: () => [AltAnamenu] })
  @OneToMany(() => AltAnamenu, (altAnamenu) => altAnamenu.anamenu)
  altAnamenuler: AltAnamenu[];
}
