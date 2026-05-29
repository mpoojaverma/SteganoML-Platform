export default function ExtractedPayload() {
  return (
    <div className="rounded-[10px] border border-white/10 bg-[#111827] overflow-hidden">

      <div className="flex justify-between items-center px-4 py-4 border-b border-white/10">
        <h2 className="text-sm font-medium">
          Extracted payload
        </h2>

        <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-400">
          Verified
        </span>
      </div>

      <div className="p-4">

        <div className="rounded-lg border border-emerald-500/20 bg-[#052e1c] p-4">

          <p className="text-sm text-emerald-400 font-medium">
            Message decrypted successfully
          </p>

          <div className="mt-3 rounded bg-[#1a2235] p-3 text-sm">
            Confidential: Protocol Alpha — rendezvous at 0300 UTC.
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3">

            <div className="rounded bg-[#1a2235] p-3">
              <p className="text-xs text-slate-500">
                Payload Size
              </p>

              <p className="mt-1">
                248 bytes
              </p>
            </div>

            <div className="rounded bg-[#1a2235] p-3">
              <p className="text-xs text-slate-500">
                Processing
              </p>

              <p className="mt-1">
                16.8s
              </p>
            </div>

            <div className="rounded bg-[#1a2235] p-3">
              <p className="text-xs text-slate-500">
                Method Used
              </p>

              <p className="mt-1">
                ML-guided
              </p>
            </div>

            <div className="rounded bg-[#1a2235] p-3">
              <p className="text-xs text-slate-500">
                Positions Read
              </p>

              <p className="mt-1">
                184,320
              </p>
            </div>

          </div>

          <div className="mt-3 flex items-center justify-between rounded border border-emerald-500/20 bg-[#06351f] px-3 py-3">

            <p className="text-xs text-emerald-300">
              AES-256 tag verified · no tampering detected
            </p>

            <button className="rounded border border-emerald-500/20 px-3 py-1 text-xs text-emerald-400">
              Copy
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}