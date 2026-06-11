"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { supabase } from "@/lib/supabase";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface TopbarProps {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const router = useRouter();

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const [online, setOnline] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    async function checkHealth() {
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

        const response = await fetch(`${apiBase}/health/`);

        if (response.ok) {
          setOnline(true);
        } else {
          setOnline(false);
        }
      } catch {
        setOnline(false);
      }
    }

    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }

    checkHealth();
    loadUser();
  }, [API_BASE]);

  async function handleConfirmLogout() {
    setIsLogoutModalOpen(false);
    
    if (typeof window !== "undefined") {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith("steganoml_")) {
          sessionStorage.removeItem(key);
        }
      });
    }

    await supabase.auth.signOut();
    router.push("/login");
  }

  const fullName = user?.user_metadata?.full_name || "";
  const email = user?.email || "";
  const displayName = fullName || email.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#08101f] px-4 md:px-8">
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Sign Out"
        message="Are you sure you want to sign out?"
        confirmText="Sign Out"
        cancelText="Cancel"
      />

      <button
        onClick={onMenuClick}
        className="mr-2 rounded-xl p-3 text-slate-400 hover:bg-white/5 hover:text-white md:hidden focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08101f] outline-none min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>

      <div className="hidden md:block" />

      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/encode")}
          className="hidden md:flex rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-medium text-black focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08101f] outline-none min-h-[44px] lg:min-h-0 items-center justify-center transition hover:brightness-110 cursor-pointer"
        >
          New Encode Job
        </button>

        <span
          className={`hidden md:inline-block rounded-full px-3 py-1 text-xs ${
            online
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {online ? "API Online" : "API Offline"}
        </span>

        <span className="hidden md:inline-block rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-400">
          ML Active
        </span>

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 min-h-[44px] lg:min-h-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 font-semibold text-black">
            {initial}
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs text-slate-400 mt-0.5 leading-none">{email}</p>
          </div>
        </div>

        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="rounded-xl border border-red-500/30 px-4 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08101f] outline-none min-h-[44px] lg:min-h-0 flex items-center justify-center cursor-pointer"
        >
          Logout
        </button>
      </div>
    </header>
  );
}