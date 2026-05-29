import AppShell from "@/components/layout/AppShell";

export default function AnalyticsPage() {
  return (
    <AppShell>
      <div className="space-y-6">

        {/* Header */}

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-5xl font-bold">
              Analytics
            </h1>

            <p className="mt-2 text-slate-400">
              Compare ML-guided embedding against randomized baselines.
            </p>
          </div>

          <div className="flex gap-2">
            <button className="rounded-lg bg-teal-500/20 px-4 py-2 text-sm text-teal-300 border border-teal-500/20">
              All jobs
            </button>

            <button className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300">
              ML-guided
            </button>

            <button className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300">
              Randomized
            </button>
          </div>
        </div>

        {/* Metric Cards */}

        <div className="grid grid-cols-4 gap-4">

          <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5 relative">
            <div className="absolute right-5 top-5 h-5 w-5 rounded bg-emerald-500/30" />

            <p className="text-xs uppercase text-slate-500">
              ML Avg PSNR
            </p>

            <h2 className="mt-5 text-5xl font-bold">
              94.69
              <span className="ml-2 text-lg">dB</span>
            </h2>

            <p className="mt-3 text-sm text-emerald-400">
              +0.41 dB vs randomized baseline
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5 relative">
            <div className="absolute right-5 top-5 h-5 w-5 rounded bg-emerald-500/30" />

            <p className="text-xs uppercase text-slate-500">
              ML Avg SNR
            </p>

            <h2 className="mt-5 text-5xl font-bold">
              72.03
              <span className="ml-2 text-lg">dB</span>
            </h2>

            <p className="mt-3 text-sm text-emerald-400">
              +0.41 dB vs randomized baseline
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5 relative">
            <div className="absolute right-5 top-5 h-5 w-5 rounded bg-purple-500/30" />

            <p className="text-xs uppercase text-slate-500">
              Avg BER
            </p>

            <h2 className="mt-5 text-5xl font-bold">
              1
              <span className="text-2xl align-top">e-6</span>
            </h2>

            <p className="mt-3 text-sm text-slate-400">
              Near-zero across all files
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5 relative">
            <div className="absolute right-5 top-5 h-5 w-5 rounded bg-emerald-500/30" />

            <p className="text-xs uppercase text-slate-500">
              NC Score
            </p>

            <h2 className="mt-5 text-5xl font-bold">
              1.000
            </h2>

            <p className="mt-3 text-sm text-emerald-400">
              Perfect signal correlation
            </p>
          </div>

        </div>

        {/* Comparison Row */}

        <div className="grid grid-cols-2 gap-4">

          {/* PSNR Chart */}

          <div className="rounded-3xl border border-white/10 bg-[#0b1327] overflow-hidden">
            <div className="border-b border-white/10 p-5">
              <h2 className="font-semibold">
                PSNR per file — method comparison
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Higher is better
              </p>
            </div>

            <div className="p-5 space-y-5">

              {[
                ["file_1", "96%", "94%"],
                ["file_9", "96%", "94%"],
                ["file_14", "99%", "95%"],
                ["file_11", "88%", "85%"],
                ["file_16", "86%", "82%"],
              ].map(([file, ml, rand]) => (
                <div key={file}>
                  <p className="mb-2 text-sm text-slate-400">
                    {file}
                  </p>

                  <div className="h-3 rounded bg-slate-800">
                    <div
                      className="h-3 rounded bg-cyan-400"
                      style={{ width: ml }}
                    />
                  </div>

                  <div className="mt-2 h-3 rounded bg-slate-800">
                    <div
                      className="h-3 rounded bg-purple-500"
                      style={{ width: rand }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scatter Plot */}

          <div className="rounded-3xl border border-white/10 bg-[#0b1327] overflow-hidden">
            <div className="border-b border-white/10 p-5">
              <h2 className="font-semibold">
                SNR vs PSNR distribution
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Scatter comparison
              </p>
            </div>

            <div className="relative h-[300px] p-6">

              <div className="absolute left-8 top-8 bottom-10 w-px bg-white/10" />
              <div className="absolute left-8 right-8 bottom-10 h-px bg-white/10" />

              <div className="absolute left-[55%] top-[55%] h-3 w-3 rounded-full bg-cyan-400" />
              <div className="absolute left-[63%] top-[50%] h-3 w-3 rounded-full bg-cyan-400" />
              <div className="absolute left-[71%] top-[45%] h-3 w-3 rounded-full bg-cyan-400" />
              <div className="absolute left-[78%] top-[40%] h-3 w-3 rounded-full bg-cyan-400" />
              <div className="absolute left-[84%] top-[35%] h-3 w-3 rounded-full bg-cyan-400" />

              <div className="absolute left-[51%] top-[53%] h-3 w-3 rounded-full bg-purple-500" />
              <div className="absolute left-[58%] top-[52%] h-3 w-3 rounded-full bg-purple-500" />
              <div className="absolute left-[66%] top-[47%] h-3 w-3 rounded-full bg-purple-500" />
              <div className="absolute left-[73%] top-[43%] h-3 w-3 rounded-full bg-purple-500" />
              <div className="absolute left-[79%] top-[38%] h-3 w-3 rounded-full bg-purple-500" />

              <div className="absolute left-8 bottom-3 text-[10px] text-slate-500">
                55 dB
              </div>

              <div className="absolute right-8 bottom-3 text-[10px] text-slate-500">
                80 dB
              </div>
            </div>

            <div className="flex gap-5 px-6 pb-5 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <div className="h-2 w-2 rounded-full bg-cyan-400" />
                ML-guided
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                Randomized
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Table */}

        <div className="rounded-3xl border border-white/10 bg-[#0b1327] overflow-hidden">

          <div className="border-b border-white/10 p-5">
            <h2 className="font-semibold">
              Full metrics table
            </h2>
          </div>

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
              {[
                ["file_1.wav", "ML", "95.89", "76.59", "4.3e-7", "1.000"],
                ["file_1.wav", "Rand", "95.70", "76.40", "3.9e-7", "1.000"],
                ["file_14.wav", "ML", "98.57", "79.96", "1.8e-7", "1.000"],
                ["file_14.wav", "Rand", "97.17", "78.55", "2.1e-7", "1.000"],
                ["file_16.wav", "ML", "92.01", "57.88", "1.3e-6", "1.000"],
                ["file_16.wav", "Rand", "90.99", "56.86", "7.3e-6", "1.000"],
              ].map((row, idx) => (
                <tr
                  key={idx}
                  className="border-t border-white/5 hover:bg-white/[0.02] transition"
                >
                  {row.map((cell) => (
                    <td key={cell} className="px-5 py-4">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

        </div>

        {/* Robustness */}

        <div className="rounded-3xl border border-white/10 bg-[#0b1327] overflow-hidden">

          <div className="border-b border-white/10 p-5">
            <h2 className="font-semibold">
              Robustness matrix
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Pass / fail under three attack types
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 p-5">

            <div className="rounded-2xl bg-[#182238] p-4">
              <h3 className="font-medium mb-3">
                MP3 compression (128k)
              </h3>

              <p className="text-sm text-slate-300">
                ML-guided
                <span className="float-right text-red-400">
                  Fail
                </span>
              </p>

              <p className="mt-2 text-sm text-slate-300">
                Randomized
                <span className="float-right text-red-400">
                  Fail
                </span>
              </p>
            </div>

            <div className="rounded-2xl bg-[#182238] p-4">
              <h3 className="font-medium mb-3">
                Gaussian noise
              </h3>

              <p className="text-sm text-slate-300">
                ML-guided
                <span className="float-right text-emerald-400">
                  Pass
                </span>
              </p>

              <p className="mt-2 text-sm text-slate-300">
                Randomized
                <span className="float-right text-emerald-400">
                  Pass
                </span>
              </p>
            </div>

            <div className="rounded-2xl bg-[#182238] p-4">
              <h3 className="font-medium mb-3">
                Targeted quiet-frame noise
              </h3>

              <p className="text-sm text-slate-300">
                ML-guided
                <span className="float-right text-emerald-400">
                  Pass
                </span>
              </p>

              <p className="mt-2 text-sm text-slate-300">
                Randomized
                <span className="float-right text-red-400">
                  Fail
                </span>
              </p>

              <p className="mt-4 text-xs text-cyan-400">
                ML-guided uniquely survives targeted attack.
              </p>
            </div>

          </div>
        </div>

      </div>
    </AppShell>
  );
}