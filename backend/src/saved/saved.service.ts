import {
    Injectable,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    SavedListResponseDto,
    SavedActionResponseDto,
    MenuSavedItemDto,
    RestaurantSavedItemDto,
} from './dto/saved-response.dto';

@Injectable()
export class SavedService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Get all saved items for a user (menus only, as UserSaved only supports menus)
     * @param userId - The ID of the current user
     * @returns List of saved menus
     */
    async getUserSaved(userId: number): Promise<SavedListResponseDto> {
        // Get saved menus with related data
        const menuSaved = await this.prisma.userSaved.findMany({
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

        // Transform menu saved to DTO
        const menus: MenuSavedItemDto[] = menuSaved.map((item) => ({
            saved_id: item.saved_id,
            menu_id: item.menu_id,
            menu_name: item.menu.menu_name || '',
            price: item.menu.price ? Number(item.menu.price) : null,
            restaurant_name: item.menu.restaurant.restaurant_name,
            restaurant_id: item.menu.restaurant_id,
            image_url: item.menu.menu_images[0]?.image_url || null,
            created_at: item.created_at,
        }));

        return {
            success: true,
            message: '保存済みリストを取得しました',
            data: {
                menus,
                restaurants: [], // UserSaved doesn't support restaurants yet
                total_menus: menus.length,
                total_restaurants: 0,
            },
        };
    }

    /**
     * Add a menu item to user's saved list
     * @param userId - The ID of the current user
     * @param menuId - The ID of the menu item to save
     * @returns Response with the created saved item
     */
    async addMenuSaved(
        userId: number,
        menuId: number,
    ): Promise<SavedActionResponseDto> {
        // Validate that menu exists
        const menu = await this.prisma.restaurantMenu.findUnique({
            where: { menu_id: menuId },
        });

        if (!menu) {
            throw new NotFoundException('メニューが見つかりません');
        }

        // Check for existing saved item
        const existingSaved = await this.prisma.userSaved.findUnique({
            where: {
                unique_user_saved: {
                    user_id: userId,
                    menu_id: menuId,
                },
            },
        });

        if (existingSaved) {
            throw new ConflictException('このメニューは既に保存済みです');
        }

        // Create new saved item
        const saved = await this.prisma.userSaved.create({
            data: {
                user_id: userId,
                menu_id: menuId,
            },
        });

        return {
            success: true,
            message: 'メニューを保存しました',
            data: {
                saved_id: saved.saved_id,
                type: 'menu',
                item_id: menuId,
                action: 'added',
            },
        };
    }

    /**
     * Remove a menu item from user's saved list
     * @param userId - The ID of the current user
     * @param menuId - The ID of the menu item to remove
     * @returns Response confirming removal
     */
    async removeMenuSaved(
        userId: number,
        menuId: number,
    ): Promise<SavedActionResponseDto> {
        // Find the saved item
        const saved = await this.prisma.userSaved.findUnique({
            where: {
                unique_user_saved: {
                    user_id: userId,
                    menu_id: menuId,
                },
            },
        });

        if (!saved) {
            throw new NotFoundException('このメニューは保存されていません');
        }

        // Delete the saved item
        await this.prisma.userSaved.delete({
            where: { saved_id: saved.saved_id },
        });

        return {
            success: true,
            message: 'メニューの保存を解除しました',
            data: {
                type: 'menu',
                item_id: menuId,
                action: 'removed',
            },
        };
    }

    /**
     * Check if a menu item is in user's saved list
     * @param userId - The ID of the current user
     * @param menuId - The ID of the menu item to check
     * @returns Boolean indicating if saved
     */
    async isMenuSaved(userId: number, menuId: number): Promise<boolean> {
        const saved = await this.prisma.userSaved.findUnique({
            where: {
                unique_user_saved: {
                    user_id: userId,
                    menu_id: menuId,
                },
            },
        });
        return !!saved;
    }
}
