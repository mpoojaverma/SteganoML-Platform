"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Shield,
  Cpu,
  Lock,
  Activity,
  CheckCircle2,
  ChevronRight,
  Sliders,
  Zap,
  Check,
  X,
  FileText,
  HelpCircle,
  Sparkles
} from "lucide-react";

const encodeSteps = [
  {
    title: "Upload Audio Carrier",
    description: "The user uploads a lossless WAV audio file which acts as the carrier medium. The platform checks audio format parameters like sample rate and bit depth.",
    icon: FileText,
    detail: "Supports WAV (16-bit PCM / 24-bit PCM), automatically extracts wave samples."
  },
  {
    title: "AES-256 Encryption",
    description: "The secret message is encrypted using a password-derived key using PBKDF2 key derivation. This encapsulates the payload in a cryptographic envelope.",
    icon: Lock,
    detail: "AES-256-CBC with random 16-byte initialization vector (IV) and salt."
  },
  {
    title: "ML Frame Analysis",
    description: "CatBoost tree ensemble classifier analyzes audio frame features (RMS energy, MFCCs, spectral properties) to predict high-capacity, acoustically stable regions.",
    icon: Cpu,
    detail: "Analyzes 20ms frames; returns a capacity stability probability score per frame."
  },
  {
    title: "Adaptive Embedding",
    description: "Encrypted payload bits are dynamically embedded into the Least Significant Bits (LSB) of selected high-score frames, keeping low-energy/silent frames untouched.",
    icon: Zap,
    detail: "Modulates LSB insertion depth adaptively based on local frame capacity limits."
  },
  {
    title: "Stego Audio Export",
    description: "The final stego-audio file is synthesized and exported. It sounds identical to the original carrier, ensuring absolute visual/auditory imperceptibility.",
    icon: CheckCircle2,
    detail: "Maintains original audio headers and structure; achieves high PSNR (> 90 dB)."
  },
];

const decodeSteps = [
  {
    title: "Upload Stego Audio",
    description: "The recipient uploads the stego-audio file containing the hidden, encrypted message for extraction.",
    icon: FileText,
    detail: "Input must match the stego-encoded file dimensions and sample attributes."
  },
  {
    title: "Password Verification",
    description: "The supplied password is run through PBKDF2 with the embedded salt to derive the symmetric decryption key.",
    icon: Lock,
    detail: "Cryptographic key derivation matches the encoding specifications."
  },
  {
    title: "Stable Region Recovery",
    description: "The classification engine uses the identical ML scoring pass to locate and target the exact frame sequence used for embedding.",
    icon: Cpu,
    detail: "Locates stego sample zones without needing the original, unencoded carrier audio."
  },
  {
    title: "Bit Stream Extraction",
    description: "Recovered stego samples have their least significant bits read to assemble the encrypted byte sequence.",
    icon: Zap,
    detail: "Collects payload stream bits from the active sample frame coordinates."
  },
  {
    title: "Decryption & Message Restore",
    description: "The cryptographic envelope is opened using the derived AES-256 key, validating integrity and displaying the original secret message.",
    icon: CheckCircle2,
    detail: "Decrypted byte stream is rendered as UTF-8 text or downloaded as a raw file."
  },
];

const technologies = [
  { name: "Next.js", desc: "React Framework for premium, responsive UI development and routing.", color: "hover:border-cyan-400/50 hover:bg-cyan-500/5 text-cyan-400" },
  { name: "FastAPI", desc: "High-performance Python backend powering feature extraction and ML pipelines.", color: "hover:border-emerald-400/50 hover:bg-emerald-500/5 text-emerald-400" },
  { name: "CatBoost", desc: "Tree boosting machine learning library designed for tabular acoustic parameters.", color: "hover:border-purple-400/50 hover:bg-purple-500/5 text-purple-400" },
  { name: "Supabase", desc: "PostgreSQL database and secure client auth management.", color: "hover:border-blue-400/50 hover:bg-blue-500/5 text-blue-400" },
  { name: "Python", desc: "Scientific environment using Librosa for feature engineering and extraction.", color: "hover:border-amber-400/50 hover:bg-amber-500/5 text-amber-400" },
  { name: "Tailwind CSS", desc: "Modern styling engine for premium design layout and fluid components.", color: "hover:border-pink-400/50 hover:bg-pink-500/5 text-pink-400" },
];

