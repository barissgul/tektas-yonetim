import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarkalarService } from './markalar.service';
import { MarkalarController } from './markalar.controller';
import { Marka } from './entities/marka.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Marka])],
  controllers: [MarkalarController],
  providers: [MarkalarService],
  exports: [MarkalarService],
})
export class MarkalarModule {}

