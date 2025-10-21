import React, { useState } from "react";
import { motion } from "framer-motion";

export const WobbleCard = ({
  children,
  containerClassName,
  className,
  ...props
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (clientX - (rect.left + rect.width / 2)) / 20;
    const y = (clientY - (rect.top + rect.height / 2)) / 20;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      style={{
        transform: isHovering
          ? `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) scale3d(1, 1, 1)`
          : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
        transition: "transform 0.1s ease-out",
      }}
      className={`relative overflow-hidden rounded-2xl border border-transparent bg-neutral-900 ${containerClassName || ""}`}
      {...props}
    >
      <div className="relative z-10">{children}</div>
      <div
        className={`absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 transition-opacity duration-300 ${
          isHovering ? "opacity-100" : ""
        } ${className || ""}`}
      />
    </motion.div>
  );
};