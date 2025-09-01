import Property from "../components/home/Property.jsx";
import axios from "axios";
import { useEffect, useState } from "react";

export default function PropertyPage() {
    const initialFilters = {
        address: "",
        minPrice: "",
        maxPrice: "",
        bedrooms: "",
        bathrooms: "",
        status: ""
    }
    const [properties, setProperties] = useState([]);
    const [filters, setFilters] = useState(initialFilters);

    const getProperties = async () => {
        try {
            const response = await axios.get('http://localhost:7070/api/get-properties');
            setProperties(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:7070/api/search-properties', {
                params: filters
            });
            setProperties(response.data);
        }  catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const resetFilters = () => {
        setFilters(initialFilters);
    }

    useEffect(() => {
        getProperties()
    }, []);

    return (
        <div className="dark:bg-gray-900 dark:text-white min-h-screen flex justify-center items-center">
            <div className="w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 dark:bg-gray-900 dark:text-white">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 text-center dark:text-white mb-4">
                    Properties
                </h2>
                <p className="text-gray-700 dark:text-gray-300 text-center mb-8 max-w-3xl mx-auto">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                </p>

                <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <input type="search" 
                                           className="w-full p-4 ps-12 text-sm border-2 border-gray-200 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                           placeholder="Enter location..."
                                           name="address"
                                           value={filters.address}
                                           onChange={handleChange}
                                    />
                                    <svg className="absolute left-4 top-4 w-5 h-5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex-1.5">
                                <div className="flex gap-2">
                                    <input type="number" 
                                           placeholder="Min Price" 
                                           className="w-full p-4 text-sm border-2 border-gray-200 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                           min="1"
                                           name="minPrice"
                                           value={filters.minPrice}
                                           onChange={handleChange}
                                    />
                                    <input type="number" 
                                           placeholder="Max Price" 
                                           className="w-full p-4 text-sm border-2 border-gray-200 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                           min="1"
                                           name="maxPrice"
                                           value={filters.maxPrice}
                                           onChange={handleChange}
                                    />
                                   <input type="number"
                                          placeholder="Beds"
                                          className="w-full p-4 text-sm border-2 border-gray-200 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                          min="1"
                                          name="bedrooms"
                                          value={filters.bedrooms}
                                          onChange={handleChange}
                                   />
                                   <input type="number"
                                          placeholder="Bathrooms"
                                          className="w-full p-4 text-sm border-2 border-gray-200 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                          min="1"
                                          name="bathrooms"
                                          value={filters.bathrooms}
                                          onChange={handleChange}
                                   />
                                    <select className="w-full p-4 text-sm border-2 border-gray-200 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            name="status"
                                            value={filters.status}
                                            onChange={handleChange}
                                    >
                                        <option value="">Any Status</option>
                                        <option value="sale">For sale</option>
                                        <option value="rent">For rent/lease</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center gap-3">
                            <button type="submit"
                                    className="w-full md:w-auto px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm transition-colors duration-200 ease-in-out"
                                    onClick={handleSearch}
                            >
                                Search Properties
                            </button>
                            <button
                                className="w-full md:w-auto px-6 ml-2 py-3 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm transition-colors duration-200 ease-in-out"
                                onClick={resetFilters}
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
                    {properties.length > 0 ? (
                        properties.map(property => (
                            <div key={property.id} className="h-full w-full">
                                <Property
                                    id={property.id}
                                    src={property.images.map(image => image.url)}
                                    address={property.location}
                                    desc={property.description}
                                    price={property.price}
                                    bedrooms={property.bedRoomNo}
                                    bathrooms={property.bathRoomNo}
                                />
                            </div>
                        ))
                    ) : (
                        <p className="text-4xl col-span-full text-center">No results found.</p>
                    )}
                </div>
            </div>
        </div>
    )
}