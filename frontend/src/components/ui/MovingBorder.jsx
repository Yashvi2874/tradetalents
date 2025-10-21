import React from "react";
import { motion } from "framer-motion";

export const MovingBorder = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={`relative p-[2px] rounded-full ${className || ""}`}
      {...props}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "conic-gradient(from 0deg, #3b82f6, #8b5cf6, #3b82f6)",
          mask: "radial-gradient(black 60%, transparent 70%)",
          WebkitMask: "radial-gradient(black 60%, transparent 70%)",
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div className="relative bg-background rounded-full p-px">
        {children}
      </div>
    </div>
  );
};