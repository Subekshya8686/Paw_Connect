import {
  Bars3Icon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "../../core/public/Login";
import Register from "../../core/public/register";
import { useAuth } from "../../hooks/useAuth";
import ConfirmDialogBox from "../ConfirmDialogBox/ConfirmDialogBox";

const AppBar = ({
  scrollToSection,
  homeRef,
  breedsRef,
  petsRef,
  footerRef,
}) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const menuRef = useRef(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to manage dialog visibility
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state for confirm button

  const { isAuthenticated, userId, logout: authLogout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleHomeClick = () => {
    navigate("/");
    homeRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleBreedClick = () => {
    navigate("/");
    breedsRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleAvailableClick = () => {
    navigate("/");
    petsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && searchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleProfileClick = () => {
    if (userId) {
      navigate(`/user/${userId}`);
    } else {
      // If no user ID, user is not authenticated, show login
      setIsLoginOpen(true);
    }
  };

  const handleLogout = () => {
    // localStorage.removeItem(config.TOKEN_KEY); // Remove token on logout
    // navigate("/"); // Optionally, navigate to the homepage
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDialogConfirm = () => {
    setIsDialogOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });

    authLogout(); // Use the auth hook to handle logout
    navigate("/"); // Optionally, navigate to the homepage
  };

  return (
    <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-500 to-purple-600 font-lora shadow-lg">
      <div className="flex justify-between items-center p-4 px-6 md:px-10">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-white ">PawConnect</h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <button
            className="text-white hover:text-indigo-200 transition-colors duration-200"
            onClick={handleHomeClick}
          >
            Home
          </button>
          <button
            className="text-white hover:text-indigo-200 transition-colors duration-200"
            onClick={handleBreedClick}
          >
            Breed
          </button>
          <button
            className="text-white hover:text-indigo-200 transition-colors duration-200"
            onClick={handleAvailableClick}
          >
            Available Pets
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <XMarkIcon className="w-8 h-8 text-gray-800" />
            ) : (
              <Bars3Icon className="w-8 h-8 text-white" />
            )}
          </button>
        </div>

        {/* Search and User Menu */}
        <div className="hidden md:flex space-x-4 items-center">
          <input
            type="text"
            className="px-3 py-1 rounded-3xl border border-gray-300 focus:outline-none h-10"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-center h-10"
            >
              <UserCircleIcon className="w-12 h-12 text-white hover:text-indigo-200 transition-colors duration-200" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg p-2">
                {isAuthenticated ? (
                  <>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleProfileClick}
                    >
                      Profile
                    </button>

                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setIsLoginOpen(true);
                        setMenuOpen(false);
                      }}
                    >
                      Login
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setIsRegisterOpen(true);
                        setMenuOpen(false);
                      }}
                    >
                      Register
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden flex flex-col space-y-2 absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg p-2 border border-gray-200">
          <button
            className="text-black "
            onClick={() => {
              handleHomeClick();
              setMobileMenuOpen(false);
            }}
          >
            Home
          </button>
          <button
            className="text-black "
            onClick={() => {
              handleBreedClick();
              setMobileMenuOpen(false);
            }}
          >
            Breed
          </button>
          <button
            className="text-black "
            onClick={() => {
              handleAvailableClick();
              setMobileMenuOpen(false);
            }}
          >
            Available Pets
          </button>

          {/* Divider Line */}
          <hr className="border-gray-300" />

          {/* Login and Register Buttons */}
          {isAuthenticated ? (
            <>
              <button
                className="text-black  bg-white py-2 rounded-lg shadow-md"
                onClick={() => {
                  handleProfileClick();
                  setMobileMenuOpen(false);
                }}
              >
                Profile
              </button>

              <button
                className="text-black  bg-white py-2 rounded-lg shadow-md"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="text-black  bg-white py-2 rounded-lg shadow-md"
                onClick={() => {
                  setIsLoginOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                Login
              </button>
              <button
                className="text-black  bg-white py-2 rounded-lg shadow-md"
                onClick={() => {
                  setIsRegisterOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                Register
              </button>
            </>
          )}
        </div>
      )}

      {isLoginOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <LoginModal onClose={() => setIsLoginOpen(false)} />
          </div>
        </div>
      )}

      {isRegisterOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <Register onClose={() => setIsRegisterOpen(false)} />
          </div>
        </div>
      )}

      {isDialogOpen && (
        <ConfirmDialogBox
          open={isDialogOpen}
          handleClose={handleDialogClose}
          label={"Are you sure you want to Log Out?"}
          handleConfirm={handleDialogConfirm}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default AppBar;
