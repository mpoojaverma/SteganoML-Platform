"use client";

import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import useStats from "@/hooks/useStats";
import useJobs from "@/hooks/useJobs";

export default function DashboardPage() {
  const { stats, loading } =
    useStats();

  const { jobs } = useJobs();

  return (
    <AppShell>
      <div className="space-y-6">

        <div>
          <h1 className="text-5xl font-bold">
            Dashboard
          </h1>

          <p className="mt-2 text-slate-400">
            Monitor adaptive steganography pipelines,
            security metrics and system activity.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-8">

          <MetricCard
            title="Total Jobs"
            value={
              loading
                ? "-"
                : stats.total_jobs
            }
          />

          <MetricCard
            title="Encodes"
            value={
              loading
                ? "-"
                : stats.encodes
            }
          />

          <MetricCard
            title="Decodes"
            value={
              loading
                ? "-"
                : stats.decodes
            }
          />

          <MetricCard
            title="Success Rate"
            value={
              loading
                ? "-"
                : `${stats.success_rate}%`
            }
            color="text-emerald-400"
          />

          <MetricCard
            title="Avg PSNR"
            value={
              loading
                ? "-"
                : stats.avg_psnr
            }
            color="text-cyan-400"
          />

          <MetricCard
            title="Avg SNR"
            value={
              loading
                ? "-"
                : stats.avg_snr
            }
            color="text-purple-400"
          />

          <MetricCard
            title="Avg BER"
            value={
              loading
                ? "-"
                : Number(
                    stats.avg_ber || 0
                  ).toExponential(2)
            }
            color="text-orange-400"
          />

          <MetricCard
            title="Avg NC"
            value={
              loading
                ? "-"
                : stats.avg_nc
            }
            color="text-pink-400"
          />

        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">

          <div className="xl:col-span-8 overflow-hidden rounded-3xl border border-white/10 bg-[#0b1327]">

            <div className="flex items-center justify-between border-b border-white/10 p-5">

              <h2 className="font-semibold">
                Recent Jobs
              </h2>

              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                Live Activity
              </span>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="text-left text-xs text-slate-500">

                    <th className="px-5 py-4">
                      File
                    </th>

                    <th>Type</th>

                    <th>Method</th>

                    <th>Status</th>

                    <th>PSNR</th>

                    <th>SNR</th>

                    <th>BER</th>

                    <th>NC</th>

                  </tr>

                </thead>

                <tbody>

                  {jobs
                    .slice(0, 8)
                    .map(
                      (
                        job: any,
                        index: number
                      ) => (
                        <tr
                          key={index}
                          className="border-t border-white/5 hover:bg-white/[0.03]"
                        >
                          <td className="px-5 py-4 max-w-[250px] truncate">
                            {job.file_name}
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

                        </tr>
                      )
                    )}

                </tbody>

              </table>

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
            />

          </div>

        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">

          <h2 className="mb-4 font-semibold">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

            <QuickLink
              href="/encode"
              label="New Encode Job"
            />

            <QuickLink
              href="/decode"
              label="Decode Audio"
            />

            <QuickLink
              href="/analytics"
              label="Analytics"
            />

            <QuickLink
              href="/job-history"
              label="Job History"
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
}: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">

      <p className="text-xs uppercase text-slate-500">
        {title}
      </p>

      <h2
        className={`mt-4 text-5xl font-bold ${color}`}
      >
        {value}
      </h2>

    </div>
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
}: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">

      <h2 className="mb-4 font-semibold">
        Live Metrics
      </h2>

      <div className="space-y-3 text-sm">

        <MetricRow
          label="Total Records"
          value={total}
        />

        <MetricRow
          label="Encoded Files"
          value={encodes}
        />

        <MetricRow
          label="Decoded Files"
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