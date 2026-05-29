"use client";

import { useEffect, useState } from "react";

export default function Topbar() {
  const [online, setOnline] =
    useState(false);

  useEffect(() => {
    fetch(
      "http://127.0.0.1:8000/api/health/"
    )
      .then(() => setOnline(true))
      .catch(() => setOnline(false));
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#08101f] px-8">

      <div />

      <div className="flex items-center gap-3">

        <button className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-black">
          New encode job
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

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700">
          P
        </div>

      </div>

    </header>
  );
}