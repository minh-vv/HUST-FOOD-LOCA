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
	 * Lấy danh sách nhà hàng trending
	 * @param limit - số lượng nhà hàng cần lấy
	 */
	async getTrendingRestaurants(limit = 6) {
		const restaurants = await this.prisma.restaurant.findMany({
			take: limit,
			include: {
				images: {
					where: { is_primary: true },
					take: 1,
				},
			},
			orderBy: { restaurant_id: 'desc' },
		});

		return restaurants.map((r) => ({
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
			orderBy: {
				created_at: 'desc',
			},
		});

		// Fetch restaurant data separately to avoid schema issues
		const enriched = await Promise.all(
			menu.map(async (m) => {
				const restaurant = await this.prisma.restaurant.findUnique({
					where: { restaurant_id: m.restaurant_id },
					select: { restaurant_name: true, images: { where: { is_primary: true }, take: 1 } },
				});

				return {
					menu_id: m.menu_id,
					restaurant_id: m.restaurant_id,
					restaurant_name: restaurant?.restaurant_name ?? null,
					price: m.price ?? null,
					primary_image_url: restaurant?.images?.[0]?.image_url ?? null,
				};
			}),
		);

		return enriched;
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