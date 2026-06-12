"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/components/ui/Logo";
import { motion } from "framer-motion";

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

        <Logo size="md" showSubText={true} href="/dashboard" />

      </div>

      {/* NAVIGATION */}

      <div className="flex-1 px-4 overflow-y-auto">

        {/* Workspace */}

        <div className="mb-8">

          <p className="mb-3 text-xs uppercase tracking-wider text-slate-500">
            Workspace
          </p>

          {workspace.map((item) => (
            <SidebarLink key={item.label} item={item} pathname={pathname} />
          ))}

        </div>

        {/* Insights */}

        <div className="mb-8">

          <p className="mb-3 text-xs uppercase tracking-wider text-slate-500">
            Insights
          </p>

          {insights.map((item) => (
            <SidebarLink key={item.label} item={item} pathname={pathname} />
          ))}

        </div>

        {/* Resources */}

        <div className="mb-8">

          <p className="mb-3 text-xs uppercase tracking-wider text-slate-500">
            Resources
          </p>

          {resources.map((item) => (
            <SidebarLink key={item.label} item={item} pathname={pathname} />
          ))}

        </div>

        {/* System */}

        <div>

          <p className="mb-3 text-xs uppercase tracking-wider text-slate-500">
            System
          </p>

          {system.map((item) => (
            <SidebarLink key={item.label} item={item} pathname={pathname} />
          ))}

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

function SidebarLink({ item, pathname }: { item: any; pathname: string }) {
  const Icon = item.icon;
  const active = pathname === item.href;

  return (
    <Link
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      className={`relative mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 outline-none overflow-hidden group ${
        active
          ? "bg-cyan-500/10 text-cyan-300 border-l-2 border-cyan-400 pl-[14px]"
          : "text-slate-300 hover:bg-white/5"
      } focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111f]`}
    >
      {/* Hover Magnetic Icon Container */}
      <motion.div
        className="shrink-0 text-cyan-400/80 group-hover:text-cyan-400"
        whileHover={{ x: 2, y: -0.5 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <Icon size={18} />
      </motion.div>

      <span className="relative z-10 transition-colors group-hover:text-white">
        {item.label}
      </span>

      {/* Active Indicator Beam */}
      {active && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
          <motion.div
            className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent"
            animate={{ left: ["-30%", "130%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}
    </Link>
  );
}