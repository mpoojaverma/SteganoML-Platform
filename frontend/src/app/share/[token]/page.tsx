"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Lock, 
  Unlock, 
  Download, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  Eye, 
  EyeOff, 
  FileAudio,
  ShieldCheck,
  RefreshCw,
  Cpu,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

const isLocalhost = typeof window !== "undefined" && 
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const API_BASE = isLocalhost 
  ? "http://127.0.0.1:8000/api" 
  : (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api");

export default function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const unwrappedParams = React.use(params);
  const token = unwrappedParams.token;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("loading");
  const [fileInfo, setFileInfo] = useState<any>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  async function fetchShareInfo(verifyPassword?: string) {
    setLoading(true);
    setError(null);
    setPasswordError(null);

    try {
      const response = verifyPassword
        ? await axios.post(`${API_BASE}/share/info/${token}`, { password: verifyPassword })
        : await axios.post(`${API_BASE}/share/info/${token}`);
      const data = response.data;

      if (data.status === "password_protected") {
        setStatus("password_protected");
      } else {
        setStatus("active");
        setFileInfo(data);
      }
    } catch (err: any) {
      console.error(err);
      const status_code = err?.response?.status;
      const detail = err?.response?.data?.detail;

      if (status_code === 401) {
        setPasswordError("Incorrect password. Please verify and try again.");
        setStatus("password_protected");
      } else if (status_code === 410) {
        setStatus("expired");
        setError(detail || "This secure share link has expired.");
      } else if (status_code === 403) {
        if (detail && detail.toLowerCase().includes("limit")) {
          setStatus("download_limit_reached");
        } else {
          setStatus("disabled");
        }
        setError(detail || "This secure share link is inactive.");
      } else if (status_code === 404) {
        setStatus("not_found");
        setError("Secure link not found. It may have been permanently deleted.");
      } else {
        setStatus("error");
        setError("Unable to retrieve shared file details. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      fetchShareInfo();
    }
  }, [token]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setPasswordError("Password is required.");
      return;
    }
    fetchShareInfo(password);
  };

  const handleDownload = () => {
    if (!token) return;
    const downloadUrl = `${API_BASE}/share/download/${token}${
      password ? `?password=${encodeURIComponent(password)}` : ""
    }`;
    window.location.href = downloadUrl;

    // Refresh info to update downloads remaining metric after a slight delay
    setTimeout(() => {
      fetchShareInfo(password || undefined);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#020817] text-white relative overflow-hidden">
      {/* Decorative glowing lines and dots overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-white/5 bg-[#0b1327]/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1.5px]">
              <div className="h-full w-full bg-[#020817] rounded-lg flex items-center justify-center font-bold text-sm text-cyan-400">
                S
              </div>
            </div>
            <span className="font-extrabold tracking-tight text-lg bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent font-sans">
              SteganoML
            </span>
          </div>
          <span className="text-[10px] font-mono bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
            Secure Delivery
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 lg:p-8 relative">
        {/* Floating glow accents */}
        <div className="absolute left-1/4 top-1/3 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute right-1/4 bottom-1/3 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-[4fr_6fr] lg:grid-cols-2 gap-8 lg:gap-16 items-center py-8 z-10">
          
          {/* Left Column (Visual Branding & Pipeline Visualizations) */}
          <div className="space-y-6 lg:pr-8 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Secure Delivery Protocol
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent font-sans">
              Secure Audio Delivery
            </h1>

            <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
              This protected audio asset was shared through SteganoML's encrypted delivery platform. Access is securely monitored, limits are automatically enforced, and download keys are derived dynamically.
            </p>

            {/* Interactive Flow Visualizer */}
            <div className="space-y-4 pt-4">
              {/* Waveform Bouncing Bars */}
              <div className="relative border border-white/5 bg-[#0b1327]/30 backdrop-blur-sm rounded-2xl p-6 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
                <div className="absolute -left-12 -top-12 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="relative flex items-end justify-center gap-1 h-20 w-full">
                  {[...Array(24)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 rounded-full bg-gradient-to-t from-cyan-400 to-indigo-500"
                      animate={{
                        height: [
                          `${Math.floor(Math.sin(i * 0.4) * 30) + 35}px`,
                          `${Math.floor(Math.cos(i * 0.3) * 45) + 48}px`,
                          `${Math.floor(Math.sin(i * 0.4) * 30) + 35}px`
                        ]
                      }}
                      transition={{
                        duration: 1.5 + (i % 3) * 0.3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
                <p className="text-[10px] font-mono text-center text-slate-500 mt-3">Acoustic Masking Frame Selection Active</p>
              </div>

              {/* Transmission Node Pulse Animation */}
              <div className="relative flex items-center justify-between border border-white/5 bg-[#0b1327]/30 backdrop-blur-sm rounded-2xl p-6 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:12px_12px]" />
                
                <div className="relative flex flex-col items-center gap-1.5 z-10">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-md">
                    <Cpu size={18} />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">Sender Node</span>
                </div>
                
                <div className="flex-1 relative mx-4 h-[2px] bg-white/5">
                  <motion.div 
                    className="absolute top-0 h-full w-12 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                    animate={{ left: ["-20%", "120%"] }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>
                
                <div className="relative flex flex-col items-center gap-1.5 z-10">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shadow-md">
                    <Lock size={18} />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">Receiver</span>
                </div>
              </div>
            </div>

            {/* Trust Badges Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-[#0b1327]/30 p-3 text-xs font-medium text-slate-300 backdrop-blur-sm">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                  <Lock size={14} />
                </div>
                <span>AES-256 Encrypted</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-[#0b1327]/30 p-3 text-xs font-medium text-slate-300 backdrop-blur-sm">
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
                  <Cpu size={14} />
                </div>
                <span>ML-Guided Embedding</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-[#0b1327]/30 p-3 text-xs font-medium text-slate-300 backdrop-blur-sm">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <ShieldCheck size={14} />
                </div>
                <span>Research-Backed</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-[#0b1327]/30 p-3 text-xs font-medium text-slate-300 backdrop-blur-sm">
                <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 shrink-0">
                  <Zap size={14} />
                </div>
                <span>Secure Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column (Dynamic State Cards) */}
          <div className="w-full max-w-md mx-auto">
            {loading ? (
              <div className="rounded-[24px] border border-white/10 bg-[#0b1327]/60 p-8 text-center space-y-4 shadow-xl glass">
                <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                <p className="text-sm text-slate-400 font-medium animate-pulse">
                  Decrypting shared envelope...
                </p>
              </div>
            ) : status === "password_protected" ? (
              <div className="rounded-[24px] border border-white/10 bg-[#0b1327] p-8 shadow-2xl space-y-6 relative overflow-hidden transition-all duration-300">
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600" />
                
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto shadow-md">
                    <Lock size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Protected Shared File</h2>
                  <p className="text-xs text-slate-400 leading-normal">
                    This share link requires a secondary access password configured by the sender.
                  </p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 block mb-2">
                      Enter Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full rounded-xl border border-white/5 bg-white/5 pl-4 pr-12 py-3.5 outline-none focus:border-cyan-500/50 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1327] transition-all text-sm"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition outline-none cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-red-400 text-xs mt-2 flex items-start gap-1">
                        <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                        <span>{passwordError}</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#1bd6d1] py-3.5 text-sm font-semibold text-black hover:brightness-110 active:scale-[0.98] transition cursor-pointer shadow-lg shadow-cyan-500/10"
                  >
                    Verify Access Password
                  </button>
                </form>
              </div>
            ) : status === "active" && fileInfo ? (
              <div className="rounded-[24px] border border-white/10 bg-[#0b1327] p-8 shadow-2xl space-y-6 relative overflow-hidden transition-all duration-300">
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
                
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                    <ShieldCheck size={22} />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Delivery Details</h2>
                  <p className="text-xs text-slate-400">
                    Steganography output package is validated and ready.
                  </p>
                </div>

                {/* File details card */}
                <div className="rounded-xl border border-white/5 bg-[#020817]/60 p-4 space-y-3.5">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white/5 text-cyan-400 shrink-0">
                      <FileAudio size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">File Name</p>
                      <p className="text-sm font-semibold text-white truncate mt-0.5" title={fileInfo.file_name}>
                        {fileInfo.file_name}
                      </p>
                    </div>
                  </div>

                  <hr className="border-white/5" />

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Clock size={11} /> Expires On
                      </span>
                      <p className="font-semibold text-slate-300">
                        {new Date(fileInfo.expires_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Download size={11} /> Downloads Remaining
                      </span>
                      <p className="font-semibold text-slate-300">
                        {fileInfo.downloads_remaining === "Unlimited" 
                          ? "Unlimited" 
                          : `${fileInfo.downloads_remaining}`}
                      </p>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck size={11} /> Protection Status
                      </span>
                      <p className="font-semibold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        <span>{fileInfo.is_password_protected ? "Double Protected (Encrypted + Password)" : "Signal Encrypted"}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 py-3.5 text-sm font-semibold text-black hover:brightness-110 active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10"
                >
                  <Download size={16} />
                  <span>Secure Download</span>
                </button>

                <p className="text-[10px] text-center text-slate-500 leading-normal">
                  Downloads are redirected securely via authenticated 60-second storage endpoints. Direct table access is blocked.
                </p>
              </div>
            ) : (
              <div className="rounded-[24px] border border-red-500/20 bg-red-500/5 p-8 shadow-2xl text-center space-y-4 relative overflow-hidden transition-all duration-300">
                <div className="absolute top-0 inset-x-0 h-[2px] bg-red-500" />
                
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto shadow-md">
                  <AlertTriangle size={22} />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Access Link Inactive</h2>
                <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
                  {error || "This secure share link has expired or has been disabled by the owner."}
                </p>

                <div className="pt-4 border-t border-white/5 mt-4">
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                    Error Code: Link_Status_{status.toUpperCase()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 bg-[#020817] z-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SteganoML. Research-backed secure transmission.</p>
          <div className="flex gap-4">
            <span className="text-slate-600">SteganoML Secure Delivery</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
