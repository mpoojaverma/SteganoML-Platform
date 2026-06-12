import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface LogoProps {
  className?: string;
  showSubText?: boolean;
  size?: "sm" | "md" | "lg";
  href?: string;
}

export default function Logo({
  className = "",
  showSubText = false,
  size = "md",
  href = "/dashboard",
}: LogoProps) {
  const iconSize = size === "sm" ? "h-8 w-8 rounded-lg" : size === "lg" ? "h-12 w-12 rounded-2xl" : "h-10 w-10 rounded-xl";
  const svgSize = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5";
  const textSize = size === "sm" ? "text-lg font-extrabold" : size === "lg" ? "text-2xl font-extrabold" : "text-xl font-bold";

  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    hoverTimer.current = setTimeout(() => {
      setShowDiagnostics(true);
    }, 2000);
  };

  const handleMouseLeave = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    setShowDiagnostics(false);
  };

  return (
    <div 
      className="relative z-50 shrink-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={href} className={`flex items-center gap-3 group shrink-0 outline-none rounded-xl ${className}`}>
        <div className={`flex items-center justify-center bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 transition group-hover:scale-105 shrink-0 ${iconSize}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${svgSize} text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]`}
          >
            <rect x="2" y="2" width="20" height="20" rx="6" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.5" className="stroke-cyan-500/25" />
            <path
              d="M5 12c1.5-4 3.5-4 5 0s3.5 4 5 0 3.5-4 5 0"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-cyan-400"
            />
            <path
              d="M7 12c1.2-2.5 2.8-2.5 4 0s2.8 2.5 4 0 2.8-2.5 4 0"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="1.5 1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-cyan-300/50"
            />
          </svg>
        </div>

        <div className="flex flex-col text-left">
          <span className={`tracking-tight text-white leading-none whitespace-nowrap ${textSize}`}>
            SteganoML
          </span>
          {showSubText && (
            <span className="text-[10px] text-slate-500 mt-1 whitespace-nowrap">
              Audio Steganography
            </span>
          )}
        </div>
      </Link>

      <AnimatePresence>
        {showDiagnostics && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full mt-2 left-0 w-64 bg-[#07111f]/95 border border-cyan-500/30 backdrop-blur-md rounded-xl p-4 shadow-[0_4px_20px_rgba(6,182,212,0.15)] pointer-events-none font-mono text-[11px] text-slate-300 space-y-1.5 z-[100]"
          >
            <div className="text-cyan-400 border-b border-cyan-500/20 pb-1 font-bold flex items-center justify-between">
              <span>ML Model Status</span>
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ROC-AUC:</span>
              <span className="text-emerald-400 font-semibold">0.9581</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">AES-256:</span>
              <span className="text-cyan-300 font-semibold">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Secure Delivery:</span>
              <span className="text-cyan-300 font-semibold flex items-center gap-1">
                Online
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
