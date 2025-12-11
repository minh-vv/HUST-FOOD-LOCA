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
  const [rating, setRating] = useState(0); // (6)
  const [thumbIndex, setThumbIndex] = useState(0); // điều hướng thumbnail

  useEffect(() => {
    fetchDishDetail();
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

  const handleFavoriteClick = () => setIsFavorited((p) => !p);
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
            {/* --------------------- 3. ẢNH LỚN --------------------- */}
            <div className="flex justify-center">
              <div className="w-[330px] h-[330px] bg-gray-100 border border-gray-300 rounded-lg overflow-hidden flex justify-center items-center">
                {dishDetail.images?.length ? (
                  <img
                    src={dishDetail.images[thumbIndex]?.image_url}
                    alt="dish"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">画像がありません</span>
                )}
              </div>
            </div>

            {/* RIGHT: INFO */}
            <div className="space-y-6">
              {/* --- Row: Title + ❤️⭐--- */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 font-semibold">
                    名前・呼び方
                  </p>

                  {/* ❤️ + ⭐ */}
                  <div className="flex items-center gap-4">
                    {/* Favorite */}
                    <button
                      onClick={handleFavoriteClick}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm border transition-colors ${
                        isFavorited
                          ? "bg-red-100 border-red-300 text-red-600"
                          : "bg-gray-50 border-gray-300 text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      <Heart
                        size={18}
                        fill={isFavorited ? "currentColor" : "none"}
                      />
                      <span>お気に入り</span>
                    </button>

                    {/* Rating stars */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRatingClick(star)}
                          className={`transition-colors ${
                            rating >= star ? "text-yellow-400" : "text-gray-300"
                          }`}
                        >
                          <Star
                            size={20}
                            fill={rating >= star ? "currentColor" : "none"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Name */}
                <p className="text-gray-800 font-medium text-lg">
                  {dishDetail.menu_name || dishDetail.name || "料理名"}
                </p>
              </div>

              {/* --- 7. Ingredients --- */}
              <div>
                <p className="text-sm text-gray-600 font-semibold">一般材料</p>
                <p className="text-gray-800 mt-1">
                  {dishDetail.ingredients?.main?.length > 0
                    ? dishDetail.ingredients.main
                        .map((ing) => ing.name)
                        .join(", ")
                    : dishDetail.main_ingredients || "ー"}
                </p>
              </div>

              {/* --- 8. Taste --- */}
              <div>
                <p className="text-sm text-gray-600 font-semibold">味</p>
                <p className="text-gray-800 mt-1">{dishDetail.taste || "ー"}</p>
              </div>

              {/* --- 9. Price --- */}
              <div>
                <p className="text-sm text-gray-600 font-semibold">
                  値段の範囲
                </p>
                <p className="text-gray-800 mt-1 font-semibold text-lg">
                  {priceText}
                </p>
              </div>

              {/* --- 10. Image list  --- */}
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-2">
                  食べ物の画像
                </p>

                <div className="flex items-center gap-3 overflow-x-auto">
                  {dishDetail.images?.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setThumbIndex(idx)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                        thumbIndex === idx
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

                  {!dishDetail.images?.length && (
                    <p className="text-gray-400 text-sm">画像がありません</p>
                  )}
                </div>
              </div>
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