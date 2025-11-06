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
  const [clicked,setClicked]=useState(false)
  const navigate=useNavigate()

  const handleSubmit = async (e) => {
    setClicked(true)
    e.preventDefault();
    await fetch("http://localhost:8080/auth/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setClicked(false)
    navigate("/login")
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#1c140f] text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-[#2a1f16] p-10 rounded-lg shadow-lg w-[450px]"
      >
        <h2 className="text-3xl font-bold mb-6">Sign Up</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-4 rounded bg-gray-800"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-gray-800"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-gray-800"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <select
          className="w-full p-3 mb-6 rounded bg-gray-800"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="customer">Customer</option>
          <option value="waiter">Waiter</option>
          <option value="chef">Chef</option>
        </select>
        <button className="bg-white text-black w-full py-3 rounded font-semibold hover:bg-gray-200 transition">
          {clicked?"Creating account...":"Sign Up"}
        </button>
        <p className="mt-4 text-center text-sm">
  Already have an account?{" "}
  <Link
    to="/login"
    className="text-yellow-400 hover:underline font-medium"
  >
    Sign In
    
  </Link>
</p>
      </form>
    </div>
  );
};

export default Signup;
