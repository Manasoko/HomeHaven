import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function PropertyDetail() {
  const { state } = useLocation();
  const images = state?.src;
  console.log(images);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full dark:bg-gray-900 overflow-hidden">
      <div className="relative w-full h-2/4 md:h-3/4 object-cover">
        {/* Images */}
        <div
          className="flex transition-transform duration-700"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="min-w-full relative">
              <img
                src={`http://localhost:7070/${image}`}
                alt={`Slide ${index + 1}`}
                className="w-full md:h-[550px] object-cover"
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-600"
        >
          &lt;
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-600"
        >
          &gt;
        </button>
      </div>
      <div className="bg-white dark:bg-gray-900 w-full h-full mb-20">
        <div className="p-6 grid grid-rows-3 gap-1 sm:p-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-300">
            {state?.address}
          </h2>
          <p className="text-gray-600 dark:text-gray-200 mt-2 sm:mt-1">
            {state?.desc}
          </p>
          <p className="text-xl font-bold text-gray-800 dark:text-gray-300 mt-4 sm:mt-2">
            ₦{state?.price.toLocaleString()}
          </p>
          <div className="flex flex-col md:flex-row justify-center">
            <button className="basic-1/2 mt-4  text-indigo-700 px-6 py-2 border-2 border-indigo-700 rounded-lg justify-self-center hover:bg-indigo-700 hover:text-white flex items-center sm:px2 sm:py-1 sm:mt-2 mx-auto">
              Contact on WhatsApp
            </button>
            <button className="basic-1/2 mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg justify-self-center hover:bg-indigo-700 flex items-center sm:px2 sm:py-1 sm:mt-2 mx-auto">
              Contact Agent
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H4a1 1 0 110-2h10.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
