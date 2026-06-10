"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Shield,
  Cpu,
  Lock,
  Activity,
  CheckCircle2,
  ChevronRight,
  Database,
  ArrowRight,
  FileCode,
  AudioWaveform,
  Zap,
  Globe,
  Sliders
} from "lucide-react";

export default function HomePage() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeArchBlock, setActiveArchBlock] = useState(0);
  const [psnrCounter, setPsnrCounter] = useState(0);
  const [snrCounter, setSnrCounter] = useState(0);

  // Hero showcase pipeline loop
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  // Simple counting animation for research stats on mount
  useEffect(() => {
    const psnrTarget = 94.69;
    const snrTarget = 72.03;
    let currentPsnr = 0;
    let currentSnr = 0;

    const interval = setInterval(() => {
      if (currentPsnr < psnrTarget) {
        currentPsnr += 2.3;
        setPsnrCounter(Math.min(currentPsnr, psnrTarget));
      }
      if (currentSnr < snrTarget) {
        currentSnr += 1.8;
        setSnrCounter(Math.min(currentSnr, snrTarget));
      }
      if (currentPsnr >= psnrTarget && currentSnr >= snrTarget) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const getWaveformHeights = (step: number) => {
    switch (step) {
      case 0: // Validation: low sine wave
        return Array.from({ length: 32 }, (_, i) => Math.abs(Math.sin(i * 0.3) * 16) + 6);
      case 1: // Encryption: high noise
        return Array.from({ length: 32 }, (_, i) => (i % 2 === 0 ? 30 : 6) + Math.random() * 8);
      case 2: // ML Analysis: focused select
        return Array.from({ length: 32 }, (_, i) => (i > 8 && i < 22 ? 36 : 8));
      case 3: // Embedding: spiky spikes
        return Array.from({ length: 32 }, (_, i) => (i % 3 === 0 ? 40 : 8));
      case 4: // Quality: stable wave
        return Array.from({ length: 32 }, (_, i) => Math.abs(Math.sin(i * 0.22) * 24) + 8);
      default:
        return Array.from({ length: 32 }, () => 12);
    }
  };

  const steps = [
    { title: "Audio Validation", desc: "Checking sample rates, audio bit depth, and constraints" },
    { title: "AES-256 Encryption", desc: "Encrypting secret payload using PBKDF2 derived keys" },
    { title: "ML Frame Analysis", desc: "Evaluating spectral centroids and frame stability" },
    { title: "Adaptive Embedding", desc: "LSB-guided embedding on high capacity targets" },
    { title: "Quality Verification", desc: "Running validation metrics (PSNR, SNR, BER, NC)" },
  ];

  const archBlocks = [
    {
      title: "Audio Segmentation",
      subtitle: "Pre-processing & Framing",
      description: "Splits continuous audio carriers (e.g. WAV, MP3) into short 20ms frames. Localizes acoustic variations to ensure analyzed properties correspond to imperceptible hearing intervals.",
      icon: AudioWaveform,
      detail: "Supports 44.1kHz standard formats; handles float/integer bitstreams."
    },
    {
      title: "Feature Extraction",
      subtitle: "Acoustic Parameterization",
      description: "Extracts multi-dimensional features from each segment, including Zero Crossing Rate, Spectral Centroid, Root Mean Square (RMS) energy, and Mel-Frequency Cepstral Coefficients (MFCCs).",
      icon: Sliders,
      detail: "Creates robust high-dimensional feature vectors representing frame complexity."
    },
    {
      title: "ML Classification",
      subtitle: "Capacity & Stability Selection",
      description: "Feeds extracted parameters into a trained CatBoost regression classifier. Evaluates and scores every frame based on its capacity to hide data without audible distortion.",
      icon: Cpu,
      detail: "Filters out high-risk regions; highlights acoustically masked frames."
    },
    {
      title: "Cryptographic Processing",
      subtitle: "AES-256 Security Envelope",
      description: "Applies symmetric encryption to the input secret message payload. Derives high-entropy keys using the PBKDF2 key derivation function with randomized salts.",
      icon: Lock,
      detail: "Ensures hidden data remains unreadable even if stego location selectors are analyzed."
    },
    {
      title: "Adaptive Embedding",
      subtitle: "Least Significant Bit Insertion",
      description: "Alters the least significant bits (LSB) of audio samples only within top-scoring frames. Dynamically adjusts embedding density based on frame capacity limits.",
      icon: Zap,
      detail: "Provides superior imperceptibility, outperforming uniform blind LSB methods."
    },
    {
      title: "Recovery Pipeline",
      subtitle: "Authenticated Signal Retrieval",
      description: "Passes the target stego audio through the same segmentation, feature classification, LSB extraction, and decryption sequence using the shared password.",
      icon: Shield,
      detail: "Features zero bit error rate (BER) under uncompressed channel parameters."
    }
  ];

  const innovations = [
    {
      title: "ML-Guided Embedding",
      desc: "First steganographic workflow incorporating CatBoost tree ensemble models to predict acoustic thresholds.",
      badge: "Innovation I"
    },
    {
      title: "Adaptive Frame Selection",
      desc: "Dynamically identifies carrier frames capable of higher noise tolerances, completely avoiding flat-tone distortions.",
      badge: "Innovation II"
    },
    {
      title: "Cryptographic Protection",
      desc: "Combines steganographic obscurity with PBKDF2 + AES-256 cryptographic rigidity, creating dual-layer authentication.",
      badge: "Innovation III"
    },
    {
      title: "Hardware Embodiment",
      desc: "Engineered feature extraction and LSB embedding formulas optimized for FPGA synthesis and HSM security modules.",
      badge: "Innovation IV"
    },
    {
      title: "Software Embodiment",
      desc: "Premium, responsive Next.js SaaS dashboard dashboard with integrated REST API triggers for high-throughput batch runs.",
      badge: "Innovation V"
    }
  ];

  return (
    <main className="relative min-h-screen bg-[#020817] text-white overflow-hidden font-sans">
      {/* Visual Depth Background Ornaments */}
      <div className="absolute left-[-200px] top-[-200px] h-[600px] w-[600px] rounded-full bg-cyan-500/5 blur-[160px] pointer-events-none" />
      <div className="absolute right-[-200px] top-[100px] h-[600px] w-[600px] rounded-full bg-purple-500/5 blur-[160px] pointer-events-none" />
      <div className="absolute left-[30%] bottom-[-200px] h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[160px] pointer-events-none" />
      
      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* NAVBAR */}
      <nav className="relative z-30 border-b border-white/5 bg-[#020817]/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 font-bold text-cyan-400 border border-cyan-500/10">
              S
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">SteganoML</h1>
              <p className="text-[10px] text-slate-500 mt-1">Secure Audio Steganography</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-semibold text-black transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] focus-visible:ring-2 focus-visible:ring-cyan-400 outline-none cursor-pointer"
            >
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION WITH INTERACTIVE PIPELINE */}
      <section className="relative z-20 mx-auto max-w-7xl px-6 pt-20 pb-12 lg:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* LEFT: TEXT & CTA */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-medium text-cyan-300 animate-pulse">
              <Shield size={12} />
              <span>Published • Research Validated Model</span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black leading-tight tracking-tight">
              Adaptive
              <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]"> ML-guided</span>
              <br />
              Audio Steganography
            </h1>

            <p className="max-w-xl mx-auto lg:mx-0 text-base text-slate-400 leading-relaxed">
              Securely embed encrypted messages inside audio files using adaptive machine-learning-based steganography. Engineered for secure communication workflows, research, and payload imperceptibility.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/login"
                className="rounded-xl bg-cyan-500 px-8 py-4 font-semibold text-black transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_20px_rgba(6,182,212,0.35)] flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-cyan-400 outline-none cursor-pointer"
              >
                <span>Start Encoding</span>
                <ArrowRight size={16} />
              </Link>

              <a
                href="#architecture"
                className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-white hover:bg-white/10 transition flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-cyan-400 outline-none cursor-pointer"
              >
                <span>Explore Architecture</span>
              </a>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4 text-xs font-mono text-slate-400 pt-4">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span>ROC-AUC <strong className="text-cyan-300">0.9581</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span>AES-256 <strong className="text-cyan-300">Enabled</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span>PSNR <strong className="text-cyan-300">94.69 dB</strong></span>
              </div>
            </div>
          </div>

          {/* RIGHT: INTERACTIVE SHOWCASE PANEL */}
          <div className="lg:col-span-6 relative">
            <div className="absolute inset-0 rounded-[36px] bg-cyan-500/10 blur-3xl opacity-50" />

            <div className="relative rounded-[36px] border border-cyan-500/20 bg-[#071122]/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  <h2 className="text-lg font-bold text-white">Live Encode Pipeline</h2>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 tracking-wider">STATUS: ACTIVE</span>
              </div>

              {/* Looping Pipeline Checklist */}
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const isActive = index === activeStep;
                  const isCompleted = index < activeStep;

                  return (
                    <div
                      key={index}
                      className={`flex gap-4 p-3 rounded-2xl border transition-all duration-300 ${
                        isActive
                          ? "border-cyan-500/20 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.04)]"
                          : "border-transparent bg-transparent"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0 transition-colors duration-300 ${
                          isCompleted
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                            : isActive
                              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse"
                              : "bg-white/5 text-slate-500"
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 size={16} /> : index + 1}
                      </div>

                      <div className="flex-1">
                        <p
                          className={`text-sm font-semibold transition-colors duration-300 ${
                            isActive ? "text-cyan-300" : isCompleted ? "text-slate-300" : "text-slate-500"
                          }`}
                        >
                          {step.title}
                        </p>
                        <div className="mt-2 h-1 w-full rounded-full bg-white/5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isCompleted
                                ? "w-full bg-emerald-400"
                                : isActive
                                  ? "w-1/2 bg-cyan-400 animate-pulse"
                                  : "w-0"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DYNAMIC WAVEFORM SPECTRUM */}
              <div className="mt-8 rounded-2xl bg-white/[0.02] border border-white/5 p-4">
                <div className="h-16 w-full flex items-center justify-between gap-[3px]">
                  {getWaveformHeights(activeStep).map((h, i) => (
                    <div
                      key={i}
                      className={`w-[4px] rounded-full transition-all duration-500 ${
                        activeStep === 4
                          ? "bg-emerald-400/80 shadow-[0_0_6px_rgba(52,211,153,0.3)]"
                          : "bg-cyan-400/80 shadow-[0_0_6px_rgba(34,211,238,0.3)]"
                      }`}
                      style={{
                        height: `${h}%`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* LIVE QUALITY METRICS */}
              <div className="mt-6 grid grid-cols-4 gap-3 text-center">
                <div className="rounded-xl bg-white/5 p-3">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500">PSNR</span>
                  <p className="text-base font-bold text-cyan-400 mt-1">94.69 dB</p>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500">SNR</span>
                  <p className="text-base font-bold text-cyan-400 mt-1">72.03 dB</p>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500">BER</span>
                  <p className="text-base font-bold text-purple-400 mt-1">1.00e-6</p>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500">NC</span>
                  <p className="text-base font-bold text-emerald-400 mt-1">1.000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESEARCH HIGHLIGHTS WITH ANIMATED COUNTERS */}
      <section className="relative z-20 mx-auto mt-24 max-w-7xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase tracking-widest text-cyan-400 font-bold">Research Performance</h2>
          <h3 className="text-3xl sm:text-4xl font-bold mt-2">Steganographic Quality Benchmarks</h3>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm">
            Our ML-guided framework achieves unmatched balance between steganographic security and carrier signal preservation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              value: psnrCounter.toFixed(2),
              unit: " dB",
              label: "Average PSNR",
              desc: "Peak Signal-to-Noise Ratio showing near-identical replica output.",
              color: "text-cyan-400"
            },
            {
              value: snrCounter.toFixed(2),
              unit: " dB",
              label: "Signal-to-Noise Ratio",
              desc: "Average signal ratio preserving pure fidelity constraints.",
              color: "text-cyan-400"
            },
            {
              value: "1e−6",
              unit: "",
              label: "Bit Error Rate (BER)",
              desc: "Extracted bits matching source files at near-absolute efficiency.",
              color: "text-purple-400"
            },
            {
              value: "0.9581",
              unit: "",
              label: "ROC-AUC Detection Score",
              desc: "CatBoost model accuracy in distinguishing secure noise zones.",
              color: "text-emerald-400"
            }
          ].map((stat, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-white/10 bg-[#071122] p-8 text-center transition-all duration-300 hover:border-cyan-500/30 hover:shadow-[0_4px_25px_rgba(6,182,212,0.05)] hover:-translate-y-1"
            >
              <h4 className={`text-4xl font-black ${stat.color} tracking-tight`}>
                {stat.value}
                <span className="text-sm font-normal text-slate-500">{stat.unit}</span>
              </h4>
              <p className="mt-3 text-base font-semibold text-white">{stat.label}</p>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CORE RESEARCH FEATURE CARDS */}
      <section className="relative z-20 mx-auto mt-24 max-w-7xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase tracking-widest text-cyan-400 font-bold">Robustness & Features</h2>
          <h3 className="text-3xl sm:text-4xl font-bold mt-2">Core System Offerings</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "ML-guided Frame Selection",
              description: "Uses machine learning to identify optimal audio regions for secure message embedding."
            },
            {
              title: "Adaptive LSB Embedding",
              description: "Dynamically embeds encrypted data while minimizing perceptible audio distortion."
            },
            {
              title: "AES-256 Encryption",
              description: "Encrypts message payloads before embedding to provide an additional security layer."
            },
            {
              title: "Live Quality Analytics",
              description: "Tracks PSNR, SNR, BER and other quality metrics during encoding and decoding."
            },
            {
              title: "Real-time Pipeline Monitoring",
              description: "Visualizes each processing stage from audio validation to message extraction."
            },
            {
              title: "Noise Robustness Testing",
              description: "Evaluates resilience against compression, noise injection and audio modifications."
            }
          ].map((feature, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-white/10 bg-[#071122] p-8 transition-all duration-300 hover:border-cyan-500/30 hover:bg-[#081328]/60 hover:shadow-[0_4px_20px_rgba(255,255,255,0.01)] hover:-translate-y-0.5"
            >
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-6">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="font-semibold text-lg text-white">{feature.title}</h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE ARCHITECTURE EXPLORER */}
      <section id="architecture" className="relative z-20 mx-auto mt-28 max-w-7xl px-6 py-12 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-xs uppercase tracking-widest text-cyan-400 font-bold">Technical Blueprint</h2>
          <h3 className="text-3xl sm:text-4xl font-bold mt-2">Architecture Explorer</h3>
          <p className="text-slate-400 mt-3 max-w-lg mx-auto text-sm">
            Click on each module blocks below to explore how SteganoML segments, processes, and embeds cryptographic payloads.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* ARCH NAVIGATION LIST */}
          <div className="lg:col-span-5 space-y-3.5">
            {archBlocks.map((block, idx) => {
              const Icon = block.icon;
              const isActive = idx === activeArchBlock;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveArchBlock(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center gap-4 outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    isActive
                      ? "border-cyan-500/40 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.06)]"
                      : "border-white/5 bg-[#071122]/30 hover:border-white/20 hover:bg-[#071122]/70"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl transition-colors duration-200 shrink-0 ${
                    isActive ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/25" : "bg-white/5 text-slate-400"
                  }`}>
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className={`font-semibold text-sm transition-colors duration-200 ${isActive ? "text-cyan-300" : "text-slate-300"}`}>
                      {block.title}
                    </p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{block.subtitle}</p>
                  </div>
                  <ChevronRight size={16} className={`ml-auto transition-transform duration-200 ${isActive ? "text-cyan-400 translate-x-0.5" : "text-slate-600"}`} />
                </button>
              );
            })}
          </div>

          {/* ACTIVE ARCH DETAIL VIEW */}
          <div className="lg:col-span-7 rounded-[32px] border border-cyan-500/20 bg-[#081329] p-8 shadow-2xl relative min-h-[300px] flex flex-col justify-between transition-all duration-300 hover:border-cyan-500/30">
            <div className="absolute right-6 top-6 opacity-[0.03] text-cyan-400 pointer-events-none">
              {(() => {
                const Icon = archBlocks[activeArchBlock].icon;
                return <Icon size={180} />;
              })()}
            </div>
            
            <div className="relative z-10 space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                  Step {activeArchBlock + 1} of 6 • {archBlocks[activeArchBlock].subtitle}
                </span>
                <h3 className="text-2xl font-bold text-white mt-2">
                  {archBlocks[activeArchBlock].title}
                </h3>
              </div>
              <p className="text-slate-300 text-base leading-relaxed">
                {archBlocks[activeArchBlock].description}
              </p>
            </div>

            <div className="relative z-10 mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-400">Specifications:</span>
              <span className="font-mono text-cyan-400/80 bg-cyan-500/5 px-3 py-1.5 rounded-lg border border-cyan-500/10">
                {archBlocks[activeArchBlock].detail}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* PREMIUM PATENT & INNOVATION SHOWCASE SECTION */}
      <section className="relative z-20 mx-auto mt-28 max-w-7xl px-6 py-16 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-xs uppercase tracking-widest text-cyan-400 font-bold">Security Disclosures</h2>
          <h3 className="text-3xl sm:text-4xl font-bold mt-2">Patent & Innovation Showcase</h3>
          <p className="text-slate-400 mt-3 max-w-lg mx-auto text-sm">
            Core steganographic techniques engineered and protected as unique scientific disclosures.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {innovations.map((item, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-white/10 bg-[#071122] p-8 flex flex-col justify-between min-h-[260px] transition-all duration-300 hover:border-cyan-500/30 hover:-translate-y-1 hover:shadow-[0_4px_25px_rgba(6,182,212,0.06)]"
            >
              <div>
                <span className="text-[10px] font-mono tracking-widest text-purple-400 uppercase bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                  {item.badge}
                </span>
                <h4 className="text-xl font-bold text-white mt-6">{item.title}</h4>
                <p className="text-slate-400 text-sm mt-3 leading-relaxed">{item.desc}</p>
              </div>
              
              <div className="mt-6 border-t border-white/5 pt-4 text-xs text-slate-600 font-mono">
                SteganoML Secure Encryptor
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RESEARCH RESOURCES */}
      <section className="relative z-20 mx-auto mt-20 max-w-7xl px-6 pb-28">
        <h2 className="mb-12 text-center text-3xl font-bold">Research Resources</h2>

        <div className="grid gap-6 md:grid-cols-3">
          <Link
            href="/about"
            className="rounded-3xl border border-white/10 bg-[#071122] p-8 transition-all duration-300 hover:border-cyan-500/30 hover:bg-[#081328]/60 hover:-translate-y-1 hover:shadow-[0_4px_25px_rgba(6,182,212,0.04)] focus-visible:ring-2 focus-visible:ring-cyan-400 outline-none"
          >
            <h3 className="text-xl font-semibold text-white">About SteganoML</h3>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              Complete project overview, encoding pipeline, decoding workflow, IEEE publication and quality metrics.
            </p>
          </Link>

          <Link
            href="/model-insights"
            className="rounded-3xl border border-white/10 bg-[#071122] p-8 transition-all duration-300 hover:border-cyan-500/30 hover:bg-[#081328]/60 hover:-translate-y-1 hover:shadow-[0_4px_25px_rgba(6,182,212,0.04)] focus-visible:ring-2 focus-visible:ring-cyan-400 outline-none"
          >
            <h3 className="text-xl font-semibold text-white">Model Insights</h3>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              CatBoost performance, ROC-AUC evaluation, confusion matrix and feature importance analysis.
            </p>
          </Link>

          <Link
            href="/research-dataset"
            className="rounded-3xl border border-white/10 bg-[#071122] p-8 transition-all duration-300 hover:border-cyan-500/30 hover:bg-[#081328]/60 hover:-translate-y-1 hover:shadow-[0_4px_25px_rgba(6,182,212,0.04)] focus-visible:ring-2 focus-visible:ring-cyan-400 outline-none"
          >
            <h3 className="text-xl font-semibold text-white">Research Dataset</h3>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              Dataset construction, audio feature extraction, preprocessing and training workflow.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
