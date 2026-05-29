import AppShell from "@/components/layout/AppShell";
import MetricCard from "@/components/ui/MetricCard";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-8">

        <div>
          <h1 className="text-6xl font-bold">
            Dashboard
          </h1>

          <p className="mt-3 text-slate-400">
            Monitor adaptive embedding pipelines and steganographic robustness.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-5">
          <MetricCard
            title="Avg PSNR"
            value="94.69"
            subtitle="+0.41 vs baseline"
          />

          <MetricCard
            title="Avg SNR"
            value="72.03"
            subtitle="+0.41 vs baseline"
          />

          <MetricCard
            title="Total Jobs"
            value="24"
            subtitle="18 encode • 6 decode"
          />

          <MetricCard
            title="Success Rate"
            value="100%"
            subtitle="24 / 24 completed"
          />
        </div>

        <div className="grid grid-cols-12 gap-5">

          <div className="col-span-9 rounded-3xl border border-white/10 bg-[#0b1327] p-6">

            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Recent Jobs
              </h2>

              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-400">
                All healthy
              </span>
            </div>

            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500">
                  <th className="pb-4">File</th>
                  <th>Method</th>
                  <th>PSNR</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>

                <tr className="border-t border-white/5">
                  <td className="py-5">speech_sample_01.wav</td>
                  <td>ML-guided</td>
                  <td>95.89</td>
                  <td>Complete</td>
                  <td>14.2s</td>
                </tr>

                <tr className="border-t border-white/5">
                  <td className="py-5">music_track_03.wav</td>
                  <td>ML-guided</td>
                  <td>98.57</td>
                  <td>Complete</td>
                  <td>18.6s</td>
                </tr>

                <tr className="border-t border-white/5">
                  <td className="py-5">voice_sample_16.wav</td>
                  <td>Randomized</td>
                  <td>92.01</td>
                  <td>Analyzing</td>
                  <td>--</td>
                </tr>

              </tbody>
            </table>

          </div>

          <div className="col-span-3 rounded-3xl border border-white/10 bg-[#0b1327] p-6">
            <div className="mb-6 flex justify-between">
              <h2 className="font-semibold">
                Live Pipeline
              </h2>

              <span className="text-xs text-emerald-400">
                Active
              </span>
            </div>

            <div className="space-y-5">

              <div>
                <p className="mb-2 text-sm">Audio received</p>
                <div className="h-2 rounded bg-slate-800">
                  <div className="h-2 w-full rounded bg-emerald-400" />
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm">Encryption</p>
                <div className="h-2 rounded bg-slate-800">
                  <div className="h-2 w-full rounded bg-emerald-400" />
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm text-purple-400">
                  ML analysis
                </p>

                <div className="h-2 rounded bg-slate-800">
                  <div className="h-2 w-1/2 rounded bg-purple-500" />
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm text-slate-500">
                  Adaptive embedding
                </p>

                <div className="h-2 rounded bg-slate-800" />
              </div>

              <div>
                <p className="mb-2 text-sm text-slate-500">
                  Quality metrics
                </p>

                <div className="h-2 rounded bg-slate-800" />
              </div>

            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-6">
          <h2 className="mb-6 font-semibold">
            PSNR by file — ML vs baseline
          </h2>

          <div className="space-y-6">

            <div>
              <p className="mb-2 text-sm">file_1</p>

              <div className="h-3 rounded bg-slate-800">
                <div className="h-3 w-[96%] rounded bg-cyan-400" />
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm">file_14</p>

              <div className="h-3 rounded bg-slate-800">
                <div className="h-3 w-[98%] rounded bg-cyan-400" />
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm">file_16</p>

              <div className="h-3 rounded bg-slate-800">
                <div className="h-3 w-[92%] rounded bg-cyan-400" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </AppShell>
  );
}