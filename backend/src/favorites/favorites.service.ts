import {
    Injectable,
    ConflictException,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    FavoritesListResponseDto,
    FavoriteActionResponseDto,
    MenuFavoriteItemDto,
    RestaurantFavoriteItemDto,
} from './dto/favorites-response.dto';

@Injectable()
export class FavoritesService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Get all favorites for a user (both menus and restaurants)
     * @param userId - The ID of the current user
     * @returns Combined list of favorite menus and restaurants
     */
    async getUserFavorites(userId: number): Promise<FavoritesListResponseDto> {
        // Get favorite menus with related data
        const menuFavorites = await this.prisma.userFavorite.findMany({
            where: { user_id: userId },
            include: {
                menu: {
                    include: {
                        restaurant: true,
                        menu_images: {
                            where: { is_primary: true },
                            take: 1,
                        },
                    },
                },
            },
            orderBy: { created_at: 'desc' },
        });

        // Get favorite restaurants with related data
        const restaurantFavorites = await this.prisma.restaurantFavorite.findMany({
            where: { user_id: userId },
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
            orderBy: { created_at: 'desc' },
        });

        // Transform menu favorites to DTO
        const menus: MenuFavoriteItemDto[] = menuFavorites.map((fav) => ({
            favorite_id: fav.favorite_id,
            menu_id: fav.menu_id,
            menu_name: fav.menu.menu_name || '',
            price: fav.menu.price ? Number(fav.menu.price) : null,
            restaurant_name: fav.menu.restaurant.restaurant_name,
            restaurant_id: fav.menu.restaurant_id,
            image_url: fav.menu.menu_images[0]?.image_url || null,
            created_at: fav.created_at,
        }));

        // Transform restaurant favorites to DTO
        const restaurants: RestaurantFavoriteItemDto[] = restaurantFavorites.map(
            (fav) => ({
                favorite_id: fav.favorite_id,
                restaurant_id: fav.restaurant_id,
                restaurant_name: fav.restaurant.restaurant_name,
                address: fav.restaurant.address,
                image_url: fav.restaurant.images[0]?.image_url || null,
                created_at: fav.created_at,
            }),
        );

        return {
            success: true,
            message: 'Lấy danh sách yêu thích thành công',
            data: {
                menus,
                restaurants,
                total_menus: menus.length,
                total_restaurants: restaurants.length,
            },
        };
    }

    /**
     * Add a menu item to user's favorites
     * @param userId - The ID of the current user
     * @param menuId - The ID of the menu item to add
     * @returns Response with the created favorite
     * @throws ConflictException if already favorited
     * @throws NotFoundException if menu doesn't exist
     */
    async addMenuFavorite(
        userId: number,
        menuId: number,
    ): Promise<FavoriteActionResponseDto> {
        // Validate that menu exists
        const menu = await this.prisma.restaurantMenu.findUnique({
            where: { menu_id: menuId },
        });

        if (!menu) {
            throw new NotFoundException('Món ăn không tồn tại');
        }

        // Check for existing favorite (prevent duplicates)
        const existingFavorite = await this.prisma.userFavorite.findUnique({
            where: {
                unique_user_favorite: {
                    user_id: userId,
                    menu_id: menuId,
                },
            },
        });

        if (existingFavorite) {
            throw new ConflictException('Món ăn này đã có trong danh sách yêu thích');
        }

        // Create new favorite
        const favorite = await this.prisma.userFavorite.create({
            data: {
                user_id: userId,
                menu_id: menuId,
            },
        });

        return {
            success: true,
            message: 'Đã thêm món ăn vào danh sách yêu thích',
            data: {
                favorite_id: favorite.favorite_id,
                type: 'menu',
                item_id: menuId,
                action: 'added',
            },
        };
    }

    /**
     * Remove a menu item from user's favorites
     * @param userId - The ID of the current user
     * @param menuId - The ID of the menu item to remove
     * @returns Response confirming removal
     * @throws NotFoundException if favorite doesn't exist
     */
    async removeMenuFavorite(
        userId: number,
        menuId: number,
    ): Promise<FavoriteActionResponseDto> {
        // Find the favorite to delete
        const favorite = await this.prisma.userFavorite.findUnique({
            where: {
                unique_user_favorite: {
                    user_id: userId,
                    menu_id: menuId,
                },
            },
        });

        if (!favorite) {
            throw new NotFoundException(
                'Món ăn này không có trong danh sách yêu thích',
            );
        }

        // Delete the favorite
        await this.prisma.userFavorite.delete({
            where: { favorite_id: favorite.favorite_id },
        });

        return {
            success: true,
            message: 'Đã xoá món ăn khỏi danh sách yêu thích',
            data: {
                type: 'menu',
                item_id: menuId,
                action: 'removed',
            },
        };
    }

    /**
     * Add a restaurant to user's favorites
     * @param userId - The ID of the current user
     * @param restaurantId - The ID of the restaurant to add
     * @returns Response with the created favorite
     * @throws ConflictException if already favorited
     * @throws NotFoundException if restaurant doesn't exist
     */
    async addRestaurantFavorite(
        userId: number,
        restaurantId: number,
    ): Promise<FavoriteActionResponseDto> {
        // Validate that restaurant exists
        const restaurant = await this.prisma.restaurant.findUnique({
            where: { restaurant_id: restaurantId },
        });

        if (!restaurant) {
            throw new NotFoundException('Nhà hàng không tồn tại');
        }

        // Check for existing favorite (prevent duplicates)
        const existingFavorite = await this.prisma.restaurantFavorite.findUnique({
            where: {
                unique_user_restaurant_favorite: {
                    user_id: userId,
                    restaurant_id: restaurantId,
                },
            },
        });

        if (existingFavorite) {
            throw new ConflictException(
                'Nhà hàng này đã có trong danh sách yêu thích',
            );
        }

        // Create new favorite
        const favorite = await this.prisma.restaurantFavorite.create({
            data: {
                user_id: userId,
                restaurant_id: restaurantId,
            },
        });

        return {
            success: true,
            message: 'Đã thêm nhà hàng vào danh sách yêu thích',
            data: {
                favorite_id: favorite.favorite_id,
                type: 'restaurant',
                item_id: restaurantId,
                action: 'added',
            },
        };
    }

    /**
     * Remove a restaurant from user's favorites
     * @param userId - The ID of the current user
     * @param restaurantId - The ID of the restaurant to remove
     * @returns Response confirming removal
     * @throws NotFoundException if favorite doesn't exist
     */
    async removeRestaurantFavorite(
        userId: number,
        restaurantId: number,
    ): Promise<FavoriteActionResponseDto> {
        // Find the favorite to delete
        const favorite = await this.prisma.restaurantFavorite.findUnique({
            where: {
                unique_user_restaurant_favorite: {
                    user_id: userId,
                    restaurant_id: restaurantId,
                },
            },
        });

        if (!favorite) {
            throw new NotFoundException(
                'Nhà hàng này không có trong danh sách yêu thích',
            );
        }

        // Delete the favorite
        await this.prisma.restaurantFavorite.delete({
            where: { favorite_id: favorite.favorite_id },
        });

        return {
            success: true,
            message: 'Đã xoá nhà hàng khỏi danh sách yêu thích',
            data: {
                type: 'restaurant',
                item_id: restaurantId,
                action: 'removed',
            },
        };
    }

    /**
     * Check if a menu item is in user's favorites
     * @param userId - The ID of the current user
     * @param menuId - The ID of the menu item to check
     * @returns Boolean indicating if favorited
     */
    async isMenuFavorited(userId: number, menuId: number): Promise<boolean> {
        const favorite = await this.prisma.userFavorite.findUnique({
            where: {
                unique_user_favorite: {
                    user_id: userId,
                    menu_id: menuId,
                },
            },
        });
        return !!favorite;
    }

    /**
     * Check if a restaurant is in user's favorites
     * @param userId - The ID of the current user
     * @param restaurantId - The ID of the restaurant to check
     * @returns Boolean indicating if favorited
     */
    async isRestaurantFavorited(
        userId: number,
        restaurantId: number,
    ): Promise<boolean> {
        const favorite = await this.prisma.restaurantFavorite.findUnique({
            where: {
                unique_user_restaurant_favorite: {
                    user_id: userId,
                    restaurant_id: restaurantId,
                },
            },
        });
        return !!favorite;
    }
}
