import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrendyolController } from './trendyol.controller';
import { TrendyolService } from './trendyol.service';
import { TrendyolConfig } from './entities/trendyol-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrendyolConfig])],
  controllers: [TrendyolController],
  providers: [TrendyolService],
  exports: [TrendyolService],
})
export class TrendyolModule {}
