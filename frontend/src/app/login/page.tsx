"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Shield, Cpu, Key, Activity, CheckCircle2, Lock, ArrowRight, Eye, EyeOff, AlertTriangle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace("/dashboard");
      }
    }
    checkSession();
  }, [router]);

  // Looping showcase pipeline steps
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  async function handleGoogleSignIn() {
    try {
      setOauthLoading(true);
      setLoginError("");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) {
        setLoginError(error.message);
        setOauthLoading(false);
      }
    } catch (err: any) {
      setLoginError(err.message || "Google Sign-In failed to initialize.");
      setOauthLoading(false);
    }
  }

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
    { title: "Audio Analysis", desc: "Verifying sample rates, bit depth, and spectral constraints." },
    { title: "Payload Encryption", desc: "Encrypting payload bytes using AES-256 with PBKDF2 key derivation." },
    { title: "ML Frame Selection", desc: "Evaluating acoustic parameters using trained tree-boosting classifiers." },
    { title: "Adaptive Embedding", desc: "Adjusting LSB insertion depth based on local frame capacity limits." },
    { title: "Fidelity Verification", desc: "Calculating validation metrics (PSNR, SNR, BER) for transmission assurance." },
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
      <div className="relative flex-1 flex flex-col justify-between items-center px-6 py-12 lg:px-16 xl:px-24 z-10 lg:max-w-[45%] xl:max-w-[40%] bg-[#020817] border-r border-white/5 min-h-screen">
        <div className="absolute left-[-150px] top-[-150px] h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-[100px]" />
        
        {/* LOGO LINK */}
        <Link href="/" className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-cyan-400 outline-none rounded-xl p-1 self-start mb-6 lg:mb-0 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 transition group-hover:scale-105 shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
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
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide leading-none whitespace-nowrap">SteganoML</h1>
            <p className="text-[10px] text-slate-500 mt-1 whitespace-nowrap">Adaptive Audio Steganography Platform</p>
          </div>
        </Link>

        <div className="w-full max-w-sm my-auto py-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Sign In</h2>
              <p className="mt-2 text-sm text-slate-400">
                Access your ML-powered audio payload protection dashboard.
              </p>
            </div>

            <button
              type="button"
              disabled={loading || oauthLoading}
              onClick={handleGoogleSignIn}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:bg-white/10 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] disabled:opacity-50 cursor-pointer text-sm active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              {oauthLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in with Google...</span>
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  <span>Sign in with Google</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-3 py-2">
              <div className="h-[1px] flex-1 bg-white/10" />
              <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">OR</span>
              <div className="h-[1px] flex-1 bg-white/10" />
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="login-email" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Email Address
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
                <div className="relative mt-2">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-4 pr-12 py-3 text-white focus:border-cyan-500/50 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020817] outline-none transition-all duration-200"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition focus-visible:text-white outline-none cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {loginError && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400 flex items-start gap-3 transition-all duration-300"
              >
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Authentication Failed</p>
                  <p className="mt-1 text-xs text-red-400/80">{loginError}</p>
                </div>
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
                  <span>Sign In to Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="text-center text-sm text-slate-500 pt-2 border-t border-white/5">
              Don't have an account?{" "}
              <Link href="/register" className="text-cyan-400 font-medium hover:underline hover:text-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-400 outline-none rounded px-1 py-0.5">
                Sign up
              </Link>
            </div>
          </form>
        </div>

        {/* SAAS FOOTER */}
        <div className="w-full max-w-sm mt-auto pt-6 border-t border-white/5">
          <p className="text-[10.5px] text-slate-500 font-mono tracking-tight text-center lg:text-left">
            © {new Date().getFullYear()} SteganoML. All Rights Reserved.
          </p>
          <p className="text-[10px] text-slate-500 mt-1 text-center lg:text-left">
            SteganoML is an adaptive audio steganography platform guided by machine learning.
          </p>
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
