import { Controller, Get, Query } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller('api/home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  /**
   * API tổng hợp — trả về trending dishes + restaurants + menu
   */
  @Get()
  async getHome(@Query('limit') limit?: string) {
    // Chuyển limit từ string sang number, nếu không có thì mặc định 6
    const l = Number(limit) || 6;
    return this.homeService.getHome(l);
  }

  /**
   * API lấy danh sách món ăn trending
   */
  @Get('trending-dishes')
  async getTrendingDishes(@Query('limit') limit?: string) {
    const l = Number(limit) || 6;
    return this.homeService.getTrendingDishes(l);
  }

  /**
   * API lấy danh sách nhà hàng trending
   */
  @Get('trending-restaurants')
  async getTrendingRestaurants(@Query('limit') limit?: string) {
    const l = Number(limit) || 6;
    return this.homeService.getTrendingRestaurants(l);
  }

  /**
   * API lấy danh sách menu items trending
   */
  @Get('trending-menu')
  async getTrendingMenu(@Query('limit') limit?: string) {
    const l = Number(limit) || 6;
    return this.homeService.getTrendingMenuItems(l);
  }
}
