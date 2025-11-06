// src/components/Button.jsx
import React from "react";

const Button = ({ children, primary = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-md font-semibold transition flex items-center ${
        primary
          ? "bg-white text-black hover:bg-gray-200"
          : "border border-white hover:bg-white hover:text-black"
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
