import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HepsiburadaController } from './hepsiburada.controller';
import { HepsiburadaService } from './hepsiburada.service';
import { SanalMagaza } from '../sanal-magaza/entities/sanal-magaza.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SanalMagaza])],
  controllers: [HepsiburadaController],
  providers: [HepsiburadaService],
  exports: [HepsiburadaService],
})
export class HepsiburadaModule {}
