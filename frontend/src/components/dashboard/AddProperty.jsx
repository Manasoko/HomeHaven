import {useState, useEffect} from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AddProperty = () => {
    const { state: property } = useLocation();
    const { id } = useParams();
    const navigate = useNavigate();

    const isEdit = Boolean(property);

    const [images, setImages] = useState([]);
    const [inputs, setInputs] = useState({
        propertyAddress: "",
        price: "",
        description: "",
        propertyType: "",
        bedRoomNo: 0,
        bathRoomNo: 0,
        id: 0
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEdit) {
            setInputs({
                propertyAddress: property.location ?? "",
                price: property.price ?? "",
                description: property.description ?? "",
                propertyType: property.propertyType ?? "",
                bedRoomNo: property.bedRoomNo ?? 0,
                bathRoomNo: property.bathRoomNo ?? 0,
                id: property.id ?? 0
            });

            if (property.images && property.images.length) {
                const baseURL = "http://localhost:7070";
                setImages(
                    property.images.map((img) => ({
                        preview: `${baseURL}/${img.url.replace('../', '')}`,
                        file: null,
                    }))
                );
            }
        }
    }, [property, isEdit]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files).map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        if (files.length + images.length > 20) {
            alert("You can upload up to 20 images only.");
            return;
        }

        setImages((prevImages) => [...prevImages, ...files]);
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setInputs((prevInputs) => ({
            ...prevInputs,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputs.propertyType) {
            alert("Please select a product type.");
            return;
        }

        const formData = new FormData();
        Object.keys(inputs).forEach((key) => formData.append(key, inputs[key]));
        images.forEach((image) => formData.append("images", image.file));

        try {
            if (isEdit) {
                await axios.put(`http://localhost:7070/api/edit-property/${id}`, formData, {
                    headers: {"Content-Type": "multipart/form-data"},
                });
                alert("Property updated!");
            } else {
                await axios.post("http://localhost:7070/api/add-property", formData, {
                    headers: {"Content-Type": "multipart/form-data"},
                });
                alert("Property added!");
            }
            navigate("/dashboard/properties");
        } catch (err) {
            console.error(err);
            if (err.response?.status === 400) {
                setError(err.response.data.error);
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
    };


    useEffect(() => {
        return () => {
            images.forEach((image) => {
                if (image.preview && image.file) {
                    URL.revokeObjectURL(image.preview);
                }
            });
        };
    }, [images]);

    return (
        <div className="w-full mx-auto p-6 bg-white dark:bg-gray-900 mt-10">
            <h2 className="text-2xl font-bold text-center mb-6">
                {isEdit ? "Edit Property" : "Add Property"}
            </h2>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                {/*Property Address*/}
                <div className="mb-4">
                    <label
                        htmlFor="propertyAddress"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                    >
                        Property Address
                    </label>
                    <input
                        type="text"
                        name="propertyAddress"
                        id="propertyAddress"
                        value={inputs.propertyAddress}
                        className="rounded-lg dark:bg-gray-700 shadow-md w-full p-2"
                        onChange={handleInputChange}
                    />
                </div>
                {/*Property Price*/}
                <div className="mb-4">
                    <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                    >
                        Property Price
                    </label>
                    <input
                        type="text"
                        name="price"
                        id="price"
                        value={inputs.price}
                        className="rounded-lg dark:bg-gray-700 shadow-md w-full p-2"
                        onChange={handleInputChange}
                    />
                </div>
                {/*Property Type*/}
                <div className="mb-4">
                    <label
                        htmlFor="propertyType"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                    >
                        Select Property Type
                    </label>
                    <div className="relative">
                        <select
                            id="propertyType"
                            name="propertyType"
                            value={inputs.propertyType}
                            onChange={handleInputChange}
                            className="block w-full border-gray-300 dark:bg-gray-600 dark:text-gray-200 appearance-none rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-1"
                        >
                            <option value="" disabled>
                                -- Choose a Property Type --
                            </option>
                            <option value="Residential Property">Residential Property</option>
                            <option value="Commercial Property">Commercial Property</option>
                            <option value="Land">Land</option>
                        </select>
                        <span
                            className="absolute inset-y-0 right-3 flex items-center text-gray-600 dark:text-gray-200 pointer-events-none">
              ▼
            </span>
                    </div>
                </div>

                {/* Image Upload */}
                <div className="mb-6">
                    <label
                        htmlFor="images"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                    >
                        Upload Images (Max: 20)
                    </label>
                    <input
                        type="file"
                        name="images"
                        id="images"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="block w-full text-sm text-gray-500 dark:bg-gray-700 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-lg file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                    />
                    {images.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-200">
                                Uploaded Images: {images.length}/20
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-2">
                                {images.map((image, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={image.preview}
                                            alt={`Preview ${index + 1}`}
                                            className="h-24 w-full object-cover rounded-lg border border-gray-200"
                                        />
                                        {!image.file && (
                                            <span className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">
                                                Existing
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="description"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Property Description
                    </label>
                    <textarea
                        id="description"
                        rows="4"
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Write the description here..."
                        value={inputs.description}
                        name="description"
                        onChange={handleInputChange}
                    ></textarea>
                </div>
                <hr></hr>
                <div className="flex items-center justify-between">
                    <div className="mb-4 flex items-center">
                        <input type="number" className="my-2 bg-gray-200 rounded p-1" min={0} value={inputs.bedRoomNo}
                               onChange={handleInputChange} aria-valuenow={inputs.bedRoomNo} id="bedRoomNo" name="bedRoomNo"/>
                        <label className="mx-3">Number of Bedrooms</label>
                    </div>
                    <div className="mb-4 flex items-center">
                        <input type="number" className="my-2 bg-gray-200 rounded p-1" min={0} value={inputs.bathRoomNo}
                               onChange={handleInputChange} aria-valuenow={inputs.bathRoomNo} id="bathRoomNo" name="bathRoomNo"/>
                        <label className="mx-3">Number of Bathrooms</label>
                    </div>
                </div>
                {isEdit ? <input type="hidden" value={inputs.id}/> : ""}

                {/* Submit Button */}
                <div className="text-center">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {isEdit ? "Update Property" : "Add Property"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProperty;
