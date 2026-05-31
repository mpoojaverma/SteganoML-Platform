"use client";

import { useEffect, useState } from "react";

import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabase";
import { getJobs } from "@/lib/jobs";

export default function ProfilePage() {
  const [user, setUser] =
    useState<any>(null);

  const [stats, setStats] =
    useState({
      total: 0,
      encodes: 0,
      decodes: 0,
      successRate: 0,
    });

  useEffect(() => {
    async function loadData() {
      const {
        data,
      } =
        await supabase.auth.getUser();

      setUser(data.user);

      const jobs =
        await getJobs();

      const total =
        jobs.length;

      const encodes =
        jobs.filter(
          (j: any) =>
            j.type === "encode"
        ).length;

      const decodes =
        jobs.filter(
          (j: any) =>
            j.type === "decode"
        ).length;

      const successful =
        jobs.filter(
          (j: any) =>
            j.status === "success"
        ).length;

      const successRate =
        total > 0
          ? (
              (successful /
                total) *
              100
            ).toFixed(1)
          : "0";

      setStats({
        total,
        encodes,
        decodes,
        successRate:
          Number(successRate),
      });
    }

    loadData();
  }, []);

  return (
    <AppShell>
      <div className="space-y-8">

        <div>
          <h1 className="text-5xl font-bold">
            Profile
          </h1>

          <p className="mt-2 text-slate-400">
            Account information and activity.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-8">

          <div className="flex items-center gap-6">

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500 text-3xl font-bold text-black">

              {user?.user_metadata?.full_name
                ?.charAt(0)
                ?.toUpperCase() || "U"}

            </div>

            <div>

              <h2 className="text-3xl font-semibold">
                {
                  user?.user_metadata
                    ?.full_name
                }
              </h2>

              <p className="mt-2 text-slate-400">
                {user?.email}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Joined{" "}
                {user?.created_at
                  ? new Date(
                      user.created_at
                    ).toLocaleDateString()
                  : "-"}
              </p>

            </div>

          </div>

        </div>

        <div className="grid grid-cols-4 gap-4">

          <StatCard
            title="Total Jobs"
            value={stats.total}
          />

          <StatCard
            title="Encodes"
            value={stats.encodes}
          />

          <StatCard
            title="Decodes"
            value={stats.decodes}
          />

          <StatCard
            title="Success Rate"
            value={`${stats.successRate}%`}
            color="text-emerald-400"
          />

        </div>

      </div>
    </AppShell>
  );
}

function StatCard({
  title,
  value,
  color = "",
}: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-6">

      <p className="text-xs uppercase text-slate-500">
        {title}
      </p>

      <h2
        className={`mt-4 text-4xl font-bold ${color}`}
      >
        {value}
      </h2>

    </div>
  );
}