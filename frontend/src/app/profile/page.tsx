"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabase";
import { getJobs } from "@/lib/jobs";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    encodes: 0,
    decodes: 0,
    successRate: 0,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);

        const jobs = await getJobs();
        const total = jobs.length;
        const encodes = jobs.filter((j: any) => j.type === "encode").length;
        const decodes = jobs.filter((j: any) => j.type === "decode").length;
        const successful = jobs.filter((j: any) => j.status === "success").length;

        const successRate =
          total > 0 ? ((successful / total) * 100).toFixed(1) : "0";

        setStats({
          total,
          encodes,
          decodes,
          successRate: Number(successRate),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-5xl font-bold">Profile</h1>
          <p className="mt-2 text-slate-400">
            Account information and activity.
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-8 animate-pulse">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="h-24 w-24 rounded-full bg-white/10 shrink-0" />
              <div className="space-y-3 flex-1 w-full text-center sm:text-left">
                <div className="h-8 w-48 rounded bg-white/10 mx-auto sm:mx-0" />
                <div className="h-4 w-64 rounded bg-white/10 mx-auto sm:mx-0" />
                <div className="h-4 w-32 rounded bg-white/10 mx-auto sm:mx-0" />
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-8 transition duration-300 hover:border-white/20">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-3xl font-bold text-black shadow-lg">
                {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-3xl font-semibold text-white">
                  {user?.user_metadata?.full_name || "SteganoML User"}
                </h2>
                <p className="mt-2 text-slate-400">{user?.email}</p>
                <p className="mt-2 text-sm text-slate-500">
                  Joined{" "}
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl border border-white/10 bg-[#0b1327] p-6 animate-pulse space-y-4"
              >
                <div className="h-4 w-20 rounded bg-white/5" />
                <div className="h-10 w-16 rounded bg-white/5" />
              </div>
            ))
          ) : (
            <>
              <StatCard title="Total Jobs" value={stats.total} />
              <StatCard title="Encodes" value={stats.encodes} />
              <StatCard title="Decodes" value={stats.decodes} />
              <StatCard
                title="Success Rate"
                value={`${stats.successRate}%`}
                color="text-emerald-400"
              />
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({ title, value, color = "" }: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-6 transition duration-300 hover:border-white/20 hover:shadow-[0_4px_20px_rgba(255,255,255,0.02)] hover:-translate-y-0.5">
      <p className="text-xs uppercase text-slate-500">{title}</p>
      <h2 className={`mt-4 text-4xl font-bold ${color}`}>{value}</h2>
    </div>
  );
}