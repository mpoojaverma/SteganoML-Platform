export default function SecretPayloadCard() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#111827] overflow-hidden">

      <div className="border-b border-white/10 px-5 py-4">
        <h3 className="text-sm font-medium">
          Secret payload
        </h3>

        <p className="text-xs text-slate-500 mt-1">
          AES-256 encrypted before embedding
        </p>
      </div>

      <div className="p-5 space-y-4">

        <div>
          <label className="text-xs text-slate-400">
            Secret message
          </label>

          <textarea
            className="mt-2 w-full rounded-lg border border-white/10 bg-[#1a2235] p-4 outline-none"
            rows={4}
            defaultValue="Confidential: Protocol Alpha — rendezvous at 0300 UTC."
          />
        </div>

        <div>
          <label className="text-xs text-slate-400">
            Shared password
          </label>

          <input
            type="password"
            defaultValue="password123"
            className="mt-2 w-full rounded-lg border border-white/10 bg-[#1a2235] p-4 outline-none"
          />
        </div>

        <div className="rounded-lg bg-[#1a2235] p-4 text-xs text-slate-400">
          Payload will be encrypted with AES-256 Fernet + random 16-byte salt before embedding
        </div>

      </div>
    </div>
  );
}