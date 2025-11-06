// src/components/Hero.jsx
import React from "react";
import { FiArrowRight } from "react-icons/fi";
import Button from "./Button";
import coffeeImage from "../assets/coffee_logo.png";
import { Link } from "react-router-dom";
import {useNavigate} from 'react-router-dom';

const Hero = () => {
  const navigate=useNavigate()
  const handleBook=()=>{
    console.log("erfrege")
    const token=localStorage.getItem('token')
    if (token) {
      navigate('/book')
    }
    else{
      alert('Please login to book a table')
      navigate('/login')
    }
  }
  return (
    <section className="flex justify-around items-center px-16 py-20 bg-[#1c140f] text-white min-h-screen">
      {/* Left Content */}
      <div className="max-w-xl">
        <h2 className="text-6xl font-extrabold leading-tight mb-6">
          Discover The
          <br /> Art Of Perfect
          <br /> Coffee
        </h2>
        <p className="text-red-300 text-lg leading-relaxed mb-10">
          Experience The Rich And Bold Flavors Of Our Exquisite Coffee Blends,
          Crafted To Awaken Your Senses And Start Your Day Right
        </p>

        <div className="flex space-x-6">
         
          <Button primary onClick={handleBook}>
            Book Table <FiArrowRight className="ml-2" />
          </Button>
          
          <Link to="/menu"><Button>Explore Menu</Button></Link>
        </div>
      </div>

      {/* Right Coffee Image */}
      <div className="relative">
        <img
          src={coffeeImage}
          alt="coffee cup"
          className="w-[420px] drop-shadow-2xl"
        />
      </div>
    </section>
  );
};

export default Hero;