export default function AboutPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pipelineMode, setPipelineMode] = useState<"encode" | "decode">("encode");
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
      }
    }
    checkSession();
  }, []);

  const steps = pipelineMode === "encode" ? encodeSteps : decodeSteps;

  return (
    <main className="min-h-screen bg-[#020817] text-white relative overflow-hidden font-sans">
      {/* Background Ornaments */}
      <div className="absolute left-[-200px] top-[-200px] h-[600px] w-[600px] rounded-full bg-cyan-500/5 blur-[160px] pointer-events-none" />
      <div className="absolute right-[-200px] top-[100px] h-[600px] w-[600px] rounded-full bg-purple-500/5 blur-[160px] pointer-events-none" />
      <div className="absolute left-[30%] bottom-[-200px] h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[160px] pointer-events-none" />

      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* NAVBAR */}
      <nav className="relative z-30 border-b border-white/5 bg-[#020817]/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3 group outline-none">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 transition group-hover:scale-105 shrink-0">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                <rect x="2" y="2" width="20" height="20" rx="6" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.5" className="stroke-cyan-500/25" />
                <path d="M5 12c1.5-4 3.5-4 5 0s3.5 4 5 0 3.5-4 5 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-cyan-400" />
                <path d="M7 12c1.2-2.5 2.8-2.5 4 0s2.8 2.5 4 0 2.8-2.5 4 0" stroke="currentColor" strokeWidth="1" strokeDasharray="1.5 1.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-cyan-300/50" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">SteganoML</h1>
              <p className="text-[10px] text-slate-500 mt-1">Secure Audio Steganography</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-semibold text-black transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] focus-visible:ring-2 focus-visible:ring-cyan-400 outline-none cursor-pointer"
            >
              {isLoggedIn ? "Go to Dashboard" : "Launch App"}
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-20 mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <div className="rounded-[40px] border border-cyan-500/20 bg-gradient-to-br from-[#07111f] via-[#081528] to-[#07111f] p-8 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 px-4 py-2 text-xs font-medium text-cyan-300">
            <Sparkles size={12} className="animate-spin" />
            Research Project Overview
          </span>
          <h1 className="mt-8 text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none">
            About SteganoML
          </h1>
          <h2 className="mt-4 max-w-5xl text-xl sm:text-3xl font-semibold text-cyan-400/90 leading-tight">
            Adaptive Machine Learning Guided Audio Steganography Platform
          </h2>
          <p className="mt-8 max-w-4xl text-base sm:text-lg leading-relaxed text-slate-300">
            SteganoML leverages advanced tree-ensemble modeling, adaptive LSB embedding,
            and robust cryptography to embed secret payloads within audio files. By identifying optimal masking thresholds per frame, SteganoML guarantees both high data integrity and auditory transparency.
          </p>
        </div>
      </section>

      {/* PROJECT VISION */}
      <section className="relative z-20 mx-auto max-w-7xl px-6 py-6">
        <div className="rounded-3xl border border-white/5 bg-[#07111f]/60 p-8 md:p-12 backdrop-blur-md hover:border-cyan-500/10 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <div className="space-y-4 max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Project Vision</h2>
              <p className="text-sm sm:text-base leading-relaxed text-slate-400">
                Traditional audio steganography algorithms typically write bits uniformly across the carrier signal, creating detectable spectral signatures. SteganoML changes this paradigm by introducing an intelligent, trained machine learning model. The model predicts which specific frames contain enough acoustic noise, mask energy, or high frequency complexity to hide alterations seamlessly.
              </p>
            </div>
            <div className="shrink-0 flex items-center justify-center h-20 w-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <Shield size={36} />
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE PIPELINE EXPLORER */}
      <section className="relative z-20 mx-auto mt-24 max-w-7xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase tracking-widest text-cyan-400 font-bold">How it Works</h2>
          <h3 className="text-3xl sm:text-4xl font-bold mt-2">Interactive Pipeline Explorer</h3>
          <p className="text-slate-400 mt-3 max-w-md mx-auto text-sm">
            Toggle between the embedding and retrieval operations to explore the technical steps in detail.
          </p>

          {/* Toggle Buttons */}
          <div className="flex justify-center mt-8">
            <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-white/5">
              <button
                onClick={() => { setPipelineMode("encode"); setActiveStep(0); }}
                className={`rounded-lg px-6 py-2.5 text-xs font-semibold tracking-wide transition-all outline-none cursor-pointer ${
                  pipelineMode === "encode" ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/15" : "text-slate-400 hover:text-white"
                }`}
              >
                Encoding Phase
              </button>
              <button
                onClick={() => { setPipelineMode("decode"); setActiveStep(0); }}
                className={`rounded-lg px-6 py-2.5 text-xs font-semibold tracking-wide transition-all outline-none cursor-pointer ${
                  pipelineMode === "decode" ? "bg-purple-500 text-white shadow-md shadow-purple-500/15" : "text-slate-400 hover:text-white"
                }`}
              >
                Decoding Phase
              </button>
            </div>
          </div>
        </div>

        {/* Visual pipeline block */}
        <div className="grid gap-8 lg:grid-cols-12 items-start mt-8">
          {/* Step Selector List (Left Column) */}
          <div className="lg:col-span-5 space-y-3">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === activeStep;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center gap-4 outline-none cursor-pointer focus-visible:ring-2 ${
                    pipelineMode === "encode"
                      ? isActive
                        ? "border-cyan-500/40 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.06)]"
                        : "border-white/5 bg-[#071122]/30 hover:border-white/20 hover:bg-[#071122]/70"
                      : isActive
                        ? "border-purple-500/40 bg-purple-500/5 shadow-[0_0_15px_rgba(168,85,247,0.06)]"
                        : "border-white/5 bg-[#071122]/30 hover:border-white/20 hover:bg-[#071122]/70"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl transition-colors duration-200 shrink-0 ${
                    isActive
                      ? pipelineMode === "encode"
                        ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/25"
                        : "bg-purple-500 text-white shadow-lg shadow-purple-500/25"
                      : "bg-white/5 text-slate-400"
                  }`}>
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className={`font-semibold text-sm transition-colors duration-200 ${
                      isActive
                        ? pipelineMode === "encode" ? "text-cyan-300" : "text-purple-300"
                        : "text-slate-300"
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">Step {idx + 1}</p>
                  </div>
                  <ChevronRight size={16} className={`ml-auto transition-transform duration-200 ${isActive ? "text-cyan-400 translate-x-0.5" : "text-slate-600"}`} />
                </button>
              );
            })}
          </div>

          {/* Active Step Panel (Right Column) */}
          <div className={`lg:col-span-7 rounded-[32px] border bg-[#081329] p-8 shadow-2xl relative min-h-[300px] flex flex-col justify-between transition-all duration-300 hover:border-white/10 ${
            pipelineMode === "encode" ? "border-cyan-500/25" : "border-purple-500/25"
          }`}>
            <div className={`absolute right-6 top-6 opacity-[0.03] pointer-events-none ${
              pipelineMode === "encode" ? "text-cyan-400" : "text-purple-400"
            }`}>
              {(() => {
                const Icon = steps[activeStep].icon;
                return <Icon size={180} />;
              })()}
            </div>

            <div className="relative z-10 space-y-6">
              <div>
                <span className={`text-xs font-mono uppercase tracking-widest ${
                  pipelineMode === "encode" ? "text-cyan-400" : "text-purple-400"
                }`}>
                  Phase Step {activeStep + 1} of 5
                </span>
                <h3 className="text-2xl font-bold text-white mt-2">
                  {steps[activeStep].title}
                </h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed sm:text-base">
                {steps[activeStep].description}
              </p>
            </div>

            <div className="relative z-10 mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-3">
              <span className="font-semibold text-slate-400">Pipeline Parameters:</span>
              <span className={`font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 ${
                pipelineMode === "encode" ? "text-cyan-400/90" : "text-purple-400/90"
              }`}>
                {steps[activeStep].detail}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* QUALITY METRICS WITH STATUS GAUGES */}
      <section className="relative z-20 mx-auto mt-28 max-w-7xl px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight">Audio Quality Standards</h2>
        <p className="text-slate-400 text-sm mt-3 text-center max-w-md mx-auto">
          Our adaptive ML architecture maintains performance well within industry-accepted transparent limits.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {/* Card 1: PSNR */}
          <div className="rounded-[32px] border border-cyan-500/10 bg-[#07111f]/40 p-8 hover:border-cyan-500/30 transition duration-300">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-2 py-0.5 rounded">
                  Imperceptibility
                </span>
                <h3 className="text-3xl font-extrabold text-white mt-4">PSNR</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 font-mono">SteganoML Average</span>
                <p className="text-2xl font-bold text-cyan-400">94.69 dB</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              Peak Signal-to-Noise Ratio measures similarity between raw carrier files and generated stego audio files. Larger numbers mean lower distortion.
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Acceptable (30 dB)</span>
                <span>Excellent (&gt;40 dB)</span>
                <span>SteganoML (94 dB)</span>
              </div>
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: "95%" }} />
              </div>
            </div>
          </div>

          {/* Card 2: SNR */}
          <div className="rounded-[32px] border border-cyan-500/10 bg-[#07111f]/40 p-8 hover:border-cyan-500/30 transition duration-300">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-2 py-0.5 rounded">
                  Signal Fidelity
                </span>
                <h3 className="text-3xl font-extrabold text-white mt-4">SNR</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 font-mono">SteganoML Average</span>
                <p className="text-2xl font-bold text-cyan-400">72.03 dB</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              Signal-to-Noise Ratio quantifies carrier content strength versus noise added during embedding. Higher ratios preserve tone fidelity.
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Standard (20 dB)</span>
                <span>Excellent (&gt;30 dB)</span>
                <span>SteganoML (72 dB)</span>
              </div>
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: "88%" }} />
              </div>
            </div>
          </div>

          {/* Card 3: BER */}
          <div className="rounded-[32px] border border-purple-500/10 bg-[#07111f]/40 p-8 hover:border-purple-500/30 transition duration-300">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-purple-400 uppercase bg-purple-500/10 px-2 py-0.5 rounded">
                  Data Accuracy
                </span>
                <h3 className="text-3xl font-extrabold text-white mt-4">BER</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 font-mono">SteganoML Average</span>
                <p className="text-2xl font-bold text-purple-400">1.00e-6</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              Bit Error Rate assesses payload bit alterations during extraction. Lower ratios denote reliable recovery of the embedded secret message.
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Poor (&gt;0.05)</span>
                <span>Good (&lt;0.01)</span>
                <span>Ideal (0.00)</span>
              </div>
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ width: "99.9%" }} />
              </div>
            </div>
          </div>

          {/* Card 4: NC */}
          <div className="rounded-[32px] border border-purple-500/10 bg-[#07111f]/40 p-8 hover:border-purple-500/30 transition duration-300">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-purple-400 uppercase bg-purple-500/10 px-2 py-0.5 rounded">
                  Correlation Coeff
                </span>
                <h3 className="text-3xl font-extrabold text-white mt-4">NC</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 font-mono">SteganoML Average</span>
                <p className="text-2xl font-bold text-purple-400">1.000</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              Normalized Correlation captures alignment shape similarity between the embedded input payload and recovered output text.
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Distorted (&lt;0.7)</span>
                <span>Coherent (&gt;0.9)</span>
                <span>Perfect (1.0)</span>
              </div>
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ width: "100%" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRADITIONAL VS STEGANOML COMPARISON */}
      <section className="relative z-20 mx-auto mt-28 max-w-7xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase tracking-widest text-cyan-400 font-bold">Architecture Contrast</h2>
          <h3 className="text-3xl sm:text-4xl font-bold mt-2">Traditional LSB vs. SteganoML</h3>
          <p className="text-slate-400 mt-3 max-w-md mx-auto text-sm">
            Comparison showing key differences between legacy blind insertion algorithms and SteganoML.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Column 1: Traditional LSB */}
          <div className="rounded-3xl border border-white/5 bg-[#050b16]/60 p-8 relative overflow-hidden transition-all duration-300 hover:border-white/10">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-red-500/5 blur-[50px] pointer-events-none" />
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
              <div className="h-8 w-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center font-bold">L</div>
              <h4 className="text-xl font-bold text-slate-300">Traditional LSB</h4>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <X className="text-red-500 shrink-0 mt-0.5" size={16} />
                <span>Writes bits sequentially across random or arbitrary sample indices.</span>
              </li>
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <X className="text-red-500 shrink-0 mt-0.5" size={16} />
                <span>Fixed payload density without context analysis, causing noise spikes.</span>
              </li>
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <X className="text-red-500 shrink-0 mt-0.5" size={16} />
                <span>Highly vulnerable to steganalysis, filter alterations, or audio compression.</span>
              </li>
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <X className="text-red-500 shrink-0 mt-0.5" size={16} />
                <span>No intelligent signal evaluation or frame capacity prediction algorithms.</span>
              </li>
            </ul>
          </div>

          {/* Column 2: SteganoML */}
          <div className="rounded-3xl border border-cyan-500/20 bg-[#071329]/80 p-8 relative overflow-hidden transition-all duration-300 hover:border-cyan-500/40 shadow-xl shadow-cyan-950/20">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-cyan-500/10 blur-[50px] pointer-events-none" />
            <div className="flex items-center gap-3 border-b border-cyan-500/10 pb-4 mb-6">
              <div className="h-8 w-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">S</div>
              <h4 className="text-xl font-bold text-white">SteganoML Platform</h4>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-200 text-sm">
                <Check className="text-cyan-400 shrink-0 mt-0.5" size={16} />
                <span>Identifies and hides payload sample bits only in ML-selected carrier regions.</span>
              </li>
              <li className="flex items-start gap-3 text-slate-200 text-sm">
                <Check className="text-cyan-400 shrink-0 mt-0.5" size={16} />
                <span>Adjusts density adaptively according to dynamic acoustic frame thresholds.</span>
              </li>
              <li className="flex items-start gap-3 text-slate-200 text-sm">
                <Check className="text-cyan-400 shrink-0 mt-0.5" size={16} />
                <span>Maintains zero Bit Error Rate and robust structure under standard channel parameters.</span>
              </li>
              <li className="flex items-start gap-3 text-slate-200 text-sm">
                <Check className="text-cyan-400 shrink-0 mt-0.5" size={16} />
                <span>Trained CatBoost tree ensemble models accurately predict stego masking profiles.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* TECHNOLOGY STACK */}
      <section className="relative z-20 mx-auto mt-28 mb-24 max-w-7xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase tracking-widest text-cyan-400 font-bold">Tech Framework</h2>
          <h3 className="text-3xl sm:text-4xl font-bold mt-2">Engineered Tech Stack</h3>
          <p className="text-slate-400 mt-3 max-w-md mx-auto text-sm">
            SteganoML relies on state-of-the-art framework technologies to deliver reliable performance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologies.map((tech) => (
            <div
              key={tech.name}
              className={`rounded-3xl border border-white/5 bg-[#07111f]/50 p-8 transition-all duration-300 hover:scale-[1.02] cursor-default ${tech.color}`}
            >
              <h3 className="text-2xl font-bold text-white">{tech.name}</h3>
              <p className="mt-4 text-xs sm:text-sm text-slate-400 leading-relaxed">
                {tech.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* MINIMAL FOOTER */}
      <footer className="relative z-30 border-t border-white/5 bg-[#020817] py-8">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <span>© 2026 SteganoML. All Rights Reserved.</span>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-cyan-400 transition">Home</Link>
            <Link href="/model-insights" className="hover:text-cyan-400 transition">Model Insights</Link>
            <Link href="/research-dataset" className="hover:text-cyan-400 transition">Dataset</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
