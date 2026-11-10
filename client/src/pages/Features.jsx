import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiCheckSquare,
  FiUsers,
  FiFileText,
  FiLock,
  FiRefreshCw,
  FiMail,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
} from 'react-icons/fi';
import { motion as Motion, AnimatePresence } from 'motion/react';

const features = [
  {
    id: 'tasks',
    icon: FiCheckSquare,
    title: 'Task & Subtask Management',
    description:
      'Create tasks with descriptions, priority levels, and assignees. Break complex work into granular subtasks with individual completion tracking. A 3-state system (Todo, In Progress, Done) keeps your velocity clear.',
    tag: 'TASK MANAGEMENT',
    highlights: [
      'Subtasks with independent checklist states',
      'Assignee attribution & file attachments',
      'Three-state progress tracking: Todo, In Progress, Done',
    ],
  },
  {
    id: 'access',
    icon: FiUsers,
    title: 'Role-Based Team Access',
    description:
      'A structured three-tier permission matrix: Admin, Project Admin, and Member. Admins govern workspace membership, Project Admins structure deliverables, and Members execute with focused access.',
    tag: 'ACCESS CONTROL',
    highlights: [
      'Admin: Full workspace, role, and deletion authority',
      'Project Admin: Task creation, edits, and subtask management',
      'Member: Focused execution, subtask completion, and read access',
    ],
  },
  {
    id: 'notes',
    icon: FiFileText,
    title: 'Embedded Project Notes',
    description:
      'Attach structured architectural notes, meeting logs, and technical decisions directly to projects. Keep implementation context living alongside your tasks without needing third-party wikis.',
    tag: 'DOCUMENTATION',
    highlights: [
      'Attached directly to project IDs with role verification',
      'Persistent record of architectural choices and guidelines',
      'Instant access for all project contributors',
    ],
  },
  {
    id: 'security',
    icon: FiLock,
    title: 'Secure Authentication & Verification',
    description:
      'Robust JWT-based authentication with token refresh mechanisms. Mandatory email verification secures account creation, and password reset flows ensure complete account safety.',
    tag: 'SECURITY',
    highlights: [
      'JWT access tokens with secure refresh rotation',
      'Cryptographic email verification on signup',
      'Granular role-aware endpoint middleware protection',
    ],
  },
  {
    id: 'dashboard',
    icon: FiRefreshCw,
    title: 'Real-Time Project Overview',
    description:
      'An instant snapshot of every project across your team. Track completion ratios, monitor in-flight tasks, and spot blockers across your entire workspace in a single view.',
    tag: 'DASHBOARD',
    highlights: [
      'Consolidated metrics across all joined projects',
      'Instant visibility into Todo, In Progress, and Done items',
      'One-click navigation directly into project workspaces',
    ],
  },
  {
    id: 'collaboration',
    icon: FiMail,
    title: 'Member Invitations & Lifecycle',
    description:
      'Invite team members to workspaces by email with assigned roles. Change permissions or revoke access at any point to maintain strict organizational control.',
    tag: 'COLLABORATION',
    highlights: [
      'Email-based invitations with pre-configured roles',
      'Instant membership updates without account recreation',
      'Centralized member roster per project',
    ],
  },
];

const Features = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const currentFeature = features[activeIndex];

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % features.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const handleSelectTab = (index) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (dir) => ({
      x: dir < 0 ? 80 : -80,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#171717] font-geist selection:bg-[#171717] selection:text-white">
      {/* Header section */}
      <section className="border-b border-[#ebebeb] bg-[#fafafa] px-4 py-16 text-center sm:px-8">
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl"
        >
          <p className="font-mono-eyebrow text-[#8f8f8f]">Platform</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#171717] sm:text-5xl">
            Everything your team needs
          </h1>
          <p className="mt-4 text-base text-[#4d4d4d] leading-relaxed">
            Projectub is a focused project management platform built for teams that ship. No bloat. Just the tools that matter.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 h-10 px-5 text-sm font-medium rounded-[6px] bg-[#171717] text-white hover:bg-[#333333] transition-colors shadow-xs"
            >
              Get Started
              <FiArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center h-10 px-5 text-sm font-medium rounded-[6px] bg-white text-[#171717] border border-[#ebebeb] hover:bg-[#fafafa] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </Motion.div>
      </section>

      {/* Feature Carousel Section */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-8">
        {/* Navigation Category Tabs */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 gap-1.5 scrollbar-none">
          {features.map((item, index) => {
            const isCurrent = index === activeIndex;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(index)}
                className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 cursor-pointer ${
                  isCurrent
                    ? 'text-white'
                    : 'text-[#525252] hover:text-[#171717] hover:bg-black/[0.04]'
                }`}
              >
                {isCurrent && (
                  <Motion.div
                    layoutId="activeFeaturePill"
                    className="absolute inset-0 bg-[#171717] rounded-full z-0"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <item.icon className="w-3.5 h-3.5" />
                  {item.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Carousel Showcase Card */}
        <div className="relative mt-6 rounded-2xl border border-[#ebebeb] bg-white shadow-[0_12px_36px_-6px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="p-6 sm:p-10 min-h-[440px] flex items-center">
            <AnimatePresence mode="wait" custom={direction}>
              <Motion.div
                key={currentFeature.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12"
              >
                <div className="flex flex-col justify-center lg:col-span-6">
                  <div className="inline-flex w-fit items-center gap-2 text-[#4d4d4d]">
                    <currentFeature.icon aria-hidden="true" className="h-4 w-4 text-[#171717]" />
                    <span className="font-mono-eyebrow text-[#4d4d4d]">{currentFeature.tag}</span>
                  </div>
                  <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-1.28px] text-[#171717] sm:text-4xl">
                    {currentFeature.title}
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-6 text-[#4d4d4d]">
                    {currentFeature.description}
                  </p>
                </div>
                <div className="border-t border-[#ebebeb] pt-5 lg:col-span-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                  <p className="mb-4 font-mono-eyebrow text-[#4d4d4d]">Included</p>
                  <ul className="space-y-4">
                    {currentFeature.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-3 text-base leading-6 text-[#4d4d4d]">
                        <FiCheck aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[#171717]" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Bottom Control Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#fafafa] border-t border-[#ebebeb]">
            {/* Step Indicators */}
            <div className="flex items-center gap-1.5">
              {features.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectTab(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    i === activeIndex
                      ? 'w-6 bg-[#171717]'
                      : 'w-1.5 bg-[#d4d4d8] hover:bg-[#a1a1aa]'
                  }`}
                />
              ))}
              <span className="ml-3 text-xs font-mono text-[#8f8f8f]">
                0{activeIndex + 1} / 0{features.length}
              </span>
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous feature"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#ebebeb] bg-white text-[#171717] hover:bg-[#f0f0f0] transition-colors cursor-pointer shadow-2xs"
              >
                <FiChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next feature"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#ebebeb] bg-white text-[#171717] hover:bg-[#f0f0f0] transition-colors cursor-pointer shadow-2xs"
              >
                <FiChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Features;
