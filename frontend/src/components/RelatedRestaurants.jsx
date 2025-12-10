import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:3000/api";

export default function RelatedRestaurants({ restaurantId }) {
  const [restaurants, setRestaurants] = useState([]);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [restaurantId]);

  const fetchData = async () => {
    const res = await fetch(`${API_BASE_URL}/restaurant?limit=10`);
    const data = await res.json();
    setRestaurants(data.data || []);
  };

  const prev = () =>
    setIndex((i) => (i === 0 ? restaurants.length - 3 : i - 1));
  const next = () => setIndex((i) => (i + 3 >= restaurants.length ? 0 : i + 1));

  const visible = restaurants.slice(index, index + 3);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">関連するレストラン</h2>

      <div className="relative">
        {/* Buttons */}
        {restaurants.length > 3 && (
          <>
            <button
              className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
              onClick={prev}
            >
              <ChevronLeft />
            </button>

            <button
              className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
              onClick={next}
            >
              <ChevronRight />
            </button>
          </>
        )}

        {/* Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visible.map((r) => (
            <button
              key={r.restaurant_id}
              onClick={() => navigate(`/restaurant/${r.restaurant_id}`)}
              className="border rounded-lg overflow-hidden bg-gray-50 hover:shadow-lg"
            >
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                {r.images?.[0]?.image_url ? (
                  <img
                    src={r.images[0].image_url}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "画像なし"
                )}
              </div>
              <div className="p-3 text-center font-semibold text-gray-700">
                {r.restaurant_name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
