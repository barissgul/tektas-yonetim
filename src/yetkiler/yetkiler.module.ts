import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YetkilerService } from './yetkiler.service';
import { YetkilerController } from './yetkiler.controller';
import { Yetkiler } from './entities/yetkiler.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Yetkiler])],
  controllers: [YetkilerController],
  providers: [YetkilerService],
  exports: [YetkilerService],
})
export class YetkilerModule {}
