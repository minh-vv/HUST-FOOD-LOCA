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
import { SavedService } from './saved.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
    SavedListResponseDto,
    SavedActionResponseDto,
} from './dto/saved-response.dto';

/**
 * Controller for managing user saved items.
 * All endpoints require JWT authentication.
 * Users can only access/modify their own saved items.
 */
@Controller('api/saved')
@UseGuards(JwtAuthGuard)
export class SavedController {
    constructor(private readonly savedService: SavedService) { }

    /**
     * GET /api/saved
     * Get all saved items for the authenticated user
     * @param user - Current authenticated user from JWT
     * @returns List of saved menus
     */
    @Get()
    async getUserSaved(
        @CurrentUser() user: { user_id: number },
    ): Promise<SavedListResponseDto> {
        return this.savedService.getUserSaved(user.user_id);
    }

    /**
     * POST /api/saved/menu/:menuId
     * Add a menu item to the user's saved list
     * @param user - Current authenticated user from JWT
     * @param menuId - ID of the menu item to save
     * @returns Response confirming the addition
     */
    @Post('menu/:menuId')
    @HttpCode(HttpStatus.CREATED)
    async addMenuSaved(
        @CurrentUser() user: { user_id: number },
        @Param('menuId', ParseIntPipe) menuId: number,
    ): Promise<SavedActionResponseDto> {
        return this.savedService.addMenuSaved(user.user_id, menuId);
    }

    /**
     * DELETE /api/saved/menu/:menuId
     * Remove a menu item from the user's saved list
     * @param user - Current authenticated user from JWT
     * @param menuId - ID of the menu item to remove
     * @returns Response confirming the removal
     */
    @Delete('menu/:menuId')
    @HttpCode(HttpStatus.OK)
    async removeMenuSaved(
        @CurrentUser() user: { user_id: number },
        @Param('menuId', ParseIntPipe) menuId: number,
    ): Promise<SavedActionResponseDto> {
        return this.savedService.removeMenuSaved(user.user_id, menuId);
    }

    /**
     * GET /api/saved/menu/:menuId/check
     * Check if a menu item is in the user's saved list
     * @param user - Current authenticated user from JWT
     * @param menuId - ID of the menu item to check
     * @returns Boolean indicating if saved
     */
    @Get('menu/:menuId/check')
    async checkMenuSaved(
        @CurrentUser() user: { user_id: number },
        @Param('menuId', ParseIntPipe) menuId: number,
    ): Promise<{ success: boolean; data: { is_saved: boolean } }> {
        const isSaved = await this.savedService.isMenuSaved(user.user_id, menuId);
        return {
            success: true,
            data: { is_saved: isSaved },
        };
    }
}
