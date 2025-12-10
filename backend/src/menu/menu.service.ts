import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MenuDetailResponseDto } from './dto/menu-detail-response.dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

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
    const averageRating = totalReviews > 0
      ? menu.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;
    
    // Rating breakdown (5 stars, 4 stars, etc.)
    const ratingBreakdown = {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    };
    menu.reviews.forEach(r => {
      const rating = Math.round(r.rating);
      if (rating >= 1 && rating <= 5) {
        ratingBreakdown[rating as keyof typeof ratingBreakdown]++;
      }
    });

    // Determine primary image
    const primaryImage = menu.menu_images.find(img => img.is_primary) || menu.menu_images[0];

    // Placeholder for Name since schema lacks it. 
    // In a real scenario, we would fix the schema. 
    // Here we construct a display name.
    const dishName = `Món ăn tại ${menu.restaurant.restaurant_name}`;

    return {
      id: menu.menu_id,
      name: dishName, 
      restaurant: {
        name: menu.restaurant.restaurant_name,
        address: menu.restaurant.address,
      },
      image_url: primaryImage?.image_url || null,
      rating: Number(averageRating.toFixed(1)),
      total_reviews: totalReviews,
      rating_breakdown: ratingBreakdown,
      ingredients: {
        main: mainIngredients,
        others: sideIngredients,
      },
      reviews: menu.reviews.map(r => ({
        id: r.review_id,
        user_name: r.user.full_name || 'Người dùng',
        user_avatar: r.user.profile_image_url,
        rating: r.rating,
        comment: r.comment,
        created_at: r.created_at,
        images: r.images.map(img => img.image_url)
      }))
    };
  }
}
