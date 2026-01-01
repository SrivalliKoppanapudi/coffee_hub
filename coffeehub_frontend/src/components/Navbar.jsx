// src/components/Navbar.jsx
import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/menu", label: "Menu" },
    { to: "/book", label: "Book Table" },
  ];

  const dashboardLinks = [
    user?.role === "ROLE_CUSTOMER" && { to: "/customerdashboard", label: "Dashboard" },
    user?.role === "ROLE_WAITER" && { to: "/waiterdashboard", label: "Dashboard" },
    user?.role === "ROLE_CHEF" && { to: "/chefdashboard", label: "Dashboard" },
    user?.role === "ROLE_ADMIN" && { to: "/admin", label: "Admin Panel" },
  ].filter(Boolean);

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#1c140f] via-[#2a1b15] to-[#1c140f] text-white shadow-xl border-b border-amber-800 transition-all duration-300">
      <div className="flex justify-between items-center px-4 md:px-12 py-4 md:py-6">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <h1 className="text-2xl md:text-3xl font-bold font-serif tracking-wide bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent group-hover:from-amber-100 group-hover:to-yellow-300 transition-all duration-300">
            ☕ CoffeeBite
          </h1>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex space-x-8 text-base font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="relative group text-gray-200 hover:text-amber-300 transition-colors duration-200"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
          
          {dashboardLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="relative group text-gray-200 hover:text-amber-300 transition-colors duration-200"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </nav>

        {/* Right side (User & Mobile Menu Button) */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button 
                onClick={toggleDropdown}
                className="transition-transform duration-300 hover:scale-110"
              >
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="User"
                    className="w-10 h-10 rounded-full cursor-pointer border-2 border-amber-400 hover:border-amber-300 transition-colors duration-200"
                  />
                ) : (
                  <FaUserCircle className="text-3xl cursor-pointer text-amber-400 hover:text-amber-300 transition-colors duration-200" />
                )}
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 min-w-[12rem] bg-gradient-to-b from-[#2a1b15] to-[#1c140f] text-white rounded-lg shadow-2xl z-50 border border-amber-700 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    to="/profile"
                    className="block px-4 py-3 hover:bg-amber-700 hover:text-white rounded-t-lg transition-colors duration-150"
                  >
                    👤 Profile
                  </Link>
                  <Link
                    to="/cart"
                    className="block px-4 py-3 hover:bg-amber-700 hover:text-white transition-colors duration-150"
                  >
                    🛒 Cart
                  </Link>
                  <Link
                    to="/history"
                    className="block px-4 py-3 hover:bg-amber-700 hover:text-white transition-colors duration-150"
                  >
                    📅 My Bookings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:bg-red-700 hover:text-white rounded-b-lg transition-colors duration-150 border-t border-amber-700"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              to="/login" 
              className="hidden md:block px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-2xl text-amber-400 hover:text-amber-300 transition-colors duration-200"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-[#2a1b15] to-[#1c140f] border-t border-amber-800 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block px-4 py-2 text-amber-200 hover:bg-amber-700 hover:text-white rounded transition-colors duration-150"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {dashboardLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block px-4 py-2 text-amber-200 hover:bg-amber-700 hover:text-white rounded transition-colors duration-150"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              <Link
                to="/profile"
                className="block px-4 py-2 text-amber-200 hover:bg-amber-700 hover:text-white rounded transition-colors duration-150"
                onClick={() => setMobileMenuOpen(false)}
              >
                👤 Profile
              </Link>
              <Link
                to="/cart"
                className="block px-4 py-2 text-amber-200 hover:bg-amber-700 hover:text-white rounded transition-colors duration-150"
                onClick={() => setMobileMenuOpen(false)}
              >
                🛒 Cart
              </Link>
              <Link
                to="/history"
                className="block px-4 py-2 text-amber-200 hover:bg-amber-700 hover:text-white rounded transition-colors duration-150"
                onClick={() => setMobileMenuOpen(false)}
              >
                📅 My Bookings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-300 hover:bg-red-700 hover:text-white rounded transition-colors duration-150"
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded text-center transition-colors duration-150"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
