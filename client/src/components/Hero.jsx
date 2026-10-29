import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUp, FiPlus, FiArrowUpRight } from 'react-icons/fi';
import heroImage from '../assets/Serene Cherry Blossom Sunrise Promenade.png';

const samplePrompts = [
  'Create a sprint plan for the upcoming release with task owners and deadlines.',
  'Break down the authentication feature into tasks and subtasks.',
  'Draft an engineering note documenting our project architecture and API design.',
  'Create a bug-fixing backlog and prioritize issues by severity.',
  'Set up project tasks for frontend and backend teams with clear ownership.',
  'Review all in-progress tasks and identify blockers before sprint completion.',
  'Create subtasks for JWT authentication, token validation, and role-based access.',
  'Prepare a release checklist covering testing, security, and deployment.',
];

const Hero = () => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [taskPrompt, setTaskPrompt] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = samplePrompts[currentPromptIndex];
    let timer;

    if (!isDeleting) {
      if (!currentFullText.startsWith(taskPrompt)) {
        timer = setTimeout(() => {
          setTaskPrompt((prev) => prev.slice(0, -1));
        }, 15);
      } else if (taskPrompt.length < currentFullText.length) {
        const delay = taskPrompt.length === 0 ? 350 : 35;
        timer = setTimeout(() => {
          setTaskPrompt(currentFullText.slice(0, taskPrompt.length + 1));
        }, delay);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (taskPrompt.length > 0) {
        timer = setTimeout(() => {
          setTaskPrompt((prev) => prev.slice(0, -1));
        }, 18);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(false);
          setCurrentPromptIndex((prev) => (prev + 1) % samplePrompts.length);
        }, 400);
      }
    }

    return () => clearTimeout(timer);
  }, [taskPrompt, isDeleting, currentPromptIndex]);

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

            {/* Subtle Gradient Shade for contrast at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            {/* Overlaid Interactive Prompt / Task Box */}
            <div className="absolute inset-x-4 bottom-6 sm:bottom-10 md:bottom-12 flex justify-center z-10">
              <div className="w-full max-w-2xl bg-white/95 backdrop-blur-md border border-[#ebebeb] rounded-xl shadow-xl p-2.5 sm:p-3.5 transition-all">
                <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center gap-2">
                  
                  {/* Plus Icon Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsDeleting(false);
                      setTaskPrompt('');
                      setCurrentPromptIndex((prev) => (prev + 1) % samplePrompts.length);
                    }}
                    title="Cycle suggested prompt"
                    className="p-2 text-[#4d4d4d] hover:text-[#171717] hover:bg-[#f2f2f2] rounded-lg transition-colors focus:outline-none"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>

                  {/* Input field (Display showcase with typewriter blinker) */}
                  <div
                    id="hero-interactive-task-input"
                    role="textbox"
                    aria-readonly="true"
                    className="flex-1 min-w-0 bg-transparent border-none text-xs sm:text-sm text-[#171717] px-1 flex items-center select-none cursor-default overflow-hidden whitespace-nowrap"
                  >
                    {taskPrompt ? (
                      <div className="flex items-center min-w-0 overflow-hidden">
                        <span className="truncate">{taskPrompt}</span>
                        <span className="inline-block w-[1.5px] sm:w-[2px] h-3.5 sm:h-4 bg-[#171717] ml-[1.5px] animate-cursor-blink shrink-0" />
                      </div>
                    ) : (
                      <div className="flex items-center text-[#a1a1a1] min-w-0">
                        <span className="inline-block w-[1.5px] sm:w-[2px] h-3.5 sm:h-4 bg-[#171717] mr-[2px] animate-cursor-blink shrink-0" />
                        <span className="truncate">Enter project task or sprint backlog...</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button (Display-only showcase) */}
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    id="hero-interactive-submit-btn"
                    className="w-8 h-8 rounded-lg bg-[#c85a32] text-white flex items-center justify-center shadow-xs cursor-default select-none pointer-events-none focus:outline-none"
                  >
                    <FiArrowUp className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Docked 3-Column Feature Grid directly beneath image */}
          <div className="border-t border-[#ebebeb] grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#ebebeb] bg-white text-left">
            
            {/* Feature 1 */}
            <div className="p-6 flex flex-col justify-between hover:bg-[#fcfcfc] transition-colors group">
              <div>
                <h3 className="font-semibold text-sm text-[#171717] tracking-tight">
                  Task & Subtask Matrix
                </h3>
                <p className="mt-2 text-xs text-[#4d4d4d] leading-relaxed">
                  Break complex projects into manageable tasks and nested subtasks. Track progress through Todo, In Progress, and Done statuses.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#f2f2f2] flex items-center justify-between">
                <Link 
                to="/features"
                className="font-mono-eyebrow text-[#8f8f8f] group-hover:text-[#171717] transition-colors">
                  TASK MANAGEMENT
                </Link>
                <FiArrowUpRight className="w-3.5 h-3.5 text-[#8f8f8f] group-hover:text-[#171717] transition-colors" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 flex flex-col justify-between hover:bg-[#fcfcfc] transition-colors group">
              <div>
                <h3 className="font-semibold text-sm text-[#171717] tracking-tight">
                  Role-Based Access
                </h3>
                <p className="mt-2 text-xs text-[#4d4d4d] leading-relaxed">
                   Manage project permissions with role-based access. Control who can manage projects, assign tasks, and collaborate with your team.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#f2f2f2] flex items-center justify-between">
                <Link 
                to="/features"
                className="font-mono-eyebrow text-[#8f8f8f] group-hover:text-[#171717] transition-colors">
                  ACCESS CONTROL
                </Link>
                <FiArrowUpRight className="w-3.5 h-3.5 text-[#8f8f8f] group-hover:text-[#171717] transition-colors" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 flex flex-col justify-between hover:bg-[#fcfcfc] transition-colors group">
              <div>
                <h3 className="font-semibold text-sm text-[#171717] tracking-tight">
                  Integrated Project Notes
                </h3>
                <p className="mt-2 text-xs text-[#4d4d4d] leading-relaxed">
                  Keep project requirements, technical decisions, and implementation notes alongside your work instead of scattering context across tools.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#f2f2f2] flex items-center justify-between">
                <Link 
                to="/features"
                className="font-mono-eyebrow text-[#8f8f8f] group-hover:text-[#171717] transition-colors">
                  PROJECT DOCUMENTATION
                </Link>
                <FiArrowUpRight className="w-3.5 h-3.5 text-[#8f8f8f] group-hover:text-[#171717] transition-colors" />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;
