"use client";

import React, { useEffect, useState } from "react";

export default function GlobalClientWrapper() {
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (!isLargeScreen) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{
        background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(34, 211, 238, 0.045), transparent 80%)`,
      }}
    />
  );
}
