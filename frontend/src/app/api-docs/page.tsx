import AppShell from "@/components/layout/AppShell";

export default function ApiDocsPage() {
  return (
    <AppShell>
      <div className="space-y-8">

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-5xl font-bold">
              API Docs
            </h1>

            <p className="mt-2 text-slate-400">
              Programmatic access to SteganoML encoding,
              decoding and analytics services.
            </p>
          </div>

          <span className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm text-emerald-400">
            API Online
          </span>
        </div>

        <div className="grid grid-cols-3 gap-5">

          <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-6">
            <p className="text-xs uppercase text-slate-500">
              Base URL
            </p>

            <h2 className="mt-3 font-mono text-lg text-cyan-400">
              https://api.steganoml.ai/v1
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-6">
            <p className="text-xs uppercase text-slate-500">
              Authentication
            </p>

            <h2 className="mt-3 font-semibold">
              Bearer Token
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-6">
            <p className="text-xs uppercase text-slate-500">
              Version
            </p>

            <h2 className="mt-3 font-semibold text-emerald-400">
              v1.0.0
            </h2>
          </div>

        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0b1327] overflow-hidden">

          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-xl font-semibold">
              POST /encode
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Create a steganographic embedding job.
            </p>
          </div>

          <div className="p-6 space-y-4">

            <div>
              <p className="mb-2 text-sm text-slate-400">
                Request
              </p>

              <pre className="overflow-x-auto rounded-2xl bg-[#182238] p-5 text-sm text-cyan-300">
{`{
  "message": "Confidential payload",
  "password": "secret",
  "method": "ml-guided"
}`}
              </pre>
            </div>

            <div>
              <p className="mb-2 text-sm text-slate-400">
                Response
              </p>

              <pre className="overflow-x-auto rounded-2xl bg-[#182238] p-5 text-sm text-emerald-300">
{`{
  "jobId": "job_d12f7c44",
  "status": "processing",
  "method": "ml-guided"
}`}
              </pre>
            </div>

          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0b1327] overflow-hidden">

          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-xl font-semibold">
              POST /decode
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Extract hidden payload from stego audio.
            </p>
          </div>

          <div className="p-6 space-y-4">

            <div>
              <p className="mb-2 text-sm text-slate-400">
                Request
              </p>

              <pre className="overflow-x-auto rounded-2xl bg-[#182238] p-5 text-sm text-cyan-300">
{`{
  "password": "secret",
  "method": "ml-guided"
}`}
              </pre>
            </div>

            <div>
              <p className="mb-2 text-sm text-slate-400">
                Response
              </p>

              <pre className="overflow-x-auto rounded-2xl bg-[#182238] p-5 text-sm text-emerald-300">
{`{
  "payload": "Confidential payload",
  "verified": true
}`}
              </pre>
            </div>

          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0b1327] overflow-hidden">

          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-xl font-semibold">
              GET /analytics
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Retrieve aggregate quality metrics.
            </p>
          </div>

          <div className="p-6">
            <pre className="overflow-x-auto rounded-2xl bg-[#182238] p-5 text-sm text-emerald-300">
{`{
  "avgPSNR": 94.69,
  "avgSNR": 72.03,
  "ber": 0.000001,
  "nc": 1.0
}`}
            </pre>
          </div>

        </div>

      </div>
    </AppShell>
  );
}