import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import heroImage from '../assets/Serene Cherry Blossom Sunrise Promenade.png';

const Hero = () => {
  return (
    <section className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-[#fafafa]">
      
      {/* Container for Headline & Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Display Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.04em] text-[#171717] leading-[1.08] max-w-4xl mx-auto">
          Project management for <span className="font-editorial-italic font-normal tracking-tight">teams</span> who <br className="hidden sm:inline" />
          build with <span className="font-editorial-italic font-normal tracking-tight">precision</span>
        </h1>

        {/* Sub-headline */}
        <p className="mt-6 text-sm sm:text-base md:text-[17px] text-[#4d4d4d] max-w-2xl mx-auto leading-relaxed">
          Manage projects, subtasks, and team notes in one workspace.
          <br className="hidden sm:inline" />
          Built for teams that ship.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/features"
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#171717] bg-white border border-[#ebebeb] hover:border-[#d4d4d4] hover:bg-[#f9f9f9] rounded-md shadow-2xs transition-colors"
          >
            Explore Platform
          </Link>
          <Link
            to="/signup"
            id="hero-signup-btn"
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#171717] hover:bg-[#2b2b2b] rounded-md shadow-xs transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Visual Hero Container with Image & Docked Cards */}
        <div className="mt-14 max-w-5xl mx-auto border border-[#ebebeb] rounded-xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          
          {/* Main Visual Image Banner */}
          <div className="relative w-full aspect-[16/9] max-h-[500px] overflow-hidden bg-[#f5f5f5]">
            <img
              src={heroImage}
              alt="Project Camp serene productive workspace landscape"
              className="w-full h-full object-cover object-center select-none"
              loading="eager"
            />

          </div>

          {/* Docked Cards */}
        </div>

      </div>
    </section>
  );
};

export default Hero;
