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
    avgPsnr: "0.00",
    avgSnr: "0.00",
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

        const encodeJobs = jobs.filter((j: any) => j.type === "encode" && j.status === "success");
        const avgPsnr = encodeJobs.length > 0 
          ? (encodeJobs.reduce((sum: number, j: any) => sum + Number(j.psnr || 0), 0) / encodeJobs.length).toFixed(2)
          : "0.00";
        const avgSnr = encodeJobs.length > 0 
          ? (encodeJobs.reduce((sum: number, j: any) => sum + Number(j.snr || 0), 0) / encodeJobs.length).toFixed(2)
          : "0.00";

        setStats({
          total,
          encodes,
          decodes,
          successRate: Number(successRate),
          avgPsnr,
          avgSnr,
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
      <div className="space-y-8 max-w-5xl">
        <div>
          <h1 className="text-5xl font-black tracking-tight text-white">Profile</h1>
          <p className="mt-2 text-slate-400 text-sm">
            Account information, cryptographic configurations, and performance diagnostics.
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-white/5 bg-[#071122]/60 p-8 animate-pulse glass">
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
          <div className="rounded-3xl border border-white/5 bg-[#071122]/60 p-8 transition-all duration-300 hover:border-cyan-500/20 glass hover:shadow-[0_0_30px_rgba(24,213,208,0.05)]">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Premium Avatar Container */}
              <div className="relative shrink-0 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 p-[3px] shadow-xl hover:scale-105 transition-transform duration-300">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#020817] text-3xl font-black text-cyan-400">
                  {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              </div>

              <div className="text-center sm:text-left space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h2 className="text-3xl font-bold text-white tracking-tight">
                    {user?.user_metadata?.full_name || "SteganoML User"}
                  </h2>
                  <span className="inline-flex self-center rounded-full bg-cyan-500/10 border border-cyan-500/25 px-2.5 py-0.5 text-[10px] font-mono font-medium text-cyan-300 uppercase tracking-wider">
                    Sec-Node Active
                  </span>
                </div>
                <p className="text-slate-300 font-mono text-sm">{user?.email}</p>
                <p className="text-xs text-slate-500">
                  Registered Node Created:{" "}
                  <span className="text-slate-400 font-medium">
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "-"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STATS CARDS */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold mb-4">
            Security Performance Metrics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-white/5 bg-[#071122]/60 p-6 animate-pulse space-y-4 glass"
                >
                  <div className="h-4 w-20 rounded bg-white/5" />
                  <div className="h-10 w-16 rounded bg-white/5" />
                </div>
              ))
            ) : (
              <>
                <StatCard title="Total Encodes" value={stats.encodes} desc="Encrypted stego carriers compiled" />
                <StatCard title="Total Decodes" value={stats.decodes} desc="Secure signal extractions run" />
                <StatCard title="Avg PSNR" value={`${stats.avgPsnr} dB`} color="text-cyan-400" desc="Peak signal-to-noise ratio" />
                <StatCard title="Avg SNR" value={`${stats.avgSnr} dB`} color="text-purple-400" desc="Average signal-to-noise fidelity" />
              </>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  color?: string;
  desc?: string;
}

function StatCard({ title, value, color = "", desc = "" }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-white/5 bg-[#071122]/60 p-6 transition-all duration-300 hover:border-cyan-500/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.03)] hover:-translate-y-1 glass flex flex-col justify-between min-h-[140px]">
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">{title}</p>
        <h2 className={`mt-3 text-4xl font-extrabold tracking-tight ${color}`}>{value}</h2>
      </div>
      <p className="text-[11px] text-slate-500 leading-normal mt-2">{desc}</p>
    </div>
  );
}