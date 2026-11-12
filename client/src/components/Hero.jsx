import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence,
  motion as Motion,
  useReducedMotion,
} from "motion/react";
import { AvatarCircles } from "./AvatarCircles";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.png";
import dashboardImage from "../assets/dashboard.png";

import { MdCreate } from "react-icons/md";
import { TbCodeCircleFilled } from "react-icons/tb";
import { RiSpaceShip2Fill } from "react-icons/ri";

const teamAvatars = [image1, image2, image3, image4, image5, image6];

const heroActions = [
  {
    label: "Create",
    icon: MdCreate,
    color: "text-orange-500",
    tint: "bg-orange-50",
  },
  {
    label: "Build",
    icon: TbCodeCircleFilled,
    color: "text-blue-500",
    tint: "bg-blue-50",
  },
  {
    label: "Ship",
    icon: RiSpaceShip2Fill,
    color: "text-green-500",
    tint: "bg-green-50",
  },
];

const Hero = () => {
  const [actionIndex, setActionIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const intervalId = window.setInterval(() => {
      setActionIndex((index) => (index + 1) % heroActions.length);
    }, 2200);

    return () => window.clearInterval(intervalId);
  }, [prefersReducedMotion]);

  const activeAction = heroActions[prefersReducedMotion ? 1 : actionIndex];
  const ActiveIcon = activeAction.icon;

  return (
    <section className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-[#fafafa]">
      {/* Container for Headline & Content */}
      <Motion.div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center read-only:select-none"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.12, delayChildren: 0.08 },
          },
        }}
      >
        <Motion.div
          aria-hidden="true"
          className="mb-6 flex justify-center"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <AvatarCircles avatarUrls={teamAvatars} />
        </Motion.div>

        {/* Display Headline */}
        <Motion.h1
          variants={{
            hidden: { opacity: 0, y: 18 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.04em] text-[#171717] leading-[1.08] max-w-4xl mx-auto"
        >
          For <span className="font-editorial-italic font-normal">teams</span>{" "}
          who
          <br className="sm:inline" />
          <AnimatePresence mode="wait" initial={false}>
            <Motion.span
              key={activeAction.label}
              aria-label={activeAction.label}
              className={`inline-flex min-w-[4.2em] align-[0.08em] items-center justify-center gap-[0.22em] rounded-full px-[0.38em] py-[0.08em] text-[0.68em] font-medium tracking-[-0.03em] ${activeAction.tint} ${activeAction.color}`}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <ActiveIcon
                aria-hidden="true"
                className="h-[0.95em] w-[0.95em] shrink-0"
              />
              {activeAction.label}
            </Motion.span>
          </AnimatePresence>{" "}
          together.
        </Motion.h1>

        {/* Sub-headline */}
        <Motion.p
          variants={{
            hidden: { opacity: 0, y: 14 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mt-6 text-sm sm:text-base md:text-[17px] text-[#4d4d4d] max-w-2xl mx-auto leading-relaxed"
        >
          Manage projects, subtasks, and team notes in one workspace.
        </Motion.p>

        {/* Action CTAs */}
        <Motion.div
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
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
        </Motion.div>

        {/* Product preview */}
        <Motion.div
          variants={{
            hidden: { opacity: 0, y: 22 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 max-w-5xl mx-auto border border-b-0 border-[#ebebeb] rounded-t-xl bg-white overflow-hidden"
        >
          <div className="relative w-full overflow-hidden bg-white">
            <Motion.img
              src={dashboardImage}
              alt="Preview of the Projectub dashboard, showing project summaries, recent tasks, and team projects"
              className="block w-full h-auto select-none"
              loading="eager"
              draggable="false"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#fafafa] to-transparent sm:h-28"
            />
          </div>
        </Motion.div>
      </Motion.div>
    </section>
  );
};

export default Hero;
