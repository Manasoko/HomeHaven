import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios"

import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import HomePage from "./components/home/HomePage.jsx";
import LoginPage from "./components/pages/forms/LoginPage.jsx";
import RegisterPage from "./components/pages/forms/RegisterPage.jsx";
import PropertyPage from "./components/pages/PropertyPage.jsx";
import PropertyDetail from "./components/pages/PropertyDetail.jsx";
import Page404 from "./components/pages/404Page.jsx";
import ConfirmEmail from "./components/pages/forms/ConfirmEmail.jsx";
import ResetPassword from "./components/pages/forms/ResetPassword.jsx";
import AddProperty from "./components/pages/forms/AddProperty.jsx";
import Dashboard from "./components/dashboard/main.jsx";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect( () => {
        const fetchSession = async () => {
            try {
                const response = await axios.get('http://localhost:7070/api/test-session');
                if (response.data.isLoggedIn) {
                    return setIsLoggedIn(true);
                } else {
                    return setIsLoggedIn(false);
                }
            } catch (e) {
                console.log(e);
                setIsLoggedIn(false);
            }
        };
        fetchSession();
    }, []);

    return (
        <div className='dark:bg-gray-900 dark:text-white h-full'>
            <Navbar  isLogin={isLoggedIn}/>
            <Routes>
                <Route path='/' element={<HomePage/>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/properties" element={<PropertyPage />} />
                <Route path="/property/:id" element={<PropertyDetail />} />
                <Route path='/reset' element={<ConfirmEmail />}/>
                <Route path='/reset/:token' element={<ResetPassword />} />
                <Route path='/add-property' element={isLoggedIn ? <AddProperty />: <Navigate to='/login' />} />
                <Route path='/dashboard' element={isLoggedIn ? <Dashboard />: <Navigate to='/login' />} />
                <Route path="*" element={<Page404 />} />
            </Routes>
            <Footer/>
        </div>
    );
}

export default App;
