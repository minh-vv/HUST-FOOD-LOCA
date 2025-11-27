import { useRef, useState, useEffect } from "react";
import Navbar from "../components/Navbar";

const API_BASE_URL="http://localhost:3000/api/home"

export default function HomePage() {
  const [trendFoods, setTrendFoods] = useState([]);
  const [trendRestaurants, setTrendRestaurants] = useState([]);
  const [trendMenus, setTrendMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Gọi API tổng hợp
      const response = await fetch(`${API_BASE_URL}?limit=10`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      // Map dữ liệu từ API sang state
      setTrendFoods(data.trending_dishes || []);
      setTrendRestaurants(data.trending_restaurants || []);
      setTrendMenus(data.trending_menu_items || []);
    } catch (err) {
      console.error("Error fetching home data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600"></p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">データ取得エラー</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchHomeData}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }
  };
  return (
    <div className="px-6 py-4">
      <Navbar />

      <div className="max-w-5xl mx-auto mt-6 flex items-center gap-4">
        <input type="text" placeholder="食べ物を探す" className="border px-4 py-2 rounded flex-1" />
        <button className="border px-4 py-2 rounded hover:bg-blue-600 hover:text-white bg-yellow-100">
          フィルター
        </button>
      </div>

      <Section title="トレンド料理" items={trendFoods} type="food" />
      <Section title="トレンドレストラン" items={trendRestaurants} type="restaurant" />
      <Section title="トレンドレストランのメニュー" items={trendMenus} type="menu" />
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Section({ title, items, type }) {
  const ITEMS_PER_PAGE = 4;

  const totalItems = items.length;

  // Tính tổng số page
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const [page, setPage] = useState(0);

  const prevPage = () => setPage(p => Math.max(p - 1, 0));
  const nextPage = () => setPage(p => Math.min(p + 1, totalPages - 1));

  // Tính item đang hiển thị
  const startIndex = page * ITEMS_PER_PAGE;
  const visibleItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  useEffect(() => {
    setPage(0); // Reset về page 0 khi items thay đổi
  }, [items.length]);

  if (items.length === 0) {
    return (
      <section className="mt-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <p className="text-gray-500 text-center py-8">データがありません</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10">
      <div className="max-w-5xl mx-auto">
        {/* Header với title và nút "Xem thêm" */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold underline cursor-pointer hover:text-blue-600 transition-colors">{title}</h2>
          <button className="text-blue-600 font-medium underline hover:text-blue-800">
            もっと見る
          </button>
        </div>

        {/* Container chứa nút trái, carousel, nút phải */}
        <div className="flex items-center gap-4">
          {/* Nút trái */}
          <button
            onClick={prevPage}
            disabled={page === 0}
            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-20
            ${page === 0 ? "bg-gray-300 text-gray-400 cursor-not-allowed" :
                           "bg-orange-400 text-white hover:bg-orange-500"}`}
          >
            &#8592;
          </button>

          {/* Hiển thị 4 item / lần */}
          <div className="flex gap-6 overflow-hidden flex-1">
            {visibleItems.map((item, index) => {
              if (type === "menu")
                return (
                  <MenuCard
                    key={item.menu_id || index}
                    dish={item.dish_name}
                    restaurant={item.restaurant_name}
                    imageUrl={item.primary_image_url}
                    price={item.price}
                  />
                );
              if (type === "food") {
                return (
                  <CarouselCard 
                    key={item.dish_id || index} 
                    title={item.dish_name}
                    imageUrl={item.primary_image_url}
                    subtitle={item.cuisine_type}
                  />
                );
              }
              if (type === "restaurant") {
                return (
                  <CarouselCard 
                    key={item.restaurant_id || index} 
                    title={item.restaurant_name}
                    imageUrl={item.primary_image_url}
                  />
                );
              }
              return <CarouselCard key={index} title={item} />;
            })}
          </div>

          {/* Nút phải */}
          <button
            onClick={nextPage}
            disabled={page === totalPages - 1}
            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-20
            ${page === totalPages - 1 ? "bg-gray-300 text-gray-400 cursor-not-allowed" :
                                        "bg-orange-400 text-white hover:bg-orange-500"}`}
          >
            &#8594;
          </button>
        </div>
      </div>
    </section>
  );
}


function CarouselCard({ title, imageUrl, subtitle }) {
  return (
    <div className="w-52 p-4 border rounded-lg text-center flex-shrink-0 cursor-pointer hover:bg-gray-100 hover:shadow-lg transition-all bg-white">
      <div className="w-full h-32 bg-gray-200 rounded-xl overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
              e.target.parentElement.innerHTML = '<span class="text-gray-400 text-sm">No Image</span>';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-sm">画像なし</span>
          </div>
        )}
      </div>
      <p className="mt-2 text-sm font-medium truncate">{title}</p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
}

function MenuCard({ dish, restaurant, imageUrl, price }) {
  return (
    <div className="w-52 p-4 border rounded-lg text-center flex-shrink-0 cursor-pointer hover:bg-gray-100 hover:shadow-lg transition-all bg-white">
      <div className="w-full h-32 bg-gray-200 rounded-xl overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={dish}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
              e.target.parentElement.innerHTML = '<span class="text-gray-400 text-sm">No Image</span>';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-sm">画像なし</span>
          </div>
        )}
      </div>
      <p className="mt-2 text-sm font-medium truncate">{dish}</p>
      <p className="text-xs text-gray-600 truncate">{restaurant}</p>
      {price && <p className="text-xs text-orange-600 font-semibold mt-1">¥{price.toLocaleString()}</p>}
    </div>
  );
}

function SeeMoreCard() {
  return (
    <div className="w-52 h-48 flex-shrink-0 flex items-center justify-center border rounded-lg bg-blue-50 cursor-pointer hover:bg-blue-100">
      <p className="text-blue-700 font-medium">もっと見る</p>
    </div>
  );
}