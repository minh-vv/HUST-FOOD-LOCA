// DTO cho món ăn xu hướng trên homepage
export class TrendingDishDto {
  dish_id: number;
  dish_name: string;
  primary_image_url: string;
  cuisine_type: string;
}
// DTO cho nhà hàng xu hướng trên homepage
export class TrendingRestaurantDto {
  restaurant_id: number;
  restaurant_name: string;
  primary_image_url: string;
}
//DTO cho mục menu xu hướng trên homepage
export class TrendingMenuItemDto {
  menu_id: number;
  dish_id: number;
  dish_name: string;
  primary_image_url: string;
  cuisine_type: string;
  restaurant_id: number;
  restaurant_name: string;
  price: number;
}
// Gộp tất cả các DTO trên thành DTO phản hồi cho trang chủ
export class HomePageResponseDto {
  trending_dishes: TrendingDishDto[];
  trending_restaurants: TrendingRestaurantDto[];
  trending_menu_items: TrendingMenuItemDto[];
}
// Xử lý truy vấn giới hạn số lượng mục trả về
export class GetTrendingQueryDto {
  limit?: number = 10;
}
