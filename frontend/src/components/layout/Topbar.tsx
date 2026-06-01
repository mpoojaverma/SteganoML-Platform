"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Topbar() {
  const router = useRouter();

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL;

  const [online, setOnline] =
    useState(false);

  const [user, setUser] =
    useState<any>(null);

  useEffect(() => {
    async function checkHealth() {
      try {
        const response = await fetch(
          `${API_BASE}/health/`
        );

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
      const {
        data,
      } = await supabase.auth.getUser();

      setUser(data.user);
    }

    checkHealth();
    loadUser();
  }, [API_BASE]);

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/login");
  }

  const fullName =
    user?.user_metadata?.full_name || "";

  const email =
    user?.email || "";

  const displayName =
    fullName ||
    email.split("@")[0] ||
    "User";

  const initial =
    displayName.charAt(0).toUpperCase();

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#08101f] px-8">

      <div />

      <div className="flex items-center gap-3">

        <button
          onClick={() =>
            router.push("/encode")
          }
          className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-black"
        >
          New Encode Job
        </button>

        <span
          className={`rounded-full px-3 py-1 text-xs ${
            online
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {online
            ? "API Online"
            : "API Offline"}
        </span>

        <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-400">
          ML Active
        </span>

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 font-semibold text-black">
            {initial}
          </div>

          <div className="hidden md:block">

            <p className="text-sm font-medium">
              {displayName}
            </p>

            <p className="text-xs text-slate-400">
              {email}
            </p>

          </div>

        </div>

        <button
          onClick={handleLogout}
          className="rounded-xl border border-red-500/30 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
        >
          Logout
        </button>

      </div>

    </header>
  );
}