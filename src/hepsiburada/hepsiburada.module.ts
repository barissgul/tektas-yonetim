import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HepsiburadaController } from './hepsiburada.controller';
import { HepsiburadaService } from './hepsiburada.service';
import { HepsiburadaConfig } from './entities/hepsiburada-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HepsiburadaConfig])],
  controllers: [HepsiburadaController],
  providers: [HepsiburadaService],
  exports: [HepsiburadaService],
})
export class HepsiburadaModule {}
