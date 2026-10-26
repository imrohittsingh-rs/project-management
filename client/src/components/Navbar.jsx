import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowUpRight,
  FiMenu,
  FiX
} from 'react-icons/fi';
import logo from "../assets/logo.png";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/[0.06] bg-white/40 backdrop-blur-md transition-all shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group focus:outline-none">
          <img src={logo} alt="logo" className="w-13 h-13" />
          <span className="font-geist font-semibold tracking-widest text-xs sm:text-lg uppercase text-[#171717]">
            Projectub
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 absolute left-1/2 -translate-x-1/2">

          <Link
            to="/features"
            className="px-3 py-1.5 text-xs uppercase font-medium tracking-wide text-[#4d4d4d] hover:text-[#171717] rounded-md transition-colors"
          >
            Features
          </Link>

          <Link
            to="/pricing"
            className="px-3 py-1.5 text-xs uppercase font-medium tracking-wide text-[#4d4d4d] hover:text-[#171717] rounded-md transition-colors"
          >
            Pricing
          </Link>

          <Link
            to="/how-it-works"
            className="px-3 py-1.5 text-xs uppercase font-medium tracking-wide text-[#4d4d4d] hover:text-[#171717] rounded-md transition-colors"
          >
            How it works
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center space-x-3">
          <Link
            to="/login"
            className="px-3.5 py-1.5 text-xs uppercase font-semibold tracking-wider text-[#171717] bg-white border border-[#ebebeb] hover:border-[#d4d4d4] hover:bg-[#f9f9f9] rounded-md transition-all shadow-2xs"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="px-3.5 py-1.5 text-xs uppercase font-semibold tracking-wider text-white bg-[#171717] hover:bg-[#2e2e2e] rounded-md transition-all shadow-xs"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#4d4d4d] hover:text-[#171717] rounded-md focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black/[0.06] bg-white/80 backdrop-blur-xl px-4 pt-3 pb-5 space-y-3">
          <div className="space-y-1">
            <Link
              to="/features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs uppercase font-medium tracking-wide text-[#4d4d4d] hover:text-[#171717] rounded-md hover:bg-white"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs uppercase font-medium tracking-wide text-[#4d4d4d] hover:text-[#171717] rounded-md hover:bg-white"
            >
              Pricing
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs uppercase font-medium tracking-wide text-[#4d4d4d] hover:text-[#171717] rounded-md hover:bg-white"
            >
              How it works
            </Link>
          </div>

          <div className="pt-3 border-t border-[#ebebeb] flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-xs uppercase font-semibold tracking-wider text-[#171717] bg-white border border-[#ebebeb] rounded-md"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-xs uppercase font-semibold tracking-wider text-white bg-[#171717] rounded-md"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;