import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_BASE_URL = "http://localhost:3000/api/home";

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [trendFoods, setTrendFoods] = useState([]);
  const [trendRestaurants, setTrendRestaurants] = useState([]);
  const [trendMenus, setTrendMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSearchClick = async () => {
    if (searchQuery.trim().length === 0) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `http://localhost:3000/search?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      if (data.success) {
        setSearchResults(data.data);
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("検索に失敗しました");
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

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
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              データ取得エラー
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchHomeData}
              className="bg-orange-400 text-white px-6 py-2 rounded hover:bg-orange-500"
            >
              再試行
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
        <input
          type="text"
          placeholder="食べ物を探す"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="border border-gray-300 hover:border-orange-400 focus:border-orange-500 focus:outline-none px-4 py-2 rounded flex-1"
        />
        <button
          onClick={handleSearchClick}
          disabled={isSearching}
          className="px-4 py-2 rounded bg-orange-400 text-white hover:bg-orange-500 disabled:bg-gray-400"
        >
          {isSearching ? "検索中..." : "検索"}
        </button>
        <button className="border px-4 py-2 rounded hover:bg-orange-400 hover:text-white bg-yellow-100">
          フィルター
        </button>
      </div>

      {/* Hiển thị kết quả tìm kiếm */}
      {searchResults && (
        <SearchResultsSection searchResults={searchResults} navigate={navigate} />
      )}

      {/* Hiển thị trending khi không search */}
      {!searchResults && (
        <>
          <Section
            title="トレンド料理"
            items={trendFoods}
            type="food"
            navigate={navigate}
          />
          <Section
            title="トレンドレストラン"
            items={trendRestaurants}
            type="restaurant"
            navigate={navigate}
          />
          <Section
            title="トレンドレストランのメニュー"
            items={trendMenus}
            type="menu"
            navigate={navigate}
          />
        </>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <DetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Section({ title, items, type, navigate }) {
  const ITEMS_PER_PAGE = 4;

  const totalItems = items.length;

  // Tính tổng số page
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const [page, setPage] = useState(0);

  const prevPage = () => setPage((p) => Math.max(p - 1, 0));
  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages - 1));

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
          <h2 className="text-xl font-bold cursor-pointer hover:text-orange-600 hover:underline transition-colors">
            {title}
          </h2>
        </div>

        {/* Container chứa nút trái, carousel, nút phải */}
        <div className="flex items-center gap-4">
          {/* Nút trái */}
          <button
            onClick={prevPage}
            disabled={page === 0}
            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-20
            ${
              page === 0
                ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                : "bg-orange-400 text-white hover:bg-orange-500"
            }`}
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
                    onClick={() => navigate(`/dish/${item.menu_id}`)}
                  />
                );
              if (type === "food") {
                return (
                  <CarouselCard
                    key={item.dish_id || index}
                    title={item.dish_name}
                    imageUrl={item.primary_image_url}
                    subtitle={item.cuisine_type}
                    onClick={() => {
                      // If dish has menu_id, navigate to dish detail, otherwise navigate to search
                      if (item.menu_id) {
                        navigate(`/dish/${item.menu_id}`);
                      }
                    }}
                  />
                );
              }
              if (type === "restaurant") {
                return (
                  <CarouselCard
                    key={item.restaurant_id || index}
                    title={item.restaurant_name}
                    imageUrl={item.primary_image_url}
                    onClick={() =>
                      navigate(`/restaurant/${item.restaurant_id}`)
                    }
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
            ${
              page === totalPages - 1
                ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                : "bg-orange-400 text-white hover:bg-orange-500"
            }`}
          >
            &#8594;
          </button>
        </div>
      </div>
    </section>
  );
}

function CarouselCard({ title, imageUrl, subtitle, onClick }) {
  return (
    <div
      onClick={onClick}
      className="w-52 p-4 border rounded-lg text-center flex-shrink-0 cursor-pointer hover:bg-gray-100 hover:shadow-lg transition-all bg-white"
    >
      <div className="w-full h-32 bg-gray-200 rounded-xl overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.classList.add(
                "flex",
                "items-center",
                "justify-center"
              );
              e.target.parentElement.innerHTML =
                '<span class="text-gray-400 text-sm">No Image</span>';
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

function MenuCard({ dish, restaurant, imageUrl, price, onClick }) {
  return (
    <div
      onClick={onClick}
      className="w-52 p-4 border rounded-lg text-center flex-shrink-0 cursor-pointer hover:bg-gray-100 hover:shadow-lg transition-all bg-white"
    >
      <div className="w-full h-32 bg-gray-200 rounded-xl overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={dish}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.classList.add(
                "flex",
                "items-center",
                "justify-center"
              );
              e.target.parentElement.innerHTML =
                '<span class="text-gray-400 text-sm">No Image</span>';
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
      {price && (
        <p className="text-xs text-orange-600 font-semibold mt-1">
          {price.toLocaleString()} VND
        </p>
      )}
    </div>
  );
}


function SearchResultCard({ item, onClick }) {
  return (
    <div
      onClick={onClick}
      className="w-52 p-4 border rounded-lg text-center cursor-pointer hover:bg-gray-100 hover:shadow-lg transition-all flex-shrink-0"
    >
      <div className="w-full h-32 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400">No image</span>
        )}
      </div>
      <p className="mt-2 text-sm font-medium">{item.name}</p>
      {item.address && <p className="text-xs text-gray-600">{item.address}</p>}
      {item.price && <p className="text-xs text-orange-600">{item.price} VND</p>}
      {item.description && (
        <p className="text-xs text-gray-500 mt-1">
          {item.description?.substring(0, 50)}...
        </p>
      )}
    </div>
  );
}

function SearchResultsSection({ searchResults, navigate }) {
  const ITEMS_PER_PAGE = 4;
  const [dishPage, setDishPage] = useState(0);
  const [restaurantPage, setRestaurantPage] = useState(0);

  const dishes = searchResults.dishes || [];
  const restaurants = searchResults.restaurants || [];

  const dishTotalPages = Math.ceil(dishes.length / ITEMS_PER_PAGE);
  const restaurantTotalPages = Math.ceil(restaurants.length / ITEMS_PER_PAGE);

  const getVisibleItems = (items, page) => {
    const startIndex = page * ITEMS_PER_PAGE;
    return items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const renderPaginatedSection = (title, items, page, setPage) => {
    if (items.length === 0) return null;

    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
    const visibleItems = getVisibleItems(items, page);
    const showNavigation = items.length > ITEMS_PER_PAGE;

    return (
      <section className="mt-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold mb-4">{title}</h2>

          <div className="flex items-center gap-4">
            {/* Nút trái - chỉ hiển thị nếu có nhiều hơn 4 items */}
            {showNavigation && (
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                disabled={page === 0}
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-20
                ${
                  page === 0
                    ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                    : "bg-orange-400 text-white hover:bg-orange-500"
                }`}
              >
                &#8592;
              </button>
            )}

            {/* Hiển thị 4 item / lần */}
            <div className="flex gap-6 overflow-hidden flex-1">
              {visibleItems.map((item) => (
                <SearchResultCard
                  key={item.id}
                  item={item}
                  onClick={() => navigate(
                    item.restaurant_id ? `/restaurant/${item.restaurant_id}` : `/dish/${item.id}`
                  )}
                />
              ))}
            </div>

            {/* Nút phải - chỉ hiển thị nếu có nhiều hơn 4 items */}
            {showNavigation && (
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                disabled={page === totalPages - 1}
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-20
                ${
                  page === totalPages - 1
                    ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                    : "bg-orange-400 text-white hover:bg-orange-500"
                }`}
              >
                &#8594;
              </button>
            )}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="max-w-5xl mx-auto mt-6">
      {renderPaginatedSection("料理", dishes, dishPage, setDishPage)}
      {renderPaginatedSection("レストラン", restaurants, restaurantPage, setRestaurantPage)}

      {dishes.length === 0 && restaurants.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          検索結果が存在しません
        </p>
      )}
    </div>
  );
}

function DetailModal({ item, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b flex items-center justify-between p-4">
          <h2 className="text-xl font-bold">{item.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Image */}
          <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden mb-6">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400">No image</span>
            )}
          </div>

          {/* Info */}
          <div className="space-y-3">
            <p className="text-gray-700">{item.description}</p>

            {item.address && (
              <div>
                <p className="font-semibold text-sm">住所</p>
                <p className="text-gray-600">{item.address}</p>
              </div>
            )}

            {item.price && (
              <div>
                <p className="font-semibold text-sm">価格</p>
                <p className="text-blue-600 font-bold">¥{item.price}</p>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
