import { Controller, Get, Param, NotFoundException, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuDetailResponseDto } from './dto/menu-detail-response.dto';

/**
 * Controller for menu-related API endpoints.
 * Handles requests for retrieving menu details.
 */
@Controller('api/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  /**
   * GET /api/menu/:id
   * Retrieves the details of a menu item by its ID.
   * @param id The ID of the menu item to retrieve.
   * @returns {Promise<MenuDetailResponseDto>} The details of the menu item.
   * @throws {NotFoundException} If the menu item is not found.
   * @throws {HttpException} For internal server errors.
   */
  @Get(':id')
  async getMenuDetail(@Param('id', ParseIntPipe) id: number): Promise<MenuDetailResponseDto> {
    const menu = await this.menuService.getMenuDetail(id);
    if (!menu) {
      throw new NotFoundException('Menu item not found');
    }
    return menu;
  }
}

