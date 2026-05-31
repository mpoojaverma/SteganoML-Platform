"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  AudioWaveform,
  ShieldCheck,
  BarChart3,
  History,
  Settings,
  FileCode,
  User,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

const workspace = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Encode Studio",
    href: "/encode",
    icon: AudioWaveform,
  },
  {
    label: "Decode Studio",
    href: "/decode",
    icon: ShieldCheck,
  },
];

const insights = [
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    label: "Job History",
    href: "/job-history",
    icon: History,
  },
];

const system = [
  {
    label: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    label: "API Docs",
    href: "/api-docs",
    icon: FileCode,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const [name, setName] =
    useState("User");

  const [email, setEmail] =
    useState("");

  useEffect(() => {
    async function loadUser() {
      const {
        data,
      } =
        await supabase.auth.getUser();

      if (data.user) {
        setName(
          data.user.user_metadata
            ?.full_name || "User"
        );

        setEmail(
          data.user.email || ""
        );
      }
    }

    loadUser();
  }, []);

  return (
    <aside className="flex min-h-screen w-[240px] flex-col border-r border-white/10 bg-[#07111f]">

      {/* LOGO */}

      <div className="px-6 py-6">

        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 font-bold text-cyan-400">
            S
          </div>

          <div>

            <h1 className="text-xl font-bold text-white">
              SteganoML
            </h1>

            <p className="text-xs text-slate-500">
              Audio Steganography
            </p>

          </div>

        </Link>

      </div>

      {/* NAVIGATION */}

      <div className="flex-1 px-4">

        {/* Workspace */}

        <div className="mb-8">

          <p className="mb-3 text-xs uppercase tracking-wider text-slate-500">
            Workspace
          </p>

          {workspace.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}

        </div>

        {/* Insights */}

        <div className="mb-8">

          <p className="mb-3 text-xs uppercase tracking-wider text-slate-500">
            Insights
          </p>

          {insights.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}

        </div>

        {/* System */}

        <div>

          <p className="mb-3 text-xs uppercase tracking-wider text-slate-500">
            System
          </p>

          {system.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}

        </div>

      </div>

      {/* USER SECTION */}

      <div className="border-t border-white/10 p-4">

        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-white/5"
        >

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 font-bold text-black">

            {name.charAt(0).toUpperCase()}

          </div>

          <div className="min-w-0">

            <p className="truncate text-sm font-medium text-white">
              {name}
            </p>

            <p className="truncate text-xs text-slate-400">
              {email}
            </p>

          </div>

        </Link>

      </div>

    </aside>
  );
}