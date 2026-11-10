import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion as Motion } from 'motion/react';
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiCheck,
  FiCreditCard,
  FiSettings,
  FiFileText,
} from 'react-icons/fi';
import logo from "../assets/logo.png";
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isVerified = Boolean(user?.isEmailVerified);
  const avatarUrl = user?.avatar?.url || (typeof user?.avatar === 'string' ? user.avatar : '');

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
    <header className="sticky top-0 z-50 w-full border-b border-black/6 bg-white/70 backdrop-blur-md transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
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
            <NavLink
              key={link.name}
              to={link.to}
            >
              {({ isActive }) => (
                <span className="relative block rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-wide">
                  {isActive && (
                    <Motion.span
                      layoutId="desktop-navbar-active-pill"
                      className="absolute inset-0 rounded-full bg-[#f2f2f2]"
                      transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 transition-colors ${isActive ? 'text-[#171717]' : 'text-[#4d4d4d] hover:text-[#171717]'}`}>
                    {link.name}
                  </span>
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              {/* Trigger Button: User Name + Email on Left, Avatar on Right */}
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 py-1 px-1 text-[#171717] hover:opacity-90 transition-opacity cursor-pointer focus:outline-none"
                aria-expanded={profileDropdownOpen}
                aria-haspopup="true"
                id="profile-menu-button"
              >

                {/* Avatar with Verified / Unverified Ring & Badge on the Right */}
                <div className="relative shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full overflow-hidden p-[1.5px] transition-colors ${
                      isVerified
                        ? 'ring-2 ring-[#0d9488] ring-offset-1 bg-white'
                        : 'ring-2 ring-amber-500 ring-offset-1 bg-white'
                    }`}
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={user.fullName || user.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-[#171717] text-white flex items-center justify-center text-[11px] font-semibold tracking-wide">
                        {getInitials()}
                      </div>
                    )}
                  </div>

                  {/* Verification Status Badge */}
                  {isVerified ? (
                    <div
                      title="Email verified"
                      className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#0d9488] border-[1.5px] border-white flex items-center justify-center shadow-xs"
                    >
                      <FiCheck className="w-2 h-2 text-white stroke-[3.5]" />
                    </div>
                  ) : (
                    <div
                      title="Email not verified"
                      className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-amber-500 border-[1.5px] border-white flex items-center justify-center shadow-xs"
                    >
                      <span className="text-[8px] font-bold text-white leading-none">!</span>
                    </div>
                  )}
                </div>
              </button>

              {/* Profile Dropdown Menu - Kokonut UI Two-Card Layout */}
              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2.5 w-[280px] z-50 flex flex-col gap-2 animate-in fade-in slide-in-from-top-1 duration-150"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="profile-menu-button"
                >
                  {/* Bottom Card: Menu Actions */}
                  <div className="bg-white border border-[#e5e5e7] rounded-2xl p-2.5 shadow-[0_12px_32px_rgba(0,0,0,0.08)] flex flex-col gap-1">
                    {/* 1. Profile */}
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#f4f4f5] text-sm text-[#18181b] font-medium transition-colors"
                      role="menuitem"
                    >
                      <FiUser className="w-4 h-4 text-[#18181b]" />
                      <span>Profile</span>
                    </Link>

                    {/* 3. Subscription */}
                    <Link
                      to="/pricing"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#f4f4f5] text-sm text-[#18181b] font-medium transition-colors"
                      role="menuitem"
                    >
                      <div className="flex items-center gap-3">
                        <FiCreditCard className="w-4 h-4 text-[#18181b]" />
                        <span>Subscription</span>
                      </div>
                    </Link>

                    {/* 4. Settings */}
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#f4f4f5] text-sm text-[#18181b] font-medium transition-colors"
                      role="menuitem"
                    >
                      <FiSettings className="w-4 h-4 text-[#18181b]" />
                      <span>Settings</span>
                    </Link>

                    {/* 6. Sign Out Button */}
                    <div className="pt-1.5 mt-1 border-t border-[#f4f4f5]">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#fee2e2]/60 hover:bg-[#fee2e2] text-[#ef4444] text-sm font-medium transition-colors cursor-pointer text-left"
                        role="menuitem"
                      >
                        <FiLogOut className="w-4 h-4 text-[#ef4444]" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs uppercase font-semibold tracking-wider text-[#171717] bg-white border border-[#ebebeb] hover:border-[#d4d4d4] hover:bg-[#f9f9f9] rounded-md transition-colors shadow-2xs"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-3.5 py-1.5 text-xs uppercase font-semibold tracking-wider text-white bg-[#171717] hover:bg-[#2e2e2e] rounded-md transition-colors shadow-xs"
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
            className="flex h-11 w-11 items-center justify-center rounded-md text-[#4d4d4d] transition-colors hover:bg-[#fafafa] hover:text-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0070f3]"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="md:hidden border-t border-black/6 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-3">
          {/* User profile banner on mobile */}
          {user && (
            <div className="flex items-center gap-3 p-3 bg-[#fafafa] border border-[#ebebeb] rounded-lg mb-2">
              <div className="relative shrink-0">
                <div
                  className={`w-9 h-9 rounded-full overflow-hidden p-[2px] transition-colors ${
                    isVerified
                      ? 'ring-2 ring-[#0d9488] ring-offset-1 bg-white'
                      : 'ring-2 ring-amber-500 ring-offset-1 bg-white'
                  }`}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user.fullName || user.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#171717] text-white flex items-center justify-center text-xs font-semibold">
                      {getInitials()}
                    </div>
                  )}
                </div>
                {isVerified ? (
                  <div
                    title="Email verified"
                    className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#0d9488] border-2 border-white flex items-center justify-center shadow-xs"
                  >
                    <FiCheck className="w-2.5 h-2.5 text-white stroke-[3.5]" />
                  </div>
                ) : (
                  <div
                    title="Email not verified"
                    className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center shadow-xs"
                  >
                    <span className="text-[9px] font-bold text-white leading-none">!</span>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-semibold text-[#171717] truncate">
                    {user.fullName || user.username}
                  </p>
                </div>
                <p className="text-[11px] text-[#8f8f8f] truncate">{user.email}</p>
              </div>
            </div>
          )}

          <div className="space-y-1">
            {user && (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-11 items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-[#18181b] transition-colors hover:bg-black/4"
                >
                  <FiUser className="w-4 h-4 text-[#71717a]" />
                  <span>Profile</span>
                </Link>
                <Link
                  to="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-11 items-center justify-between rounded-md px-3 py-2 text-xs font-medium text-[#18181b] transition-colors hover:bg-black/4"
                >
                  <div className="flex items-center gap-2.5">
                    <FiCreditCard className="w-4 h-4 text-[#71717a]" />
                    <span>Subscription</span>
                  </div>
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-11 items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-[#18181b] transition-colors hover:bg-black/4"
                >
                  <FiSettings className="w-4 h-4 text-[#71717a]" />
                  <span>Settings</span>
                </Link>
                <div className="border-t border-[#ebebeb] my-1 pt-1" />
              </>
            )}
            {navlinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
              >
                {({ isActive }) => (
                  <span className="relative flex min-h-11 items-center rounded-full px-3 py-2 text-xs font-medium uppercase tracking-wide">
                    {isActive && (
                      <Motion.span
                        layoutId="mobile-navbar-active-pill"
                        className="absolute inset-0 rounded-full bg-[#f2f2f2]"
                        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                      />
                    )}
                    <span className={`relative z-10 ${isActive ? 'text-[#171717]' : 'text-[#4d4d4d]'}`}>
                      {link.name}
                    </span>
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          <div className="pt-3 border-t border-[#ebebeb] flex flex-col gap-2">
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-[#fef2f2] py-2.5 text-xs font-medium text-[#ef4444] transition-colors hover:bg-[#fee2e2]"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-11 w-full items-center justify-center rounded-md border border-[#ebebeb] bg-white py-2 text-xs font-semibold uppercase tracking-wider text-[#171717]"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-11 w-full items-center justify-center rounded-md bg-[#171717] py-2 text-xs font-semibold uppercase tracking-wider text-white"
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
