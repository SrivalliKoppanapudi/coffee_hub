// src/pages/Signup.jsx
import React, { useContext, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [clicked,setClicked]=useState(false)
  const navigate=useNavigate()
  const {login}=useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setClicked(true);
  
    try {
      // 1. Signup
      const res = await fetch("http://localhost:8080/auth/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include", // 🔥 REQUIRED
      });
  
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Signup failed");
      }
  
      // 2. Fetch logged-in user
      const meRes = await fetch("http://localhost:8080/auth/me", {
        credentials: "include",
      });
  
      if (!meRes.ok) {
        throw new Error("Auto-login failed");
      }
  
      const userData = await meRes.json();
  
      // 3. Save user in context
      login({
        email: userData.email,
        role: userData.roles[0]?.authority,
      });
  
      // 4. Redirect
      navigate("/");
  
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
            <label className="text-xs uppercase tracking-wide text-amber-200/80">
              Username
            </label>
            <input
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
            <label className="text-xs uppercase tracking-wide text-amber-200/80">
              Email
            </label>
            <input
              type="email"
              placeholder="you@coffeebite.com"
              className="w-full p-3"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-amber-200/80">
              Password
            </label>
            <input
              type="password"
              placeholder="At least 6 characters"
              className="w-full p-3"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-amber-200/80">
              Role
            </label>
            <select
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
