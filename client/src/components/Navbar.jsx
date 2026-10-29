import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiGrid,
  FiChevronDown,
  FiPlus
} from 'react-icons/fi';
import logo from "../assets/logo.png";
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setProfileDropdownOpen(false);
      setMobileMenuOpen(false);
      navigate("/login");
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  const navlinks = [
    ...(user ? [{ name: "Dashboard", to: "/dashboard" }] : []),
    { name: "Features", to: "/features" },
    { name: "Pricing", to: "/pricing" },
    { name: "How it works", to: "/how-it-works" },
  ];

  // Helper to extract initials
  const getInitials = () => {
    if (!user) return "U";
    if (user.fullName) {
      const parts = user.fullName.trim().split(" ");
      if (parts.length > 1) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return user.fullName.slice(0, 2).toUpperCase();
    }
    if (user.username) {
      return user.username.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/[0.06] bg-white/70 backdrop-blur-md transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group focus:outline-none">
          <img src={logo} alt="Projectub" className="w-10 h-10 object-contain" />
          <span className="font-geist font-semibold tracking-wider text-base sm:text-lg uppercase text-[#171717]">
            Projectub
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 absolute left-1/2 -translate-x-1/2">
          {navlinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className="px-3 py-1.5 text-xs uppercase font-medium tracking-wide text-[#4d4d4d] hover:text-[#171717] rounded-md transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-[#ebebeb] bg-white hover:border-[#d4d4d4] hover:bg-[#fafafa] transition-all text-[#171717] cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/5"
                aria-expanded={profileDropdownOpen}
                aria-haspopup="true"
                id="profile-menu-button"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName || user.username}
                    className="w-7 h-7 rounded-full object-cover border border-[#ebebeb]"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#171717] text-white flex items-center justify-center text-xs font-semibold tracking-wide">
                    {getInitials()}
                  </div>
                )}
                <span className="text-xs font-medium text-[#171717] max-w-[120px] truncate">
                  {user.fullName || user.username}
                </span>
                <FiChevronDown
                  className={`w-3.5 h-3.5 text-[#8f8f8f] transition-transform duration-150 ${
                    profileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white border border-[#ebebeb] rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="profile-menu-button"
                >
                  {/* User info card */}
                  <div className="px-3.5 py-2.5 border-b border-[#f2f2f2]">
                    <p className="text-xs font-semibold text-[#171717] truncate">
                      {user.fullName || user.username}
                    </p>
                    <p className="text-[11px] text-[#8f8f8f] truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#4d4d4d] hover:text-[#171717] hover:bg-[#fafafa] transition-colors"
                      role="menuitem"
                    >
                      <FiGrid className="w-4 h-4 text-[#8f8f8f]" />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      to="/dashboard"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#4d4d4d] hover:text-[#171717] hover:bg-[#fafafa] transition-colors"
                      role="menuitem"
                    >
                      <FiPlus className="w-4 h-4 text-[#8f8f8f]" />
                      <span>Projects</span>
                    </Link>
                  </div>

                  <div className="border-t border-[#f2f2f2] pt-1 mt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#ee0000] hover:bg-[#fff5f5] transition-colors text-left cursor-pointer"
                      role="menuitem"
                    >
                      <FiLogOut className="w-4 h-4 text-[#ee0000]" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs uppercase font-semibold tracking-wider text-[#171717] bg-white border border-[#ebebeb] hover:border-[#d4d4d4] hover:bg-[#f9f9f9] rounded-[6px] transition-all shadow-2xs"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-3.5 py-1.5 text-xs uppercase font-semibold tracking-wider text-white bg-[#171717] hover:bg-[#2e2e2e] rounded-[6px] transition-all shadow-xs"
              >
                Sign Up
              </Link>
            </>
          )}
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
        <div className="md:hidden border-t border-black/[0.06] bg-white/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-3">
          {/* User profile banner on mobile */}
          {user && (
            <div className="flex items-center gap-3 p-3 bg-[#fafafa] border border-[#ebebeb] rounded-lg mb-2">
              <div className="w-9 h-9 rounded-full bg-[#171717] text-white flex items-center justify-center text-xs font-semibold">
                {getInitials()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#171717] truncate">
                  {user.fullName || user.username}
                </p>
                <p className="text-[11px] text-[#8f8f8f] truncate">{user.email}</p>
              </div>
            </div>
          )}

          <div className="space-y-1">
            {user && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs uppercase font-medium tracking-wide text-[#171717] bg-black/[0.03] rounded-md"
              >
                <FiGrid className="w-4 h-4 text-[#171717]" />
                Dashboard
              </Link>
            )}
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
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-center py-2 text-xs uppercase font-semibold tracking-wider text-[#ee0000] bg-white border border-[#ebebeb] rounded-md hover:bg-[#fff5f5] cursor-pointer"
              >
                Log Out
              </button>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;