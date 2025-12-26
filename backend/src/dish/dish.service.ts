import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DishDetailResponseDto } from './dto/dish-detail-response.dto';

@Injectable()
export class DishService {
  constructor(private prisma: PrismaService) {}

  async findById(dishId: number): Promise<DishDetailResponseDto | null> {
    const dish = await this.prisma.dish.findUnique({
      where: { dish_id: dishId },
      include: {
        images: true,
        flavors: {
          include: {
            flavor: true,
          },
        },
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    if (!dish) return null;

    return {
      dish_id: dish.dish_id,
      dish_name: dish.dish_name,
      description: dish.description ?? undefined,
      average_price: dish.average_price?.toNumber(),
      cuisine_type: dish.cuisine_type ?? undefined,

      images: dish.images.map((img) => ({
        image_url: img.image_url,
        is_primary: img.is_primary ?? false,
      })),

      flavors: dish.flavors.map((f) => ({
        name: f.flavor.flavor_name,
        intensity: f.intensity,
      })),

      ingredients: dish.ingredients.map((i) => ({
        name: i.ingredient.ingredient_name,
        is_main: i.is_main,
      })),
    };
  }
}
