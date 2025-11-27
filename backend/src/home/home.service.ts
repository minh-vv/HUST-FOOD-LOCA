import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HomeService {
	constructor(private prisma: PrismaService) {}

	/**
	 * Lấy danh sách món ăn trending (dựa trên số lượng reviews giảm dần)
	 * @param limit - số lượng món cần lấy
	 */
	async getTrendingDishes(limit = 6) {
		// Query lấy danh sách món ăn, ưu tiên món có nhiều review nhất
		const dishes = await this.prisma.dish.findMany({
			take: limit,
			orderBy: { reviews: { _count: 'desc' } }, // Sắp xếp theo số review
			include: {
				images: {
					where: { is_primary: true }, // Chỉ lấy ảnh chính
					take: 1,
				},
			},
		});

		// Chuẩn hoá dữ liệu trả về theo DTO
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
		// Query các nhà hàng trending
		const restaurants = await this.prisma.restaurant.findMany({
			take: limit,
			orderBy: { reviews: { _count: 'desc' } }, // nhà hàng nhiều review nhất lên trước
			include: {
				images: {
					where: { is_primary: true },
					take: 1,
				},
			},
		});

		// Chuẩn hoá dữ liệu
		return restaurants.map((r) => ({
			restaurant_id: r.restaurant_id,
			restaurant_name: r.restaurant_name,
			primary_image_url: r.images?.[0]?.image_url ?? null,
		}));
	}

	/**
	 * Lấy menu items trending bằng cách:
	 * 1. Lấy top 5 nhà hàng trending
	 * 2. Lấy menu items thuộc các nhà hàng đó
	 */
	async getTrendingMenuItems(limit = 6) {
		// (1) Lấy 5 nhà hàng trending dựa theo review
		const trending = await this.prisma.restaurant.findMany({
			take: 5,
			orderBy: { reviews: { _count: 'desc' } },
		});

		const ids = trending.map((r) => r.restaurant_id);

		// (2) Lấy menu thuộc các nhà hàng trending
		const menu = await this.prisma.restaurantMenu.findMany({
			where: {
				restaurant_id: { in: ids },
			},
			take: limit,
			include: {
				dish: {
					include: {
						images: {
							where: { is_primary: true },
							take: 1,
						},
					},
				},
				restaurant: true,
			},
		});

		// Chuẩn hoá dữ liệu trả về
		return menu.map((m) => ({
			menu_id: m.menu_id,
			dish_id: m.dish?.dish_id ?? null,
			dish_name: m.dish?.dish_name ?? null,
			cuisine_type: m.dish?.cuisine_type ?? null,
			primary_image_url: m.dish?.images?.[0]?.image_url ?? null,
			restaurant_id: m.restaurant?.restaurant_id ?? null,
			restaurant_name: m.restaurant?.restaurant_name ?? null,
			price: m.price ?? null,
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
