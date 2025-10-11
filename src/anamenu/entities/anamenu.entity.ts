import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Menu } from '../../menu/entities/menu.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('anamenu')
export class Anamenu {
  @ApiProperty({ description: 'Anamenu ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Ana menü adı' })
  @Column({ type: 'varchar', length: 255 })
  anamenu: string;

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

  @ApiProperty({ description: 'Alt menüler', type: () => [Menu] })
  @OneToMany(() => Menu, (menu) => menu.anamenu)
  menuler: Menu[];
}
