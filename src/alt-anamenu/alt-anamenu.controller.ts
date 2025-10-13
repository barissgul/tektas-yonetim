import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AltAnamenuService } from './alt-anamenu.service';
import { CreateAltAnamenuDto } from './dto/create-alt-anamenu.dto';
import { UpdateAltAnamenuDto } from './dto/update-alt-anamenu.dto';
import { AltAnamenu } from './entities/alt-anamenu.entity';

@ApiTags('Alt Ana Menü')
@Controller('alt-anamenu')
export class AltAnamenuController {
  constructor(private readonly altAnamenuService: AltAnamenuService) {}

  @Post()
  @ApiOperation({ summary: 'Yeni alt ana menü oluştur' })
  @ApiResponse({
    status: 201,
    description: 'Alt ana menü başarıyla oluşturuldu.',
    type: AltAnamenu,
  })
  @ApiResponse({ status: 400, description: 'Geçersiz veri.' })
  create(@Body() createAltAnamenuDto: CreateAltAnamenuDto) {
    return this.altAnamenuService.create(createAltAnamenuDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm alt ana menüleri getir' })
  @ApiResponse({
    status: 200,
    description: 'Alt ana menüler başarıyla getirildi.',
    type: [AltAnamenu],
  })
  findAll() {
    return this.altAnamenuService.findAll();
  }

  @Get('anamenu/:anamenuId')
  @ApiOperation({ summary: 'Belirli ana menüye ait alt ana menüleri getir' })
  @ApiParam({ name: 'anamenuId', description: 'Ana menü ID' })
  @ApiResponse({
    status: 200,
    description: 'Alt ana menüler başarıyla getirildi.',
    type: [AltAnamenu],
  })
  findByAnamenuId(@Param('anamenuId') anamenuId: string) {
    return this.altAnamenuService.findByAnamenuId(+anamenuId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID ile alt ana menü getir' })
  @ApiParam({ name: 'id', description: 'Alt ana menü ID' })
  @ApiResponse({
    status: 200,
    description: 'Alt ana menü başarıyla getirildi.',
    type: AltAnamenu,
  })
  @ApiResponse({ status: 404, description: 'Alt ana menü bulunamadı.' })
  findOne(@Param('id') id: string) {
    return this.altAnamenuService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Alt ana menü güncelle' })
  @ApiParam({ name: 'id', description: 'Alt ana menü ID' })
  @ApiResponse({
    status: 200,
    description: 'Alt ana menü başarıyla güncellendi.',
    type: AltAnamenu,
  })
  @ApiResponse({ status: 404, description: 'Alt ana menü bulunamadı.' })
  update(
    @Param('id') id: string,
    @Body() updateAltAnamenuDto: UpdateAltAnamenuDto,
  ) {
    return this.altAnamenuService.update(+id, updateAltAnamenuDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Alt ana menü sil' })
  @ApiParam({ name: 'id', description: 'Alt ana menü ID' })
  @ApiResponse({ status: 200, description: 'Alt ana menü başarıyla silindi.' })
  @ApiResponse({ status: 404, description: 'Alt ana menü bulunamadı.' })
  remove(@Param('id') id: string) {
    return this.altAnamenuService.remove(+id);
  }
}
