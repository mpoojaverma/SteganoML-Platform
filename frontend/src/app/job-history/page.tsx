"use client";

import { useMemo, useState } from "react";

import AppShell from "@/components/layout/AppShell";
import useJobs from "@/hooks/useJobs";

export default function JobHistoryPage() {
  const { jobs, loading } = useJobs();

  const [search, setSearch] =
    useState("");

  const filteredJobs = useMemo(() => {
    return jobs.filter((job: any) =>
      `${job.file_name} ${job.method} ${job.type}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [jobs, search]);

  const totalJobs =
    jobs.length;

  const encodeJobs =
    jobs.filter(
      (job: any) =>
        job.type === "encode"
    ).length;

  const decodeJobs =
    jobs.filter(
      (job: any) =>
        job.type === "decode"
    ).length;

  const successRate =
    jobs.length === 0
      ? "0%"
      : `${Math.round(
          (jobs.filter(
            (job: any) =>
              job.status ===
              "success"
          ).length /
            jobs.length) *
            100
        )}%`;

  return (
    <AppShell>
      <div className="space-y-6">

        <div>
          <h1 className="text-5xl font-bold">
            Job History
          </h1>

          <p className="mt-2 text-slate-400">
            Review encoding and decoding operations.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Total Jobs"
            value={totalJobs}
            loading={loading}
          />

          <StatCard
            title="Encodes"
            value={encodeJobs}
            loading={loading}
          />

          <StatCard
            title="Decodes"
            value={decodeJobs}
            loading={loading}
          />

          <StatCard
            title="Success Rate"
            value={successRate}
            color="text-emerald-400"
            loading={loading}
          />

        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b1327]">

          <div className="flex items-center justify-between border-b border-white/10 p-5">

            <h2 className="font-semibold">
              Recent Operations
            </h2>

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search jobs..."
              className="rounded-xl border border-white/10 bg-[#182238] px-4 py-2 text-sm outline-none"
            />

          </div>

          {loading ? (
            <div className="overflow-x-auto animate-pulse">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-left">
                    <th className="p-4">File</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Method</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">PSNR</th>
                    <th className="p-4">SNR</th>
                    <th className="p-4">BER</th>
                    <th className="p-4">NC</th>
                    <th className="p-4">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-white/5">
                      <td className="p-4"><div className="h-4 w-28 rounded bg-white/5" /></td>
                      <td className="p-4"><div className="h-4 w-12 rounded bg-white/5" /></td>
                      <td className="p-4"><div className="h-4 w-12 rounded bg-white/5" /></td>
                      <td className="p-4"><div className="h-6 w-16 rounded-full bg-white/5" /></td>
                      <td className="p-4"><div className="h-4 w-10 rounded bg-white/5" /></td>
                      <td className="p-4"><div className="h-4 w-10 rounded bg-white/5" /></td>
                      <td className="p-4"><div className="h-4 w-10 rounded bg-white/5" /></td>
                      <td className="p-4"><div className="h-4 w-10 rounded bg-white/5" /></td>
                      <td className="p-4"><div className="h-4 w-24 rounded bg-white/5" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center border-t border-white/5">
              <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-200">No jobs found</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm">
                We couldn't find any steganography runs matching your search query.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead>

                  <tr className="border-b border-white/10 text-slate-400">

                    <th className="p-4 text-left">
                      File
                    </th>

                    <th className="p-4 text-left">
                      Type
                    </th>

                    <th className="p-4 text-left">
                      Method
                    </th>

                    <th className="p-4 text-left">
                      Status
                    </th>

                    <th className="p-4 text-left">
                      PSNR
                    </th>

                    <th className="p-4 text-left">
                      SNR
                    </th>

                    <th className="p-4 text-left">
                      BER
                    </th>

                    <th className="p-4 text-left">
                      NC
                    </th>

                    <th className="p-4 text-left">
                      Created
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredJobs.map(
                    (
                      job: any,
                      index: number
                    ) => (
                      <tr
                        key={index}
                        className="border-b border-white/5 hover:bg-white/[0.02]"
                      >

                        <td className="p-4 max-w-[260px] group">
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

                        <td className="p-4 capitalize">
                          {job.type}
                        </td>

                        <td className="p-4 uppercase">
                          {job.method || "-"}
                        </td>

                        <td className="p-4">

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

                        <td className="p-4">
                          {job.psnr
                            ? Number(
                                job.psnr
                              ).toFixed(2)
                            : "-"}
                        </td>

                        <td className="p-4">
                          {job.snr
                            ? Number(
                                job.snr
                              ).toFixed(2)
                            : "-"}
                        </td>

                        <td className="p-4">
                          {job.ber ?? "-"}
                        </td>

                        <td className="p-4">
                          {job.nc ?? "-"}
                        </td>

                        <td className="p-4 whitespace-nowrap">
                          {new Date(
                            job.created_at
                          ).toLocaleString()}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </AppShell>
  );
}

function StatCard({
  title,
  value,
  color = "",
  loading = false,
}: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">

      <p className="text-xs uppercase text-slate-500">
        {title}
      </p>

      {loading ? (
        <div className="mt-4 h-12 w-2/3 rounded-xl bg-white/5 animate-pulse" />
      ) : (
        <h2
          className={`mt-4 text-5xl font-bold ${color}`}
        >
          {value}
        </h2>
      )}

    </div>
  );
}