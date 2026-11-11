import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const suggestions = [
  { name: 'Home', to: '/' },
  { name: 'Pricing', to: '/pricing' },
  { name: 'features', to: '/features' },
];

const NotFound = () => {
  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] overflow-y-auto flex flex-col items-center justify-center px-4 py-12 text-center font-geist">
      <div className="flex flex-col items-center max-w-md w-full">

        <span className="text-7xl sm:text-8xl md:text-9xl font-bold tracking-tight text-[#4a4a4a] select-none leading-none">
          404
        </span>

        <h1 className="mt-4 sm:mt-5 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          Page not found
        </h1>

        <p className="mt-3 text-sm sm:text-base text-[#8f8f8f] leading-relaxed max-w-xs sm:max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <p className="mt-10 mb-3 text-xs sm:text-sm text-[#737373]">
          You might be looking for:
        </p>

        <div className="w-full max-w-[340px] rounded-2xl border border-[#262626] bg-[#0c0c0c]/80 backdrop-blur-sm divide-y divide-[#1f1f1f] overflow-hidden text-left shadow-2xl">
          {suggestions.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className="group flex items-center justify-between px-5 py-3.5 text-sm text-[#e5e5e5] hover:text-white hover:bg-white/[0.04] transition-colors duration-150"
            >
              <span>{item.name}</span>
              <FiArrowRight className="w-4 h-4 text-[#737373] group-hover:text-white group-hover:translate-x-0.5 transition-[color,background-color,transform] duration-150" />
            </Link>
          ))}
        </div>

        <div className="w-full max-w-[340px] mt-3.5 grid grid-cols-2 gap-2.5">
          <Link
            to="/login"
            className="flex items-center justify-center py-2.5 px-4 text-xs sm:text-sm font-medium text-neutral-300 border border-[#262626] bg-[#0c0c0c]/80 hover:bg-white/[0.06] hover:text-white hover:border-[#383838] rounded-xl transition-colors duration-150"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="flex items-center justify-center py-2.5 px-4 text-xs sm:text-sm font-medium text-[#0a0a0a] bg-white hover:bg-neutral-200 rounded-xl transition-colors duration-150 shadow-sm"
          >
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
