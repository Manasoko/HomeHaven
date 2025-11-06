import { PencilIcon, TrashIcon } from "@heroicons/react/16/solid";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const DashboardPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [userId, setUserId] = useState(0);
  const navigate = useNavigate();

  const deleteProperty = async (id) => {
    try {
      await axios.delete(`http://localhost:7070/api/property/${id}`);
      alert("Property deleted!");
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const [propertiesRes, userRes] = await Promise.all([
          axios.get("http://localhost:7070/api/get-properties"),
          axios.get("http://localhost:7070/api/get-session"),
        ]);

        setProperties(propertiesRes.data);
        setUserId(userRes.data.user?.id || null);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div className="h-screen">
      <h1 className="text-2xl font-bold text-center">Properties</h1>
      <div className="flex justify-end my-3">
        <Link
          to="/dashboard/add-property"
          className="bg-blue-500 hover:bg-indigo-700 text-white px-2 py-1 md:px-3 md:py-2 xl:px-4  rounded"
        >
          Add Properties
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {/* Filter properties by userId */}
        {(() => {
          // Filter properties to include only those owned by the logged-in user
          const userProperties = properties.filter(
            (property) => property.userId === userId
          );

          // Check if there are any properties for the user
          if (userProperties.length === 0) {
            return (
              <h2 className="text-center text-gray-600">
                You haven&#39;t posted any properties yet.
              </h2>
            );
          }

          // Render the list of properties
          return userProperties.map((property) => (
            <div
              className="bg-white dark:bg-gray-900 shadow-md p-4 rounded-lg flex justify-between items-center"
              key={property.id}
            >
              <div className="flex items-center space-x-4">
                {/* Display the first image or a placeholder */}
                <img
                  src={
                    property.images && property.images[0]?.url
                      ? `http://localhost:7070/${property.images[0].url.replace(
                          "../",
                          ""
                        )}`
                      : "https://placehold.co/600x400"
                  }
                  alt="Property"
                  className="w-24 h-16 object-cover rounded"
                />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-200">{property.location}</p>
                  <p className="text-sm">
                    {property.bedRoomNo} Beds • {property.bathRoomNo} Baths
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-600">
                  ₦{property.price.toLocaleString()}
                </p>
                <div className="mt-2 space-x-2 flex justify-end">
                  {/* Edit Button */}
                  <button
                    onClick={() =>
                      navigate(`/dashboard/edit-property/${property.id}`, {
                        state: { property: property },
                      })
                    }
                    className="flex items-center bg-red-500 hover:bg-red-800 px-3 mx-2 rounded text-white"
                  >
                    <PencilIcon className="size-4 fill-white/75" />
                    Edit
                  </button>
                  {/* Delete Button */}
                  <button
                    className="flex items-center bg-blue-500 hover:bg-indigo-700 px-4 py-1 mx-1 rounded text-white"
                    onClick={() => deleteProperty(property.id)}
                  >
                    <TrashIcon className="size-4 fill-white/75" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ));
        })()}
      </div>
    </div>
  );
};

export default DashboardPropertiesPage;
