export default function QualityReportCard() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#111827] overflow-hidden">

      <div className="border-b border-white/10 px-5 py-4">
        <h3 className="text-sm font-medium">
          Quality report
        </h3>

        <p className="text-xs text-slate-500 mt-1">
          Computed after embedding completes
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4">

        <div className="rounded-lg bg-[#1a2235] p-4">
          <p className="text-xs text-slate-500">
            PSNR
          </p>

          <h2 className="text-3xl font-bold mt-2">
            95.89
          </h2>

          <p className="text-xs text-emerald-400 mt-2">
            +0.19 vs randomized
          </p>
        </div>

        <div className="rounded-lg bg-[#1a2235] p-4">
          <p className="text-xs text-slate-500">
            SNR
          </p>

          <h2 className="text-3xl font-bold mt-2">
            76.59
          </h2>

          <p className="text-xs text-emerald-400 mt-2">
            +0.19 vs randomized
          </p>
        </div>

        <div className="rounded-lg bg-[#1a2235] p-4">
          <p className="text-xs text-slate-500">
            BER
          </p>

          <h2 className="text-2xl font-bold mt-2">
            4.3e-7
          </h2>
        </div>

        <div className="rounded-lg bg-[#1a2235] p-4">
          <p className="text-xs text-slate-500">
            NC
          </p>

          <h2 className="text-2xl font-bold mt-2">
            1.000
          </h2>
        </div>

      </div>

      <div className="px-4 pb-4">

        <div className="rounded-lg bg-[#1a2235] p-4 mb-4">

          <div className="flex justify-between">

            <div>
              <p className="text-xs text-slate-500">
                Robust positions
              </p>

              <p className="mt-1">
                184,320 bytes
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Payload size
              </p>

              <p className="mt-1">
                248 bytes
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Processing
              </p>

              <p className="mt-1">
                14.2s
              </p>
            </div>

          </div>

        </div>

        <button className="w-full rounded-lg bg-teal-900/60 border border-teal-500 py-3 text-teal-300">
          Download stego audio
        </button>

      </div>
    </div>
  );
}