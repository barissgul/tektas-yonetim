import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnamenuService } from './anamenu.service';
import { AnamenuController } from './anamenu.controller';
import { Anamenu } from './entities/anamenu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Anamenu])],
  controllers: [AnamenuController],
  providers: [AnamenuService],
  exports: [AnamenuService],
})
export class AnamenuModule {}
