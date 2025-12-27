import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

interface FilterMenuParams {
  flavorIds?: string;
  ingredientIds?: string;
}

@Injectable()
export class FilterService {
  constructor(private prisma: PrismaService) {}

  async filterMenus(params: FilterMenuParams) {
    const { flavorIds, ingredientIds } = params;

    const flavorIdArray = flavorIds
      ? flavorIds.split(",").map(Number)
      : [];

    const ingredientIdArray = ingredientIds
      ? ingredientIds.split(",").map(Number)
      : [];

    return this.prisma.restaurantMenu.findMany({
      where: {
        AND: [
          // Filter theo FLAVOR
          flavorIdArray.length > 0
            ? {
                flavors: {
                  some: {
                    flavor_id: { in: flavorIdArray },
                  },
                },
              }
            : {},

          // Filter theo INGREDIENT
          ingredientIdArray.length > 0
            ? {
                ingredients: {
                  some: {
                    ingredient_id: { in: ingredientIdArray },
                  },
                },
              }
            : {},
        ],
      },

      include: {
        restaurant: true,
        menu_images: true,
        flavors: {
          include: { flavor: true },
        },
        ingredients: {
          include: { ingredient: true },
        },
      },
    });
  }
}
