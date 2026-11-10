import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import heroImage from '../assets/Serene Cherry Blossom Sunrise Promenade.png';
import logoImage from '../assets/logo.png';

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
            to="/how-it-works"
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#171717] bg-white border border-[#ebebeb] hover:border-[#d4d4d4] hover:bg-[#f9f9f9] rounded-md shadow-2xs transition-all"
          >
            Explore Platform
          </Link>
          <Link
            to="/signup"
            id="hero-signup-btn"
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#171717] hover:bg-[#2b2b2b] rounded-md shadow-xs transition-all"
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

          {/* Docked 3-Column Feature Grid directly beneath image */}
          <div className="grid grid-cols-1 divide-y divide-[#ebebeb] bg-white text-left md:grid-cols-3 md:divide-x md:divide-y-0">
            
            {/* Feature 1 */}
            <Link to="/features" className="group flex min-h-52 flex-col justify-between p-6 transition-colors hover:bg-[#fcfcfc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0070f3]">
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-mono-eyebrow text-[#8f8f8f]">01 / WORKFLOW</span>
                  <FiArrowUpRight aria-hidden="true" className="h-4 w-4 text-[#8f8f8f] transition-colors group-hover:text-[#171717]" />
                </div>
                <h3 className="text-base font-semibold tracking-[-0.4px] text-[#171717]">Task &amp; Subtask Matrix</h3>
                <p className="mt-2 text-sm leading-5 text-[#4d4d4d]">
                  Break complex projects into manageable tasks and nested subtasks. Track progress through Todo, In Progress, and Done statuses.
                </p>
              </div>
              <span className="mt-5 border-t border-[#f2f2f2] pt-3 font-mono-eyebrow text-[#8f8f8f]">TASK MANAGEMENT</span>
            </Link>

            {/* Feature 2 */}
            <Link to="/features" className="group flex min-h-52 flex-col justify-between p-6 transition-colors hover:bg-[#fcfcfc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0070f3]">
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-mono-eyebrow text-[#8f8f8f]">02 / PERMISSIONS</span>
                  <FiArrowUpRight aria-hidden="true" className="h-4 w-4 text-[#8f8f8f] transition-colors group-hover:text-[#171717]" />
                </div>
                <h3 className="text-base font-semibold tracking-[-0.4px] text-[#171717]">Role-Based Access</h3>
                <p className="mt-2 text-sm leading-5 text-[#4d4d4d]">
                  Manage project permissions with role-based access. Control who can manage projects, assign tasks, and collaborate with your team.
                </p>
              </div>
              <span className="mt-5 border-t border-[#f2f2f2] pt-3 font-mono-eyebrow text-[#8f8f8f]">ACCESS CONTROL</span>
            </Link>

            {/* Feature 3 */}
            <Link to="/features" className="group flex min-h-52 flex-col justify-between p-6 transition-colors hover:bg-[#fcfcfc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0070f3]">
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-mono-eyebrow text-[#8f8f8f]">03 / CONTEXT</span>
                  <FiArrowUpRight aria-hidden="true" className="h-4 w-4 text-[#8f8f8f] transition-colors group-hover:text-[#171717]" />
                </div>
                <h3 className="text-base font-semibold tracking-[-0.4px] text-[#171717]">Integrated Project Notes</h3>
                <p className="mt-2 text-sm leading-5 text-[#4d4d4d]">
                  Keep project requirements, technical decisions, and implementation notes alongside your work instead of scattering context across tools.
                </p>
              </div>
              <span className="mt-5 border-t border-[#f2f2f2] pt-3 font-mono-eyebrow text-[#8f8f8f]">PROJECT DOCUMENTATION</span>
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;
