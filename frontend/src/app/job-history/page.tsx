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

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-5xl font-bold">
              Job History
            </h1>

            <p className="mt-2 text-slate-400">
              Review encoding and decoding operations.
            </p>
          </div>

        </div>

        <div className="grid grid-cols-4 gap-4">

          <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">
            <p className="text-xs uppercase text-slate-500">
              Total Jobs
            </p>

            <h2 className="mt-4 text-5xl font-bold">
              {totalJobs}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">
            <p className="text-xs uppercase text-slate-500">
              Encodes
            </p>

            <h2 className="mt-4 text-5xl font-bold">
              {encodeJobs}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">
            <p className="text-xs uppercase text-slate-500">
              Decodes
            </p>

            <h2 className="mt-4 text-5xl font-bold">
              {decodeJobs}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">
            <p className="text-xs uppercase text-slate-500">
              Success Rate
            </p>

            <h2 className="mt-4 text-5xl font-bold text-emerald-400">
              {successRate}
            </h2>
          </div>

        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0b1327] overflow-hidden">

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
              className="rounded-xl border border-white/10 bg-[#182238] px-4 py-2 text-sm"
            />

          </div>

          {loading ? (
            <div className="p-6 text-slate-400">
              Loading jobs...
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="p-6 text-slate-400">
              No jobs found.
            </div>
          ) : (
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
                      className="border-b border-white/5"
                    >
                      <td className="p-4">
                        {job.file_name}
                      </td>

                      <td className="p-4 capitalize">
                        {job.type}
                      </td>

                      <td className="p-4 uppercase">
                        {job.method}
                      </td>

                      <td className="p-4">
                        {job.status}
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
                        {new Date(
                          job.created_at
                        ).toLocaleString()}
                      </td>
                    </tr>
                  )
                )}

              </tbody>

            </table>
          )}

        </div>

      </div>
    </AppShell>
  );
}