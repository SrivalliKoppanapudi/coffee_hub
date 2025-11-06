// src/pages/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1412] text-white">
      <div className="bg-[#2a2422] p-12 rounded-2xl shadow-xl text-center max-w-md w-full">
        <h1 className="text-4xl font-extrabold mb-4">CoffeeBite</h1>
        <p className="text-[#d4a373] mb-10 text-lg">
          Discover the art of perfect coffee <br /> Sign in to continue
        </p>

        {/* Auth Buttons */}
        <div className="space-y-6">
          <Link
            to="/login"
            className="block w-full bg-[#d4a373] text-black font-semibold py-3 rounded-lg hover:bg-[#e0b989] transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="block w-full border border-[#d4a373] text-[#d4a373] font-semibold py-3 rounded-lg hover:bg-[#d4a373] hover:text-black transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
