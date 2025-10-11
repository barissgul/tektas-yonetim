import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Anamenu } from '../../anamenu/entities/anamenu.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('menu')
export class Menu {
  @ApiProperty({ description: 'Menu ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Menü adı' })
  @Column({ type: 'varchar', length: 255 })
  menu: string;

  @ApiProperty({ description: 'Ana menü ID' })
  @Column({ name: 'anamenu_id' })
  anamenu_id: number;

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

  @ApiProperty({ description: 'Ana menü', type: () => Anamenu })
  @ManyToOne(() => Anamenu, (anamenu) => anamenu.menuler)
  @JoinColumn({ name: 'anamenu_id' })
  anamenu: Anamenu;
}
