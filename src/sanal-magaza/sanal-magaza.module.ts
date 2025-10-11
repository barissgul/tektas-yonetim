import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SanalMagazaService } from './sanal-magaza.service';
import { SanalMagazaController } from './sanal-magaza.controller';
import { SanalMagaza } from './entities/sanal-magaza.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SanalMagaza])],
  controllers: [SanalMagazaController],
  providers: [SanalMagazaService],
  exports: [SanalMagazaService],
})
export class SanalMagazaModule {}

