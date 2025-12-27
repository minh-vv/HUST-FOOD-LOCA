/**
 * Restaurant Image Data Transfer Object
 */
export class RestaurantImageDto {
  /**
   * URL of the restaurant image
   * @type {string}
   */
  image_url: string;

  /**
   * Display order of the image
   * @type {number}
   */
  display_order: number;

  /**
   * Whether this is the primary image
   * @type {boolean}
   */
  is_primary: boolean;
}

/**
 * Menu Item in Restaurant
 */
export class RestaurantMenuItemDto {
  /**
   * Menu ID
   * @type {number}
   */
  menu_id: number;

  /**
   * Menu name (constructed from dish info or menu name)
   * @type {string}
   */
  name?: string;

  /**
   * Menu price
   * @type {number}
   */
  price: number;

  /**
   * Menu primary image URL, or null if not available
   * @type {string | null}
   */
  image_url: string | null;

  /**
   * Average rating
   * @type {number}
   */
  rating: number;

  /**
   * Total reviews count
   * @type {number}
   */
  total_reviews: number;
}

/**
 * Restaurant Detail Response DTO
 */
export class RestaurantDetailResponseDto {
  /**
   * Unique identifier for the restaurant
   * @type {number}
   */
  restaurant_id: number;

  /**
   * Name of the restaurant
   * @type {string}
   */
  restaurant_name: string;

  /**
   * Address of the restaurant, or null if not available
   * @type {string | null}
   */
  address: string | null;

  /**
   * Average service time in minutes, or null if not available
   * @type {number | null}
   */
  average_service_time: number | null;

  /**
   * Google Map URL, or null if not available
   * @type {string | null}
   */
  google_map_url: string | null;

  /**
   * Website URL, or null if not available
   * @type {string | null}
   */
  website_url: string | null;

  /**
   * Restaurant description, or null if not available
   * @type {string | null}
   */
  description: string | null;

  /**
   * List of restaurant images
   * @type {RestaurantImageDto[]}
   */
  images: RestaurantImageDto[];

  /**
   * List of menu items available at this restaurant
   * @type {RestaurantMenuItemDto[]}
   */
  menu_items: RestaurantMenuItemDto[];

  /**
   * Total number of menu items
   * @type {number}
   */
  total_menu_items: number;
}
