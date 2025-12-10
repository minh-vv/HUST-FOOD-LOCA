export class IngredientDto {
  /**
   * Unique identifier for the ingredient.
   * @type {number}
   */
  id: number;
  /**
   * Name of the ingredient.
   * @type {string}
   */
  name: string;
}

export class MenuIngredientsDto {
  /**
   * List of main ingredients in the menu item.
   * @type {IngredientDto[]}
   */
  main: IngredientDto[];
  /**
   * List of other (secondary) ingredients in the menu item.
   * @type {IngredientDto[]}
   */
  others: IngredientDto[];
}

export class ReviewDto {
  /**
   * Unique identifier for the review.
   * @type {number}
   */
  id: number;
  /**
   * Name of the user who wrote the review.
   * @type {string}
   */
  user_name: string;
  /**
   * URL of the user's avatar image, or null if not available.
   * @type {string | null}
   */
  user_avatar: string | null;
  /**
   * Rating given by the user (e.g., 1-5).
   * @type {number}
   */
  rating: number;
  /**
   * Text comment provided by the user, or null if not provided.
   * @type {string | null}
   */
  comment: string | null;
  /**
   * Date when the review was created.
   * @type {Date}
   */
  created_at: Date;
  /**
   * List of image URLs attached to the review.
   * @type {string[]}
   */
  images: string[];
}

export class RatingBreakdownDto {
  /**
   * Number of 5-star ratings.
   * @type {number}
   */
  5: number;
  /**
   * Number of 4-star ratings.
   * @type {number}
   */
  4: number;
  /**
   * Number of 3-star ratings.
   * @type {number}
   */
  3: number;
  /**
   * Number of 2-star ratings.
   * @type {number}
   */
  2: number;
  /**
   * Number of 1-star ratings.
   * @type {number}
   */
  1: number;
}

export class MenuDetailResponseDto {
  /**
   * Unique identifier for the menu item.
   * @type {number}
   */
  id: number;
  /**
   * Name of the menu item.
   * @type {string}
   */
  name: string;
  /**
   * Information about the restaurant offering the menu item.
   * @type {{ name: string; address: string | null }}
   */
  restaurant: {
    /**
     * Name of the restaurant.
     * @type {string}
     */
    name: string;
    /**
     * Address of the restaurant, or null if not available.
     * @type {string | null}
     */
    address: string | null;
  };
  /**
   * URL of the menu item's image, or null if not available.
   * @type {string | null}
   */
  image_url: string | null;
  /**
   * Average rating of the menu item.
   * @type {number}
   */
  rating: number;
  /**
   * Total number of reviews for the menu item.
   * @type {number}
   */
  total_reviews: number;
  /**
   * Breakdown of ratings by star value.
   * @type {RatingBreakdownDto}
   */
  rating_breakdown: RatingBreakdownDto;
  /**
   * Ingredients used in the menu item.
   * @type {MenuIngredientsDto}
   */
  ingredients: MenuIngredientsDto;
  /**
   * List of reviews for the menu item.
   * @type {ReviewDto[]}
   */
  reviews: ReviewDto[];
}

