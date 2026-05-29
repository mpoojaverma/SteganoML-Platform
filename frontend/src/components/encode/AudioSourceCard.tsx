export default function AudioSourceCard() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#111827] overflow-hidden">
      <div className="border-b border-white/10 px-5 py-4">
        <h3 className="text-sm font-medium">
          Audio source
        </h3>

        <p className="text-xs text-slate-500 mt-1">
          WAV, MP3, FLAC, M4A — max 50 MB
        </p>
      </div>

      <div className="p-5">

        <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-[#1a2235] px-4 py-4">

          <div className="h-10 w-10 rounded-lg bg-teal-900/50" />

          <div>
            <p className="text-sm font-medium">
              voice_sample_16.wav
            </p>

            <p className="text-xs text-slate-500">
              44.1 kHz · Mono · 3.1 MB · 32.4s
            </p>
          </div>
        </div>

        <div className="mt-4 h-14 rounded-lg bg-[#1a2235] flex items-center px-3">
          <div className="flex gap-[2px]">
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={i}
                className="w-[3px] rounded bg-teal-500/70"
                style={{
                  height: `${12 + (i % 8) * 4}px`,
                }}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}