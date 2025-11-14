import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const MAX_IMAGES = 20;
const BASE_URL = "http://localhost:7070";

const initialInputs = {
    propertyAddress: "",
    price: "",
    description: "",
    propertyType: "",
    bedRoomNo: 0,
    bathRoomNo: 0,
    id: 0,
    status: "",
};

const AddProperty = () => {
    const { state } = useLocation();
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(state);

    const [images, setImages] = useState([]);
    const [inputs, setInputs] = useState(initialInputs);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEdit) {
            setInputs({
                propertyAddress: state.property.address ?? "",
                price: state.property.price ?? "",
                description: state.property.description ?? "",
                propertyType: state.property.propertyType ?? "",
                bedRoomNo: state.property.bedRoomNo ?? 0,
                bathRoomNo: state.property.bathRoomNo ?? 0,
                id: state.property.id ?? 0,
                status: state.property.status ?? "",
            });
            if (state.property.images?.length) {
                setImages(
                    state.property.images.map((img) => ({
                        preview: `${BASE_URL}/${img.url.replace("../", "")}`,
                        file: null,
                    }))
                );
            }
        }
    }, [state, isEdit]);

    useEffect(() => {
        return () => {
            images.forEach((image) => {
                if (image.preview && image.file) URL.revokeObjectURL(image.preview);
            });
        };
    }, [images]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files).map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        if (files.length + images.length > MAX_IMAGES) {
            alert(`You can upload up to ${MAX_IMAGES} images only.`);
            return;
        }
        setImages((prev) => [...prev, ...files]);
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setInputs((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputs.propertyType) {
            alert("Please select a property type.");
            return;
        }
        const formData = new FormData();
        Object.entries(inputs).forEach(([key, val]) => formData.append(key, val));
        images.forEach((img) => img.file && formData.append("images", img.file));
        try {
            if (isEdit) {
                await axios.put(`${BASE_URL}/api/property/${id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                alert("Property updated!");
            } else {
                await axios.post(`${BASE_URL}/api/property`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                alert("Property added!");
            }
            navigate("/dashboard/properties");
        } catch (err) {
            setError(
                err.response?.status === 400
                    ? err.response.data.error
                    : "Something went wrong. Please try again."
            );
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-2xl mt-12">
            <h2 className="text-3xl font-extrabold text-center mb-8 text-blue-700 dark:text-blue-300 tracking-tight">
                {isEdit ? "Edit Property" : "Add New Property"}
            </h2>
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                        label="Property Address"
                        name="propertyAddress"
                        value={inputs.propertyAddress}
                        onChange={handleInputChange}
                        icon="🏠"
                    />
                    <FormInput
                        label="Property Price"
                        name="price"
                        value={inputs.price}
                        onChange={handleInputChange}
                        icon="💲"
                    />
                    <FormSelect
                        label="Property Type"
                        name="propertyType"
                        value={inputs.propertyType}
                        onChange={handleInputChange}
                        options={[
                            { value: "", label: "-- Choose a Property Type --", disabled: true },
                            { value: "Residential Property", label: "Residential Property" },
                            { value: "Commercial Property", label: "Commercial Property" },
                            { value: "Land", label: "Land" },
                        ]}
                        icon="🏢"
                    />
                    <FormSelect
                        label="Property Status"
                        name="status"
                        value={inputs.status}
                        onChange={handleInputChange}
                        options={[
                            { value: "", label: "-- Select Property Status --", disabled: true },
                            { value: "for rent/lease", label: "For Rent/Lease" },
                            { value: "for sale", label: "For Sale" },
                            { value: "sold", label: "Sold" },
                        ]}
                        icon="📋"
                    />
                </div>
                <div>
                    <label
                        htmlFor="images"
                        className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                    >
                        Upload Images (Max: {MAX_IMAGES})
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
                    {images.length > 0 && <ImagePreviewList images={images} />}
                </div>
                <div>
                    <label
                        htmlFor="description"
                        className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                    >
                        Property Description
                    </label>
                    <textarea
                        id="description"
                        rows="4"
                        className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Write the description here..."
                        value={inputs.description}
                        name="description"
                        onChange={handleInputChange}
                    ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <FormNumberInput
                        label="Bedrooms"
                        name="bedRoomNo"
                        value={inputs.bedRoomNo}
                        onChange={handleInputChange}
                        icon="🛏️"
                    />
                    <FormNumberInput
                        label="Bathrooms"
                        name="bathRoomNo"
                        value={inputs.bathRoomNo}
                        onChange={handleInputChange}
                        icon="🛁"
                    />
                </div>
                {isEdit && <input type="hidden" value={inputs.id} />}
                <div className="text-center mt-8">
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                        {isEdit ? "Update Property" : "Add Property"}
                    </button>
                </div>
            </form>
        </div>
    );
};


const FormInput = ({ label, name, value, onChange, icon }) => (
    <div>
        <label
            htmlFor={name}
            className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
        >
            {icon && <span className="mr-2">{icon}</span>}
            {label}
        </label>
        <input
            type="text"
            name={name}
            id={name}
            value={value}
            className="rounded-xl dark:bg-gray-700 shadow w-full p-3 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            onChange={onChange}
        />
    </div>
);

const FormNumberInput = ({ label, name, value, onChange, icon }) => (
    <div>
        <label
            htmlFor={name}
            className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
        >
            {icon && <span className="mr-2">{icon}</span>}
            {label}
        </label>
        <input
            type="number"
            className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 border border-gray-300 w-full focus:ring-blue-500 focus:border-blue-500"
            min={0}
            value={value}
            onChange={onChange}
            aria-valuenow={value}
            id={name}
            name={name}
        />
    </div>
);

const FormSelect = ({ label, name, value, onChange, options, icon }) => (
    <div>
        <label
            htmlFor={name}
            className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
        >
            {icon && <span className="mr-2">{icon}</span>}
            {label}
        </label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="block w-full border-gray-300 dark:bg-gray-700 dark:text-gray-200 rounded-xl shadow focus:ring-blue-500 focus:border-blue-500 p-3"
        >
            {options.map((opt, i) => (
                <option key={i} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
);

const ImagePreviewList = ({ images }) => (
    <div className="mt-4">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-200 mb-2">
            Uploaded Images: {images.length}/{MAX_IMAGES}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((image, idx) => (
                <div key={idx} className="relative group">
                    <img
                        src={image.preview}
                        alt={`Preview ${idx + 1}`}
                        className="h-28 w-full object-cover rounded-xl border border-gray-200 shadow group-hover:opacity-80 transition"
                    />
                    {!image.file && (
                        <span className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">
                            Existing
                        </span>
                    )}
                </div>
            ))}
        </div>
    </div>
);

export default AddProperty;
