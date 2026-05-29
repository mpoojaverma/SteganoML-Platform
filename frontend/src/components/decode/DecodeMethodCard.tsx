export default function DecodeMethodCard() {
  return (
    <div className="rounded-[10px] border border-white/10 bg-[#111827] overflow-hidden">

      <div className="px-4 py-4 border-b border-white/10">
        <h2 className="text-sm font-medium">
          Decode method
        </h2>

        <p className="text-xs text-slate-500 mt-1">
          Must match the method used during encoding
        </p>
      </div>

      <div className="p-4 grid grid-cols-2 gap-2">

        <div className="rounded-lg border border-teal-600 bg-[#0f4c47] p-4">
          <h3 className="text-sm font-medium text-teal-300">
            ML-guided
          </h3>

          <p className="mt-2 text-xs text-slate-300">
            Re-runs CatBoost to regenerate exact robust position map
          </p>

          <span className="inline-block mt-3 rounded bg-purple-500/20 px-2 py-1 text-xs text-purple-300">
            Recommended
          </span>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#1a2235] p-4">
          <h3 className="text-sm font-medium">
            Randomized LSB
          </h3>

          <p className="mt-2 text-xs text-slate-400">
            Uses password seed — no ML inference needed
          </p>

          <span className="inline-block mt-3 rounded bg-teal-500/20 px-2 py-1 text-xs text-teal-300">
            Fast
          </span>
        </div>

      </div>

    </div>
  );
}