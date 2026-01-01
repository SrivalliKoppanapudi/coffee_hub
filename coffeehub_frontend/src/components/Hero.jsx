// src/components/Hero.jsx
import React from "react";
import { FiArrowRight } from "react-icons/fi";
import Button from "./Button";
import coffeeImage from "../assets/coffee_logo.png";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate()
  const handleBook = () => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/book')
    }
    else {
      alert('Please login to book a table')
      navigate('/login')
    }
  }

  return (
    <section className="coffee-hero overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-amber-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-red-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="flex flex-col md:flex-row justify-around items-center px-6 md:px-16 py-12 md:py-20 gap-8 relative z-10 container-custom">
        {/* Left Content */}
        <div className="max-w-xl space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-300 bg-clip-text text-transparent animate-slide-in-left">
              Discover The
              <br /> Art Of Perfect
              <br /> Coffee
            </h2>
          </div>
          
          <p className="text-lg md:text-xl text-amber-100 leading-relaxed animate-slide-in-up animation-delay-200 hover:text-amber-50 transition-colors duration-300 max-w-xl">
            Experience The Rich And Bold Flavors Of Our Exquisite Coffee Blends, Crafted To Awaken Your Senses And Start Your Day Right
          </p>

          <div className="flex flex-col sm:flex-row gap-6 animate-slide-in-up animation-delay-400">
            <div className="transform hover:scale-110 transition-transform duration-300">
              <Button primary onClick={handleBook}>
                Book Table <FiArrowRight className="ml-2 animate-bounce-right" />
              </Button>
            </div>
            
            <div className="transform hover:scale-110 transition-transform duration-300">
              <Link to="/menu">
                <Button>Explore Menu</Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8 animate-slide-in-up animation-delay-600">
            <div className="text-center hover:transform hover:scale-110 transition-transform duration-300 group">
              <div className="text-3xl font-bold text-amber-400 group-hover:text-amber-300 transition-colors">500+</div>
              <div className="text-sm text-gray-300 group-hover:text-amber-200 transition-colors">Happy Customers</div>
            </div>
            <div className="text-center hover:transform hover:scale-110 transition-transform duration-300 group">
              <div className="text-3xl font-bold text-amber-400 group-hover:text-amber-300 transition-colors">50+</div>
              <div className="text-sm text-gray-300 group-hover:text-amber-200 transition-colors">Menu Items</div>
            </div>
            <div className="text-center hover:transform hover:scale-110 transition-transform duration-300 group">
              <div className="text-3xl font-bold text-amber-400 group-hover:text-amber-300 transition-colors">4.9★</div>
              <div className="text-sm text-gray-300 group-hover:text-amber-200 transition-colors">Best Rated</div>
            </div>
          </div>
        </div>

        {/* Right Coffee Image */}
        <div className="relative animate-float">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <img
            src={coffeeImage}
            alt="coffee cup"
            className="w-[300px] md:w-[420px] drop-shadow-2xl relative z-10 hover:drop-shadow-[0_0_30px_rgba(217,119,6,0.8)] transition-all duration-300 transform hover:scale-110"
          />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-32 bg-gradient-to-t from-[#1c140f] to-transparent blur-xl"></div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-amber-300">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-amber-400 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-amber-400 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
