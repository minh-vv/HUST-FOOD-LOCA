import { useRef, useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function HomePage() {
  const trendFoods = ["料理1", "料理2", "料理3", "料理4", "料理5"];
  const trendRestaurants = ["レストラン1", "レストラン2", "レストラン3", "レストラン4", "レストラン5"];
  const trendMenus = [
    { dish: "料理A", restaurant: "レストランX" },
    { dish: "料理B", restaurant: "レストランY" },
    { dish: "料理C", restaurant: "レストランZ" },
    { dish: "料理D", restaurant: "レストランX" },
  ];

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

  return (
    <section className="mt-10">
      <div className="max-w-5xl mx-auto">
        {/* Header với title và nút "Xem thêm" */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold underline cursor-pointer hover:text-blue-600 transition-colors">{title}</h2>
          <button className="text-blue-600 font-medium underline hover:text-blue-800">
            Xem thêm
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
                    key={index}
                    dish={item.dish}
                    restaurant={item.restaurant}
                  />
                );

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


function CarouselCard({ title }) {
  return (
    <div className="w-52 p-4 border rounded-lg text-center flex-shrink-0 cursor-pointer hover:bg-gray-100 hover:shadow-lg transition-all">
      <div className="w-full h-32 bg-gray-200 rounded-xl"></div>
      <p className="mt-2 text-sm font-medium">{title}</p>
    </div>
  );
}

function MenuCard({ dish, restaurant }) {
  return (
    <div className="w-52 p-4 border rounded-lg text-center flex-shrink-0 cursor-pointer hover:bg-gray-100 hover:shadow-lg transition-all">
      <div className="w-full h-32 bg-gray-200 rounded-xl"></div>
      <p className="mt-2 text-sm font-medium">{dish}</p>
      <p className="text-xs text-gray-600">{restaurant}</p>
    </div>
  );
}

function SeeMoreCard() {
  return (
    <div className="w-52 h-48 flex-shrink-0 flex items-center justify-center border rounded-lg bg-blue-50 cursor-pointer hover:bg-blue-100">
      <p className="text-blue-700 font-medium">Xem thêm</p>
    </div>
  );
}