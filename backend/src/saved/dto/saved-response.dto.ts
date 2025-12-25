/**
 * DTO for menu saved item response
 */
export class MenuSavedItemDto {
    saved_id: number;
    menu_id: number;
    menu_name: string;
    price: number | null;
    restaurant_name: string;
    restaurant_id: number;
    image_url: string | null;
    created_at: Date;
}

/**
 * DTO for restaurant saved item response
 */
export class RestaurantSavedItemDto {
    saved_id: number;
    restaurant_id: number;
    restaurant_name: string;
    address: string | null;
    image_url: string | null;
    created_at: Date;
}

/**
 * DTO for complete saved list response
 */
export class SavedListResponseDto {
    success: boolean;
    message: string;
    data: {
        menus: MenuSavedItemDto[];
        restaurants: RestaurantSavedItemDto[];
        total_menus: number;
        total_restaurants: number;
    };
}

/**
 * DTO for single saved action response
 */
export class SavedActionResponseDto {
    success: boolean;
    message: string;
    data: {
        saved_id?: number;
        type: 'menu' | 'restaurant';
        item_id: number;
        action: 'added' | 'removed';
    };
}

/**
 * DTO for error response
 */
export class SavedErrorResponseDto {
    success: boolean;
    message: string;
    error?: string;
}
