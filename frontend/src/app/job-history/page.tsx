import AppShell from "@/components/layout/AppShell";

export default function JobHistoryPage() {
  return (
    <AppShell>
      <div className="space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold">
              Job History
            </h1>

            <p className="mt-2 text-slate-400">
              Review completed encoding and decoding operations.
            </p>
          </div>

          <button className="rounded-xl border border-white/10 px-4 py-2 text-sm">
            Export CSV
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">

          <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">
            <p className="text-xs text-slate-500 uppercase">
              Total Jobs
            </p>

            <h2 className="mt-4 text-5xl font-bold">
              24
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">
            <p className="text-xs text-slate-500 uppercase">
              Encodes
            </p>

            <h2 className="mt-4 text-5xl font-bold">
              18
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">
            <p className="text-xs text-slate-500 uppercase">
              Decodes
            </p>

            <h2 className="mt-4 text-5xl font-bold">
              6
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-5">
            <p className="text-xs text-slate-500 uppercase">
              Success Rate
            </p>

            <h2 className="mt-4 text-5xl font-bold">
              100%
            </h2>
          </div>

        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0b1327] overflow-hidden">

          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <h2 className="font-semibold">
              Recent Operations
            </h2>

            <input
              placeholder="Search jobs..."
              className="rounded-lg border border-white/10 bg-[#182238] px-4 py-2 text-sm outline-none"
            />
          </div>

          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-slate-500">
                <th className="px-5 py-4">Job ID</th>
                <th>File</th>
                <th>Type</th>
                <th>Method</th>
                <th>PSNR</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>

              {[
                [
                  "job_d12f7c44",
                  "speech_sample_01.wav",
                  "Encode",
                  "ML-guided",
                  "95.89",
                  "Complete",
                  "2026-05-28",
                ],
                [
                  "job_a81bc220",
                  "music_track_03.wav",
                  "Encode",
                  "ML-guided",
                  "98.57",
                  "Complete",
                  "2026-05-27",
                ],
                [
                  "job_98fc12ab",
                  "voice_sample_16.wav",
                  "Decode",
                  "ML-guided",
                  "--",
                  "Complete",
                  "2026-05-27",
                ],
                [
                  "job_77df8120",
                  "conference.wav",
                  "Encode",
                  "Randomized",
                  "92.01",
                  "Complete",
                  "2026-05-26",
                ],
              ].map((row, i) => (
                <tr
                  key={i}
                  className="border-t border-white/5 hover:bg-white/[0.02]"
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

      </div>
    </AppShell>
  );
}