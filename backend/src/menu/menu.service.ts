import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MenuDetailResponseDto } from './dto/menu-detail-response.dto';

/**
 * Service for handling restaurant menu operations.
 * Provides methods to retrieve menu details including images, ingredients, reviews, and associated restaurant information.
 */
@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves detailed information for a specific menu item by its ID.
   * Includes associated restaurant info, menu images, ingredients, and reviews.
   *
   * @param {number} menuId - The unique identifier of the menu item to retrieve.
   * @returns {Promise<MenuDetailResponseDto | null>} The detailed menu information, or null if not found.
   */
  async getMenuDetail(menuId: number): Promise<MenuDetailResponseDto | null> {
    const menu = await this.prisma.restaurantMenu.findUnique({
      where: { menu_id: menuId },
      include: {
        restaurant: {
          select: {
            restaurant_name: true,
            address: true,
          },
        },
        menu_images: {
          select: {
            image_url: true,
            is_primary: true,
          },
          orderBy: {
            display_order: 'asc',
          },
        },
        ingredients: {
          include: {
            ingredient: true,
          },
        },
        flavors: {
          include: {
            flavor: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                full_name: true,
                profile_image_url: true,
              },
            },
            images: true,
          },
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    });

    if (!menu) {
      return null;
    }

    // Process ingredients
    const mainIngredients = menu.ingredients
      .filter((i) => i.is_main)
      .map((i) => ({
        id: i.ingredient.ingredient_id,
        name: i.ingredient.ingredient_name,
      }));

    const sideIngredients = menu.ingredients
      .filter((i) => !i.is_main)
      .map((i) => ({
        id: i.ingredient.ingredient_id,
        name: i.ingredient.ingredient_name,
      }));

    // Calculate rating stats
    const totalReviews = menu.reviews.length;
    const averageRating =
      totalReviews > 0
        ? menu.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    // Rating breakdown (5 stars, 4 stars, etc.)
    const ratingBreakdown = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };
    menu.reviews.forEach((r) => {
      const rating = Math.round(r.rating);
      if (rating >= 1 && rating <= 5) {
        ratingBreakdown[rating as keyof typeof ratingBreakdown]++;
      }
    });

    const dishName = `${menu.restaurant.restaurant_name}`;

    return {
      id: menu.menu_id,
      name: dishName,
      restaurant: {
        name: menu.restaurant.restaurant_name,
        address: menu.restaurant.address,
      },
      images: menu.menu_images.map((img) => ({
        image_url: img.image_url,
      })),
      rating: Number(averageRating.toFixed(1)),
      total_reviews: totalReviews,
      rating_breakdown: ratingBreakdown,
      ingredients: {
        main: mainIngredients,
        others: sideIngredients,
      },
      taste: menu.flavors.map((f) => f.flavor.flavor_name).join(', '),
      reviews: menu.reviews.map((r) => ({
        id: r.review_id,
        user_name: r.user.full_name || 'Người dùng',
        user_avatar: r.user.profile_image_url,
        rating: r.rating,
        comment: r.comment,
        created_at: r.created_at,
        images: r.images.map((img) => img.image_url),
      })),
    };
  }
}
