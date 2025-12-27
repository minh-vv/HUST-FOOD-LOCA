export class DishDetailResponseDto {
  dish_id: number;
  dish_name: string;
  description?: string;
  average_price?: number;
  cuisine_type?: string;

  images: {
    image_url: string;
    is_primary: boolean;
  }[];

  flavors: {
    name: string;
    intensity: number;
  }[];

  ingredients: {
    name: string;
    is_main: boolean;
  }[];
}
