import React from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "motion/react";
import {
  FaArrowRight,
  FaPen,
  FaTrash,
  FaCheck,
  FaNoteSticky,
  FaFolderOpen,
  FaListCheck,
} from "react-icons/fa6";
import { IoMdDoneAll } from "react-icons/io";
import { RiProgress5Line } from "react-icons/ri";
import { BsArrowReturnRight } from "react-icons/bs";
import { useAuth } from "../context/AuthContext";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";
import FeatureCard from "../components/FeatureCard";

const CoreFeatures = [
  {
    title: "Project Workspaces",
    description:
      "Keep project goals, tasks, people, and progress together in one workspace.",
    icon: "FaFolderOpen",
  },
  {
    title: "Task Progress",
    description:
      "See what is planned, in progress, and done across every project.",
    icon: "FaListCheck",
  },
  {
    title: "Team Collaboration",
    description: "Invite teammates and assign the right role for each project.",
    icon: "FaUsers",
  },
  {
    title: "Notes & Documentation",
    description:
      "Capture decisions, requirements, and project context where your team works.",
    icon: "FaNoteSticky",
  },
];

const actions = [
  {
    label: "Edit Tasks",
    desc: "Update details as work evolves",
    icon: <FaPen className="text-blue-500" size={10} />,
    bg: "bg-blue-50",
  },
  {
    label: "Assign Members",
    desc: "Give every task a clear owner",
    icon: <FaTrash className="text-red-500" size={10} />,
    bg: "bg-red-50",
  },
  {
    label: "Track Status",
    desc: "Move work from todo to done",
    icon: <RiProgress5Line className="text-orange-500" size={10} />,
    bg: "bg-zinc-100",
  },
  {
    label: "Add Notes",
    desc: "Keep important context close",
    icon: <FaNoteSticky className="text-emerald-500" size={10} />,
    bg: "bg-emerald-50",
  },
];

const taskStats = [
  {
    label: "Total",
    count: 4,
    icon: <FaListCheck size={12} />,
    badge: "bg-[#edf4ff] text-[#1769e0]",
    badgeLabel: "All tasks",
  },
  {
    label: "Projects",
    count: 3,
    icon: <FaFolderOpen size={12} />,
    badge: "bg-[#f2f2f2] text-[#4d4d4d]",
    badgeLabel: "All projects",
  },
  {
    label: "In Progress",
    count: 2,
    icon: <RiProgress5Line size={13} />,
    badge: "bg-[#fff3e0] text-[#ab570a]",
    badgeLabel: "Active work",
  },
  {
    label: "Done",
    count: 1,
    icon: <IoMdDoneAll size={11} />,
    badge: "bg-[#d9f7ec] text-[#13795b]",
    badgeLabel: "Completed",
  },
];

