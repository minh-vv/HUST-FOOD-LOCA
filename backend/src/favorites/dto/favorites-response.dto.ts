/**
 * DTO for menu favorite item response
 */
export class MenuFavoriteItemDto {
    favorite_id: number;
    menu_id: number;
    menu_name: string;
    price: number | null;
    restaurant_name: string;
    restaurant_id: number;
    image_url: string | null;
    created_at: Date;
}

/**
 * DTO for restaurant favorite item response
 */
export class RestaurantFavoriteItemDto {
    favorite_id: number;
    restaurant_id: number;
    restaurant_name: string;
    address: string | null;
    image_url: string | null;
    created_at: Date;
}

/**
 * DTO for complete favorites list response
 */
export class FavoritesListResponseDto {
    success: boolean;
    message: string;
    data: {
        menus: MenuFavoriteItemDto[];
        restaurants: RestaurantFavoriteItemDto[];
        total_menus: number;
        total_restaurants: number;
    };
}

/**
 * DTO for single favorite action response
 */
export class FavoriteActionResponseDto {
    success: boolean;
    message: string;
    data: {
        favorite_id?: number;
        type: 'menu' | 'restaurant';
        item_id: number;
        action: 'added' | 'removed';
    };
}

/**
 * DTO for error response
 */
export class FavoriteErrorResponseDto {
    success: boolean;
    message: string;
    error?: string;
}
