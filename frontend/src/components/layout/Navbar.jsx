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

const Navbar = ({ isLogin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post("http://localhost:7070/api/logout");
      isLogin = false;
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
          {!isLogin ? (
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
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div
        className={`md:hidden fixed top-0 right-0 h-full w-3/4 max-w-xs bg-white dark:bg-gray-900 z-50 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out shadow-lg`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-800 dark:text-white hover:text-blue-600 focus:outline-none"
        >
          ✕
        </button>
        <div className="flex flex-col justify-center items-center h-full space-y-6">
          <Link
            to="/"
            className="text-xl font-medium text-gray-800 hover:text-blue-600 dark:text-white"
            onClick={() => setIsOpen(false)}
          >
            HomeHaven
          </Link>
          <Link
            to="/properties"
            className="text-xl font-medium text-gray-800 hover:text-blue-600 dark:text-white"
            onClick={() => setIsOpen(false)}
          >
            Properties
          </Link>
          {!isLogin ? (
            <>
              <Link
                to="/login"
                className="text-xl font-medium text-gray-800 hover:text-blue-600 dark:text-white"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-xl font-medium text-gray-800 hover:text-blue-600 dark:text-white"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/add-property"
                className="text-xl font-medium dark:text-white text-gray-800 hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                Add Properties
              </Link>
              <Menu as="div" className="relative w-full text-center">
                <MenuButton className="text-xl font-medium hover:text-blue-600 dark:text-white">
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
                  <MenuItems className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-40 bg-gray-800 text-white rounded-md shadow-lg py-2">
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
                          className={`block w-full text-left px-4 py-2 ${
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
      </div>
    </nav>
  );
};

export default Navbar;
