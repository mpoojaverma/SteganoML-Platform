"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import { getJobs } from "@/lib/jobs";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

export default function AnalyticsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareStats, setShareStats] = useState({
    links_created: 0,
    files_shared: 0,
    downloads_completed: 0,
    expired_links: 0
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getJobs();
        setJobs(data || []);

        const { getAnalytics } = await import("@/lib/analytics");
        const analyticsData = await getAnalytics();
        if (analyticsData) {
          setShareStats({
            links_created: analyticsData.links_created || 0,
            files_shared: analyticsData.files_shared || 0,
            downloads_completed: analyticsData.downloads_completed || 0,
            expired_links: analyticsData.expired_links || 0
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const encodeJobs = useMemo(
    () =>
      jobs.filter(
        (job) => job.type === "encode"
      ),
    [jobs]
  );

  const decodeJobs = useMemo(
    () =>
      jobs.filter(
        (job) => job.type === "decode"
      ),
    [jobs]
  );

  const avgPSNR =
    encodeJobs.length > 0
      ? (
          encodeJobs.reduce(
            (sum, job) =>
              sum +
              Number(job.psnr || 0),
            0
          ) / encodeJobs.length
        ).toFixed(2)
      : "0.00";

  const avgSNR =
    encodeJobs.length > 0
      ? (
          encodeJobs.reduce(
            (sum, job) =>
              sum +
              Number(job.snr || 0),
            0
          ) / encodeJobs.length
        ).toFixed(2)
      : "0.00";

  const avgBER =
    encodeJobs.length > 0
      ? (
          encodeJobs.reduce(
            (sum, job) =>
              sum +
              Number(job.ber || 0),
            0
          ) / encodeJobs.length
        ).toExponential(2)
      : "0";

  const avgNC =
    encodeJobs.length > 0
      ? (
          encodeJobs.reduce(
            (sum, job) =>
              sum +
              Number(job.nc || 0),
            0
          ) / encodeJobs.length
        ).toFixed(3)
      : "0.000";

  const bestPSNR =
    encodeJobs.length > 0
      ? [...encodeJobs].sort(
          (a, b) =>
            Number(b.psnr || 0) -
            Number(a.psnr || 0)
        )[0]
      : null;

  const bestSNR =
    encodeJobs.length > 0
      ? [...encodeJobs].sort(
          (a, b) =>
            Number(b.snr || 0) -
            Number(a.snr || 0)
        )[0]
      : null;

  const psnrData = encodeJobs.map(
    (job, index) => ({
      job: `J${index + 1}`,
      psnr: Number(
        job.psnr || 0
      ),
    })
  );

  const snrData = encodeJobs.map(
    (job, index) => ({
      job: `J${index + 1}`,
      snr: Number(
        job.snr || 0
      ),
    })
  );

  const pieData = [
    {
      name: "Encode",
      value: encodeJobs.length,
    },
    {
      name: "Decode",
      value: decodeJobs.length,
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6">

        <div>
          <h1 className="text-5xl font-bold">
            Analytics
          </h1>

          <p className="mt-2 text-slate-400">
            Research metrics and
            steganographic performance.
          </p>
        </div>

        {loading ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">
                  <div className="h-3 w-16 bg-white/5 animate-pulse rounded" />
                  <div className="mt-4 h-12 w-20 bg-white/5 animate-pulse rounded-xl" />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">
                <div className="h-5 w-28 bg-white/5 animate-pulse rounded mb-5" />
                <div className="h-[300px] w-full bg-white/5 animate-pulse rounded-xl" />
              </div>
              <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">
                <div className="h-5 w-28 bg-white/5 animate-pulse rounded mb-5" />
                <div className="h-[300px] w-full bg-white/5 animate-pulse rounded-xl" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">
                <div className="h-5 w-36 bg-white/5 animate-pulse rounded mb-5" />
                <div className="h-[300px] w-full bg-white/5 animate-pulse rounded-xl" />
              </div>
              <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">
                <div className="h-5 w-36 bg-white/5 animate-pulse rounded mb-4" />
                <div className="space-y-4">
                  <div className="h-24 w-full bg-white/5 animate-pulse rounded-xl" />
                  <div className="h-24 w-full bg-white/5 animate-pulse rounded-xl" />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0b1327] overflow-hidden">
              <div className="border-b border-white/10 p-5">
                <div className="h-5 w-32 bg-white/5 animate-pulse rounded" />
              </div>
              {/* Desktop Loading Skeleton Table */}
              <div className="hidden md:block overflow-x-auto w-full min-w-0">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-slate-500">
                      <th className="px-5 py-4">File</th>
                      <th>Method</th>
                      <th>PSNR</th>
                      <th>SNR</th>
                      <th>BER</th>
                      <th>NC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <tr key={idx} className="border-t border-white/5">
                        <td className="px-5 py-4"><div className="h-4 w-28 bg-white/5 animate-pulse rounded" /></td>
                        <td><div className="h-4 w-12 bg-white/5 animate-pulse rounded" /></td>
                        <td><div className="h-4 w-10 bg-white/5 animate-pulse rounded" /></td>
                        <td><div className="h-4 w-10 bg-white/5 animate-pulse rounded" /></td>
                        <td><div className="h-4 w-10 bg-white/5 animate-pulse rounded" /></td>
                        <td><div className="h-4 w-10 bg-white/5 animate-pulse rounded" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Loading Skeleton Cards */}
              <div className="block md:hidden divide-y divide-white/5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} className="p-5 space-y-4 animate-pulse">
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-2/3 rounded bg-white/5" />
                      <div className="h-4 w-12 rounded bg-white/5" />
                    </div>
                    <div className="grid grid-cols-4 gap-2 pt-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-8 rounded bg-white/5" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : jobs.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-12 text-center flex flex-col items-center justify-center">
            <svg className="w-20 h-20 text-cyan-500/20 mb-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h2 className="text-2xl font-bold text-slate-200">No Analytics Data Yet</h2>
            <p className="text-slate-500 mt-2 max-w-md">
              Run some encoding and decoding operations to view quality trends, detection confidence rates, and system efficiency reports.
            </p>
            <Link
              href="/encode"
              className="mt-8 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black hover:brightness-110 transition focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1327] outline-none cursor-pointer min-h-[44px] inline-flex items-center justify-center"
            >
              Process First Audio File
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">

              <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5 min-w-0">
                <p className="text-xs uppercase text-slate-500 truncate lg:overflow-visible lg:whitespace-normal" title="Encodes">
                  Encodes
                </p>
                <h2 className="mt-4 text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold truncate lg:overflow-visible lg:whitespace-normal lg:break-normal break-words">
                  {encodeJobs.length}
                </h2>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5 min-w-0">
                <p className="text-xs uppercase text-slate-500 truncate lg:overflow-visible lg:whitespace-normal" title="Decodes">
                  Decodes
                </p>
                <h2 className="mt-4 text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold truncate lg:overflow-visible lg:whitespace-normal lg:break-normal break-words">
                  {decodeJobs.length}
                </h2>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5 min-w-0">
                <p className="text-xs uppercase text-slate-500 truncate lg:overflow-visible lg:whitespace-normal" title="Avg PSNR">
                  Avg PSNR
                </p>
                <h2 className="mt-4 text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold truncate lg:overflow-visible lg:whitespace-normal lg:break-normal break-words">
                  {avgPSNR}
                </h2>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5 min-w-0">
                <p className="text-xs uppercase text-slate-500 truncate lg:overflow-visible lg:whitespace-normal" title="Avg SNR">
                  Avg SNR
                </p>
                <h2 className="mt-4 text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold truncate lg:overflow-visible lg:whitespace-normal lg:break-normal break-words">
                  {avgSNR}
                </h2>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5 min-w-0">
                <p className="text-xs uppercase text-slate-500 truncate lg:overflow-visible lg:whitespace-normal" title="Avg BER">
                  Avg BER
                </p>
                <h2 className="mt-4 text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold truncate lg:overflow-visible lg:whitespace-normal lg:break-normal break-words">
                  {avgBER}
                </h2>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5 min-w-0">
                <p className="text-xs uppercase text-slate-500 truncate lg:overflow-visible lg:whitespace-normal" title="Avg NC">
                  Avg NC
                </p>
                <h2 className="mt-4 text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold truncate lg:overflow-visible lg:whitespace-normal lg:break-normal break-words">
                  {avgNC}
                </h2>
              </div>

            </div>

            {/* Share Stats Grid */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                Secure Delivery & Sharing Analytics
              </h3>
              
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5 min-w-0 transition-all duration-300 hover:border-cyan-500/20">
                  <p className="text-xs uppercase text-slate-500 truncate" title="Links Created">
                    Links Created
                  </p>
                  <h2 className="mt-4 text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold truncate text-cyan-400">
                    {shareStats.links_created}
                  </h2>
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5 min-w-0 transition-all duration-300 hover:border-teal-500/20">
                  <p className="text-xs uppercase text-slate-500 truncate" title="Files Shared">
                    Files Shared
                  </p>
                  <h2 className="mt-4 text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold truncate text-teal-400">
                    {shareStats.files_shared}
                  </h2>
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5 min-w-0 transition-all duration-300 hover:border-purple-500/20">
                  <p className="text-xs uppercase text-slate-500 truncate" title="Downloads Completed">
                    Downloads
                  </p>
                  <h2 className="mt-4 text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold truncate text-purple-400">
                    {shareStats.downloads_completed}
                  </h2>
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5 min-w-0 transition-all duration-300 hover:border-orange-500/20">
                  <p className="text-xs uppercase text-slate-500 truncate" title="Expired Links">
                    Expired Links
                  </p>
                  <h2 className="mt-4 text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold truncate text-orange-400">
                    {shareStats.expired_links}
                  </h2>
                </div>
              </div>
            </div>

            {/* Desktop View (>= md) */}
            <div className="hidden md:grid grid-cols-2 gap-6">

              <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">
                <h2 className="mb-5 font-semibold">
                  PSNR Trend
                </h2>

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >
                  <LineChart
                    data={psnrData}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="job" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="psnr"
                      stroke="#06b6d4"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">
                <h2 className="mb-5 font-semibold">
                  SNR Trend
                </h2>

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >
                  <LineChart
                    data={snrData}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="job" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="snr"
                      stroke="#8b5cf6"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

            </div>

            {/* Mobile View (< md) */}
            <div className="block md:hidden space-y-6">

              <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">
                <h2 className="mb-5 font-semibold">
                  PSNR Trend
                </h2>

                <ResponsiveContainer
                  width="100%"
                  height={220}
                >
                  <LineChart
                    data={psnrData}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="job" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="psnr"
                      stroke="#06b6d4"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">
                <h2 className="mb-5 font-semibold">
                  SNR Trend
                </h2>

                <ResponsiveContainer
                  width="100%"
                  height={220}
                >
                  <LineChart
                    data={snrData}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="job" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="snr"
                      stroke="#8b5cf6"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

            </div>

            {/* Desktop View (>= md) */}
            <div className="hidden md:grid grid-cols-2 gap-6">

              <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">
                <h2 className="mb-5 font-semibold">
                  Encode vs Decode
                </h2>

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      outerRadius={100}
                      label
                    >
                      <Cell fill="#06b6d4" />
                      <Cell fill="#8b5cf6" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">
                <h2 className="mb-5 font-semibold">
                  Research Summary
                </h2>

                <div className="space-y-4">

                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-sm text-slate-400">
                      Best PSNR File
                    </p>

                    <p className="mt-2 font-medium">
                      {bestPSNR?.file_name ||
                        "N/A"}
                    </p>

                    <p className="text-cyan-400">
                      {bestPSNR?.psnr ||
                        "-"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-sm text-slate-400">
                      Best SNR File
                    </p>

                    <p className="mt-2 font-medium">
                      {bestSNR?.file_name ||
                        "N/A"}
                    </p>

                    <p className="text-purple-400">
                      {bestSNR?.snr ||
                        "-"}
                    </p>
                  </div>

                </div>
              </div>

            </div>

            {/* Mobile View (< md) */}
            <div className="block md:hidden space-y-6">

              <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">
                <h2 className="mb-5 font-semibold">
                  Encode vs Decode
                </h2>

                <ResponsiveContainer
                  width="100%"
                  height={220}
                >
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      outerRadius={75}
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#06b6d4" />
                      <Cell fill="#8b5cf6" />
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" align="center" iconSize={10} wrapperStyle={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">
                <h2 className="mb-5 font-semibold">
                  Research Summary
                </h2>

                <div className="space-y-4">

                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-sm text-slate-400">
                      Best PSNR File
                    </p>

                    <p className="mt-2 font-medium break-all">
                      {bestPSNR?.file_name ||
                        "N/A"}
                    </p>

                    <p className="text-cyan-400">
                      {bestPSNR?.psnr ||
                        "-"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-sm text-slate-400">
                      Best SNR File
                    </p>

                    <p className="mt-2 font-medium break-all">
                      {bestSNR?.file_name ||
                        "N/A"}
                    </p>

                    <p className="text-purple-400">
                      {bestSNR?.snr ||
                        "-"}
                    </p>
                  </div>

                </div>
              </div>

            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0b1327] overflow-hidden">

              <div className="border-b border-white/10 p-5">
                <h2 className="font-semibold">
                  Encode Results
                </h2>
              </div>

              {/* Desktop View (>= md) */}
              <div className="hidden md:block overflow-x-auto w-full min-w-0">
                <table className="w-full">

                  <thead>
                    <tr className="text-left text-xs text-slate-500">
                      <th className="px-5 py-4">
                        File
                      </th>
                      <th>Method</th>
                      <th>PSNR</th>
                      <th>SNR</th>
                      <th>BER</th>
                      <th>NC</th>
                    </tr>
                  </thead>

                  <tbody>
                    {encodeJobs.map(
                      (
                        job,
                        index
                      ) => (
                        <tr
                          key={index}
                          className="border-t border-white/5 hover:bg-white/[0.02]"
                        >
                          <td className="px-5 py-4 group">
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
                          <td>
                            {job.method}
                          </td>
                          <td>
                            {job.psnr}
                          </td>
                          <td>
                            {job.snr}
                          </td>
                          <td>
                            {job.ber}
                          </td>
                          <td>
                            {job.nc}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>

                </table>
              </div>

              {/* Mobile Cards View */}
              <div className="block md:hidden divide-y divide-white/5">
                {encodeJobs.map((job, index) => (
                  <div key={index} className="p-5 space-y-3">
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
                        <div className="mt-1 text-xs text-slate-400 capitalize">
                          Method: {job.method || "-"}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="rounded-lg bg-white/5 p-2">
                        <div className="text-[10px] uppercase text-slate-500">PSNR</div>
                        <div className="text-xs font-semibold text-slate-300 mt-0.5">
                          {job.psnr ?? "-"}
                        </div>
                      </div>
                      <div className="rounded-lg bg-white/5 p-2">
                        <div className="text-[10px] uppercase text-slate-500">SNR</div>
                        <div className="text-xs font-semibold text-slate-300 mt-0.5">
                          {job.snr ?? "-"}
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
                  </div>
                ))}
              </div>

            </div>

          </>
        )}
      </div>
    </AppShell>
  );
}