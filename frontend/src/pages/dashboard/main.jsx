import { Link } from "react-router-dom";
import axios from "axios";
import {useEffect} from "react";
// const EditProperties = () => <div>Edit Properties</div>;
// const Analytics = () => <div>Analytics</div>;
// const Billing = () => <div>Billing</div>;
// const Settings = () => <div>Settings</div>;

const Sidebar = () => (
  <div className="w-64 h-screen bg-gray-900 text-white p-6">
    <h1 className="text-xl font-bold mb-6">Real Estate Dashboard</h1>
    <nav className="flex flex-col space-y-4">
      <Link to="/dashboard" className="text-white hover:bg-gray-800 p-2 rounded">Dashboard</Link>
      <Link to="/properties" className="text-white hover:bg-gray-800 p-2 rounded">Properties</Link>
      <a href="/edit-properties" className="text-white hover:bg-gray-800 p-2 rounded">Edit Properties</a>
      <a href="/analytics" className="text-white hover:bg-gray-800 p-2 rounded">Analytics</a>
      <a href="/billing" className="text-white hover:bg-gray-800 p-2 rounded">Billing</a>
      <a href="/settings" className="text-white hover:bg-gray-800 p-2 rounded">Settings</a>
    </nav>
  </div>
);

const Dashboard = () => {
  useEffect(() => {
    const getSession = async () => {
      try {
        const response = await axios.get('http://localhost:7070/api/get-session');
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getSession()
  }, [])

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="container mx-auto p-4">
        <div className="my-4">
          <h1 className="text-3xl font-bold">Real Estate Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold">Property Listings</h2>
            <p className="mt-2 text-gray-600">
              View and manage all property listings.
            </p>
            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
              Go to Listings
            </button>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold">Analytics</h2>
            <p className="mt-2 text-gray-600">View analytics and reports.</p>
            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
              Go to Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
