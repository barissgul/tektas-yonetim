import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrunlerService } from './urunler.service';
import { UrunlerController } from './urunler.controller';
import { Urun } from './entities/urun.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Urun])],
  controllers: [UrunlerController],
  providers: [UrunlerService],
  exports: [UrunlerService],
})
export class UrunlerModule {}

