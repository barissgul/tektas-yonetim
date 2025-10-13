import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AltAnamenuService } from './alt-anamenu.service';
import { AltAnamenuController } from './alt-anamenu.controller';
import { AltAnamenu } from './entities/alt-anamenu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AltAnamenu])],
  controllers: [AltAnamenuController],
  providers: [AltAnamenuService],
  exports: [AltAnamenuService],
})
export class AltAnamenuModule {}
