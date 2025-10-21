import React from "react";
import { cn } from "../../utils/cn"; // We'll create this utility function

export const BackgroundBeams = ({ className }) => {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 1200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0.3)" />
          </linearGradient>
        </defs>
        
        {/* Beam 1 */}
        <path
          d="M 0 600 L 300 300 L 600 600 L 900 300 L 1200 600"
          stroke="url(#beamGradient)"
          strokeWidth="2"
          fill="none"
          opacity="0.3"
        >
          <animate
            attributeName="d"
            dur="8s"
            repeatCount="indefinite"
            values="
              M 0 600 L 300 300 L 600 600 L 900 300 L 1200 600;
              M 0 500 L 300 400 L 600 500 L 900 400 L 1200 500;
              M 0 600 L 300 300 L 600 600 L 900 300 L 1200 600;
            "
          />
        </path>
        
        {/* Beam 2 */}
        <path
          d="M 0 400 L 300 700 L 600 400 L 900 700 L 1200 400"
          stroke="url(#beamGradient)"
          strokeWidth="2"
          fill="none"
          opacity="0.3"
        >
          <animate
            attributeName="d"
            dur="10s"
            repeatCount="indefinite"
            values="
              M 0 400 L 300 700 L 600 400 L 900 700 L 1200 400;
              M 0 500 L 300 600 L 600 500 L 900 600 L 1200 500;
              M 0 400 L 300 700 L 600 400 L 900 700 L 1200 400;
            "
          />
        </path>
        
        {/* Beam 3 */}
        <path
          d="M 0 800 L 300 500 L 600 800 L 900 500 L 1200 800"
          stroke="url(#beamGradient)"
          strokeWidth="2"
          fill="none"
          opacity="0.3"
        >
          <animate
            attributeName="d"
            dur="12s"
            repeatCount="indefinite"
            values="
              M 0 800 L 300 500 L 600 800 L 900 500 L 1200 800;
              M 0 700 L 300 600 L 600 700 L 900 600 L 1200 700;
              M 0 800 L 300 500 L 600 800 L 900 500 L 1200 800;
            "
          />
        </path>
      </svg>
      
      {/* Additional decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-500 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-purple-500 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-indigo-500 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};