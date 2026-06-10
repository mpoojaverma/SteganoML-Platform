"use client";

import { useEffect, useMemo, useState } from "react";

import AppShell from "@/components/layout/AppShell";
import { getJobs } from "@/lib/jobs";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

export default function AnalyticsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getJobs();
        setJobs(data);
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

        {loading && (
          <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-6">
            Loading analytics...
          </div>
        )}

        {!loading && (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">

              <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">
                <p className="text-xs uppercase text-slate-500">
                  Encodes
                </p>
                <h2 className="mt-4 text-5xl font-bold">
                  {encodeJobs.length}
                </h2>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">
                <p className="text-xs uppercase text-slate-500">
                  Decodes
                </p>
                <h2 className="mt-4 text-5xl font-bold">
                  {decodeJobs.length}
                </h2>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">
                <p className="text-xs uppercase text-slate-500">
                  Avg PSNR
                </p>
                <h2 className="mt-4 text-5xl font-bold">
                  {avgPSNR}
                </h2>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">
                <p className="text-xs uppercase text-slate-500">
                  Avg SNR
                </p>
                <h2 className="mt-4 text-5xl font-bold">
                  {avgSNR}
                </h2>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">
                <p className="text-xs uppercase text-slate-500">
                  Avg BER
                </p>
                <h2 className="mt-4 text-3xl font-bold">
                  {avgBER}
                </h2>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">
                <p className="text-xs uppercase text-slate-500">
                  Avg NC
                </p>
                <h2 className="mt-4 text-5xl font-bold">
                  {avgNC}
                </h2>
              </div>

            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

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

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

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

            <div className="rounded-3xl border border-white/10 bg-[#0b1327] overflow-hidden">

              <div className="border-b border-white/10 p-5">
                <h2 className="font-semibold">
                  Encode Results
                </h2>
              </div>

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
                        className="border-t border-white/5"
                      >
                        <td className="px-5 py-4">
                          {job.file_name}
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

          </>
        )}
      </div>
    </AppShell>
  );
}