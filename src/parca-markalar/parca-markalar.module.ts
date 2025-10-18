import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParcaMarkalarService } from './parca-markalar.service';
import { ParcaMarkalarController } from './parca-markalar.controller';
import { ParcaMarka } from './entities/parca-marka.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParcaMarka])],
  controllers: [ParcaMarkalarController],
  providers: [ParcaMarkalarService],
  exports: [ParcaMarkalarService],
})
export class ParcaMarkalarModule {}

