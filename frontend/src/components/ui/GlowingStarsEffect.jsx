import React, { useEffect, useRef, useState } from "react";

export const GlowingStarsEffect = ({ className }) => {
  const canvasRef = useRef(null);
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Create stars
    const newStars = [];
    for (let i = 0; i < 100; i++) {
      newStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.05 + 0.01,
        opacity: Math.random() * 0.5 + 0.1,
        angle: Math.random() * Math.PI * 2,
      });
    }
    setStars(newStars);

    let animationFrameId;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${star.opacity})`;
        ctx.fill();

        // Update star position
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;

        // Reset star position if it goes off screen
        if (star.x < 0 || star.x > canvas.width || star.y < 0 || star.y > canvas.height) {
          star.x = Math.random() * canvas.width;
          star.y = Math.random() * canvas.height;
        }

        // Pulsing effect
        star.opacity = 0.3 + Math.sin(Date.now() * 0.001 + star.x) * 0.2;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [stars]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className || ""}`}
    />
  );
};