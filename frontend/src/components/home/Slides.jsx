import  { useState, useEffect } from 'react';

const Slides = () => {
    const images = [
        {
            src: 'src/assets/images/slide1.jpeg',
            title: 'Offering Diverse Properties',
            description: 'HomeHaven provides you with a lot of great property throughout Nigeria so you could easily choose your dream property.',
        },
        {
            src: 'src/assets/images/slide2.jpg',
            title: 'Easily Rent & Sale',
            description: 'With the help of our services and property management solutions, you can rent or sell any house or apartment',
        },
        {
            src: 'src/assets/images/slide3.jpg',
            title: 'Trusted Property Listings',
            description: 'Browse properties from trusted sellers and agents to make your property search worry-free.',
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    return (
        <div className="relative w-full h-2/4 md:h-[550px] overflow-hidden">
            {/* Images */}
            <div
                className="flex transition-transform duration-700"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((image, index) => (
                    <div key={index} className="min-w-full relative">
                        <img
                            src={image.src}
                            alt={`Slide ${index + 1}`}
                            className="w-full md:h-[550px] object-cover"
                        />
                        {/* Text Overlay */}
                        <div className="absolute bottom-5 left-5 text-white space-y-4 max-w-md">
                            <h2 className="text-2xl md:text-4xl font-bold">{image.title}</h2>
                            <p className="text-sm md:text-lg">{image.description}</p>
                            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                                View
                            </button>
                        </div>
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
    );
};

export default Slides;
