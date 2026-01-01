// src/pages/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="coffee-page flex items-center justify-center text-white">
      <div className="coffee-section-card p-10 rounded-3xl shadow-lg-amber text-center max-w-md w-full">
        <h1 className="text-4xl font-extrabold mb-3 text-gradient-amber">
          CoffeeBite
        </h1>
        <p className="text-amber-100/80 mb-8 text-lg">
          Discover the art of perfectly brewed coffee. <br /> Sign in to order,
          book and manage your café experience.
        </p>

        {/* Auth Buttons */}
        <div className="space-y-4">
          <Link
            to="/login"
            className="block w-full bg-gradient-to-r from-[#f5e6d3] via-[#f2d3ab] to-[#e0b386] text-[#2b1810] font-semibold py-3 rounded-xl hover:from-[#f8f0e5] hover:via-[#f4d9b8] hover:to-[#e9bc8e] transition-all duration-300 shadow-md-amber hover:shadow-lg-amber"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="block w-full border border-[rgba(245,230,211,0.4)] text-[var(--coffee-cream)] font-semibold py-3 rounded-xl hover:bg-[rgba(245,230,211,0.08)] hover:border-[rgba(245,230,211,0.8)] transition-all duration-300"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
