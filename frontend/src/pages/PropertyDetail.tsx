import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`http://localhost:7070/api/property/${id}`);
        setProperty(response.data.property);
        setImages(response.data.property.images);
      } catch (error) {
        console.error("Error fetching property:", error);
      }
    };

    fetchProperty();
  }, [id]);

  useEffect(() => {
    if (!images.length) return;
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

  // Features (dummy data for demonstration)
  const features = [
    { label: "Bedrooms", value: property?.bedRoomNo || 3 },
    { label: "Bathrooms", value: property?.bathRoomNo || 2 },
    { label: "Parking", value: property?.parking || "Yes" },
    { label: "Area", value: property?.area ? `${property.area} sqft` : "2000 sqft" },
    { label: "Type", value: property?.propertyType || "Apartment" },
    { label: "Furnished", value: property?.furnished ? "Yes" : "No" },
  ];

  // Agent info (dummy data)
  const agent = {
    name: property?.agent?.name || "Jane Doe",
    phone: property?.agent?.phoneNumber || "+234 800 000 0000",
    whatsapp: property?.agent?.phoneNumber || "+234 800 000 0000",
    email: property?.agent.email || "jane.doe@agency.com",
    photo:
      property?.agentPhoto || "https://randomuser.me/api/portraits/women/44.jpg",
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 md:px-10">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        
        {/* Top Section: Image Gallery + Agent Card */}
        <div className="flex flex-col lg:flex-row">
          
          {/* Left: Image Gallery */}
          <div className="flex-1 lg:w-2/3 relative overflow-hidden">
            <div className="relative w-full aspect-[4/3] lg:aspect-[16/10] bg-gray-200 overflow-hidden">
              <div
                className="flex absolute w-full h-full transition-transform duration-700"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="w-full h-full flex-shrink-0"
                  >
                    <img
                      src={`http://localhost:7070/${image.url}`}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
              
              {/* Navigation Buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/90 text-gray-800 rounded-full p-3 shadow-lg hover:bg-indigo-600 hover:text-white transition-all duration-200 z-10"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/90 text-gray-800 rounded-full p-3 shadow-lg hover:bg-indigo-600 hover:text-white transition-all duration-200 z-10"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              
              {/* Thumbnails */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`w-3 h-3 rounded-full border-2 transition-all ${
                      currentIndex === idx
                        ? "bg-indigo-600 border-indigo-600"
                        : "bg-white border-white/70 hover:border-white"
                    }`}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Agent Card */}
          <div className="lg:w-1/3 p-6 lg:p-8 bg-gray-50 lg:bg-white">
            <div className="bg-white lg:bg-gray-50 rounded-xl shadow-lg lg:shadow-md p-6 sticky top-6">
              <div className="text-center mb-6">
                <img
                  src={agent.photo}
                  alt={agent.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-indigo-100"
                />
                <h3 className="text-xl font-bold text-gray-800 mb-1">{agent.name}</h3>
                <p className="text-gray-600 text-sm mb-1">Property Agent</p>
                <p className="text-gray-500 text-sm">{agent.email}</p>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3">
                <a
                  href={`https://wa.me/${agent?.whatsapp || "2348000000000"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.52 3.48A12.07 12.07 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.18 1.6 6.01L0 24l6.18-1.62A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 22c-1.85 0-3.67-.5-5.24-1.44l-.37-.22-3.67.96.98-3.58-.24-.37A9.94 9.94 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.27-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.34-.26.27-1 1-.98 2.43.02 1.43 1.03 2.81 1.18 3.01.15.2 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" />
                  </svg>
                  WhatsApp
                </a>
                <a
                  href={`tel:${agent.phone}`}
                  className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.45l.7 2.1a2 2 0 01-.45 2.11l-1.27 1.27a16.06 16.06 0 006.6 6.6l1.27-1.27a2 2 0 012.11-.45l2.1.7A2 2 0 0121 18.72V21a2 2 0 01-2 2h-1C7.82 23 1 16.18 1 8V7a2 2 0 012-2z" />
                  </svg>
                  Call Agent
                </a>
                <div className="text-center pt-2">
                  <span className="text-gray-600 font-medium">{agent.phone}</span>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Location</h4>
                <div className="bg-gray-200 rounded-lg h-32 flex items-center justify-center text-gray-500 text-sm">
                  Map Location Coming Soon
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Property Details */}
        <div className="p-6 lg:p-8 border-t border-gray-200">
          
          {/* Property Header */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
              {property?.address || "Beautiful Property"}
            </h1>
            <p className="text-2xl lg:text-3xl text-indigo-700 font-bold mb-6">
              ₦{property?.price?.toLocaleString() || "N/A"}
            </p>
            
            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg p-4 text-center"
                >
                  <div className="text-2xl font-bold text-indigo-700 mb-1">
                    {feature.value}
                  </div>
                  <div className="text-sm text-indigo-600 font-medium">
                    {feature.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">
                {property?.description || "This beautiful property offers modern living with excellent amenities. Located in a prime area with easy access to transportation, shopping, and entertainment. Perfect for those seeking comfort and convenience in their next home."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}