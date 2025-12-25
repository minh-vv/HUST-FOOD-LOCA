import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    ParseIntPipe,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
    FavoritesListResponseDto,
    FavoriteActionResponseDto,
} from './dto/favorites-response.dto';

/**
 * Controller for managing user favorites.
 * All endpoints require JWT authentication.
 * Users can only access/modify their own favorites.
 */
@Controller('api/favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
    constructor(private readonly favoritesService: FavoritesService) { }

    /**
     * GET /api/favorites
     * Get all favorites (menus and restaurants) for the authenticated user
     * @param user - Current authenticated user from JWT
     * @returns List of favorite menus and restaurants
     */
    @Get()
    async getUserFavorites(
        @CurrentUser() user: { user_id: number },
    ): Promise<FavoritesListResponseDto> {
        return this.favoritesService.getUserFavorites(user.user_id);
    }

    /**
     * POST /api/favorites/menu/:menuId
     * Add a menu item to the user's favorites
     * @param user - Current authenticated user from JWT
     * @param menuId - ID of the menu item to add
     * @returns Response confirming the addition
     */
    @Post('menu/:menuId')
    @HttpCode(HttpStatus.CREATED)
    async addMenuFavorite(
        @CurrentUser() user: { user_id: number },
        @Param('menuId', ParseIntPipe) menuId: number,
    ): Promise<FavoriteActionResponseDto> {
        return this.favoritesService.addMenuFavorite(user.user_id, menuId);
    }

    /**
     * DELETE /api/favorites/menu/:menuId
     * Remove a menu item from the user's favorites
     * @param user - Current authenticated user from JWT
     * @param menuId - ID of the menu item to remove
     * @returns Response confirming the removal
     */
    @Delete('menu/:menuId')
    @HttpCode(HttpStatus.OK)
    async removeMenuFavorite(
        @CurrentUser() user: { user_id: number },
        @Param('menuId', ParseIntPipe) menuId: number,
    ): Promise<FavoriteActionResponseDto> {
        return this.favoritesService.removeMenuFavorite(user.user_id, menuId);
    }

    /**
     * POST /api/favorites/restaurant/:restaurantId
     * Add a restaurant to the user's favorites
     * @param user - Current authenticated user from JWT
     * @param restaurantId - ID of the restaurant to add
     * @returns Response confirming the addition
     */
    @Post('restaurant/:restaurantId')
    @HttpCode(HttpStatus.CREATED)
    async addRestaurantFavorite(
        @CurrentUser() user: { user_id: number },
        @Param('restaurantId', ParseIntPipe) restaurantId: number,
    ): Promise<FavoriteActionResponseDto> {
        return this.favoritesService.addRestaurantFavorite(
            user.user_id,
            restaurantId,
        );
    }

    /**
     * DELETE /api/favorites/restaurant/:restaurantId
     * Remove a restaurant from the user's favorites
     * @param user - Current authenticated user from JWT
     * @param restaurantId - ID of the restaurant to remove
     * @returns Response confirming the removal
     */
    @Delete('restaurant/:restaurantId')
    @HttpCode(HttpStatus.OK)
    async removeRestaurantFavorite(
        @CurrentUser() user: { user_id: number },
        @Param('restaurantId', ParseIntPipe) restaurantId: number,
    ): Promise<FavoriteActionResponseDto> {
        return this.favoritesService.removeRestaurantFavorite(
            user.user_id,
            restaurantId,
        );
    }

    /**
     * GET /api/favorites/menu/:menuId/check
     * Check if a menu item is in the user's favorites
     * @param user - Current authenticated user from JWT
     * @param menuId - ID of the menu item to check
     * @returns Boolean indicating if favorited
     */
    @Get('menu/:menuId/check')
    async checkMenuFavorite(
        @CurrentUser() user: { user_id: number },
        @Param('menuId', ParseIntPipe) menuId: number,
    ): Promise<{ success: boolean; data: { is_favorited: boolean } }> {
        const isFavorited = await this.favoritesService.isMenuFavorited(
            user.user_id,
            menuId,
        );
        return {
            success: true,
            data: { is_favorited: isFavorited },
        };
    }

    /**
     * GET /api/favorites/restaurant/:restaurantId/check
     * Check if a restaurant is in the user's favorites
     * @param user - Current authenticated user from JWT
     * @param restaurantId - ID of the restaurant to check
     * @returns Boolean indicating if favorited
     */
    @Get('restaurant/:restaurantId/check')
    async checkRestaurantFavorite(
        @CurrentUser() user: { user_id: number },
        @Param('restaurantId', ParseIntPipe) restaurantId: number,
    ): Promise<{ success: boolean; data: { is_favorited: boolean } }> {
        const isFavorited = await this.favoritesService.isRestaurantFavorited(
            user.user_id,
            restaurantId,
        );
        return {
            success: true,
            data: { is_favorited: isFavorited },
        };
    }
}
