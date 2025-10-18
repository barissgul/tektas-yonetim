import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiparislerService } from './siparisler.service';
import { SiparislerController } from './siparisler.controller';
import { Siparis } from './entities/siparis.entity';
import { SiparisDetay } from './entities/siparis-detay.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Siparis, SiparisDetay])],
  controllers: [SiparislerController],
  providers: [SiparislerService],
  exports: [SiparislerService],
})
export class SiparislerModule {}





