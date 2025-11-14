import axios from "axios";
import {useEffect, useState} from "react";
import { Link } from "react-router-dom";

interface User {
    id: number;
    email: string;
    name: string;
    avatar?: string;
    provider?: string;
}

const DashboardHome = () => {
    const [user, setUser] = useState<User>();

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get<User>('http://localhost:7070/api/user');
                console.log("Session response:", response.data);
                setUser(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        getUser()
    }, [])

    return (

        <div className="container mx-auto p-4">
            <div className="my-4">
                <h1 className="text-3xl font-bold">Welcome, {user?.name || "User"}</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg p-4">
                    <h2 className="text-xl font-semibold dark:text-white">Property Listings</h2>
                    <p className="mt-2 text-gray-600">
                        View and manage all property listings.
                    </p>
                    <Link to="/dashboard/properties" className="inline-block mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                        Go to Listings
                    </Link>
                </div>
                <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg p-4">
                    <h2 className="text-xl font-semibold">Analytics</h2>
                    <p className="mt-2 text-gray-600">View analytics and reports.</p>
                    <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                        Go to Analytics
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;