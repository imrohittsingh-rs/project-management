import React from 'react';
import { motion } from 'motion/react';

const Loadingspinner = ({ className = 'min-h-[70vh] w-full', size = 'md' }) => {
  // Size presets
  const sizeClasses = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3.5 h-3.5',
    lg: 'w-5 h-5',
  };

  const dotSize = sizeClasses[size] || sizeClasses.md;

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.18,
      },
    },
  };

  const dotVariants = {
    initial: {
      x: -8,
      scale: 0.8,
      opacity: 0.25,
    },
    animate: {
      x: [-8, 8, -8],
      scale: [0.8, 1.25, 0.8],
      opacity: [0.25, 1, 0.25],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: [0.45, 0, 0.55, 1],
      },
    },
  };

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      role="status"
      aria-label="Loading"
    >
      <motion.div
        className="flex items-center gap-3"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            variants={dotVariants}
            className={`${dotSize} rounded-full bg-[#171717] inline-block`}
          />
        ))}
      </motion.div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export { Loadingspinner as Loader };
export default Loadingspinner;
