"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  AudioWaveform,
  ShieldCheck,
  BarChart3,
  History,
  Settings,
  FileCode,
} from "lucide-react";

const workspace = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Encode studio",
    href: "/encode",
    icon: AudioWaveform,
  },
  {
    label: "Decode studio",
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
    label: "Job history",
    href: "/job-history",
    icon: History,
  },
];

const system = [
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    label: "API docs",
    href: "/api-docs",
    icon: FileCode,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] min-h-screen border-r border-white/10 bg-[#07111f] flex flex-col">

      <div className="px-6 py-6">
        <h1 className="text-4xl font-bold text-white">
          SteganoML
        </h1>
      </div>

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
                className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-teal-500/20 text-teal-300"
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
                className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-teal-500/20 text-teal-300"
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
                className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-teal-500/20 text-teal-300"
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

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 text-black font-semibold">
            P
          </div>

          <div>
            <p className="text-sm font-medium">
              M. Pooja Verma
            </p>

            <p className="text-xs text-slate-400">
              Researcher
            </p>
          </div>

        </div>
      </div>

    </aside>
  );
}