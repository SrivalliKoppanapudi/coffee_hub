// src/pages/Signup.jsx
import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [clicked,setClicked]=useState(false)
  const navigate=useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setClicked(true);
  
    try {
      const res = await fetch("http://localhost:8080/auth/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Signup failed");
      }
  
      alert(
        "Account created successfully!\nPlease verify your email before logging in."
      );
  
      // ✅ redirect to login (NOT auto login)
      navigate("/login");
  
    } catch (err) {
      alert(err.message);
    } finally {
      setClicked(false);
    }
  };
  
  

  return (
    <div className="coffee-page flex justify-center items-center text-white">
      <div className="coffee-section-card max-w-lg w-full px-8 py-10 shadow-lg-amber">
        <h2 className="text-3xl font-bold mb-2 text-gradient-amber text-center">
          Create Your CoffeeBite Account
        </h2>
        <p className="text-sm text-amber-100/80 mb-8 text-center">
          Save your favourite brews, bookings and orders in one warm place.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="username" className="text-xs uppercase tracking-wide text-amber-200/80">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Your name"
              className="w-full p-3"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs uppercase tracking-wide text-amber-200/80">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@coffeebite.com"
              className="w-full p-3"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-xs uppercase tracking-wide text-amber-200/80">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                className="w-full p-3 pr-10"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-200/80 hover:text-amber-200 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="role" className="text-xs uppercase tracking-wide text-amber-200/80">
              Role
            </label>
            <select
              id="role"
              className="w-full p-3"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="customer">Customer</option>
              <option value="waiter">Waiter</option>
              <option value="chef">Chef</option>
            </select>
          </div>
          <button className="w-full mt-2 bg-gradient-to-r from-[#f5e6d3] via-[#f2d3ab] to-[#e0b386] text-[#2b1810] font-semibold py-3 rounded-xl hover:from-[#f8f0e5] hover:via-[#f4d9b8] hover:to-[#e9bc8e] transition-all duration-300 shadow-md-amber hover:shadow-lg-amber">
            {clicked ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-amber-100/80">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-gradient-amber hover:opacity-90"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
