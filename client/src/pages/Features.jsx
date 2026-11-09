import React, { useState, useEffect } from 'react';
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
  FiShield,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'motion/react';
import PlanComparisonTable from '../components/PlanComparisonTable';

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
    preview: {
      type: 'tasks',
      items: [
        { title: 'Implement refresh token rotation', status: 'Done', checked: true },
        { title: 'Project note access control middleware', status: 'In Progress', inProgress: true },
        { title: 'Multi-part file attachment handling', status: 'Todo', checked: false },
      ],
    },
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
    preview: {
      type: 'roles',
      roles: [
        { name: 'Admin', badge: 'Full Control', desc: 'Workspace settings & memberships' },
        { name: 'Project Admin', badge: 'Management', desc: 'Tasks, subtasks & sprint structure' },
        { name: 'Member', badge: 'Execution', desc: 'Status updates & task delivery' },
      ],
    },
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
    preview: {
      type: 'notes',
      title: 'API Architecture & Guidelines',
      content: 'All endpoints under /api/v1 require JWT bearer tokens. Project Admin role required for task mutations.',
      author: 'Admin Team',
    },
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
    preview: {
      type: 'security',
      badges: [
        { label: 'JWT Auth Tokens', status: 'Active' },
        { label: 'Email Token Verification', status: 'Verified' },
        { label: 'Role-based Middleware', status: 'Enforced' },
        { label: 'Secure Password Reset', status: 'Active' },
      ],
    },
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
    preview: {
      type: 'stats',
      metrics: [
        { label: 'Active Projects', count: 4, sub: 'All workspaces' },
        { label: 'In Progress', count: 14, sub: 'Currently active' },
        { label: 'Completed', count: 38, sub: 'Shipped to date' },
      ],
    },
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
    preview: {
      type: 'invite',
      email: 'alex.engineer@projectub.io',
      role: 'Project Admin',
      status: 'Joined',
    },
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

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
        <motion.div
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
        </motion.div>
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
                  <motion.div
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
              <motion.div
                key={currentFeature.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                {/* Left side: Feature Details */}
                <div className="lg:col-span-7 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#fafafa] border border-[#ebebeb] text-[#171717] w-fit">
                    <currentFeature.icon className="h-4 w-4 text-[#171717]" />
                    <span className="font-mono-eyebrow text-[#8f8f8f]">
                      {currentFeature.tag}
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717]">
                    {currentFeature.title}
                  </h2>

                  <p className="mt-3 text-sm sm:text-base text-[#4d4d4d] leading-relaxed">
                    {currentFeature.description}
                  </p>

                  {/* Highlights checklist */}
                  <div className="mt-6 pt-5 border-t border-[#f2f2f2]">
                    <ul className="space-y-2.5">
                      {currentFeature.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-[#404040]"
                        >
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#171717] text-white mt-0.5">
                            <FiCheck className="h-2.5 w-2.5 stroke-[3]" />
                          </span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right side: Interactive Visual Mock Preview */}
                <div className="lg:col-span-5 bg-[#fafafa] rounded-xl border border-[#ebebeb] p-5 shadow-2xs">
                  {currentFeature.preview.type === 'tasks' && (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between pb-2 border-b border-[#ebebeb]">
                        <span className="text-xs font-semibold text-[#171717]">Task Checklist</span>
                        <span className="text-[10px] text-[#8f8f8f]">Project #1</span>
                      </div>
                      {currentFeature.preview.items.map((item) => (
                        <div
                          key={item.title}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#ebebeb] shadow-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`h-4 w-4 rounded flex items-center justify-center text-[10px] ${
                                item.checked
                                  ? 'bg-[#171717] text-white'
                                  : 'border border-[#d4d4d4]'
                              }`}
                            >
                              {item.checked && '✓'}
                            </span>
                            <span
                              className={`text-xs truncate ${
                                item.checked ? 'line-through text-[#8f8f8f]' : 'text-[#171717]'
                              }`}
                            >
                              {item.title}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                              item.checked
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : item.inProgress
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-neutral-100 text-neutral-600'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentFeature.preview.type === 'roles' && (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between pb-2 border-b border-[#ebebeb]">
                        <span className="text-xs font-semibold text-[#171717]">Three-Tier Roles</span>
                        <span className="text-[10px] text-[#8f8f8f]">Access Matrix</span>
                      </div>
                      {currentFeature.preview.roles.map((role) => (
                        <div
                          key={role.name}
                          className="p-2.5 rounded-lg bg-white border border-[#ebebeb] shadow-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#171717]">{role.name}</span>
                            <span className="text-[10px] bg-neutral-100 text-neutral-800 font-medium px-2 py-0.5 rounded-full">
                              {role.badge}
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] text-[#737373] leading-snug">{role.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentFeature.preview.type === 'notes' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#ebebeb]">
                        <span className="text-xs font-semibold text-[#171717]">Project Note</span>
                        <span className="text-[10px] text-[#8f8f8f]">Markdown Doc</span>
                      </div>
                      <div className="bg-white p-3.5 rounded-lg border border-[#ebebeb] shadow-xs space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#171717]">
                          <FiFileText className="w-3.5 h-3.5 text-[#171717]" />
                          {currentFeature.preview.title}
                        </div>
                        <p className="text-xs font-mono text-[#525252] bg-[#fafafa] p-2 rounded border border-[#f0f0f0]">
                          {currentFeature.preview.content}
                        </p>
                        <div className="text-[10px] text-[#8f8f8f] pt-1">
                          Created by: {currentFeature.preview.author}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentFeature.preview.type === 'security' && (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between pb-2 border-b border-[#ebebeb]">
                        <span className="text-xs font-semibold text-[#171717]">Protection Protocols</span>
                        <FiShield className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {currentFeature.preview.badges.map((b) => (
                          <div
                            key={b.label}
                            className="flex items-center justify-between p-2.5 bg-white border border-[#ebebeb] rounded-lg shadow-xs"
                          >
                            <span className="text-xs font-medium text-[#171717]">{b.label}</span>
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              {b.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentFeature.preview.type === 'stats' && (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between pb-2 border-b border-[#ebebeb]">
                        <span className="text-xs font-semibold text-[#171717]">Workspace Velocity</span>
                        <span className="text-[10px] text-[#8f8f8f]">Live Stats</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {currentFeature.preview.metrics.map((m) => (
                          <div
                            key={m.label}
                            className="bg-white p-3 rounded-lg border border-[#ebebeb] text-center shadow-xs"
                          >
                            <span className="text-xl font-bold text-[#171717]">{m.count}</span>
                            <p className="text-[10px] font-medium text-[#404040] mt-0.5">{m.label}</p>
                            <p className="text-[9px] text-[#8f8f8f] mt-0.5">{m.sub}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentFeature.preview.type === 'invite' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#ebebeb]">
                        <span className="text-xs font-semibold text-[#171717]">Invite Collaborator</span>
                        <FiMail className="w-3.5 h-3.5 text-[#171717]" />
                      </div>
                      <div className="bg-white p-3.5 rounded-lg border border-[#ebebeb] shadow-xs space-y-2">
                        <div className="text-[11px] text-[#737373]">Invited Recipient:</div>
                        <div className="text-xs font-medium text-[#171717] font-mono bg-[#fafafa] p-2 rounded border border-[#f0f0f0]">
                          {currentFeature.preview.email}
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs text-[#525252]">Assigned Role:</span>
                          <span className="text-xs font-semibold text-[#171717]">
                            {currentFeature.preview.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
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

      {/* Plan Comparison Section */}
      <div className="border-t border-[#ebebeb] bg-white">
        <PlanComparisonTable />
      </div>
    </div>
  );
};

export default Features;
