import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiOperation({ summary: 'Yeni menü oluştur' })
  @ApiResponse({
    status: 201,
    description: 'Menü başarıyla oluşturuldu',
    type: Menu,
  })
  create(@Body() createMenuDto: CreateMenuDto): Promise<Menu> {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm menüleri listele' })
  @ApiResponse({ status: 200, description: 'Menüler listelendi', type: [Menu] })
  findAll(): Promise<Menu[]> {
    return this.menuService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Menü detayını getir' })
  @ApiResponse({ status: 200, description: 'Menü detayı', type: Menu })
  @ApiResponse({ status: 404, description: 'Menü bulunamadı' })
  findOne(@Param('id') id: string): Promise<Menu> {
    return this.menuService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Menü güncelle' })
  @ApiResponse({ status: 200, description: 'Menü güncellendi', type: Menu })
  @ApiResponse({ status: 404, description: 'Menü bulunamadı' })
  update(
    @Param('id') id: string,
    @Body() updateMenuDto: UpdateMenuDto,
  ): Promise<Menu> {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Menü sil' })
  @ApiResponse({ status: 204, description: 'Menü silindi' })
  @ApiResponse({ status: 404, description: 'Menü bulunamadı' })
  remove(@Param('id') id: string): Promise<void> {
    return this.menuService.remove(+id);
  }
}
