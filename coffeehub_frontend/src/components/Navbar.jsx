// src/components/Navbar.jsx
import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa"; // fallback user icon

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  // Close dropdown when clicking outside
  console.log(user)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle logout + redirect
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center px-12 py-6 border-b border-gray-700 bg-[#1c140f] text-white">
      {/* Logo */}
      <h1 className="text-2xl font-bold font-serif tracking-wide">
        CoffeeBite
      </h1>

      {/* Navigation Links */}
      <nav className="flex space-x-10 text-lg">
        <Link to="/">Home</Link>
      
          {/* Role-Based Dashboard */}
  {user?.role === "ROLE_CUSTOMER" && (
    <Link to="/customerdashboard">Dashboard</Link>
  )}
  {user?.role === "ROLE_WAITER" && (
    <Link to="/waiterdashboard">Dashboard</Link>
  )}
  {user?.role === "ROLE_CHEF" && (
    <Link to="/chefdashboard">Dashboard</Link>
  )}
  {user?.role === "ROLE_ADMIN" && (
    <Link to="/admin">Admin Panel</Link>
  )}


        <Link to="/menu">Menu</Link>


        
          <Link to="/book">Book Table</Link>
       
        
      </nav>

      {/* Right side (User & Search) */}
      <div className="flex items-center space-x-6 relative">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button onClick={toggleDropdown}>
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="User"
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-500"
                />
              ) : (
                <FaUserCircle className="text-3xl cursor-pointer" />
              )}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 min-w-[12rem] bg-white text-black rounded shadow-lg z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-200"
                >
                  Profile
                </Link>
                <Link
                  to="/cart"
                  className="block px-4 py-2 hover:bg-gray-200"
                >
                  Cart
                </Link>

                <Link
            to="/history"
            className="block px-4 py-2 hover:bg-gray-200"
          >
            My Bookings
          </Link>
                

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  Logout
                </button>
                

              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="hover:text-gray-300">
            Sign In
          </Link>
        )}

       
      </div>
    </header>
  );
};

export default Navbar;
