import { Module } from '@nestjs/common';
import { TektasController } from './tektas.controller';
import { TektasService } from './tektas.service';

@Module({
  controllers: [TektasController],
  providers: [TektasService],
})
export class TektasModule {}
