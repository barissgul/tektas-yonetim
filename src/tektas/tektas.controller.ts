import { Controller, Get, Query, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { TektasService } from './tektas.service';
import { TektasStokResponseDto } from './dto/tektas-stok.dto';

@ApiTags('Tektas')
@Controller('tektas')
export class TektasController {
  constructor(private readonly tektasService: TektasService) {}

  @Get('stoklar')
  @ApiOperation({ summary: 'Tektas stok listesini getir' })
  @ApiResponse({
    status: 200,
    description: 'Stok listesi başarıyla getirildi',
    type: TektasStokResponseDto,
  })
  async getStoklar(): Promise<TektasStokResponseDto> {
    return await this.tektasService.getStoklar();
  }

  @Get('stoklar/:kodu')
  @ApiOperation({ summary: 'Stok koduna göre detay getir' })
  @ApiParam({ name: 'kodu', description: 'Stok kodu' })
  @ApiResponse({ status: 200, description: 'Stok detayı getirildi' })
  async getStokByKodu(@Param('kodu') kodu: string) {
    return await this.tektasService.getStokByKodu(kodu);
  }

  @Get('stoklar/ara')
  @ApiOperation({ summary: 'Stok ara' })
  @ApiQuery({ name: 'q', description: 'Arama terimi', required: true })
  @ApiResponse({ status: 200, description: 'Arama sonuçları' })
  async searchStok(@Query('q') query: string): Promise<TektasStokResponseDto> {
    return await this.tektasService.searchStok(query);
  }
}