const Features = () => {
  const { user } = useAuth();
  const tasks = [
    {
      title: "Refresh the marketing site and launch the new homepage",
      project: "Website Redesign",
      logo: image1,
      status: "done",
    },
    {
      title: "Plan the next release and coordinate the product team",
      project: "Mobile App",
      logo: image2,
      status: "in_progress",
    },
    {
      title: "Set quarterly goals and track delivery milestones",
      project: "Q4 Planning",
      logo: image3,
      status: "todo",
    },
  ];

  const statusDotClass = {
    done: "bg-green-500",
    in_progress: "bg-orange-500",
    todo: "bg-gray-500",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20">
      <Motion.div
        className="text-center pt-8 pb-16 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <Motion.h1
          className="text-3xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-tight mb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5 }}
        >
          Everything your team needs to ship great work
        </Motion.h1>
        <Motion.p
          className="text-gray-500 text-base font-medium leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          Organize projects, assign tasks, collaborate with your team, and keep
          every important decision in one place.
        </Motion.p>
      </Motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        {/* Card 1 */}
        <FeatureCard {...CoreFeatures[0]}>
          <div className="flex flex-col gap-2.5 w-full">
            {tasks.map((task, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200/50 p-2.5 rounded-xl flex items-center justify-between gap-4 shadow-2xs transition-all select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 text-black flex items-center justify-center font-bold text-xs shrink-0 select-none overflow-hidden">
                    <img
                      src={task.logo}
                      alt=""
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-md text-gray-900 flex items-center gap-1 min-w-0">
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          statusDotClass[task.status] || statusDotClass.todo
                        }`}
                        aria-label={`${task.status.replace("_", " ")} status`}
                        title={task.status.replace("_", " ")}
                      />
                      <span className="truncate text-sm font-medium">
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <BsArrowReturnRight
                        className="text-black shrink-0"
                        size={10}
                      />
                      <span className="truncate max-w-[130px] sm:max-w-[180px] hover:underline text-xs">
                        {task.project}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FeatureCard>

        {/* Card 2*/}
        <FeatureCard {...CoreFeatures[1]}>
          <div className="grid grid-cols-2 gap-3 w-full h-full">
            {taskStats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col justify-between rounded-2xl border border-gray-200/70 bg-white p-3 shadow-2xs"
              >
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-[#7890ad]">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-semibold leading-none text-gray-950 mt-3">
                    {stat.count}
                  </p>
                </div>
                <div
                  className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${stat.badge}`}
                >
                  {stat.icon}
                  <span>{stat.badgeLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </FeatureCard>

        {/* Card 3*/}
        <FeatureCard {...CoreFeatures[2]}>
          <Motion.div
            className="flex h-50 w-full items-center justify-center overflow-hidden rounded-xl bg-white"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.15, duration: 0.45, ease: "easeOut" }}
          >
            <div className="w-full max-w-md bg-white border border-[#ebebeb] rounded-xl shadow-sm flex flex-col">
              <div className="flex items-center justify-between px-3 pt-1 border-b border-[#ebebeb]">
                <h4 className="text-sm font-semibold text-[#171717]">
                  Invite a team member
                </h4>
              </div>
              <div className="px-3 pb-3 pt-3 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-[#171717] mb-2">
                    Project
                  </label>
                  <div className="relative w-full px-3 py-1 border border-[#ebebeb] rounded-lg bg-[#ffffff] text-[#171717] text-sm">
                    Updated Website Redesign
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#171717] text-xs">
                      ⌄
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#171717] mb-2">
                    Email address
                  </label>
                  <div className="w-full px-3 py-1 border border-[#ebebeb] rounded-lg bg-[#ffffff] text-[#a1a1a1] text-sm">
                    teammate@example.com
                  </div>
                </div>
              </div>
              <div className="mx-3 mb-3 bg-[#171717] text-white px-6 py-1 rounded-lg text-sm font-semibold text-center">
                Send Invite
              </div>
            </div>
          </Motion.div>
        </FeatureCard>

        {/* Card 4*/}
        <FeatureCard {...CoreFeatures[3]}>
          {/* Simple list of action items */}
          <div className="grow flex flex-col justify-center gap-2 w-full my-1.5">
            {actions.map((action, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-white border border-gray-200/50 p-2.5 rounded-xl shadow-2xs hover:bg-gray-50/50 transition-colors select-none group/row"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-lg ${action.bg} flex items-center justify-center shrink-0`}
                  >
                    {action.icon}
                  </div>
                  <div className="min-w-0 flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                    <span className="text-sm text-gray-900 font-bold sm:font-normal leading-normal sm:w-[115px] sm:shrink-0 text-left">
                      {action.label}
                    </span>
                    <span className="text-xs text-gray-400 truncate leading-normal">
                      {action.desc}
                    </span>
                  </div>
                </div>

                {/* Green check mark */}
                <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <FaCheck className="text-emerald-600" size={8} />
                </div>
              </div>
            ))}
          </div>
        </FeatureCard>
      </div>

      {/* Footer Section */}
      <div className="mt-20 text-center bg-white border border-gray-200/60 p-8 md:p-12 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-gray-50 to-transparent rounded-full -mr-10 -mt-10 pointer-events-none"></div>
        <div className="relative z-10 max-w-lg mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-950 tracking-tight mb-3">
            Ready to bring your next project into focus?
          </h2>
          <p className="text-gray-500 text-sm md:text-base mb-8 font-medium">
            Create an account and give your team a clearer way to plan,
            collaborate, and deliver.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!user ? (
              <Link
                to="/signup"
                className="w-full sm:w-auto bg-black hover:bg-zinc-950 text-white font-semibold px-6 py-3.5 rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer"
              >
                Get Started for Free
                <FaArrowRight size={14} />
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto bg-black hover:bg-zinc-950 text-white font-semibold px-6 py-3.5 rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer"
              >
                Open Your Dashboard
                <FaArrowRight size={14} />
              </Link>
            )}
            {!user ? (
              <Link
                to="/login"
                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 font-semibold border border-gray-200 px-6 py-3.5 rounded-xl text-sm transition-all flex items-center justify-center active:scale-[0.98] cursor-pointer"
              >
                Log In
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 font-semibold border border-gray-200 px-6 py-3.5 rounded-xl text-sm transition-all flex items-center justify-center active:scale-[0.98] cursor-pointer"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
