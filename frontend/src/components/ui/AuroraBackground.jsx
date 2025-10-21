import React from "react";

export function AuroraBackground({
  className,
  children,
  showRadialGradient = true,
  ...props
}) {
  return (
    <main>
      <div
        className={`relative inset-0 h-screen w-full items-center justify-center bg-neutral-900 text-white transition-bg ${className || ""}`}
        {...props}
      >
        {showRadialGradient && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0%,rgba(0,0,0,0)_70%)]"></div>
        )}
        {children}
      </div>
    </main>
  );
}