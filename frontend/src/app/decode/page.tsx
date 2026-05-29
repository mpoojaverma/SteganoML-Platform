"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import useDecode from "@/hooks/useDecode";

export default function DecodePage() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const {
    runDecode,
    loading,
    error,
    result,
  } = useDecode();

  return (
    <AppShell>
      <div className="space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold">
              Decode studio
            </h1>

            <p className="mt-3 text-slate-400">
              Extract hidden payload from stego audio
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">

          {/* LEFT COLUMN */}

          <div className="col-span-8 space-y-6">

            {/* AUDIO FILE */}

            <div className="rounded-3xl border border-white/10 bg-[#0b1327] overflow-hidden">

              <div className="border-b border-white/10 px-8 py-6">

                <input
                  type="file"
                  accept=".wav"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setAudioFile(
                        e.target.files[0]
                      );
                    }
                  }}
                  className="mb-5 w-full rounded-xl border border-white/10 bg-white/5 p-3"
                />

                <h2 className="text-3xl font-semibold">
                  Stego audio file
                </h2>

                <p className="mt-2 text-slate-500">
                  Upload encoded WAV
                </p>

              </div>

              <div className="p-6">

                <div className="rounded-2xl bg-white/5 p-6">

                  <p className="font-semibold">
                    {audioFile
                      ? audioFile.name
                      : "No file selected"}
                  </p>

                </div>

              </div>

            </div>

            {/* PASSWORD */}

            <div className="rounded-3xl border border-white/10 bg-[#0b1327] overflow-hidden">

              <div className="border-b border-white/10 px-8 py-6">

                <h2 className="text-3xl font-semibold">
                  Authentication
                </h2>

              </div>

              <div className="p-6">

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  placeholder="Password"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none"
                />

              </div>

            </div>

            {/* LOCAL VALIDATION ERRORS */}

            {localError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
                {localError}
              </div>
            )}

            {/* DECODE BUTTON */}

            <button
              disabled={loading}
              onClick={async () => {

                if (!audioFile) {
                  setLocalError(
                    "Please select a stego audio file."
                  );
                  return;
                }

                if (!password.trim()) {
                  setLocalError(
                    "Password is required."
                  );
                  return;
                }

                setLocalError("");

                await runDecode(
                  audioFile,
                  password,
                  "ml"
                );

              }}
              className="h-16 w-full rounded-2xl bg-cyan-400 text-lg font-semibold text-black disabled:opacity-50"
            >
              {loading
                ? "Decoding..."
                : "Run decode extraction"}
            </button>

          </div>

          {/* RIGHT COLUMN */}

          <div className="col-span-4">

            <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-6">

              <h2 className="mb-5 text-xl font-semibold">
                Extracted payload
              </h2>

              {/* BACKEND ERRORS */}

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
                  {error}
                </div>
              )}

              {/* SUCCESS */}

              {result && (

                <div className="space-y-4">

                  <div className="rounded-xl bg-emerald-500/10 p-4 text-emerald-400">
                    Decode successful
                  </div>

                  <div className="rounded-xl bg-white/5 p-4">

                    <p className="text-sm text-slate-400">
                      Secret Message
                    </p>

                    <p className="mt-2 text-lg break-words">
                      {result.message}
                    </p>

                  </div>

                  <div className="rounded-xl bg-white/5 p-4">

                    <p>
                      Status:
                      {" "}
                      {result.status}
                    </p>

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>

      </div>
    </AppShell>
  );
}