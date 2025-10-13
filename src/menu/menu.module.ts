import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { Menu } from './entities/menu.entity';
import { AltAnamenu } from '../alt-anamenu/entities/alt-anamenu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, AltAnamenu])],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
