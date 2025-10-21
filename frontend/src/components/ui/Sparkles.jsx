import React, { useEffect, useRef, useState } from "react";

export const Sparkles = ({
  children,
  className,
  minSize = 0.8,
  maxSize = 1.2,
  particleDensity = 100,
  particleColor = "#FFFFFF",
  ...props
}) => {
  const containerRef = useRef(null);
  const sparklesRef = useRef([]);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create particles
    const newParticles = [];
    for (let i = 0; i < particleDensity; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * (maxSize - minSize) + minSize,
        opacity: Math.random() * 0.5 + 0.1,
        animationDelay: Math.random() * 2,
      });
    }
    setParticles(newParticles);
    sparklesRef.current = newParticles;

    // Animation function
    let animationFrameId;
    const animate = () => {
      setParticles(prev => {
        return prev.map(particle => ({
          ...particle,
          opacity: 0.3 + Math.sin(Date.now() * 0.001 + particle.id) * 0.2,
          y: (particle.y + 0.02) % 100,
        }));
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [minSize, maxSize, particleDensity]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className || ""}`}
      {...props}
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particleColor,
            borderRadius: "50%",
            opacity: particle.opacity,
            transition: "opacity 0.3s ease",
            animationDelay: `${particle.animationDelay}s`,
          }}
        />
      ))}
      <div className="relative z-10">{children}</div>
    </div>
  );
};