"use client";

import AppShell from "@/components/layout/AppShell";

const endpoints = [
  {
    method: "GET",
    route: "/api/health/",
    description:
      "Check API availability and backend health.",
  },
  {
    method: "POST",
    route: "/api/encode/",
    description:
      "Encode a secret message into an audio file.",
  },
  {
    method: "POST",
    route: "/api/decode/",
    description:
      "Extract a hidden message from encoded audio.",
  },
  {
    method: "GET",
    route: "/api/jobs/",
    description:
      "Retrieve authenticated user's job history.",
  },
  {
    method: "GET",
    route: "/api/stats/",
    description:
      "Retrieve user statistics and metrics.",
  },
];

export default function ApiDocsPage() {
  return (
    <AppShell>
      <div className="space-y-6">

        <div>
          <h1 className="text-5xl font-bold">
            API Documentation
          </h1>

          <p className="mt-2 text-slate-400">
            Internal API endpoints used by
            the SteganoML platform.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0b1327] overflow-hidden">

          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-xl font-semibold">
              Available Endpoints
            </h2>
          </div>

          <div className="divide-y divide-white/10">

            {endpoints.map(
              (endpoint) => (
                <div
                  key={endpoint.route}
                  className="flex flex-col gap-3 p-6 lg:flex-row lg:items-center lg:justify-between"
                >

                  <div>

                    <div className="flex items-center gap-3">

                      <span
                        className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                          endpoint.method ===
                          "GET"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-cyan-500/20 text-cyan-400"
                        }`}
                      >
                        {endpoint.method}
                      </span>

                      <code className="text-slate-200">
                        {
                          endpoint.route
                        }
                      </code>

                    </div>

                    <p className="mt-2 text-sm text-slate-400">
                      {
                        endpoint.description
                      }
                    </p>

                  </div>

                </div>
              )
            )}

          </div>

        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-6">

          <h2 className="mb-4 text-xl font-semibold">
            Encode Request
          </h2>

          <pre className="overflow-x-auto rounded-xl bg-[#07111f] p-4 text-sm text-cyan-300">
{`POST /api/encode/

FormData:
audio_file
secret_message
password
user_email
method`}
          </pre>

        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-6">

          <h2 className="mb-4 text-xl font-semibold">
            Decode Request
          </h2>

          <pre className="overflow-x-auto rounded-xl bg-[#07111f] p-4 text-sm text-cyan-300">
{`POST /api/decode/

FormData:
audio_file
password
user_email
method`}
          </pre>

        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-6">

          <h2 className="mb-4 text-xl font-semibold">
            Technology Stack
          </h2>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

            <TechCard
              title="Frontend"
              value="Next.js 16"
            />

            <TechCard
              title="Backend"
              value="FastAPI"
            />

            <TechCard
              title="Database"
              value="Supabase"
            />

            <TechCard
              title="ML Engine"
              value="CatBoost"
            />

          </div>

        </div>

      </div>
    </AppShell>
  );
}

function TechCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">

      <p className="text-xs uppercase text-slate-500">
        {title}
      </p>

      <h3 className="mt-2 text-lg font-semibold">
        {value}
      </h3>

    </div>
  );
}