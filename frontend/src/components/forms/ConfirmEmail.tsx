import  {useState} from "react";
import axios from "axios";

function ConfirmEmail() {
    const [inputs, setInputs] = useState({});
    const [error, setError] = useState();
    const [message, setMessage] = useState();

    const handleChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:7070/api/reset', inputs);
            setMessage(response.data.message);
            console.log([inputs, response])
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError(error.response.data.error);
            } else if (error.response.status === 422) {
                setError(error.response.data.error);
            } else {
                console.log(error)
                setError('An unexpected error occurred. Please try again.');
            }
        }
    }

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 dark:bg-gray-900">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Confirm your Email</h2>
            </div>
            {error && <p className="text-red-800 text-center">{error}</p>}
            {message && <p className="text-green-800 text-center">{message}</p>}
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm dark:bg-gray-900">
                <form className="space-y-6 dark:bg-gray-900" onSubmit={handleSubmit} noValidate>
                    <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-300">Email
                            address</label>
                        <div className="mt-2">
                            <input type="email" name="email" id="email" autoComplete="email" required
                                   onChange={handleChange}
                                   className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 dark:text-gray-300 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
                        </div>
                    </div>
                    <div>
                        <button type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Send
                            reset link
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ConfirmEmail;