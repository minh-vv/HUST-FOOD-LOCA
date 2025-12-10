import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DishImageCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mainImage, setMainImage] = useState(images[0]?.image_url);

  const handlePrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setMainImage(images[newIndex].image_url);
  };

  const handleNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setMainImage(images[newIndex].image_url);
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
    setMainImage(images[index].image_url);
  };

  return (
    <div className="w-full">
      {/* Main Image Display */}
      <div className="mb-6 bg-gray-100 rounded-lg overflow-hidden h-96 flex items-center justify-center relative">
        <img
          src={mainImage}
          alt="料理画像"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail Carousel */}
      <div className="relative">
        {/* Navigation Buttons */}
        {images.length > 3 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="前へ"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="次へ"
            >
              <ChevronRight size={24} className="text-gray-700" />
            </button>
          </>
        )}

        {/* Thumbnails Container */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? "border-blue-500 ring-2 ring-blue-300"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src={image.image_url}
                alt={`料理画像 ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Image Counter */}
      <div className="text-center mt-4 text-sm text-gray-600">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
