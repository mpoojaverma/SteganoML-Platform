export default function EmbeddingMethodCard() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#111827] overflow-hidden">

      <div className="border-b border-white/10 px-5 py-4">
        <h3 className="text-sm font-medium">
          Embedding method
        </h3>
      </div>

      <div className="p-5">

        <div className="grid grid-cols-2 gap-3">

          <div className="rounded-lg border border-teal-500 bg-teal-950/40 p-4">
            <h4 className="font-medium">
              ML-guided
            </h4>

            <p className="mt-2 text-xs text-slate-400">
              CatBoost selects acoustically stable frames.
            </p>

            <span className="mt-3 inline-block rounded bg-purple-500/20 px-2 py-1 text-xs text-purple-300">
              ROC-AUC 0.9581
            </span>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#1a2235] p-4">
            <h4 className="font-medium">
              Randomized LSB
            </h4>

            <p className="mt-2 text-xs text-slate-400">
              Password seeded random positions.
            </p>

            <span className="mt-3 inline-block rounded bg-teal-500/20 px-2 py-1 text-xs text-teal-300">
              Baseline
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}