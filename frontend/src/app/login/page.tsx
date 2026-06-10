"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Shield, Cpu, Key, Activity, CheckCircle2, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  // Looping showcase pipeline steps
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  async function handleLogin() {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoginError(error.message);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setLoginError("Login Failed");
    } finally {
      setLoading(false);
    }
  }

  // Modulate waveform heights based on active pipeline stage
  const getWaveformHeights = (step: number) => {
    switch (step) {
      case 0: // Validation: low uniform sine wave
        return Array.from({ length: 34 }, (_, i) => Math.abs(Math.sin(i * 0.3) * 16) + 6);
      case 1: // Encryption: chaotic high noise
        return Array.from({ length: 34 }, (_, i) => (i % 2 === 0 ? 32 : 8) + Math.random() * 8);
      case 2: // ML Analysis: focused selection blocks
        return Array.from({ length: 34 }, (_, i) => (i > 10 && i < 24 ? 38 : 10));
      case 3: // Adaptive Embedding: sharp spiky data inserts
        return Array.from({ length: 34 }, (_, i) => (i % 3 === 0 ? 44 : 8));
      case 4: // Quality Verification: perfect balanced stego wave
        return Array.from({ length: 34 }, (_, i) => Math.abs(Math.sin(i * 0.22) * 26) + 10);
      default:
        return Array.from({ length: 34 }, () => 14);
    }
  };

  const steps = [
    { title: "Audio Validation", desc: "Checking sample rates, audio bit depth, and constraints" },
    { title: "AES-256 Encryption", desc: "Encrypting secret payload using derives from PBKDF2" },
    { title: "ML Frame Analysis", desc: "CatBoost selecting acoustically stable frames" },
    { title: "Adaptive Embedding", desc: "Embedding payload bits into unperceived LSB spaces" },
    { title: "Quality Verification", desc: "Running validation metrics (PSNR, SNR, BER, NC)" },
  ];

  const floatingBadges = [
    { text: "AES-256", icon: Lock, top: "12%", left: "8%" },
    { text: "CatBoost ML", icon: Cpu, top: "22%", right: "10%" },
    { text: "PBKDF2 Key", icon: Key, bottom: "18%", left: "12%" },
    { text: "ML-Guided", icon: Activity, bottom: "28%", right: "8%" },
  ];

  return (
    <main className="relative flex min-h-screen bg-[#020817] text-white flex-col lg:flex-row overflow-x-hidden">
      {/* LEFT PANEL: AUTH FORM */}
      <div className="relative flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-16 xl:px-24 z-10 lg:max-w-[45%] xl:max-w-[40%] bg-[#020817] border-r border-white/5">
        <div className="absolute left-[-150px] top-[-150px] h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-[100px]" />
        
        {/* LOGO LINK */}
        <Link href="/" className="mb-12 flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-cyan-400 outline-none rounded-xl p-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 font-bold text-cyan-400 border border-cyan-500/10 transition group-hover:scale-105">
            S
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">SteganoML</h1>
            <p className="text-xs text-slate-500">Audio Steganography Platform</p>
          </div>
        </Link>

        <div className="w-full max-w-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
              <p className="mt-2 text-sm text-slate-400">
                Sign in to your secure research node.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="login-email" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-500/50 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020817] outline-none transition-all duration-200"
                  placeholder="name@domain.com"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label htmlFor="login-password" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-500/50 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020817] outline-none transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {loginError && (
              <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-400">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-500 py-3.5 font-semibold text-black flex items-center justify-center gap-2 transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020817] outline-none cursor-pointer text-sm shadow-lg shadow-cyan-500/20 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="text-center text-sm text-slate-500 pt-2 border-t border-white/5">
              New here?{" "}
              <Link href="/register" className="text-cyan-400 font-medium hover:underline hover:text-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-400 outline-none rounded px-1 py-0.5">
                Create Account
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT PANEL: INTERACTIVE PIPELINE SHOWCASE (HIDDEN ON MOBILE) */}
      <div className="hidden lg:flex flex-1 bg-[#040b19] relative overflow-hidden items-center justify-center p-12">
        {/* Dynamic Background Glows */}
        <div className="absolute right-[-100px] top-[-100px] h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[130px]" />
        <div className="absolute left-[10%] bottom-[5%] h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[130px]" />

        {/* Floating Security Badges */}
        {floatingBadges.map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <div
              key={idx}
              className="absolute z-20 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md px-3.5 py-1.5 text-xs text-slate-300 shadow-xl transition-all duration-300 hover:border-cyan-500/30 hover:bg-cyan-500/5 animate-pulse"
              style={{
                top: badge.top,
                bottom: badge.bottom,
                left: badge.left,
                right: badge.right,
                animationDelay: `${idx * 0.8}s`,
                animationDuration: "4s"
              }}
            >
              <Icon size={12} className="text-cyan-400" />
              <span>{badge.text}</span>
            </div>
          );
        })}

        {/* CENTRAL PIPELINE CARD */}
        <div className="relative z-10 w-full max-w-xl rounded-[32px] border border-white/10 bg-[#081225]/85 p-8 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-white/20">
          <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">Security Architecture</span>
              <h3 className="text-xl font-bold text-white mt-0.5">ML-Guided Embedding</h3>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs text-cyan-300 animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span>PIPELINE ACTIVE</span>
            </div>
          </div>

          {/* SteganoML Pipeline Stages */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;

              return (
                <div
                  key={index}
                  className={`flex gap-4 p-3 rounded-2xl border transition-all duration-300 ${
                    isActive
                      ? "border-cyan-500/30 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.05)] translate-x-1"
                      : "border-transparent bg-transparent"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0 transition-all duration-300 ${
                      isCompleted
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : isActive
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse"
                          : "bg-white/5 text-slate-500 border border-transparent"
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
                    <p
                      className={`text-xs mt-0.5 transition-colors duration-300 ${
                        isActive ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DYNAMIC WAVEFORM VISUALIZER */}
          <div className="mt-8 rounded-2xl bg-white/[0.02] border border-white/5 p-4 relative overflow-hidden">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Audio Carrier Spectrum</span>
              <span className="text-[10px] font-mono text-cyan-400/80">{steps[activeStep].title}</span>
            </div>
            <div className="h-16 w-full flex items-center justify-between gap-[3px]">
              {getWaveformHeights(activeStep).map((h, i) => (
                <div
                  key={i}
                  className={`w-[4px] rounded-full transition-all duration-500 ${
                    activeStep === 4
                      ? "bg-emerald-400/80 shadow-[0_0_6px_rgba(52,211,153,0.3)]"
                      : activeStep === 1
                        ? "bg-purple-400/70"
                        : "bg-cyan-400/80 shadow-[0_0_6px_rgba(34,211,238,0.3)]"
                  }`}
                  style={{
                    height: `${h}%`,
                    animationDelay: `${i * 15}ms`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* SAAS RESULTS QUALITY METRICS */}
          <div className="mt-6 grid grid-cols-4 gap-3">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 transition duration-200 hover:border-white/10">
              <span className="text-[9px] uppercase tracking-wider text-slate-500">PSNR</span>
              <p className="text-base font-bold text-cyan-400 mt-1 leading-none">94.69 dB</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 transition duration-200 hover:border-white/10">
              <span className="text-[9px] uppercase tracking-wider text-slate-500">SNR</span>
              <p className="text-base font-bold text-cyan-400 mt-1 leading-none">72.03 dB</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 transition duration-200 hover:border-white/10">
              <span className="text-[9px] uppercase tracking-wider text-slate-500">BER</span>
              <p className="text-base font-bold text-purple-400 mt-1 leading-none">1.00e-6</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 transition duration-200 hover:border-white/10">
              <span className="text-[9px] uppercase tracking-wider text-slate-500">NC</span>
              <p className="text-base font-bold text-emerald-400 mt-1 leading-none">1.000</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
