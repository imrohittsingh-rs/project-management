import React from "react";
import { Link } from "react-router-dom";
import { FaTwitter, FaLinkedin, FaGithub, FaArrowRight } from "react-icons/fa6";
import logo from "../assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", to: "/features" },
        { label: "Pricing Plans", to: "/pricing" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Help & Support", to: "/contact" },
        { label: "FAQ", to: "/features" },
        { label: "Contact Us", to: "/contact" },
      ],
    },
    {
      title: "Account",
      links: [
        { label: "Log In", to: "/login" },
        { label: "Get Started", to: "/signup" },
        { label: "Dashboard", to: "/dashboard" },
        { label: "Forgot Password", to: "/contact" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", to: "/features" },
        { label: "Contact", to: "/contact" },
        {
          label: "GitHub",
          href: "https://github.com/imrohittsingh-rs",
          external: true,
        },
        {
          label: "Twitter / X",
          href: "https://twitter.com/imrohittsingh",
          external: true,
        },
        {
          label: "LinkedIn",
          href: "https://linkedin.com/in/imrohittsingh",
          external: true,
        },
      ],
    },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      icon: FaGithub,
      href: "https://github.com/imrohittsingh-rs",
    },
    {
      name: "Twitter / X",
      icon: FaTwitter,
      href: "https://twitter.com/imrohittsingh",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      href: "https://linkedin.com/in/imrohittsingh",
    },
  ];

  return (
    <footer className="w-full bg-[#fafafa] pt-12 sm:pt-16 pb-4 sm:pb-6 px-4 sm:px-6 lg:px-8 text-[#4d4d4d] font-geist overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="w-full border-t border-[#ebebeb] mb-10 sm:mb-14" />

        {/* Main Footer Grid */}
        <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-16">
          {/* Left Column: Brand, Tagline, CTA & Meta */}
          <div className="flex flex-col items-start gap-4 max-w-sm">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 focus:outline-none group"
              aria-label="Projectub Home"
            >
              <img
                src={logo}
                alt="Projectub Logo"
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain transition-transform duration-200 group-hover:scale-105"
              />
              <span className="font-semibold text-base sm:text-lg tracking-tight text-[#171717]">
                Projectub
              </span>
            </Link>

            <p className="text-xs sm:text-[13px] text-[#666666] leading-relaxed">
              Organize projects, manage tasks and subtasks, track progress, and
              collaborate with your team efficiently.
            </p>

            {/* Pill CTA button matching reference */}
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#171717] hover:bg-black text-white text-xs sm:text-[13px] font-medium transition-all shadow-sm group"
            >
              <span>Get Started Free</span>
              <FaArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </Link>

            {/* Social channels row */}
            <div className="flex items-center gap-2 text-xs text-[#737373] pt-1">
              <span className="text-[11px] text-[#8f8f8f]">Follow us</span>
              <div className="flex items-center gap-1">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="p-1.5 rounded-md hover:text-[#171717] hover:bg-[#ededed] transition-colors focus:outline-none"
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Columns: Multi-column Links Grid */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-10">
            {footerSections.map((section) => (
              <div key={section.title} className="flex flex-col gap-3">
                <h3 className="text-xs sm:text-[13px] font-semibold text-[#171717] tracking-tight">
                  {section.title}
                </h3>
                <ul className="flex flex-col gap-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-[13px] text-[#666666] hover:text-[#171717] transition-colors duration-150 block"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          to={link.to}
                          className="text-xs sm:text-[13px] text-[#666666] hover:text-[#171717] transition-colors duration-150 block"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="w-full border-t border-[#ebebeb] mt-12 sm:mt-16 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8f8f8f]">
          <p className="select-none text-center sm:text-left">
            &copy; {currentYear} Projectub. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-[11px] text-[#8f8f8f]">
            <span>With ❤ by Rohit Singh</span>
          </div>
        </div>
      </div>

      {/* Large watermark text effect */}
      <div
        aria-hidden="true"
        className="w-full flex justify-center items-center overflow-hidden select-none pointer-events-none mt-8 sm:mt-12 -mb-2 sm:-mb-4"
      >
        <span className="inline-block font-geist font-extrabold tracking-tighter leading-[0.8] whitespace-nowrap text-center select-none footer-watermark-text">
          projectub
        </span>
      </div>
    </footer>
  );
};

export default Footer;
