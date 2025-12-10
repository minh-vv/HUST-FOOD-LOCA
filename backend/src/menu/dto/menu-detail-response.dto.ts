export class IngredientDto {
  id: number;
  name: string;
}

export class MenuIngredientsDto {
  main: IngredientDto[];
  others: IngredientDto[];
}

export class ReviewDto {
  id: number;
  user_name: string;
  user_avatar: string | null;
  rating: number;
  comment: string | null;
  created_at: Date;
  images: string[];
}

export class RatingBreakdownDto {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export class MenuDetailResponseDto {
  id: number;
  name: string;
  restaurant: {
    name: string;
    address: string | null;
  };
  image_url: string | null;
  rating: number;
  total_reviews: number;
  rating_breakdown: RatingBreakdownDto;
  ingredients: MenuIngredientsDto;
  reviews: ReviewDto[];
}

