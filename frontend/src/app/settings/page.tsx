import AppShell from "@/components/layout/AppShell";
import CustomSelect from "@/components/ui/CustomSelect";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="space-y-8">

        <div>
          <h1 className="text-5xl font-bold">
            Settings
          </h1>

          <p className="mt-2 text-slate-400">
            Configure platform preferences and pipeline defaults.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">

          <div className="col-span-6 rounded-3xl border border-white/10 bg-[#0b1327] overflow-visible">

            <div className="border-b border-white/10 px-6 py-5">
              <h2 className="font-semibold">
                Platform
              </h2>
            </div>

            <div className="space-y-5 p-6">

              <div>
                <label className="mb-2 block text-xs text-slate-500">
                  Environment
                </label>

                <CustomSelect
                  value="Research"
                  options={[
                    "Research",
                    "Production",
                    "Testing",
                  ]}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-slate-500">
                  Default Audio Format
                </label>

                <CustomSelect
                  value="WAV"
                  options={[
                    "WAV",
                    "FLAC",
                    "MP3",
                  ]}
                />
              </div>

            </div>
          </div>

          <div className="col-span-6 rounded-3xl border border-white/10 bg-[#0b1327] overflow-visible">

            <div className="border-b border-white/10 px-6 py-5">
              <h2 className="font-semibold">
                Security
              </h2>
            </div>

            <div className="space-y-5 p-6">

              <div>
                <label className="mb-2 block text-xs text-slate-500">
                  Encryption
                </label>

                <CustomSelect
                  value="AES-256 Fernet"
                  options={[
                    "AES-256 Fernet",
                    "ChaCha20",
                  ]}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-slate-500">
                  Key Derivation
                </label>

                <CustomSelect
                  value="PBKDF2"
                  options={[
                    "PBKDF2",
                    "Argon2",
                    "Scrypt",
                  ]}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-slate-500">
                  Iterations
                </label>

                <input
                  defaultValue="100000"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-[#182238]
                    px-4
                    py-3
                    text-white
                    outline-none
                  "
                />
              </div>

            </div>
          </div>

        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0b1327] overflow-hidden">

          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="font-semibold">
              ML Configuration
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-5 p-6">

            <div className="rounded-2xl bg-[#182238] p-5">
              <p className="mb-2 text-xs text-slate-500">
                Model
              </p>

              <h3 className="font-semibold">
                CatBoost
              </h3>
            </div>

            <div className="rounded-2xl bg-[#182238] p-5">
              <p className="mb-2 text-xs text-slate-500">
                ROC-AUC
              </p>

              <h3 className="font-semibold text-cyan-400">
                0.9581
              </h3>
            </div>

            <div className="rounded-2xl bg-[#182238] p-5">
              <p className="mb-2 text-xs text-slate-500">
                Status
              </p>

              <h3 className="font-semibold text-emerald-400">
                Active
              </h3>
            </div>

          </div>
        </div>

        <button
          className="
            w-full
            rounded-2xl
            bg-cyan-500
            py-4
            text-black
            font-semibold
            transition
            hover:bg-cyan-400
          "
        >
          Save Configuration
        </button>

      </div>
    </AppShell>
  );
}