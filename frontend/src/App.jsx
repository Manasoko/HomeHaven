import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios"

import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./components/forms/LoginPage.jsx";
import RegisterPage from "./components/forms/RegisterPage.jsx";
import PropertyPage from "./pages/PropertyPage.jsx";
import PropertyDetail from "./pages/PropertyDetail.jsx";
import Page404 from "./pages/404Page.jsx";
import ConfirmEmail from "./components/forms/ConfirmEmail.jsx";
import ResetPassword from "./components/forms/ResetPassword.jsx";
import AddProperty from "./components/dashboard/AddProperty.jsx";
import DashboardLayout from "./components/dashboard/outlet.jsx";
import DashboardHome from "./pages/dashboard-home.jsx";
import PropertyDashboardPage from "./components/dashboard/properties.jsx";
import Test from "./components/Test.jsx";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect( () => {
        const fetchSession = async () => {
            try {
                const response = await axios.get('http://localhost:7070/api/get-session');
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
                <Route path="/" element={<HomePage/>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/properties" element={<PropertyPage />} />
                <Route path="/property/:id" element={<PropertyDetail />} />
                <Route path="/reset" element={<ConfirmEmail />}/>
                <Route path="/reset/:token" element={<ResetPassword />} />
                <Route path="/dashboard" element={isLoggedIn ? <DashboardLayout />: <Navigate to='/login' />}>
                    <Route index element={<DashboardHome />} />
                    <Route path="/dashboard/properties" element={<PropertyDashboardPage />}/>
                    <Route path="/dashboard/add-property" element={<AddProperty />} />
                    <Route path="/dashboard/edit-property/:id" element={<AddProperty />} />
                </Route>
                <Route path="*" element={<Page404 />} />
                <Route path="/test" element={<Test />} />
            </Routes>
            <Footer/>
        </div>
    );
}

export default App;
