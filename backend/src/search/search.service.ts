import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchByKeyword(keyword: string) {
    // Search restaurants by name or description
    const restaurants = await this.prisma.restaurant.findMany({
      where: {
        OR: [
          { restaurant_name: { contains: keyword } },
          { description: { contains: keyword } },
        ],
      },
      include: {
        images: {
          where: { is_primary: true },
          take: 1,
        },
      },
      take: 10,
    });

    // Search dishes by name or description
    const dishes = await this.prisma.dish.findMany({
      where: {
        OR: [
          { dish_name: { contains: keyword } },
          { description: { contains: keyword } },
        ],
      },
      include: {
        images: {
          take: 1,
        },
      },
      take: 10,
    });

    // Find restaurants that have the searched dishes
    let restaurantsWithDishes: any[] = [];
    if (dishes.length > 0) {
      const dishIds = dishes.map((d) => d.dish_id);
      restaurantsWithDishes = await this.prisma.restaurantMenu.findMany({
        where: {
          dish_id: { in: dishIds },
        },
        include: {
          restaurant: {
            include: {
              images: {
                where: { is_primary: true },
                take: 1,
              },
            },
          },
        },
        take: 20,
      });
    }

    return {
      restaurants: restaurants.map((restaurant) => ({
        id: restaurant.restaurant_id,
        name: restaurant.restaurant_name,
        type: 'restaurant',
        description: restaurant.description,
        address: restaurant.address,
        image: restaurant.images[0]?.image_url || null,
      })),
      dishes: dishes.map((dish) => ({
        id: dish.dish_id,
        name: dish.dish_name,
        type: 'dish',
        description: dish.description,
        price: dish.average_price,
        image: dish.images[0]?.image_url || null,
      })),
      restaurantsWithDishes: restaurantsWithDishes
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.restaurant.restaurant_id ===
                value.restaurant.restaurant_id,
            ),
        )
        .map((menu) => ({
          id: menu.restaurant.restaurant_id,
          name: menu.restaurant.restaurant_name,
          type: 'restaurant',
          description: menu.restaurant.description,
          address: menu.restaurant.address,
          image: menu.restaurant.images[0]?.image_url || null,
          dishPrice: menu.price,
        })),
    };
  }
}
