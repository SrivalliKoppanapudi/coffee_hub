// src/components/Button.jsx
import React from "react";

const Button = ({ children, primary = false, onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 transform hover:scale-105 active:scale-95 shadow-md-amber ${
        primary
          ? "bg-gradient-to-r from-[#f5e6d3] via-[#f2d3ab] to-[#e0b386] text-[#2b1810] hover:from-[#f8f0e5] hover:via-[#f4d9b8] hover:to-[#e9bc8e] hover:shadow-lg-amber disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          : "border border-[rgba(245,230,211,0.35)] text-[var(--coffee-cream)] bg-black/20 hover:bg-[rgba(245,230,211,0.08)] hover:border-[rgba(245,230,211,0.6)] hover:shadow-lg-amber disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
