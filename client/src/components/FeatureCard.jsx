import React from "react";
import { motion as Motion } from "motion/react";
import {
  FaLink,
  FaMagnifyingGlass,
  FaBoltLightning,
  FaLock,
  FaChartLine,
  FaUserClock,
  FaFolderOpen,
  FaListCheck,
  FaUsers,
  FaNoteSticky,
} from "react-icons/fa6";

const FeatureCard = ({ title, description, icon, children }) => {
  const renderIcon = () => {
    switch (icon) {
      case "FaFolderOpen":
        return <FaFolderOpen className="text-gray-500" size={16} />;
      case "FaListCheck":
        return <FaListCheck className="text-gray-500" size={16} />;
      case "FaUsers":
        return <FaUsers className="text-gray-500" size={16} />;
      case "FaNoteSticky":
        return <FaNoteSticky className="text-gray-500" size={16} />;
      case "FaLink":
        return <FaLink className="text-gray-500" size={16} />;
      case "FaMagnifyingGlass":
        return <FaMagnifyingGlass className="text-gray-500" size={16} />;
      case "FaBoltLightning":
        return <FaBoltLightning className="text-gray-500" size={16} />;
      case "FaLock":
        return <FaLock className="text-gray-500" size={16} />;
      case "FaChartLine":
        return <FaChartLine className="text-gray-500" size={16} />;
      case "FaUserClock":
        return <FaUserClock className="text-gray-500" size={16} />;
      default:
        return null;
    }
  };

  return (
    <Motion.div
      className="flex flex-col group"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Motion.div
        className="bg-gray-50/70 border border-gray-200/60 rounded-2xl p-5 min-h-64 lg:h-64 flex flex-col justify-between shadow-xs relative overflow-hidden transition-all duration-300 select-none"
        whileHover={{ y: -5, boxShadow: "0 12px 30px rgba(23, 23, 23, 0.08)" }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {children}
      </Motion.div>

      <div className="mt-4 px-1">
        <h3 className="text-lg font-bold text-gray-950 flex items-center gap-2">
          {renderIcon()}
          {title}
        </h3>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
          {description}
        </p>
      </div>
    </Motion.div>
  );
};

export default FeatureCard;
