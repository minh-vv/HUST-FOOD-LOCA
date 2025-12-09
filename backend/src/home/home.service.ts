import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HomeService {
	constructor(private prisma: PrismaService) {}

	/**
	 * Lấy danh sách món ăn trending
	 * @param limit - số lượng món cần lấy
	 */
	async getTrendingDishes(limit = 6) {
		const dishes = await this.prisma.dish.findMany({
			take: limit,
			include: {
				images: {
					where: { is_primary: true },
					take: 1,
				},
			},
			orderBy: { dish_id: 'desc' },
		});

		return dishes.map((d) => ({
			dish_id: d.dish_id,
			dish_name: d.dish_name,
			primary_image_url: d.images?.[0]?.image_url ?? null,
			cuisine_type: d.cuisine_type ?? null,
		}));
	}

	/**
	 * Lấy danh sách nhà hàng trending (dựa theo số review nhiều nhất)
	 * @param limit - số lượng nhà hàng cần lấy
	 */
	async getTrendingRestaurants(limit = 6) {
		const restaurants = await this.prisma.restaurant.findMany({
			include: {
				images: {
					where: { is_primary: true },
					take: 1,
				},
				menu: {
					include: {
						reviews: true,
					},
				},
			},
		});

		// Sắp xếp theo tổng số reviews và lấy top limit
		const sortedRestaurants = restaurants
			.map((r) => ({
				...r,
				totalReviews: r.menu.reduce((sum, m) => sum + m.reviews.length, 0),
			}))
			.sort((a, b) => b.totalReviews - a.totalReviews)
			.slice(0, limit);

		return sortedRestaurants.map((r) => ({
			restaurant_id: r.restaurant_id,
			restaurant_name: r.restaurant_name,
			primary_image_url: r.images?.[0]?.image_url ?? null,
		}));
	}

	/**
	 * Lấy menu items trending
	 * Chỉ lấy các menu items mới nhất có sẵn
	 */
	async getTrendingMenuItems(limit = 6) {
		const menu = await this.prisma.restaurantMenu.findMany({
			where: {
				is_available: true,
			},
			take: limit,
			include: {
				restaurant: {
					select: {
						restaurant_id: true,
						restaurant_name: true,
						images: {
							where: { is_primary: true },
							take: 1,
							select: { image_url: true },
						},
					},
				},
				ingredients: {
					take: 3,
					include: {
						ingredient: true,
					},
				},
			},
			orderBy: {
				created_at: 'desc',
			},
		});

		return menu.map((m) => ({
			menu_id: m.menu_id,
			primary_image_url: m.restaurant?.images?.[0]?.image_url ?? null,
			restaurant_id: m.restaurant?.restaurant_id ?? null,
			restaurant_name: m.restaurant?.restaurant_name ?? null,
			price: m.price ?? null,
			ingredients: m.ingredients?.map((mi) => ({
				ingredient_id: mi.ingredient.ingredient_id,
				ingredient_name: mi.ingredient.ingredient_name,
				is_main: mi.is_main,
			})) ?? [],
		}));
	}

	/**
	 * API tổng hợp: trả về 3 phần Trending:
	 * - Món ăn trending
	 * - Nhà hàng trending
	 * - Menu items trending
	 * Dùng Promise.all để tăng tốc (chạy song song)
	 */
	async getHome(limit = 6) {
		const [trending_dishes, trending_restaurants, trending_menu_items] =
			await Promise.all([
				this.getTrendingDishes(limit),
				this.getTrendingRestaurants(limit),
				this.getTrendingMenuItems(limit),
			]);

		return {
			trending_dishes,
			trending_restaurants,
			trending_menu_items,
		};
	}
}