import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { DishService } from './dish.service';

@Controller('api/dish')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Get(':dishId')
  async getDishDetail(@Param('dishId') dishId: string) {
    const dish = await this.dishService.findById(Number(dishId));

    if (!dish) {
      throw new NotFoundException('Dish not found');
    }

    return dish;
  }
}
