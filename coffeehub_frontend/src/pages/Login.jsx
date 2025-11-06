// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // backend expects email
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Login failed. Please try again.");
      }

      const data = await res.json();
      console.log("Login successful:", data);

      if (data.token) {
        const user = {
          username: data.username,
          role: data.role,
          email: data.email,
        };
        login(user, data.token); // ✅ sets user & token in AuthContext

        switch (user.role) {
          case "ROLE_CUSTOMER":
            navigate("/book");
            break;
          case "ROLE_ADMIN":
            navigate("/admin");
            break;
          case "ROLE_WAITER":
            navigate("/waiterdashboard");
          case "ROLE_CHEF":
            navigate("/chefdashboard");
            break;
          default:
            navigate("/"); // fallback
        }
      } else {
        alert("No token received. Please try again.");
      }
    } catch (err) {
      console.error("Login failed:", err.message);
      alert(`Login failed: ${err.message}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#1c140f] text-white">
      <form
        onSubmit={handleLogin}
        className="bg-[#2a1f16] p-10 rounded-lg shadow-lg w-[400px]"
      >
        <h2 className="text-3xl font-bold mb-6">Login</h2>
        <input
          type="text"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-gray-800"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded bg-gray-800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-white text-black w-full py-3 rounded font-semibold hover:bg-gray-200 transition">
          Login
        </button>
        <p className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-yellow-400 hover:underline font-medium"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
