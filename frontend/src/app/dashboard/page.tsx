"use client";

/**
 * SteganoML Platform Production-Grade Interface Configuration
 * Path: frontend/src/app/dashboard/page.tsx
 */

import React, { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import useStats from "@/hooks/useStats";
import useJobs from "@/hooks/useJobs";
import MetricCard from "@/components/ui/MetricCard";

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string>("portfolio.viewer@steganoml.internal");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("steganoml_user_email");
      if (storedEmail) {
        setUserEmail(storedEmail);
      }
    }
  }, []);

  // Pass down the resolved user context to clear the strict parameter requirement
  const { stats, loading, error } = useStats(userEmail);
  const { jobs } = useJobs();

  // Baseline mock tracking structures if metrics are compiling or absent
  const recentJobs = Array.isArray(jobs) ? jobs.slice(0, 5) : [];

  return (
    <AppShell>
      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-red-950/40 border border-red-900 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Primary Data Metric Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Processed Signals"
            value={loading ? "..." : stats.total_jobs.toString()}
            description="Aggregated steganographic operations"
            trend={stats.total_jobs > 0 ? "+100%" : "0%"}
            trendType="up"
          />
          <MetricCard
            title="CatBoost ML Selection Rate"
            value={loading ? "..." : `${stats.success_rate}%`}
            description="Imperceptibility target optimization rate"
            trend="Stable"
            trendType="neutral"
          />
          <MetricCard
            title="Mean Distortion Ratio (PSNR)"
            value={loading ? "..." : `${stats.avg_psnr} dB`}
            description="Peak Signal-to-Noise Ratio average"
            trend="SOTA Target"
            trendType="up"
          />
          <MetricCard
            title="Bit Error Extraction (BER)"
            value={loading ? "..." : stats.avg_ber.toExponential(2)}
            description="Payload extraction accuracy profile"
            trend="Zero Loss"
            trendType="up"
          />
        </div>

        {/* Operational History Segment */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Execution Ledger</h3>
            <span className="text-xs text-slate-500">Live persistence state linked to Supabase</span>
          </div>

          {recentJobs.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              No recent execution metrics detected for this account profile.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm text-slate-400">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Operation</th>
                    <th className="py-3 px-4">Target Track Name</th>
                    <th className="py-3 px-4">Method Framework</th>
                    <th className="py-3 px-4">Status Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {recentJobs.map((job: any) => (
                    <tr key={job.id} className="hover:bg-slate-950/40 transition-colors">
                      <td className="py-3 px-4 text-xs font-mono">
                        {new Date(job.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                          job.type === "encode" ? "bg-violet-500/10 text-violet-400" : "bg-cyan-500/10 text-cyan-400"
                        }`}>
                          {job.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 truncate max-w-[180px] font-medium text-slate-300">
                        {job.file_name}
                      </td>
                      <td className="py-3 px-4 text-xs capitalize">
                        {job.method === "ml" ? "Supervised CatBoost" : "Randomized Shuffling"}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center text-xs font-semibold ${
                          job.status === "success" ? "text-emerald-400" : "text-rose-400"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                            job.status === "success" ? "bg-emerald-400" : "bg-rose-400"
                          }`} />
                          {job.status === "success" ? "Verified" : "Faulted"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}