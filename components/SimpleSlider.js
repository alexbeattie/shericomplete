// components/SimpleSlider.js
import { useState } from 'react';
import Image from 'next/image';

const SimpleSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Return null if there are no images
  if (!images || images.length === 0) return null;

  return (
    <div className="slider-container relative w-full h-[600px] sm:h-[400px] xs:h-[300px] bg-gray-200 overflow-hidden">
      {/* Image Display */}
      <div className="absolute inset-0">
        <Image
          src={images[currentIndex]}
          alt={`Property image ${currentIndex + 1}`}
          layout="fill"
          objectFit="cover"
          priority={currentIndex === 0}
        />
      </div>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors z-10"
          >
            ←
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors z-10"
          >
            →
          </button>

          {/* Pagination Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full z-10">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
};

export default SimpleSlider;
