import axios from "axios";
import {useEffect, useState} from "react";
import Slides from '../components/home/Slides.jsx';
import Property from "../components/home/Property.jsx";
import Team from "../components/home/Team.jsx";

function HomePage() {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        const getPropertyData = async () => {
            try {
                const propertiesData = await axios.get("http://localhost:7070/api/get-properties");
                const recentProperties = propertiesData.data.splice(0, 4);
                setProperties(recentProperties);
            } catch (e) {
                console.log(e);
            }
        };

        void getPropertyData();
    }, []);
    return (
        <div className="dark:bg-gray-800 dark:text-white min-h-screen">
            <Slides />
            <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 text-center dark:text-white">Recent Properties</h2>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {properties.map(data =>
                        <Property
                            className="h-full"
                            key={data.id}
                            id={data.id}
                            src={data.images.map(image => image.url)}
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