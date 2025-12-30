import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Heart, Bookmark } from "lucide-react";

const API_BASE_URL = "http://localhost:3000/api";

export default function RestaurantDetailPage() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    fetchRestaurantDetail();
    checkFavoriteStatus();
    checkSavedStatus();
  }, [restaurantId]);

  // Check if saved
  const checkSavedStatus = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const res = await fetch(
        `${API_BASE_URL}/saved/restaurant/${restaurantId}/check`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setIsSaved(data.data?.is_saved || false);
      }
    } catch (err) {
      console.error("Error checking saved status:", err);
    }
  };

  // Handle save toggle
  const handleSaveClick = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("保存するにはログインしてください");
      return;
    }

    setIsSaveLoading(true);
    try {
      const method = isSaved ? "DELETE" : "POST";
      const res = await fetch(`${API_BASE_URL}/saved/restaurant/${restaurantId}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setIsSaved(!isSaved);
      } else {
        const data = await res.json().catch(() => ({}));
        if (res.status === 409) setIsSaved(true);
        else if (res.status === 404) setIsSaved(false);
        else console.error("Save error:", data.message);
      }
    } catch (err) {
      console.error("Error toggling saved:", err);
    } finally {
      setIsSaveLoading(false);
    }
  };

  const fetchRestaurantDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/restaurant/${restaurantId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRestaurant(data);
      setCurrentImageIndex(0);
    } catch (err) {
      console.error("Error fetching restaurant detail:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Check if this restaurant is already favorited
  const checkFavoriteStatus = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const res = await fetch(
        `${API_BASE_URL}/favorites/restaurant/${restaurantId}/check`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setIsFavorited(data.data?.is_favorited || false);
      }
    } catch (err) {
      console.error("Error checking favorite status:", err);
    }
  };

  // Handle favorite button click - call API to add/remove
  const handleFavoriteClick = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("お気に入りを追加するにはログインしてください");
      return;
    }

    setIsFavoriteLoading(true);
    try {
      const method = isFavorited ? "DELETE" : "POST";
      const res = await fetch(
        `${API_BASE_URL}/favorites/restaurant/${restaurantId}`,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setIsFavorited(!isFavorited);
      } else {
        const data = await res.json();
        if (res.status === 409) {
          setIsFavorited(true);
        } else if (res.status === 404) {
          setIsFavorited(false);
        } else {
          console.error("Favorite error:", data.message);
        }
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  const handlePrev = () => {
    if (restaurant?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? restaurant.images.length - 1 : prev - 1
      );
    }
  };

  const handleNext = () => {
    if (restaurant?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === restaurant.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center max-w-md">
            <div className="text-red-600 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              エラーが発生しました
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchRestaurantDetail}
              className="bg-orange-400 text-white px-6 py-2 rounded hover:bg-orange-500"
            >
              再試行
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Restaurant not found</p>
        </div>
      </div>
    );
  }

  const currentImage = restaurant.images?.[currentImageIndex]?.image_url;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* RESTAURANT HEADER */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* LEFT: IMAGE GALLERY */}
            <div>
              <div className="relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
                {currentImage ? (
                  <img
                    src={currentImage}
                    className="w-full h-full object-cover"
                    alt="Restaurant"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    画像なし
                  </div>
                )}

                {/* Navigation buttons */}
                {restaurant.images && restaurant.images.length > 1 && (
                  <>
                    <button
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
                      onClick={handlePrev}
                      aria-label="Previous image"
                    >
                      ❮
                    </button>
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
                      onClick={handleNext}
                      aria-label="Next image"
                    >
                      ❯
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT: RESTAURANT INFO */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {restaurant.restaurant_name}
                  </h1>
                  {restaurant.address && (
                    <p className="text-gray-600 text-sm mt-2">
                      📍 {restaurant.address}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleFavoriteClick}
                    disabled={isFavoriteLoading}
                    className={`p-2 rounded-full transition-colors ${
                      isFavorited
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    } ${
                      isFavoriteLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    title={
                      isFavorited ? "お気に入りから削除" : "お気に入りに追加"
                    }
                  >
                    <Heart
                      size={28}
                      fill={isFavorited ? "currentColor" : "none"}
                      className={isFavoriteLoading ? "animate-pulse" : ""}
                    />
                  </button>

                  <button
                    onClick={handleSaveClick}
                    disabled={isSaveLoading}
                    className={`p-2 rounded-full transition-colors ${
                      isSaved
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    } ${isSaveLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    title={isSaved ? "保存を解除" : "保存する"}
                  >
                    <Bookmark
                      size={24}
                      fill={isSaved ? "currentColor" : "none"}
                      className={isSaveLoading ? "animate-pulse" : ""}
                    />
                  </button>
                </div>
              </div>

              {restaurant.description && (
                <div>
                  <p className="text-gray-800">{restaurant.description}</p>
                </div>
              )}

              {restaurant.average_service_time && (
                <div>
                  <p className="text-gray-600 text-sm font-semibold">
                    注文の時間
                  </p>
                  <p className="text-gray-800">
                    {restaurant.average_service_time} 分
                  </p>
                </div>
              )}

              <div className="flex gap-4 pt-2">
                {restaurant.google_map_url && (
                  <a
                    href={restaurant.google_map_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    🗺️ グーグルマップ
                  </a>
                )}
                {restaurant.website_url && (
                  <a
                    href={restaurant.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    🌐 ウェブサイト
                  </a>
                )}
              </div>

              {/* Thumbnails - Below links */}
              {restaurant.images && restaurant.images.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pt-4 border-t">
                  {restaurant.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                        index === currentImageIndex
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      <img
                        src={img.image_url}
                        className="w-full h-full object-cover"
                        alt={`Thumbnail ${index + 1}`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MENU ITEMS */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            メニュー項目
          </h2>
          {restaurant.menu_items && restaurant.menu_items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurant.menu_items.map((item) => (
                <button
                  key={item.menu_id}
                  onClick={() => navigate(`/review/${item.menu_id}`)}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow text-left bg-gray-50"
                >
                  <div className="relative h-48 bg-gray-300 overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        className="w-full h-full object-cover"
                        alt={item.name}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        画像なし
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-orange-600">
                        {parseFloat(item.price).toFixed(0)} VND
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-gray-700 text-sm">
                          {item.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No menu items available</p>
          )}
        </div>
      </div>
    </div>
  );
}
