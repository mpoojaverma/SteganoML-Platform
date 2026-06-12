"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import useStats from "@/hooks/useStats";
import useJobs from "@/hooks/useJobs";
import { supabase } from "@/lib/supabase";
import { Lock, Unlock, Download, Eye, Trash2, Copy, Link as LinkIcon, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

const isLocalhost = typeof window !== "undefined" && 
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const API_BASE = isLocalhost 
  ? "http://127.0.0.1:8000/api" 
  : (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api");

export default function DashboardPage() {
  const { stats, loading: statsLoading } =
    useStats();

  const { jobs, loading: jobsLoading } = useJobs();
  const isLoading = statsLoading || jobsLoading;

  const [shares, setShares] = useState<any[]>([]);
  const [sharesLoading, setSharesLoading] = useState(true);

  async function loadShares() {
    try {
      setSharesLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const response = await fetch(`${API_BASE}/share/list?owner_id=${user.id}`);
      const data = await response.json();
      setShares(data || []);
    } catch (error) {
      console.error("Error loading secure shares:", error);
    } finally {
      setSharesLoading(false);
    }
  }

  const handleDisableShare = async (token: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await fetch(`${API_BASE}/share/disable/${token}?owner_id=${user.id}`, {
        method: "POST",
      });
      loadShares();
    } catch (error) {
      console.error("Error disabling share:", error);
    }
  };

  const handleDeleteShare = async (token: string) => {
    if (!confirm("Are you sure you want to permanently delete this secure share link?")) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await fetch(`${API_BASE}/share/delete/${token}?owner_id=${user.id}`, {
        method: "DELETE",
      });
      loadShares();
    } catch (error) {
      console.error("Error deleting share:", error);
    }
  };

  useEffect(() => {
    loadShares();
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">

        <div>
          <h1 className="text-5xl font-bold">
            Dashboard
          </h1>

          <p className="mt-2 text-slate-400">
            Monitor payload protection pipelines, quality metrics, and recent operations.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-8">

          <MetricCard
            title="Total Operations"
            value={stats.total_jobs}
            loading={isLoading}
          />

          <MetricCard
            title="Secure Encodes"
            value={stats.encodes}
            loading={isLoading}
          />

          <MetricCard
            title="Successful Decodes"
            value={stats.decodes}
            loading={isLoading}
          />

          <MetricCard
            title="Success Rate"
            value={`${stats.success_rate}%`}
            color="text-emerald-400"
            loading={isLoading}
          />

          <MetricCard
            title="Avg PSNR"
            value={stats.avg_psnr}
            color="text-cyan-400"
            loading={isLoading}
          />

          <MetricCard
            title="Avg SNR"
            value={stats.avg_snr}
            color="text-purple-400"
            loading={isLoading}
          />

          <MetricCard
            title="Avg BER"
            value={Number(
              stats.avg_ber || 0
            ).toExponential(2)}
            color="text-orange-400"
            loading={isLoading}
          />

          <MetricCard
            title="Avg NC"
            value={stats.avg_nc}
            color="text-pink-400"
            loading={isLoading}
          />

        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">

          <div className="xl:col-span-8 overflow-hidden rounded-3xl border border-white/10 bg-[#0b1327]">

            <div className="flex items-center justify-between border-b border-white/10 p-5">

              <h2 className="font-semibold">
                Recent Operations
              </h2>

              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                Live Activity
              </span>

            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="text-left text-xs text-slate-500">

                    <th className="px-5 py-4">
                      Audio File
                    </th>

                    <th>Operation</th>

                    <th>Algorithm</th>

                    <th>Status</th>

                    <th>PSNR</th>

                    <th>SNR</th>

                    <th>BER</th>

                    <th>NC</th>

                  </tr>

                </thead>

                <tbody>

                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr
                        key={index}
                        className="border-t border-white/5"
                      >
                        <td className="px-5 py-4">
                          <div className="h-4 w-28 rounded bg-white/5 animate-pulse" />
                        </td>
                        <td>
                          <div className="h-4 w-12 rounded bg-white/5 animate-pulse" />
                        </td>
                        <td>
                          <div className="h-4 w-12 rounded bg-white/5 animate-pulse" />
                        </td>
                        <td>
                          <div className="h-6 w-16 rounded-full bg-white/5 animate-pulse" />
                        </td>
                        <td>
                          <div className="h-4 w-10 rounded bg-white/5 animate-pulse" />
                        </td>
                        <td>
                          <div className="h-4 w-10 rounded bg-white/5 animate-pulse" />
                        </td>
                        <td>
                          <div className="h-4 w-10 rounded bg-white/5 animate-pulse" />
                        </td>
                        <td>
                          <div className="h-4 w-10 rounded bg-white/5 animate-pulse" />
                        </td>
                      </tr>
                    ))
                  ) : jobs.length === 0 ? (
                    <tr className="border-t border-white/5">
                      <td colSpan={8} className="px-5 py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center text-center">
                          <svg className="w-12 h-12 text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <p className="text-sm font-medium text-slate-300">No Operations Logged</p>
                          <p className="text-xs text-slate-500 mt-1">Run an encode or decode task to see real-time activity logged here.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    jobs
                      .slice(0, 8)
                      .map(
                        (
                          job: any,
                          index: number
                        ) => (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                            className="border-t border-white/5 hover:bg-white/[0.03]"
                          >
                            <td className="px-5 py-4 max-w-[250px] group">
                              <div className="flex items-center gap-2">
                                <span className="truncate" title={job.file_name}>{job.file_name}</span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(job.file_name);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition shrink-0 focus-visible:opacity-100 outline-none cursor-pointer"
                                  title="Copy filename"
                                  aria-label="Copy filename"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                  </svg>
                                </button>
                              </div>
                            </td>

                            <td className="capitalize">
                              {job.type}
                            </td>

                            <td>
                              {job.method || "-"}
                            </td>

                            <td>

                              <span
                                className={`rounded-full px-3 py-1 text-xs ${
                                  job.status ===
                                  "success"
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "bg-red-500/10 text-red-400"
                                }`}
                              >
                                {job.status}
                              </span>

                            </td>

                            <td>
                              {job.psnr
                                ? Number(
                                    job.psnr
                                  ).toFixed(2)
                                : "-"}
                            </td>

                            <td>
                              {job.snr
                                ? Number(
                                    job.snr
                                  ).toFixed(2)
                                : "-"}
                            </td>

                            <td>
                              {job.ber ?? "-"}
                            </td>

                            <td>
                              {job.nc ?? "-"}
                            </td>

                          </motion.tr>
                        )
                      )
                  )}

                </tbody>

              </table>

            </div>

            {/* Mobile Cards View */}
            <div className="block md:hidden divide-y divide-white/5">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="p-5 space-y-4 animate-pulse">
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-2/3 rounded bg-white/5" />
                      <div className="h-6 w-16 rounded-full bg-white/5" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-3 w-1/2 rounded bg-white/5" />
                      <div className="h-3 w-1/3 rounded bg-white/5" />
                    </div>
                    <div className="grid grid-cols-4 gap-2 pt-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-8 rounded bg-white/5" />
                      ))}
                    </div>
                  </div>
                ))
              ) : jobs.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-sm font-medium text-slate-300">No Operations Logged</p>
                  <p className="text-xs text-slate-500 mt-1">Run an encode or decode task to see real-time activity logged here.</p>
                </div>
              ) : (
                jobs.slice(0, 8).map((job: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium text-white break-all" title={job.file_name}>
                            {job.file_name}
                          </span>
                          <button
                            onClick={() => navigator.clipboard.writeText(job.file_name)}
                            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition shrink-0 outline-none cursor-pointer"
                            title="Copy filename"
                            aria-label="Copy filename"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-slate-400 capitalize">
                          <span>Operation: {job.type}</span>
                          <span>•</span>
                          <span>Algorithm: {job.method || "-"}</span>
                          {job.created_at && (
                            <>
                              <span>•</span>
                              <span>{new Date(job.created_at).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 capitalize ${
                          job.status === "success"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="rounded-lg bg-white/5 p-2">
                        <div className="text-[10px] uppercase text-slate-500">PSNR</div>
                        <div className="text-xs font-semibold text-slate-300 mt-0.5">
                          {job.psnr ? Number(job.psnr).toFixed(2) : "-"}
                        </div>
                      </div>
                      <div className="rounded-lg bg-white/5 p-2">
                        <div className="text-[10px] uppercase text-slate-500">SNR</div>
                        <div className="text-xs font-semibold text-slate-300 mt-0.5">
                          {job.snr ? Number(job.snr).toFixed(2) : "-"}
                        </div>
                      </div>
                      <div className="rounded-lg bg-white/5 p-2">
                        <div className="text-[10px] uppercase text-slate-500">BER</div>
                        <div className="text-xs font-semibold text-slate-300 mt-0.5">
                          {job.ber ?? "-"}
                        </div>
                      </div>
                      <div className="rounded-lg bg-white/5 p-2">
                        <div className="text-[10px] uppercase text-slate-500">NC</div>
                        <div className="text-xs font-semibold text-slate-300 mt-0.5">
                          {job.nc ?? "-"}
                        </div>
                      </div>
                    </div>
                  </motion.div>
              )}
            </div>

          </div>

          <div className="xl:col-span-4 space-y-6">

            <StatusCard />

            <MetricsCard
              total={
                stats.total_jobs
              }
              encodes={
                stats.encodes
              }
              decodes={
                stats.decodes
              }
              avgPSNR={
                stats.avg_psnr
              }
              avgSNR={
                stats.avg_snr
              }
              avgBER={
                stats.avg_ber
              }
              avgNC={
                stats.avg_nc
              }
              loading={isLoading}
            />

          </div>

        </div>

        {/* Secure Shares Manager Section */}
        <div className="rounded-3xl border border-white/10 bg-[#0b1327] overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <h2 className="font-semibold text-white">Secure Shares</h2>
            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-400 font-mono uppercase tracking-wider font-semibold">
              Secure Delivery
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-white/5">
                  <th className="px-5 py-4">File Name</th>
                  <th>Expiration</th>
                  <th>Downloads Remaining</th>
                  <th>Views</th>
                  <th>Status</th>
                  <th className="px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {sharesLoading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <tr key={idx} className="border-b border-white/5 animate-pulse">
                      <td className="px-5 py-4"><div className="h-4 w-40 bg-white/5 rounded" /></td>
                      <td><div className="h-4 w-24 bg-white/5 rounded" /></td>
                      <td><div className="h-4 w-20 bg-white/5 rounded" /></td>
                      <td><div className="h-4 w-10 bg-white/5 rounded" /></td>
                      <td><div className="h-6 w-16 bg-white/5 rounded-full" /></td>
                      <td className="px-5"><div className="h-8 w-24 bg-white/5 rounded ml-auto" /></td>
                    </tr>
                  ))
                ) : shares.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                      No active share links. Generate links in the Encode Studio to deliver files securely.
                    </td>
                  </tr>
                ) : (
                  shares.map((share: any, idx: number) => {
                    const isExpired = share.status === "expired" || new Date(share.expires_at) < new Date();
                    const downloadsRemaining = share.max_downloads === -1 ? "Unlimited" : (share.max_downloads - share.download_count);
                    const shareUrl = `${window.location.origin}/share/${share.share_token}`;

                    return (
                      <motion.tr
                        key={share.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                        className="border-b border-white/5 hover:bg-white/[0.02]"
                      >
                        <td className="px-5 py-4 max-w-[200px] truncate" title={share.file_name}>
                          {share.file_name}
                        </td>
                        <td>
                          {new Date(share.expires_at).toLocaleDateString()} {new Date(share.expires_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </td>
                        <td>
                          {downloadsRemaining}
                        </td>
                        <td>
                          {share.access_count}
                        </td>
                        <td>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                              share.status === "active" && !isExpired
                                ? "bg-emerald-500/10 text-emerald-400"
                                : share.status === "disabled"
                                  ? "bg-slate-500/10 text-slate-400"
                                  : "bg-red-500/10 text-red-400"
                            }`}
                          >
                            {isExpired ? "expired" : share.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(shareUrl);
                                alert("Link copied to clipboard!");
                              }}
                              className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition shrink-0 cursor-pointer"
                              title="Copy Share Link"
                            >
                              <Copy size={14} />
                            </button>
                            <a
                              href={`/share/${share.share_token}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition shrink-0 cursor-pointer flex items-center"
                              title="View Share Page"
                            >
                              <Eye size={14} />
                            </a>
                            {share.status === "active" && !isExpired && (
                              <button
                                onClick={() => handleDisableShare(share.share_token)}
                                className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition shrink-0 cursor-pointer"
                                title="Disable Share Link"
                              >
                                <Lock size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteShare(share.share_token)}
                              className="p-1.5 rounded hover:bg-white/10 text-red-400 hover:bg-red-500/10 transition shrink-0 cursor-pointer"
                              title="Delete Share Link"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">

          <h2 className="mb-4 font-semibold">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

            <QuickLink
              href="/encode"
              label="New Encode Session"
            />

            <QuickLink
              href="/decode"
              label="Extract Payload"
            />

            <QuickLink
              href="/analytics"
              label="Analytics"
            />

            <QuickLink
              href="/job-history"
              label="Operation History"
            />

          </div>

        </div>

      </div>
    </AppShell>
  );
}

function MetricCard({
  title,
  value,
  color = "",
  loading = false,
}: any) {
  const isSignalMetric = ["Avg PSNR", "Avg SNR", "Avg BER", "Avg NC"].includes(title);
  
  // Color mapping for different glows
  let glowColor = "rgba(6, 182, 212, 0.08)"; // default cyan
  if (title === "Avg SNR") glowColor = "rgba(168, 85, 247, 0.08)"; // purple
  if (title === "Avg BER") glowColor = "rgba(249, 115, 22, 0.08)"; // orange
  if (title === "Avg NC") glowColor = "rgba(236, 72, 153, 0.08)"; // pink

  let hoverGlow = "0 10px 30px -10px rgba(6, 182, 212, 0.15)";
  if (title === "Avg SNR") hoverGlow = "0 10px 30px -10px rgba(168, 85, 247, 0.15)";
  if (title === "Avg BER") hoverGlow = "0 10px 30px -10px rgba(249, 115, 22, 0.15)";
  if (title === "Avg NC") hoverGlow = "0 10px 30px -10px rgba(236, 72, 153, 0.15)";

  let hoverBorder = "rgba(6, 182, 212, 0.4)";
  if (title === "Avg SNR") hoverBorder = "rgba(168, 85, 247, 0.4)";
  if (title === "Avg BER") hoverBorder = "rgba(249, 115, 22, 0.4)";
  if (title === "Avg NC") hoverBorder = "rgba(236, 72, 153, 0.4)";

  return (
    <motion.div
      className="rounded-3xl border border-white/10 bg-[#0b1327] p-4 sm:p-5 lg:p-5 min-w-0 lg:min-w-fit relative overflow-hidden group"
      whileHover={{
        y: -6,
        scale: 1.02,
        borderColor: hoverBorder,
        boxShadow: hoverGlow
      }}
      animate={isSignalMetric ? {
        boxShadow: [
          "0 0 0px 0px rgba(0, 0, 0, 0)",
          `0 0 15px 2px ${glowColor}`,
          "0 0 0px 0px rgba(0, 0, 0, 0)"
        ]
      } : undefined}
      transition={{
        y: { type: "spring", stiffness: 300, damping: 20 },
        scale: { type: "spring", stiffness: 300, damping: 20 },
        boxShadow: isSignalMetric ? { duration: 5, repeat: Infinity, ease: "easeInOut" } : undefined
      }}
    >
      {/* Subtle top gradient sweep on hover */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <p className="text-xs uppercase text-slate-500 truncate lg:overflow-visible lg:whitespace-normal" title={title}>
        {title}
      </p>

      {loading ? (
        <div className="mt-4 h-8 sm:h-12 lg:h-12 w-2/3 rounded-xl bg-white/5 animate-pulse" />
      ) : (
        <h2
          className={`mt-4 text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold truncate lg:overflow-visible lg:whitespace-normal lg:break-normal break-words ${color}`}
          title={value}
        >
          {value}
        </h2>
      )}
    </motion.div>
  );
}

function StatusCard() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">

      <h2 className="mb-4 font-semibold">
        System Health
      </h2>

      <div className="space-y-3">

        <HealthRow
          label="API Server"
          value="Online"
        />

        <HealthRow
          label="ML Model"
          value="Loaded"
        />

        <HealthRow
          label="Supabase"
          value="Connected"
        />

        <HealthRow
          label="Storage"
          value="Ready"
        />

      </div>

    </div>
  );
}

function HealthRow({
  label,
  value,
}: any) {
  return (
    <div className="flex justify-between rounded-xl bg-white/5 p-4">

      <span>{label}</span>

      <span className="text-emerald-400">
        {value}
      </span>

    </div>
  );
}

function MetricsCard({
  total,
  encodes,
  decodes,
  avgPSNR,
  avgSNR,
  avgBER,
  avgNC,
  loading = false,
}: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">

      <h2 className="mb-4 font-semibold">
        Operations Summary
      </h2>

      <div className="space-y-3 text-sm">

        {loading ? (
          Array.from({ length: 7 }).map((_, idx) => (
            <div key={idx} className="flex justify-between items-center py-0.5 animate-pulse">
              <div className="h-4 w-1/3 rounded bg-white/5" />
              <div className="h-4 w-1/4 rounded bg-white/5" />
            </div>
          ))
        ) : (
          <>
            <MetricRow
              label="Total Operations"
              value={total}
            />

            <MetricRow
              label="Secure Encodes"
              value={encodes}
            />

            <MetricRow
              label="Successful Decodes"
              value={decodes}
            />

            <MetricRow
              label="Average PSNR"
              value={avgPSNR}
            />

            <MetricRow
              label="Average SNR"
              value={avgSNR}
            />

            <MetricRow
              label="Average BER"
              value={Number(
                avgBER || 0
              ).toExponential(2)}
            />

            <MetricRow
              label="Average NC"
              value={avgNC}
            />
          </>
        )}

      </div>

    </div>
  );
}

function MetricRow({
  label,
  value,
}: any) {
  return (
    <div className="flex justify-between">

      <span>{label}</span>

      <span>{value}</span>

    </div>
  );
}

function QuickLink({
  href,
  label,
}: any) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-white/10 bg-white/5 p-4 text-center transition hover:bg-white/10"
    >
      {label}
    </Link>
  );
}