import Property from "../components/home/Property.jsx";
import axios from "axios";
import { useEffect, useState } from "react";

export default function PropertyPage() {
    const [properties, setProperties] = useState([]);

    const getProperties = async () => {
        try {
            const response = await axios.get('http://localhost:7070/api/get-properties');
            setProperties(response.data.properties);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getProperties();
    }, []);

    return (
        <div className="dark:bg-gray-900 dark:text-white min-h-screen">
            <div className="min-h-screen mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8 dark:bg-gray-900 dark:text-white">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 text-center dark:text-white">Properties</h2>
                <p className="text-gray-700 ">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {properties.map(property =>
                        <Property
                            key={property.id}
                            id={property.id}
                            src={property.images.map(image => image.url)}
                            address={property.location}
                            desc={property.description}
                            price={property.price}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}