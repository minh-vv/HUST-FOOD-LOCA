import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RestaurantDetailResponseDto } from './dto/restaurant-detail-response.dto';

/**
 * Service for handling restaurant operations.
 * Provides methods to retrieve restaurant details including images and menu items.
 */
@Injectable()
export class RestaurantService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves detailed information for a specific restaurant by its ID.
   * Includes restaurant images and all menu items with their ratings.
   *
   * @param {number} restaurantId - The unique identifier of the restaurant to retrieve.
   * @returns {Promise<RestaurantDetailResponseDto | null>} The detailed restaurant information, or null if not found.
   */
  async getRestaurantDetail(
    restaurantId: number,
  ): Promise<RestaurantDetailResponseDto | null> {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { restaurant_id: restaurantId },
      include: {
        images: {
          select: {
            image_url: true,
            display_order: true,
            is_primary: true,
          },
          orderBy: {
            display_order: 'asc',
          },
        },
        menu: {
          include: {
            menu_images: {
              select: {
                image_url: true,
                is_primary: true,
              },
              take: 1,
            },
            reviews: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
    });

    if (!restaurant) {
      return null;
    }

    // Transform menu items
    const menu_items = restaurant.menu.map((item) => {
      const totalReviews = item.reviews.length;
      const averageRating =
        totalReviews > 0
          ? item.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
          : 0;

      const primaryImage = item.menu_images[0];

      return {
        menu_id: item.menu_id,
        name: `Menu Item #${item.menu_id}`, // Can be enhanced with dish name if schema is updated
        price: item.price ? Number(item.price) : 0,
        image_url: primaryImage?.image_url || null,
        rating: Number(averageRating.toFixed(1)),
        total_reviews: totalReviews,
      };
    });

    return {
      restaurant_id: restaurant.restaurant_id,
      restaurant_name: restaurant.restaurant_name,
      address: restaurant.address,
      average_service_time: restaurant.average_service_time,
      google_map_url: restaurant.google_map_url,
      website_url: restaurant.website_url,
      description: restaurant.description,
      images: restaurant.images,
      menu_items: menu_items,
      total_menu_items: menu_items.length,
    };
  }
  async getRestaurants(limit: number) {
    return this.prisma.restaurant.findMany({
      take: limit,
      orderBy: {
        created_at: 'desc',
      },
      include: {
        images: true,
      },
    });
  }
}
