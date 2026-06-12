"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function HeroBackgroundEffects() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Springs for smooth parallax movement following cursor
  const springConfig = { stiffness: 40, damping: 15, mass: 1 };
  const parallaxX = useSpring(0, springConfig);
  const parallaxY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { innerWidth, innerHeight } = window;
      // Calculate normalized offset from center (-0.5 to 0.5)
      const x = (e.clientX / innerWidth - 0.5) * 25; // max 25px displacement
      const y = (e.clientY / innerHeight - 0.5) * 25;
      parallaxX.set(x);
      parallaxY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [parallaxX, parallaxY]);

  // Node graph coordinates in percentages
  const nodes = [
    { x: 15, y: 25, label: "Input Signal" },
    { x: 45, y: 15, label: "CatBoost Model" },
    { x: 75, y: 20, label: "LSB Masking" },
    { x: 88, y: 55, label: "Fidelity Validation" },
    { x: 62, y: 78, label: "AES-256 Link" },
    { x: 30, y: 82, label: "Embedding Matrix" },
    { x: 10, y: 55, label: "Signal Selection" },
    { x: 50, y: 48, label: "Core Weights" }
  ];

  const connections = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 5 },
    { from: 5, to: 6 },
    { from: 6, to: 0 },
    { from: 7, to: 1 },
    { from: 7, to: 4 },
    { from: 7, to: 6 },
    { from: 7, to: 2 }
  ];

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-10"
    >
      {/* 1. Large Translucent Animated Audio Wave */}
      <div className="absolute inset-0 flex items-center justify-around opacity-[0.06] px-4 overflow-hidden blur-[2px]">
        {[...Array(35)].map((_, i) => (
          <motion.div
            key={i}
            className="w-[3px] bg-gradient-to-t from-cyan-400 via-cyan-500 to-blue-500 rounded-full"
            animate={{
              height: [
                `${Math.sin(i * 0.2) * 140 + 200}px`,
                `${Math.sin(i * 0.2 + Math.PI) * 140 + 200}px`,
                `${Math.sin(i * 0.2) * 140 + 200}px`
              ]
            }}
            transition={{
              duration: 7 + (i % 4) * 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Parallax elements container */}
      <motion.div 
        style={{ x: parallaxX, y: parallaxY }} 
        className="absolute inset-0 w-full h-full"
      >
        {/* 2. Floating Signal Particles */}
        {[...Array(20)].map((_, i) => {
          const size = Math.random() * 4 + 1.5;
          const initialX = Math.random() * 100;
          const initialY = Math.random() * 100;
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-cyan-400 mix-blend-screen opacity-[0.04] shadow-[0_0_8px_rgba(34,211,238,0.5)]"
              style={{
                width: size,
                height: size,
                left: `${initialX}%`,
                top: `${initialY}%`
              }}
              animate={{
                x: [0, Math.random() * 40 - 20, 0],
                y: [0, Math.random() * 40 - 20, 0],
              }}
              transition={{
                duration: 12 + Math.random() * 12,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          );
        })}

        {/* 3. ML Node Network Graph */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
          {/* Glowing connections */}
          {connections.map((conn, idx) => {
            const start = nodes[conn.from];
            const end = nodes[conn.to];
            return (
              <g key={idx}>
                {/* Static base line */}
                <line
                  x1={`${start.x}%`}
                  y1={`${start.y}%`}
                  x2={`${end.x}%`}
                  y2={`${end.y}%`}
                  stroke="rgba(34, 211, 238, 0.15)"
                  strokeWidth="1"
                />
                {/* Moving signal pulse line */}
                <motion.line
                  x1={`${start.x}%`}
                  y1={`${start.y}%`}
                  x2={`${end.x}%`}
                  y2={`${end.y}%`}
                  stroke="url(#pulseGradient)"
                  strokeWidth="1.5"
                  strokeDasharray="8 20"
                  animate={{ strokeDashoffset: [0, -60] }}
                  transition={{
                    duration: 5 + (idx % 3) * 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </g>
            );
          })}
          
          {/* Definitions for pulse gradients */}
          <defs>
            <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(34, 211, 238, 0)" />
              <stop offset="50%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="rgba(34, 211, 238, 0)" />
            </linearGradient>
          </defs>

          {/* Glowing node dots */}
          {nodes.map((node, idx) => (
            <g key={idx}>
              {/* Outer pulse */}
              <motion.circle
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r="6"
                fill="rgba(34, 211, 238, 0.15)"
                animate={{ r: [6, 12, 6] }}
                transition={{
                  duration: 3 + (idx % 2) * 1.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              {/* Solid inner node */}
              <circle
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r="3"
                className="fill-cyan-400 drop-shadow-[0_0_6px_#22d3ee]"
              />
            </g>
          ))}
        </svg>
      </motion.div>
    </div>
  );
}
