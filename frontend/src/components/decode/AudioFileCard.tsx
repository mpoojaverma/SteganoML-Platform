export default function AudioFileCard() {
  return (
    <div className="rounded-[10px] border border-white/10 bg-[#111827] overflow-hidden">

      <div className="px-4 py-4 border-b border-white/10">
        <h2 className="text-sm font-medium text-white">
          Stego audio file
        </h2>

        <p className="text-xs text-slate-500 mt-1">
          The encoded WAV file received from sender
        </p>
      </div>

      <div className="p-4">

        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#1a2235] px-4 py-3">

          <div className="w-9 h-9 rounded-lg bg-[#2d1f5e]" />

          <div>
            <p className="text-sm font-medium text-white">
              stego_output_secure.wav
            </p>

            <p className="text-xs text-slate-500">
              44.1 kHz · Mono · 3.1 MB · 32.4s
            </p>
          </div>

        </div>

        <div className="mt-3 rounded-lg bg-[#1a2235] px-3 py-3 text-xs text-slate-400">
          File appears unmodified. Standard WAV format. Stego content not externally detectable.
        </div>

      </div>

    </div>
  );
}