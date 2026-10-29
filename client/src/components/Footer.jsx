import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaTwitter,
  FaLinkedin,
  FaGithub,
} from 'react-icons/fa6';
import logo from '../assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: 'Features', to: '/features' },
    { label: 'Pricing', to: '/pricing' },
    { label: 'How it works', to: '/how-it-works' },
    { label: 'Log In', to: '/login' },
    { label: 'Get Started', to: '/signup' },
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      icon: FaGithub,
      href: 'https://github.com/imrohittsingh-rs',
    },
    {
      name: 'Twitter / X',
      icon: FaTwitter,
      href: 'https://twitter.com/imrohittsingh',
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      href: 'https://linkedin.com/in/imrohittsingh',
    },
  ];

  return (
    <footer className="w-full bg-[#fafafa] pt-6 sm:pt-8 pb-12 px-4 sm:px-6 lg:px-8 text-[#4d4d4d] font-geist">
      <div className="max-w-6xl mx-auto">
        <div className="w-full border-t border-dotted border-[#dcdcdc] mb-8 sm:mb-10" />

        {/* Footer content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 text-xs text-[#8f8f8f]">
          {/* Logo and copyright */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 focus:outline-none group mb-1.5"
              aria-label="Projectub Home"
            >
              <img
                src={logo}
                alt="Projectub Logo"
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain transition-transform duration-200 group-hover:scale-105"
              />
              <span className="font-semibold text-base sm:text-[17px] tracking-tight text-[#171717]">
                Projectub
              </span>
            </Link>
            <p className="select-none text-center md:text-left text-xs text-[#8f8f8f]">
              &copy; {currentYear} Projectub
            </p>
          </div>

          {/* Navigation links */}
          <nav
            aria-label="Footer Navigation"
            className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-2.5"
          >
            {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-xs sm:text-[13px] text-[#4d4d4d] hover:text-[#171717] transition-colors duration-150"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Social Icons */}
          <div className="flex items-center gap-4 text-[#737373]">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="p-1 hover:text-[#171717] transition-colors duration-150 focus:outline-none"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;