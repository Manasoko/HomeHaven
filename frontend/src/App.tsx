import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios"

import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/forms/LoginPage.jsx";
import RegisterPage from "./pages/forms/RegisterPage.jsx";
import PropertyPage from "./pages/PropertyPage.jsx";
import PropertyDetail from "./pages/PropertyDetail.jsx";
import Page404 from "./pages/404Page.jsx";
import ConfirmEmail from "./pages/forms/ConfirmEmail.jsx";
import ResetPassword from "./pages/forms/ResetPassword.jsx";
import AddProperty from "./components/dashboard/AddProperty.jsx";
import DashboardLayout from "./components/dashboard/outlet.jsx";
import DashboardHome from "./pages/dashboard-home.jsx";
import PropertyDashboardPage from "./components/dashboard/properties.jsx";
import Test from "./components/Test.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.js"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get('http://localhost:7070/api/get-session');
        setIsLoggedIn(response.data.isLoggedIn);
      } catch (e) {
        console.log(e);
        setIsLoggedIn(false);
      } finally {
        // Always set loading to false when done (success or error)
        setIsLoading(false);
      }
    };
    fetchSession();
  }, []);

  return (
    <div className='dark:bg-gray-900 dark:text-white h-full'>
      <Navbar isLogin={isLoggedIn} />
      <Routes>
        {/* Public routes - anyone can access */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/properties" element={<PropertyPage />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/reset" element={<ConfirmEmail />} />
        <Route path="/reset/:token" element={<ResetPassword />} />

        {/* Protected routes - wrapped in ProtectedRoute */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} isLoading={isLoading}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="/dashboard/properties" element={<PropertyDashboardPage />} />
          <Route path="/dashboard/add-property" element={<AddProperty />} />
          <Route path="/dashboard/edit-property/:id" element={<AddProperty />} />
        </Route>

        {/* Catch-all routes */}
        <Route path="*" element={<Page404 />} />
        <Route path="/test" element={<Test />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;