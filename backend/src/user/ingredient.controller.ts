import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('ingredient')
export class IngredientController {
  constructor(private prisma: PrismaService) {}

  @Get('search')
  async searchIngredients(@Query('q') q: string) {
    return this.prisma.ingredient.findMany({
      where: {
        ingredient_name: {
          contains: q || '',
        },
      },
      take: 20,
      orderBy: { ingredient_name: 'asc' },
      select: {
        ingredient_id: true,
        ingredient_name: true,
      },
    });
  }

  @Get()
  async getAllIngredients() {
    return this.prisma.ingredient.findMany({
      orderBy: { ingredient_name: 'asc' },
      select: {
        ingredient_id: true,
        ingredient_name: true,
      },
    });
  }
}
