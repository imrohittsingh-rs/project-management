import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { motion as Motion } from 'motion/react';

// 3D Pushpin component matching the pinned notecards in the reference
const PushPin = ({ color }) => (
  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none select-none">
    <svg
      width="22"
      height="28"
      viewBox="0 0 24 30"
      fill="none"
      className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.22)]"
    >
      {/* Pin round head */}
      <circle cx="12" cy="7" r="5" fill={color} />
      {/* Specular highlight */}
      <circle cx="10" cy="5.2" r="1.6" fill="#ffffff" fillOpacity="0.6" />
      {/* Tapered body waist */}
      <path
        d="M9 11C9 13.2 10.2 16.5 12 17.5C13.8 16.5 15 13.2 15 11H9Z"
        fill={color}
      />
      {/* Collar rim */}
      <ellipse cx="12" cy="11" rx="4" ry="1.5" fill={color} filter="brightness(0.9)" />
      {/* Metallic needle */}
      <path d="M12 17.5V25" stroke="#9ca3af" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
    {/* Shadow on paper */}
    <div className="w-3.5 h-1 -mt-1 bg-black/15 rounded-full blur-[1px]" />
  </div>
);

// 5 authentic steps based directly on Projectub's PRD features
const steps = [
  {
    step: '01',
    title: 'Create Account',
    description:
      'Sign up in minutes with your email and verify your address. Set up your team profile and get instant access to your workspace.',
    pinColor: '#ea580c', // Orange
    theme: {
      cardBg: 'bg-[#fef8f1]',
      border: 'border-[#fde8d0]',
      numberColor: 'text-[#ea580c]',
    },
    rotateAngle: -2,
    position: 'md:justify-start md:pl-6 lg:pl-16',
  },
  {
    step: '02',
    title: 'Create Projects',
    description:
      'Spin up project workspaces with clear descriptions and goals. Organize all your team initiatives and roadmaps in one place.',
    pinColor: '#2563eb', // Blue
    theme: {
      cardBg: 'bg-[#f0f7ff]',
      border: 'border-[#dbeafe]',
      numberColor: 'text-[#2563eb]',
    },
    rotateAngle: 2,
    position: 'md:justify-end md:pr-6 lg:pr-16',
  },
  {
    step: '03',
    title: 'Assign Roles & Teams',
    description:
      'Invite members by email with role-based access. Delegate permissions across Admin, Project Admin, and Member roles safely.',
    pinColor: '#9333ea', // Purple
    theme: {
      cardBg: 'bg-[#faf5ff]',
      border: 'border-[#f3e8ff]',
      numberColor: 'text-[#9333ea]',
    },
    rotateAngle: -2,
    position: 'md:justify-start md:pl-10 lg:pl-20',
  },
  {
    step: '04',
    title: 'Structure Tasks & Notes',
    description:
      'Break work into actionable tasks and subtasks with checklists. Keep architecture docs and meeting notes embedded directly inside projects.',
    pinColor: '#ea580c', // Orange
    theme: {
      cardBg: 'bg-[#fef8f1]',
      border: 'border-[#fde8d0]',
      numberColor: 'text-[#ea580c]',
    },
    rotateAngle: 2.5,
    position: 'md:justify-end md:pr-8 lg:pr-20',
  },
  {
    step: '05',
    title: 'Track Progress & Ship',
    description:
      'Progress work across Todo, In Progress, and Done. Monitor subtask completion in real time and deliver milestones on schedule.',
    pinColor: '#2563eb', // Blue
    theme: {
      cardBg: 'bg-[#f0f7ff]',
      border: 'border-[#dbeafe]',
      numberColor: 'text-[#2563eb]',
    },
    rotateAngle: -2,
    position: 'md:justify-start md:pl-6 lg:pl-16',
  },
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#171717] font-geist selection:bg-[#171717] selection:text-white">
      {/* Header section with refined fade-up */}
      <section className="border-b border-[#ebebeb] bg-[#fafafa] px-4 py-16 text-center sm:px-8">
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl"
        >
          <Motion.h1
            className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-[#171717]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            How Projectub works
          </Motion.h1>
          <Motion.p className="mt-4 text-sm sm:text-base text-[#4d4d4d] leading-relaxed">
            From your first signup to full team delivery. A structured, transparent workflow designed to help teams execute with clarity.
          </Motion.p>
        </Motion.div>
      </section>

      {/* Main timeline with lined paper background */}
      <section className="relative px-4 py-16 sm:py-24 overflow-hidden [background-image:repeating-linear-gradient(to_bottom,transparent,transparent_31px,#ededed_31px,#ededed_32px)]">
        {/* Style tag for moving dashed trail animation */}
        <style>{`
          @keyframes dashMove {
            from {
              stroke-dashoffset: 0;
            }
            to {
              stroke-dashoffset: -28;
            }
          }
          .animate-dash-trail {
            stroke-dasharray: 8 6;
            animation: dashMove 1.4s linear infinite;
          }
        `}</style>

        <div className="relative mx-auto max-w-4xl min-h-[950px]">
          {/* Desktop connecting dashed trail SVG with moving dashes */}
          <svg
            className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 800 1100"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M 230 110 C 440 140, 500 240, 570 310 C 640 380, 210 460, 240 530 C 270 600, 510 670, 560 740 C 610 810, 210 870, 240 940"
              stroke="#94a3b8"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="animate-dash-trail"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="0; -28"
                dur="1.4s"
                repeatCount="indefinite"
              />
            </path>
          </svg>

          {/* Mobile connecting dashed vertical center line with moving dashes */}
          <svg
            className="md:hidden absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 100 1100"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M 50 30 L 50 1070"
              stroke="#94a3b8"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="animate-dash-trail"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="0; -28"
                dur="1.4s"
                repeatCount="indefinite"
              />
            </path>
          </svg>

          {/* Step cards with premium viewport entrance & spring hover */}
          <div className="relative z-10 flex flex-col gap-10 sm:gap-14 md:gap-16">
            {steps.map((item, index) => (
              <div
                key={item.step}
                className={`flex w-full justify-center ${item.position}`}
              >
                <Motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{
                    y: -6,
                    scale: 1.03,
                    rotate: 0,
                    transition: { type: 'spring', stiffness: 380, damping: 22 },
                  }}
                  style={{ rotate: item.rotateAngle }}
                  className="group relative w-full max-w-[275px] sm:max-w-[305px] bg-white rounded-[24px] p-3 shadow-[0_14px_34px_-8px_rgba(0,0,0,0.08),0_4px_12px_-2px_rgba(0,0,0,0.04)] border border-black/[0.06] hover:shadow-[0_22px_44px_-8px_rgba(0,0,0,0.13)] cursor-default select-none"
                >
                  {/* Colorful Pushpin */}
                  <PushPin color={item.pinColor} />

                  {/* Inner pastel card */}
                  <div
                    className={`${item.theme.cardBg} ${item.theme.border} border rounded-[18px] p-5 sm:p-6 text-left transition-colors duration-200`}
                  >
                    <span
                      className={`block font-bold text-2xl sm:text-3xl ${item.theme.numberColor} tracking-tight font-geist select-none`}
                    >
                      {item.step}
                    </span>
                    <h3 className="mt-2 text-base sm:text-lg font-semibold text-[#171717] tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-[13px] text-[#4d4d4d] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </Motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action section */}
      <section className="border-t border-[#ebebeb] bg-[#fafafa] px-4 py-16 text-center sm:px-8">
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717]">
            Ready to organize your team?
          </h2>
          <p className="mt-3 text-sm text-[#4d4d4d]">
            Join Projectub today and start executing projects with speed and accountability.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 h-10 px-5 text-sm font-medium rounded-[6px] bg-[#171717] text-white hover:bg-[#333333] transition-colors"
            >
              Get Started
              <FiArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center h-10 px-5 text-sm font-medium rounded-[6px] bg-white text-[#171717] border border-[#ebebeb] hover:bg-[#fafafa] transition-colors"
            >
              Log In
            </Link>
          </div>
        </Motion.div>
      </section>
    </div>
  );
};

export default HowItWorks;
