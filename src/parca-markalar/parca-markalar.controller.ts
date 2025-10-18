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
import { ParcaMarkalarService } from './parca-markalar.service';
import { CreateParcaMarkaDto } from './dto/create-parca-marka.dto';
import { UpdateParcaMarkaDto } from './dto/update-parca-marka.dto';
import { ParcaMarka } from './entities/parca-marka.entity';

@ApiTags('Parça Markalar')
@Controller('parca-markalar')
export class ParcaMarkalarController {
  constructor(private readonly parcaMarkalarService: ParcaMarkalarService) {}

  @Post()
  @ApiOperation({ summary: 'Yeni parça marka oluştur' })
  @ApiResponse({
    status: 201,
    description: 'Parça marka başarıyla oluşturuldu.',
    type: ParcaMarka,
  })
  @ApiResponse({ status: 400, description: 'Geçersiz veri.' })
  create(@Body() createParcaMarkaDto: CreateParcaMarkaDto) {
    return this.parcaMarkalarService.create(createParcaMarkaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm parça markaları getir' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Parça marka adı, menşei veya türünde arama yap',
  })
  @ApiResponse({
    status: 200,
    description: 'Parça markalar başarıyla getirildi.',
    type: [ParcaMarka],
  })
  findAll(@Query('search') search?: string) {
    return this.parcaMarkalarService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID ile parça marka getir' })
  @ApiParam({ name: 'id', description: 'Parça Marka ID' })
  @ApiResponse({
    status: 200,
    description: 'Parça marka başarıyla getirildi.',
    type: ParcaMarka,
  })
  @ApiResponse({ status: 404, description: 'Parça marka bulunamadı.' })
  findOne(@Param('id') id: string) {
    return this.parcaMarkalarService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Parça marka güncelle' })
  @ApiParam({ name: 'id', description: 'Parça Marka ID' })
  @ApiResponse({
    status: 200,
    description: 'Parça marka başarıyla güncellendi.',
    type: ParcaMarka,
  })
  @ApiResponse({ status: 404, description: 'Parça marka bulunamadı.' })
  update(
    @Param('id') id: string,
    @Body() updateParcaMarkaDto: UpdateParcaMarkaDto,
  ) {
    return this.parcaMarkalarService.update(+id, updateParcaMarkaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Parça marka sil' })
  @ApiParam({ name: 'id', description: 'Parça Marka ID' })
  @ApiResponse({ status: 200, description: 'Parça marka başarıyla silindi.' })
  @ApiResponse({ status: 404, description: 'Parça marka bulunamadı.' })
  remove(@Param('id') id: string) {
    return this.parcaMarkalarService.remove(+id);
  }
}
