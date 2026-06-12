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
  Globe,
  Info,
  Brain,
  Database,
  FileText,
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
    label: "Activity History",
    href: "/job-history",
    icon: History,
  },
];

const resources = [
  {
    label: "About SteganoML",
    href: "/about",
    icon: Info,
  },
  {
    label: "Model Insights",
    href: "/model-insights",
    icon: Brain,
  },
  {
    label: "Research Dataset",
    href: "/research-dataset",
    icon: Database,
  },
  {
    label: "Research Paper",
    href: "https://ieeexplore.ieee.org/document/11489464/",
    icon: FileText,
    external: true,
  },
];

const system = [
  {
    label: "View Website",
    href: "/",
    icon: Globe,
  },
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

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  const [name, setName] =
    useState("User");

  const [email, setEmail] =
    useState("");

  useEffect(() => {
    if (onClose) {
      onClose();
    }
  }, [pathname]);

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
    <aside className={`fixed inset-y-0 left-0 z-50 flex h-full w-[240px] max-w-[85vw] lg:max-w-none flex-col border-r border-white/10 bg-[#07111f] transition-transform duration-300 ease-in-out md:static md:flex md:translate-x-0 ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    }`}>

      {/* LOGO */}

      <div className="px-6 py-6">

        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
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

            <h1 className="text-xl font-bold text-white leading-none">
              SteganoML
            </h1>

            <p className="text-[10px] text-slate-500 mt-1">
              Audio Steganography
            </p>

          </div>

        </Link>

      </div>

      {/* NAVIGATION */}

      <div className="flex-1 px-4 overflow-y-auto">

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
                className={`mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
                  active
                    ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 pl-[14px]"
                    : "text-slate-300 hover:bg-white/5 hover:translate-x-0.5"
                } focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111f] outline-none`}
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
                className={`mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
                  active
                    ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 pl-[14px]"
                    : "text-slate-300 hover:bg-white/5 hover:translate-x-0.5"
                } focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111f] outline-none`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}

        </div>

        {/* Resources */}

        <div className="mb-8">

          <p className="mb-3 text-xs uppercase tracking-wider text-slate-500">
            Resources
          </p>

          {resources.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className={`mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
                  active
                    ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 pl-[14px]"
                    : "text-slate-300 hover:bg-white/5 hover:translate-x-0.5"
                } focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111f] outline-none`}
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
                className={`mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
                  active
                    ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 pl-[14px]"
                    : "text-slate-300 hover:bg-white/5 hover:translate-x-0.5"
                } focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111f] outline-none`}
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