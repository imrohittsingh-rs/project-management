import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#f3f4f8] text-gray-500 border-t border-gray-200/70 py-4 font-sans mt-auto">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/Images/image.png"
              alt="Project Camp"
              className="w-7 h-7 object-contain rounded-md"
            />
            <span className="text-sm font-semibold text-gray-900 tracking-tight">
              Project<span className="text-gray-950">Camp</span>
            </span>
          </div>

          <p className="text-xs text-gray-500 text-center">
            &copy; {new Date().getFullYear()} Project Camp
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
