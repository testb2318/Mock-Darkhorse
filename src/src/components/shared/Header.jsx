import React, { useEffect, useState } from "react";
import {UserPlus, User, X, Menu} from 'lucide-react'
import { Link } from "react-router-dom";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  // { name: "Blogs", href: "/blog" },
  { name: "Contact Us", href: "/contact" },
  { name: "Terms", href: "/terms" },
  { name: "Privacy", href: "/privacy" },
];

export default function Header() {
  const [activeTab, setActiveTab] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition duration-300 ${
        scrolled ? "bg-black backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="text-xl font-bold text-white drop-shadow-md">
          <img src="/logo.png" className="w-28"/>
        </div>

        {/* Center: Nav Items */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item, index) => (
            <Link to={item.href}
              key={index}
              onClick={() => setActiveTab(item)}
              className={`text-sm font-medium transition-all duration-200 ${
                activeTab === item
                  ? "text-white border-b-2 border-white"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right: Buttons */}
        <div className="hidden md:flex space-x-4 items-center">
          <Link to="/user/login" className="flex items-center space-x-1 px-4 py-2 text-white border border-white rounded hover:bg-white hover:text-black transition">
            <User className="text-sm" />
            <span>Sign In</span>
          </Link>
          <Link to="/register" className="flex items-center space-x-1 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition">
            <UserPlus className="text-sm" />
            <span>Sign Up</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black backdrop-blur-md px-4 pb-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item}
              to={item.href}
              onClick={() => {
                setActiveTab(item);
                setIsOpen(false);
              }}
              className={`block w-full text-left py-2 text-sm font-medium ${
                activeTab === item
                  ? "text-gray-300 font-semibold"
                  : "text-gray-300"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <div className="flex flex-col space-y-2 pt-2">
            <Link to="/user/login" className="flex items-center space-x-2 px-4 py-2 text-black border border-black rounded">
              <User className="text-sm" />
              <span>Sign In</span>
            </Link>
            <Link to="/register" className="flex items-center space-x-2 px-4 py-2 text-white bg-blue-600 rounded">
              <UserPlus className="text-sm" />
              <span>Sign Up</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
