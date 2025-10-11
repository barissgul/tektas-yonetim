import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnamenuModule } from './anamenu/anamenu.module';
import { MenuModule } from './menu/menu.module';
import { YetkilerModule } from './yetkiler/yetkiler.module';
import { KullanicilarModule } from './kullanicilar/kullanicilar.module';
import { SanalMagazaModule } from './sanal-magaza/sanal-magaza.module';
import { TrendyolModule } from './trendyol/trendyol.module';
import { HepsiburadaModule } from './hepsiburada/hepsiburada.module';
import { N11Module } from './n11/n11.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_DATABASE || 'tektas',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV === 'development',
    }),
    AnamenuModule,
    MenuModule,
    YetkilerModule,
    KullanicilarModule,
    SanalMagazaModule,
    TrendyolModule,
    HepsiburadaModule,
    N11Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
