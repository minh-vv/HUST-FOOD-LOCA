import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import RelatedRestaurants from "../components/RelatedRestaurants"; // mục (11)
import { Heart, Star } from "lucide-react";

const API_BASE_URL = "http://localhost:3000/api";

export default function DishDetailPage() {
  const { menuId } = useParams();
  const [dishDetail, setDishDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false); // (5)
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [rating, setRating] = useState(0); // (6)
  const [thumbIndex, setThumbIndex] = useState(0); // điều hướng thumbnail

  useEffect(() => {
    fetchDishDetail();
    checkFavoriteStatus();
  }, [menuId]);

  const fetchDishDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE_URL}/menu/${menuId}`);
      if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);

      const data = await res.json();
      setDishDetail(data);
    } catch (err) {
      console.error("Error fetching dish:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Check if this menu is already favorited
  const checkFavoriteStatus = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return; // Not logged in

      const res = await fetch(`${API_BASE_URL}/favorites/menu/${menuId}/check`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
      const res = await fetch(`${API_BASE_URL}/favorites/menu/${menuId}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setIsFavorited(!isFavorited);
      } else {
        const data = await res.json();
        // If already favorited or not found, just update state
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

  const handleRatingClick = (star) => setRating(star);

  const handleThumbLeft = () => {
    if (!dishDetail?.images) return;
    setThumbIndex((prev) =>
      prev === 0 ? dishDetail.images.length - 1 : prev - 1
    );
  };

  const handleThumbRight = () => {
    if (!dishDetail?.images) return;
    setThumbIndex((prev) =>
      prev === dishDetail.images.length - 1 ? 0 : prev + 1
    );
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-96 text-gray-600">
          読み込み中...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-96 text-red-600">
          {error}
        </div>
      </div>
    );

  if (!dishDetail)
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-96 text-gray-600">
          データが見つかりません
        </div>
      </div>
    );

  // Format price (9)
  let priceText = "ー";
  if (dishDetail.price != null)
    priceText = `¥${dishDetail.price.toLocaleString()}`;
  else if (dishDetail.average_price != null)
    priceText = `¥${dishDetail.average_price.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* --------------------- PHẦN KHUNG CHÍNH (3 → 10) --------------------- */}
        <div className="bg-white shadow-md rounded-lg p-6 border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* --------------------- 3. ẢNH LỚN + THUMBNAILS --------------------- */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="flex justify-center">
                <div className="w-full h-96 bg-gray-100 border border-gray-300 rounded-lg overflow-hidden flex justify-center items-center relative">
                  {dishDetail.images?.length ? (
                    <>
                      <img
                        src={dishDetail.images[thumbIndex]?.image_url}
                        alt="dish"
                        className="w-full h-full object-cover"
                      />
                      {/* Navigation buttons */}
                      {dishDetail.images.length > 1 && (
                        <>
                          <button
                            onClick={handleThumbLeft}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
                          >
                            ❮
                          </button>
                          <button
                            onClick={handleThumbRight}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
                          >
                            ❯
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <span className="text-gray-400">画像がありません</span>
                  )}
                </div>
              </div>

              {/* Thumbnail list */}
              {dishDetail.images?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {dishDetail.images?.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setThumbIndex(idx)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${thumbIndex === idx
                        ? "border-blue-500"
                        : "border-gray-300"
                        }`}
                    >
                      <img
                        src={img.image_url}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: INFO */}
            <div className="space-y-6">
              {/* --- Row: Title + ❤️⭐--- */}
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {dishDetail.menu_name || dishDetail.name || "料理名"}
                  </h1>
                </div>
                {/* ❤️ + ⭐ */}
                <div className="flex items-center gap-3">
                  {/* Favorite */}
                  <button
                    onClick={handleFavoriteClick}
                    disabled={isFavoriteLoading}
                    className={`p-2 rounded-full transition-colors ${isFavorited
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                      } ${isFavoriteLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    title={isFavorited ? "お気に入りから削除" : "お気に入りに追加"}
                  >
                    <Heart
                      size={28}
                      fill={isFavorited ? "currentColor" : "none"}
                      className={isFavoriteLoading ? "animate-pulse" : ""}
                    />
                  </button>

                  {/* Rating stars */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingClick(star)}
                        className="transition-colors"
                      >
                        <Star
                          size={24}
                          className={
                            rating >= star ? "text-yellow-400" : "text-gray-300"
                          }
                          fill={rating >= star ? "currentColor" : "none"}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* --- 7. Ingredients --- */}
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-2">
                  一般材料
                </p>
                <div className="flex flex-wrap gap-2">
                  {dishDetail.ingredients?.main?.length > 0 ? (
                    dishDetail.ingredients.main.map((ing, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {ing.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">ー</span>
                  )}
                </div>
              </div>

              {/* --- 8. Taste --- */}
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-2">味</p>
                <div className="flex flex-wrap gap-2">
                  {dishDetail.taste ? (
                    dishDetail.taste.split(", ").map((flavor, idx) => (
                      <span
                        key={idx}
                        className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {flavor}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">ー</span>
                  )}
                </div>
              </div>

              {/* --- 9. Price --- */}
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-2">
                  値段の範囲
                </p>
                <div className="flex gap-2">
                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-lg font-bold">
                    {priceText}
                  </span>
                </div>
              </div>

              {/* Thumbnails - Below info */}
              {dishDetail.images && dishDetail.images.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pt-4 border-t">
                  {dishDetail.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setThumbIndex(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${index === thumbIndex
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

        {/* --------------------- 11. 関連するレストラン --------------------- */}
        <div className="mt-8">
          <RelatedRestaurants
            currentMenuId={menuId}
            restaurantId={dishDetail.restaurant_id}
          />
        </div>
      </div>
    </div>
  );
}
