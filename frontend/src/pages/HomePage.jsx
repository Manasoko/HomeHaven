import Slides from '../components/home/Slides.jsx';
import Property from "../components/home/Property.jsx";
import Team from "../components/home/Team.jsx";
import propertyData from "../data/property.js";


function HomePage() {
    return (
        <div className="dark:bg-gray-800 dark:text-white min-h-screen">
            <Slides />
            <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 text-center dark:text-white">Properties</h2>
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {propertyData.map(data =>
                        <Property
                            key={data.id}
                            id={data.id}
                            src={data.src}
                            address={data.address}
                            desc={data.description}
                            price={data.price}
                        />
                    )}
                </div>
            </div>
            <Team />
        </div>
    )
}

export default HomePage;