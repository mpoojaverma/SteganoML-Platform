export default function AuthenticationCard() {
  return (
    <div className="rounded-[10px] border border-white/10 bg-[#111827] overflow-hidden">

      <div className="px-4 py-4 border-b border-white/10">
        <h2 className="text-sm font-medium">
          Authentication
        </h2>

        <p className="text-xs text-slate-500 mt-1">
          Password must match the one used during encoding
        </p>
      </div>

      <div className="p-4">

        <label className="text-xs text-slate-500">
          Shared password
        </label>

        <input
          type="password"
          defaultValue="••••••••••••"
          className="mt-2 w-full rounded-lg border border-white/10 bg-[#1a2235] px-3 py-2 outline-none"
        />

        <div className="mt-3 rounded-lg bg-[#1a2235] px-3 py-3 text-xs text-slate-400">
          PBKDF2 key re-derived · wrong password returns decryption failure
        </div>

      </div>

    </div>
  );
}