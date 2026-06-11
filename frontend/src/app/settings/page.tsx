"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Cpu, 
  Sliders, 
  Download, 
  History, 
  LayoutGrid, 
  LayoutList, 
  Globe, 
  Laptop, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lastLogin, setLastLogin] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Preferences State
  const [embedMethod, setEmbedMethod] = useState("ml");
  const [autoDownload, setAutoDownload] = useState(false);
  const [rememberFiles, setRememberFiles] = useState(true);
  const [layoutPref, setLayoutPref] = useState("grid");

  // Security Form State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdError, setPwdError] = useState("");

  // User Agent Session Info
  const [clientSessionInfo, setClientSessionInfo] = useState({
    os: "Unknown OS",
    browser: "Unknown Browser",
  });

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setEmail(user.email || "");
      setName(user.user_metadata?.full_name || "");
      if (user.last_sign_in_at) {
        setLastLogin(new Date(user.last_sign_in_at).toLocaleString());
      } else {
        setLastLogin("Current session");
      }

      // Load client preferences from localStorage
      const savedEmbed = localStorage.getItem("steganoml_pref_embed_method") || "ml";
      const savedAutoDownload = localStorage.getItem("steganoml_pref_auto_download") === "true";
      const savedRememberFiles = localStorage.getItem("steganoml_pref_remember_files") !== "false";
      const savedLayout = localStorage.getItem("steganoml_pref_dashboard_layout") || "grid";

      setEmbedMethod(savedEmbed);
      setAutoDownload(savedAutoDownload);
      setRememberFiles(savedRememberFiles);
      setLayoutPref(savedLayout);

      // Parse user agent
      if (typeof window !== "undefined") {
        const ua = window.navigator.userAgent;
        let os = "Linux / Unknown OS";
        if (ua.indexOf("Win") !== -1) os = "Windows OS";
        if (ua.indexOf("Mac") !== -1) os = "macOS";
        if (ua.indexOf("X11") !== -1) os = "UNIX OS";
        if (ua.indexOf("Linux") !== -1) os = "Linux OS";

        let browser = "Web Browser";
        if (ua.indexOf("Firefox") !== -1) browser = "Mozilla Firefox";
        else if (ua.indexOf("SamsungBrowser") !== -1) browser = "Samsung Browser";
        else if (ua.indexOf("Opera") !== -1 || ua.indexOf("OPR") !== -1) browser = "Opera Browser";
        else if (ua.indexOf("Trident") !== -1) browser = "Internet Explorer";
        else if (ua.indexOf("Edge") !== -1) browser = "Microsoft Edge";
        else if (ua.indexOf("Chrome") !== -1) browser = "Google Chrome";
        else if (ua.indexOf("Safari") !== -1) browser = "Apple Safari";

        setClientSessionInfo({ os, browser });
      }

      setLoading(false);
    }

    loadUser();
  }, [router]);

  // Preferences Change Handlers
  const handleToggleEmbed = (method: string) => {
    setEmbedMethod(method);
    localStorage.setItem("steganoml_pref_embed_method", method);
  };
  const handleToggleAutoDownload = (val: boolean) => {
    setAutoDownload(val);
    localStorage.setItem("steganoml_pref_auto_download", val ? "true" : "false");
  };
  const handleToggleRemember = (val: boolean) => {
    setRememberFiles(val);
    localStorage.setItem("steganoml_pref_remember_files", val ? "true" : "false");
  };
  const handleToggleLayout = (pref: string) => {
    setLayoutPref(pref);
    localStorage.setItem("steganoml_pref_dashboard_layout", pref);
  };

  // Change Password Handler
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPwdError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError("Passwords do not match.");
      return;
    }

    try {
      setPwdLoading(true);
      setPwdError("");
      setPwdMsg("");
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setPwdError(error.message);
      } else {
        setPwdMsg("Password changed successfully.");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      setPwdError(err.message || "Failed to update password.");
    } finally {
      setPwdLoading(false);
    }
  };

  async function handleConfirmLogout() {
    setIsLogoutModalOpen(false);
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <AppShell>
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Sign Out"
        message="Are you sure you want to sign out? You will need to log back in to access the secure steganography studio."
        confirmText="Sign Out"
        cancelText="Cancel"
      />

      <div className="space-y-8 max-w-4xl pb-16">
        <div>
          <h1 className="text-5xl font-black tracking-tight text-white">Settings</h1>
          <p className="mt-2 text-slate-400 text-sm">
            Configure application profiles, user interface preferences, and node security parameters.
          </p>
        </div>

        {/* SECTION 1: ACCOUNT DETAILS */}
        <div className="rounded-3xl border border-white/5 bg-[#071122]/60 p-6 sm:p-8 glass transition duration-300 hover:border-cyan-500/10">
          <h2 className="text-xl font-bold tracking-tight text-white mb-6">Account Profile</h2>

          {loading ? (
            <div className="space-y-5 animate-pulse">
              <div>
                <div className="h-4 w-20 rounded bg-white/5" />
                <div className="mt-2 h-12 w-full rounded-xl bg-white/5" />
              </div>
              <div>
                <div className="h-4 w-24 rounded bg-white/5" />
                <div className="mt-2 h-12 w-full rounded-xl bg-white/5" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-slate-500">Display Name</label>
                <input
                  value={name}
                  disabled
                  className="mt-2 w-full rounded-xl border border-white/5 bg-[#020817] px-4 py-3.5 text-slate-400 font-medium cursor-not-allowed outline-none select-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-slate-500">Email Address</label>
                <input
                  value={email}
                  disabled
                  className="mt-2 w-full rounded-xl border border-white/5 bg-[#020817] px-4 py-3.5 text-slate-400 font-mono cursor-not-allowed outline-none select-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: PREFERENCES */}
        <div className="rounded-3xl border border-white/5 bg-[#071122]/60 p-6 sm:p-8 glass transition duration-300 hover:border-cyan-500/10">
          <h2 className="text-xl font-bold tracking-tight text-white mb-6">Application Preferences</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Preference Card 1: Default Embedding Method */}
            <div className="rounded-2xl border border-white/5 bg-[#020817] p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Default Embedding Method</h3>
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  Pre-selects the steganographic algorithm for new encoding studios.
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleToggleEmbed("ml")}
                  className={`flex-1 rounded-xl py-2 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    embedMethod === "ml"
                      ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/10"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <Cpu size={14} />
                  <span>ML-Guided</span>
                </button>
                <button
                  onClick={() => handleToggleEmbed("random")}
                  className={`flex-1 rounded-xl py-2 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    embedMethod === "random"
                      ? "bg-purple-600 text-white shadow-md shadow-purple-500/10"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <Sliders size={14} />
                  <span>Rand LSB</span>
                </button>
              </div>
            </div>

            {/* Preference Card 2: Auto Download */}
            <div className="rounded-2xl border border-white/5 bg-[#020817] p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Auto Download Output</h3>
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  Automatically triggers browser download after stego compile completes.
                </p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs font-medium text-slate-400">Status: {autoDownload ? "Enabled" : "Disabled"}</span>
                <button
                  onClick={() => handleToggleAutoDownload(!autoDownload)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    autoDownload
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-white/5 text-slate-400 border border-transparent"
                  }`}
                >
                  {autoDownload ? "ON" : "OFF"}
                </button>
              </div>
            </div>

            {/* Preference Card 3: Remember Recent Files */}
            <div className="rounded-2xl border border-white/5 bg-[#020817] p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Cache Active Session</h3>
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  Retains uploaded audio information locally to prevent data loss on page refresh.
                </p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs font-medium text-slate-400">Status: {rememberFiles ? "Enabled" : "Disabled"}</span>
                <button
                  onClick={() => handleToggleRemember(!rememberFiles)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    rememberFiles
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      : "bg-white/5 text-slate-400 border border-transparent"
                  }`}
                >
                  {rememberFiles ? "ON" : "OFF"}
                </button>
              </div>
            </div>

            {/* Preference Card 4: Dashboard Layout */}
            <div className="rounded-2xl border border-white/5 bg-[#020817] p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Dashboard Grid Layout</h3>
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  Controls structural layout parameter alignment for dashboard stats modules.
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleToggleLayout("grid")}
                  className={`flex-1 rounded-xl py-2 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    layoutPref === "grid"
                      ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/10"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <LayoutGrid size={14} />
                  <span>Grid view</span>
                </button>
                <button
                  onClick={() => handleToggleLayout("list")}
                  className={`flex-1 rounded-xl py-2 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    layoutPref === "list"
                      ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/10"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <LayoutList size={14} />
                  <span>List view</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: SECURITY CONTROLS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Subcard A: Change Password (7 cols) */}
          <div className="md:col-span-7 rounded-3xl border border-white/5 bg-[#071122]/60 p-6 sm:p-8 glass transition duration-300 hover:border-cyan-500/10">
            <h2 className="text-xl font-bold tracking-tight text-white mb-6">Change password</h2>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label htmlFor="new-password" className="text-xs font-mono uppercase tracking-wider text-slate-500">New Password</label>
                <div className="relative mt-2">
                  <input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/5 bg-[#020817] pl-4 pr-12 py-3 text-sm focus:border-cyan-500/50 outline-none transition duration-200"
                    placeholder="Minimum 8 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white transition cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="text-xs font-mono uppercase tracking-wider text-slate-500">Confirm Password</label>
                <div className="relative mt-2">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/5 bg-[#020817] pl-4 pr-12 py-3 text-sm focus:border-cyan-500/50 outline-none transition duration-200"
                    placeholder="Match new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white transition cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {pwdError && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/25 p-3.5 text-xs text-red-400 flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{pwdError}</span>
                </div>
              )}

              {pwdMsg && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/25 p-3.5 text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 size={14} className="shrink-0" />
                  <span>{pwdMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={pwdLoading}
                className="w-full rounded-xl bg-cyan-500 py-3 text-xs font-bold text-black flex items-center justify-center gap-2 transition hover:brightness-110 disabled:opacity-50 cursor-pointer shadow-md shadow-cyan-500/10 active:scale-[0.98]"
              >
                {pwdLoading ? "Updating..." : "Update Security Credentials"}
              </button>
            </form>
          </div>

          {/* Subcard B: Current Session info (5 cols) */}
          <div className="md:col-span-5 rounded-3xl border border-white/5 bg-[#071122]/60 p-6 sm:p-8 glass space-y-6 transition duration-300 hover:border-cyan-500/10">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white mb-2">Active Session</h2>
              <p className="text-xs text-slate-500 leading-normal">
                Cryptographic authentication validation metadata.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl bg-[#020817] p-4 border border-white/5 flex gap-3 items-center">
                <Laptop size={18} className="text-cyan-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-mono">CLIENT OPERATING SYSTEM</p>
                  <p className="text-sm font-semibold text-white truncate">{clientSessionInfo.os}</p>
                </div>
              </div>

              <div className="rounded-xl bg-[#020817] p-4 border border-white/5 flex gap-3 items-center">
                <Globe size={18} className="text-purple-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-mono">ACTIVE BROWSER AGENT</p>
                  <p className="text-sm font-semibold text-white truncate">{clientSessionInfo.browser}</p>
                </div>
              </div>

              <div className="rounded-xl bg-[#020817] p-4 border border-white/5 flex gap-3 items-center">
                <History size={18} className="text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-mono">LAST LOGIN TIMESTEP</p>
                  <p className="text-sm font-semibold text-white truncate font-mono text-xs">{lastLogin}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: DANGER ZONE */}
        <div className="rounded-3xl border border-red-500/25 bg-[#071122]/60 p-6 sm:p-8 glass transition duration-300 hover:border-red-500/40">
          <h2 className="text-xl font-bold tracking-tight text-red-400 mb-2">Danger Zone</h2>
          <p className="text-xs text-slate-500 mb-6 leading-normal">
            Terminates active authorization handles immediately, clearing session cache keys.
          </p>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="rounded-xl bg-red-500/10 border border-red-500/30 px-5 py-3 font-semibold text-red-400 transition hover:bg-red-500 hover:text-white focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#071122] outline-none cursor-pointer"
          >
            Terminate Session & Logout
          </button>
        </div>
      </div>
    </AppShell>
  );
}