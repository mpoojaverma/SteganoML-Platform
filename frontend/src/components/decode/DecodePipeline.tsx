const steps = [
  "File validated",
  "ML frame analysis",
  "Bit extraction",
  "AES-256 decryption",
];

export default function DecodePipeline() {
  return (
    <div className="rounded-[10px] border border-white/10 bg-[#111827] overflow-hidden">

      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <h2 className="text-sm font-medium">
          Decode pipeline
        </h2>

        <span className="text-xs text-emerald-400">
          Complete
        </span>
      </div>

      {steps.map((step, index) => (
        <div
          key={step}
          className="flex items-center gap-3 px-4 py-3 border-b border-white/5"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
            ✓
          </div>

          <div className="flex-1">
            <p className="text-sm">
              {step}
            </p>
          </div>

          <div className="w-20 h-1 rounded bg-slate-700">
            <div className="w-full h-1 rounded bg-emerald-400" />
          </div>
        </div>
      ))}

    </div>
  );
}