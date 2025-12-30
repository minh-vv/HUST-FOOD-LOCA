import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:3000/api";

export default function RelatedDishes({ restaurantId, currentMenuId }) {
  const [relatedDishes, setRelatedDishes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRelatedDishes();
  }, [restaurantId]);

  const fetchRelatedDishes = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/menu?restaurant_id=${restaurantId}&limit=10`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch related dishes");
      }

      const data = await response.json();

      // Lọc bỏ món hiện tại
      const filtered =
        data.data?.filter((item) => item.menu_id !== Number(currentMenuId)) ||
        [];

      setRelatedDishes(filtered);
    } catch (err) {
      console.error("Error fetching related dishes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, relatedDishes.length - 3) : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev + 3 >= relatedDishes.length ? 0 : prev + 1
    );
  };

  const handleDishClick = (menuId) => {
    navigate(`/review/${menuId}`);
  };

  const visibleDishes = relatedDishes.slice(currentIndex, currentIndex + 3);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (relatedDishes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <p className="text-center text-gray-600">関連する料理がありません</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="relative">
        {/* Navigation Buttons */}
        {relatedDishes.length > 3 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight size={24} className="text-gray-700" />
            </button>
          </>
        )}

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleDishes.map((dish) => (
            <button
              key={dish.menu_id}
              onClick={() => handleDishClick(dish.menu_id)}
              className="group bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              {/* Dish Image */}
              <div className="relative bg-gray-200 h-48 flex items-center justify-center overflow-hidden">
                {dish.images?.length > 0 ? (
                  <img
                    src={dish.images[0].image_url}
                    alt={dish.name || "料理"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <span className="text-gray-400">画像なし</span>
                )}
              </div>

              {/* Dish Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-lg mb-2 group-hover:text-orange-600 transition-colors">
                  {dish.name || "料理名"}
                </h3>

                {dish.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {dish.description}
                  </p>
                )}

                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-600">
                    {dish.price?.toLocaleString() + " VND" || "N/A"}
                  </span>

                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                    {dish.average_rating
                      ? `★ ${dish.average_rating}`
                      : "未評価"}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Counter */}
      <div className="text-center mt-6 text-sm text-gray-600">
        {currentIndex + 1} - {Math.min(currentIndex + 3, relatedDishes.length)}{" "}
        / {relatedDishes.length}
      </div>
    </div>
  );
}
