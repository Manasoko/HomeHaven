import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function Property({ src, desc, price, address, id }) {
  const navigate = useNavigate();

  const goToProperty = () => {
    const property = {
      src: src,
      desc: desc,
      price: price,
      address: address,
    };
    navigate(`/property/${id}`, { state: property });
  };

  // eslint-disable-next-line react/prop-types
  const images = src?.slice(0, 6);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to go to the next image
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Function to go to the previous image
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Auto-slide effect every 3 seconds
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        nextSlide();
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [currentIndex, images.length]); // Restart interval when index changes

  return (
    <div className="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="relative w-full h-64">
        {images.length > 0 ? (
          <img
            src={`http://localhost:7070/${images[currentIndex]}`}
            alt={`Product ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
            No Image Available
          </div>
        )}

        {/* Left Arrow (only show if more than 1 image) */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
              onClick={prevSlide}
            >
              ❮
            </button>
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
              onClick={nextSlide}
            >
              ❯
            </button>
          </>
        )}
      </div>
      <div className="p-5">
        <a href="#">
          <h5 className="mb-2 text-xl font-bold tracking-tight text-black dark:text-white">
            {address}
          </h5>
        </a>
        <p className="mb-2 font-bold dark:text-gray-400">
          ₦{price.toLocaleString()}
        </p>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {desc}
        </p>
        <button
          onClick={goToProperty}
          className="relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-indigo-600 transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-50 group"
        >
          <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-indigo-600 group-hover:h-full"></span>
          <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
            <svg
              className="w-5 h-5 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </span>
          <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
            <svg
              className="w-5 h-5 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </span>
          <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">
            View
          </span>
        </button>
      </div>
    </div>
  );
}

export default Property;
