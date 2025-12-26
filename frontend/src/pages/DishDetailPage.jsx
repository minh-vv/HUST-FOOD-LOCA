import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import RelatedRestaurants from "../components/RelatedRestaurants";

const API_BASE_URL = "http://localhost:3000/api";

export default function DishDetailPage() {
  const { dishId } = useParams();

  const [dishDetail, setDishDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [thumbIndex, setThumbIndex] = useState(0);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!dishId) return;
    fetchDishDetail();
  }, [dishId]);

  const fetchDishDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE_URL}/dish/${dishId}`);
      if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);

      const data = await res.json();
      setDishDetail(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= IMAGE NAV ================= */
  const handleThumbLeft = () => {
    if (!dishDetail?.images?.length) return;
    setThumbIndex((prev) =>
      prev === 0 ? dishDetail.images.length - 1 : prev - 1
    );
  };

  const handleThumbRight = () => {
    if (!dishDetail?.images?.length) return;
    setThumbIndex((prev) =>
      prev === dishDetail.images.length - 1 ? 0 : prev + 1
    );
  };

  /* ================= RENDER STATES ================= */
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

  /* ================= DATA FORMAT ================= */
  const priceText =
    dishDetail.average_price != null
      ? `¥${Number(dishDetail.average_price).toLocaleString()}`
      : "ー";

  /* ================= MAIN UI ================= */
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-6 border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ========== LEFT: IMAGES ========== */}
            <div className="space-y-4">
              <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                {dishDetail.images?.length ? (
                  <>
                    <img
                      src={dishDetail.images[thumbIndex].image_url}
                      alt="dish"
                      className="w-full h-full object-cover"
                    />
                    {dishDetail.images.length > 1 && (
                      <>
                        <button
                          onClick={handleThumbLeft}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
                        >
                          ❮
                        </button>
                        <button
                          onClick={handleThumbRight}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
                        >
                          ❯
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <span className="flex h-full items-center justify-center text-gray-400">
                    画像がありません
                  </span>
                )}
              </div>

              {dishDetail.images?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto">
                  {dishDetail.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setThumbIndex(idx)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        thumbIndex === idx
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      <img
                        src={img.image_url}
                        className="w-full h-full object-cover"
                        alt={`thumb-${idx}`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ========== RIGHT: INFO ========== */}
            <div className="space-y-6">
              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-800">
                {dishDetail.dish_name}
              </h1>

              {/* Description */}
              {dishDetail.description && (
                <p className="text-gray-700 leading-relaxed">
                  {dishDetail.description}
                </p>
              )}

              {/* Cuisine */}
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-2">
                  料理ジャンル
                </p>
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                  {dishDetail.cuisine_type || "ー"}
                </span>
              </div>

              {/* Ingredients */}
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-2">
                  一般材料
                </p>
                <div className="flex flex-wrap gap-2">
                  {dishDetail.ingredients?.length ? (
                    dishDetail.ingredients.map((ing, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {ing.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">ー</span>
                  )}
                </div>
              </div>

              {/* Flavors */}
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-2">味</p>
                <div className="flex flex-wrap gap-2">
                  {dishDetail.flavors?.length ? (
                    dishDetail.flavors.map((f, idx) => (
                      <span
                        key={idx}
                        className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                      >
                        {f.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">ー</span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-2">
                  値段の範囲
                </p>
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-lg font-bold">
                  {priceText}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Restaurants */}
        <div className="mt-8">
          <RelatedRestaurants
            currentMenuId={dishId}
            restaurantId={dishDetail.restaurant_id}
          />
        </div>
      </div>
    </div>
  );
}
