// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    setClicked(true);
  
    try {
      // 1. Call LOGIN endpoint (not create)
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // 🔥 VERY IMPORTANT
      });
  
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Login failed");
      }
  
      // 2. Fetch authenticated user
      const meRes = await fetch("http://localhost:8080/auth/me", {
        credentials: "include",
      });
  
      if (!meRes.ok) {
        throw new Error("Failed to fetch user info");
      }
  
      const userData = await meRes.json();
  
      // 3. Save user in AuthContext
      login({
        email: userData.email,
        role: userData.roles[0]?.authority,
      });
  
      // 4. Redirect based on role
      switch (userData.roles[0]?.authority) {
        case "ROLE_ADMIN":
          navigate("/admin");
          break;
        case "ROLE_CHEF":
          navigate("/chefdashboard");
          break;
        case "ROLE_WAITER":
          navigate("/waiterdashboard");
          break;
        default:
          navigate("/"); // customer
      }
  
    } catch (err) {
      alert(err.message);
    } finally {
      setClicked(false);
    }
  };
  

  

  return (
    <div className="coffee-page flex items-center justify-center text-white">
      <div className="coffee-section-card max-w-md w-full px-8 py-10 shadow-lg-amber">
        <h2 className="text-3xl font-bold mb-2 text-gradient-amber text-center">
          Welcome Back
        </h2>
        <p className="text-sm text-amber-100/80 mb-8 text-center">
          Sign in to keep your favourite brews and bookings in sync.
        </p>
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-amber-200/80">
              Email
            </label>
            <input
              type="text"
              placeholder="you@coffeebite.com"
              className="w-full p-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-amber-200/80">
              Password
            </label>
            <input
              type="password"
              placeholder="Your secret brew"
              className="w-full p-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="w-full mt-2 bg-gradient-to-r from-[#f5e6d3] via-[#f2d3ab] to-[#e0b386] text-[#2b1810] font-semibold py-3 rounded-xl hover:from-[#f8f0e5] hover:via-[#f4d9b8] hover:to-[#e9bc8e] transition-all duration-300 shadow-md-amber hover:shadow-lg-amber">
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-amber-100/80">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-gradient-amber hover:opacity-90"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
