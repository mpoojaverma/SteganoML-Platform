export default function PipelineCard() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#111827] overflow-hidden">

      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <h3 className="text-sm font-medium">
          Pipeline
        </h3>

        <span className="text-xs text-emerald-400">
          ● Processing
        </span>
      </div>

      <div>

        <div className="border-b border-white/10 p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm">
                Audio received & validated
              </p>

              <p className="text-xs text-slate-500 mt-1">
                voice_sample_16.wav · 44.1 kHz
              </p>
            </div>

            <div className="w-24 h-1 bg-slate-700 rounded overflow-hidden mt-3">
              <div className="h-full w-full bg-emerald-400" />
            </div>
          </div>
        </div>

        <div className="border-b border-white/10 p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm">
                AES-256 encryption
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Fernet + PBKDF2
              </p>
            </div>

            <div className="w-24 h-1 bg-slate-700 rounded overflow-hidden mt-3">
              <div className="h-full w-full bg-emerald-400" />
            </div>
          </div>
        </div>

        <div className="border-b border-white/10 p-4">
          <p className="text-purple-400 text-sm">
            ML frame analysis
          </p>

          <p className="text-xs text-purple-300 mt-1">
            CatBoost classifying acoustic stability
          </p>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-2 bg-slate-800 rounded overflow-hidden">
              <div className="h-full w-[53%] bg-purple-500" />
            </div>

            <span className="text-xs text-purple-300">
              342 / 650
            </span>
          </div>
        </div>

        <div className="border-b border-white/10 p-4">
          <p className="text-slate-500 text-sm">
            Adaptive LSB embedding
          </p>

          <p className="text-xs text-slate-600">
            Waiting for robust position map
          </p>
        </div>

        <div className="p-4">
          <p className="text-slate-500 text-sm">
            Quality metrics
          </p>

          <p className="text-xs text-slate-600">
            PSNR · SNR · BER · NC
          </p>
        </div>

      </div>
    </div>
  );
}