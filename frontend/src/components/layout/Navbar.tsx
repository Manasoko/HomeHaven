import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";

interface NavbarProps {
  isLogin: boolean;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post("http://localhost:7070/api/logout");
      props.isLogin = false;
      navigate("/login");
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <nav className="bg-white shadow-md relative dark:bg-gray-900">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-2xl font-bold dark:text-white">
          HomeHaven
        </Link>

        <div className="hidden md:flex md:items-center md:space-x-6">
          <Link
            to="/properties"
            className="text-gray-800 hover:text-blue-600 dark:text-white"
          >
            Properties
          </Link>
          {!props.isLogin ? (
            <>
              <Link
                to="/login"
                className="text-gray-800 hover:text-blue-600 dark:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-800 hover:text-blue-600 dark:text-white"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {/* Profile Dropdown */}
              <Menu as="div" className="relative w-full text-center">
                <MenuButton className="flex items-center justify-center w-10 h-10 rounded-full">
                  <img
                    className="w-8 h-8 rounded-full"
                    src="https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg?s=612x612&w=0&k=20&c=UEa7oHoOL30ynvmJzSCIPrwwopJdfqzBs0q69ezQoM8="
                  />
                </MenuButton>
                <Transition
                  enter="transition duration-200 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-150 ease-in"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <MenuItems className="absolute right-0 mt-2 w-40 bg-gray-800 text-white rounded-md shadow-lg py-2 z-50">
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          to="/dashboard"
                          className={`block px-4 py-2 ${
                            focus ? "bg-gray-700" : ""
                          }`}
                        >
                          Dashboard
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ focus }) => (
                        <button
                          onClick={logout}
                          className={`block w-full px-4 py-2 ${
                            focus ? "bg-gray-700" : ""
                          }`}
                        >
                          Logout
                        </button>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Transition>
              </Menu>
            </>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-800 hover:text-blue-600 focus:outline-none dark:text-white"
        >
          ☰
        </button>
      </div>

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div
        className={`md:hidden fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 z-50 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-all duration-300 ease-in-out shadow-2xl`}
      >
        {/* Mobile Header */}
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="text-xl font-bold dark:text-white"
              onClick={() => setIsOpen(false)}
            >
              HomeHaven
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg
                className="w-6 h-6 dark:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Links */}
        <div className="py-4">
          {props.isLogin ? (
            <>
              {/* User Profile Section */}
              <div className="px-4 py-3 border-b dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg?s=612x612&w=0&k=20&c=UEa7oHoOL30ynvmJzSCIPrwwopJdfqzBs0q69ezQoM8="
                    className="w-10 h-10 rounded-full"
                    alt="Profile"
                  />
                  <div>
                    <p className="text-sm font-medium dark:text-white">
                      User Profile
                    </p>
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                      onClick={() => setIsOpen(false)}
                    >
                      Manage your account
                    </Link>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="px-4 py-2 space-y-1">
                <Link
                  to="/properties"
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Properties</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/add-property"
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Add Property</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
                >
                  <span>Logout</span>
                </button>
              </nav>
            </>
          ) : (
            <nav className="px-4 py-2 space-y-1">
              <Link
                to="/properties"
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                onClick={() => setIsOpen(false)}
              >
                <span>Properties</span>
              </Link>
              <Link
                to="/login"
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                onClick={() => setIsOpen(false)}
              >
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                onClick={() => setIsOpen(false)}
              >
                <span>Register</span>
              </Link>
            </nav>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
