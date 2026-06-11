"use client";

import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import useStats from "@/hooks/useStats";
import useJobs from "@/hooks/useJobs";

export default function DashboardPage() {
  const { stats, loading: statsLoading } =
    useStats();

  const { jobs, loading: jobsLoading } = useJobs();
  const isLoading = statsLoading || jobsLoading;

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
            value={stats.total_jobs}
            loading={isLoading}
          />

          <MetricCard
            title="Encodes"
            value={stats.encodes}
            loading={isLoading}
          />

          <MetricCard
            title="Decodes"
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
                          <p className="text-sm font-medium text-slate-300">No recent jobs found</p>
                          <p className="text-xs text-slate-500 mt-1">Run an encode or decode job to see live activity here.</p>
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
                          <tr
                            key={index}
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

                          </tr>
                        )
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
              loading={isLoading}
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
  loading = false,
}: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-4 sm:p-5 min-w-0">

      <p className="text-xs uppercase text-slate-500 truncate" title={title}>
        {title}
      </p>

      {loading ? (
        <div className="mt-4 h-8 sm:h-12 w-2/3 rounded-xl bg-white/5 animate-pulse" />
      ) : (
        <h2
          className={`mt-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold truncate break-words ${color}`}
          title={value}
        >
          {value}
        </h2>
      )}

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
  loading = false,
}: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">

      <h2 className="mb-4 font-semibold">
        Live Metrics
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