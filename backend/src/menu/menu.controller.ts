import { Controller, Get, Param, NotFoundException, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuDetailResponseDto } from './dto/menu-detail-response.dto';

@Controller('api/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get(':id')
  async getMenuDetail(@Param('id', ParseIntPipe) id: number): Promise<MenuDetailResponseDto> {
    const menu = await this.menuService.getMenuDetail(id);
    if (!menu) {
      throw new NotFoundException('Menu item not found');
    }
    return menu;
  }
}

