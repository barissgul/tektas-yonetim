import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrendyolController } from './trendyol.controller';
import { TrendyolService } from './trendyol.service';
import { TrendyolConfig } from './entities/trendyol-config.entity';
import { TrendyolOrder } from './entities/trendyol-order.entity';
import { TrendyolOrderLine } from './entities/trendyol-order-line.entity';
import { TrendyolPackageHistory } from './entities/trendyol-package-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TrendyolConfig,
      TrendyolOrder,
      TrendyolOrderLine,
      TrendyolPackageHistory,
    ]),
  ],
  controllers: [TrendyolController],
  providers: [TrendyolService],
  exports: [TrendyolService],
})
export class TrendyolModule {}
