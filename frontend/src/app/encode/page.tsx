"use client";

import { useState } from "react";
import useEncode from "@/hooks/useEncode";
import AppShell from "@/components/layout/AppShell";
import { getDownloadUrl } from "@/lib/api";
import Toast from "@/components/ui/Toast";

const waveform = [
  12, 18, 28, 42, 58, 74, 56, 38, 24, 18, 22, 34, 48, 66, 82, 62, 44, 26, 18,
  24, 40, 58, 76, 64, 48, 30, 20, 26, 44, 60, 78, 70, 52, 34, 22, 18, 30, 46,
  62, 80, 68, 50, 32, 20, 18, 26, 42, 58, 74, 64, 48, 30, 18, 24, 40, 58, 76,
  82, 60, 42, 26, 18, 22, 34, 52, 68, 80, 60, 40, 24, 18, 26, 44, 62, 78, 66,
  50, 32, 20, 18, 30, 46, 64, 82, 68, 52, 34, 22, 18, 26, 42, 58, 74, 64, 46,
  28, 18, 24, 40, 56, 72, 84, 68, 48, 30, 20, 18, 28, 42, 60, 76, 62, 46, 28,
  18, 24, 40, 58, 72, 56,
];

export default function EncodePage() {
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const [message, setMessage] = useState(
    "Confidential: Protocol Alpha — rendezvous at 0300 UTC.",
  );

  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const { runEncode, loading, error, result } = useEncode();
  return (
    <AppShell>
      <Toast show={showToast} message="✓ Encoding completed" />
      <div className="grid grid-cols-12 gap-6">
        {/* LEFT COLUMN */}

        <div className="col-span-8 space-y-6">
          {/* AUDIO SOURCE */}

          <div className="rounded-[20px] border border-white/10 bg-[#0b1327] overflow-hidden">
            <div className="px-6 py-5 border-b border-white/5">
              <input
                type="file"
                accept=".wav,.mp3,.flac,.m4a"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setAudioFile(e.target.files[0]);
                  }
                }}
                className="mb-4 w-full rounded-xl border border-white/10 bg-white/5 p-3"
              />
              <h2 className="font-semibold text-white">Audio source</h2>

              <p className="text-xs text-slate-500 mt-1">
                WAV, MP3, FLAC, M4A — max 50 MB
              </p>
            </div>

            <div className="p-4 space-y-3">
              <div className="rounded-xl bg-white/5 px-4 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-teal-500/20" />

                <div>
                  <p className="font-medium text-white">
                    {audioFile ? audioFile.name : "No file selected"}
                  </p>

                  <p className="text-xs text-slate-500">
                    44.1 kHz · Mono · 3.1 MB · 32.4s
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-white/5 px-4 py-4 border-t border-white/5">
                <div className="h-20 w-full flex items-center justify-between overflow-hidden">
                  {waveform.map((h, i) => (
                    <div
                      key={i}
                      className="w-[3px] rounded-full bg-[#18d5d0]"
                      style={{
                        height: `${h}px`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECRET PAYLOAD */}

          <div className="rounded-[20px] border border-white/10 bg-[#0b1327] overflow-hidden">
            <div className="px-6 py-5 border-b border-white/5">
              <h2 className="font-semibold">Secret payload</h2>

              <p className="text-xs text-slate-500 mt-1">
                AES-256 encrypted before embedding
              </p>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="text-xs text-slate-500">Secret message</label>

                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/5 bg-white/5 p-4 outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500">
                  Shared password (PBKDF2 key derivation)
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/5 bg-white/5 p-4 outline-none"
                />
              </div>

              <div className="rounded-xl bg-white/5 px-4 py-3 text-sm text-slate-400">
                Payload will be encrypted with AES-256 Fernet + random 16-byte
                salt before embedding.
              </div>
            </div>
          </div>

          {/* EMBEDDING METHOD */}

          <div className="rounded-[20px] border border-white/10 bg-[#0b1327] overflow-hidden">
            <div className="px-6 py-5 border-b border-white/5">
              <h2 className="font-semibold">Embedding method</h2>
            </div>

            <div className="p-4 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-teal-400 bg-teal-500/10 shadow-[0_0_25px_rgba(20,184,166,0.15)] p-4 relative">
                <div className="absolute right-4 top-4 w-4 h-4 rounded-full bg-teal-400" />

                <div className="w-7 h-7 rounded-md bg-indigo-500/40 mb-4" />

                <h3 className="font-semibold">ML-guided</h3>

                <p className="mt-2 text-sm text-slate-400">
                  CatBoost selects acoustically stable frames. Higher
                  imperceptibility and robustness.
                </p>

                <span className="inline-block mt-4 rounded-lg bg-purple-500/20 px-3 py-1.5 text-xs font-medium text-purple-300">
                  ROC AUC 0.9581
                </span>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <div className="w-7 h-7 rounded-md bg-teal-500/20 mb-4" />

                <h3 className="font-semibold">Randomized LSB</h3>

                <p className="mt-2 text-sm text-slate-400">
                  Password seeded random positions. Fast baseline method.
                </p>

                <span className="inline-block mt-4 rounded-md bg-teal-500/20 px-2 py-1 text-xs text-teal-300">
                  Baseline
                </span>
              </div>
            </div>
          </div>

          {localError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
              {localError}
            </div>
          )}
          <button
            onClick={async () => {
              if (!audioFile) {
                setLocalError("Please select an audio file before encoding.");
                return;
              }

              if (!message.trim()) {
                setLocalError("Secret message cannot be empty.");
                return;
              }

              if (!password.trim()) {
                setLocalError("Password is required.");
                return;
              }

              setLocalError("");

              const response = await runEncode(
                audioFile,
                message,
                password,
                "ml",
              );

              if (response?.status === "success") {
                setShowToast(true);

                setTimeout(() => {
                  setShowToast(false);
                }, 3000);
              }
            }}
            disabled={loading}
            className="w-full rounded-xl bg-[#1bd6d1] py-5 text-base font-semibold text-black transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Encoding..." : "Run ML-guided encode"}
          </button>
        </div>

        {/* RIGHT COLUMN */}

        <div className="col-span-4 space-y-5">
          {/* PIPELINE */}

          <div className="rounded-[20px] border border-white/10 bg-[#0b1327] overflow-hidden">
            <div className="px-6 py-5 flex justify-between border-b border-white/5">
              <h2 className="font-semibold">Pipeline</h2>

              <span className="text-emerald-400 text-sm">● Processing</span>
            </div>

            <div className="p-6 space-y-7">
              {[
                "Audio received & validated",
                "AES-256 encryption",
                "ML frame analysis",
                "Adaptive LSB embedding",
                "Quality metrics",
              ].map((step, i) => (
                <div key={step} className="flex gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                      i < 2
                        ? "bg-emerald-500/20 text-emerald-400"
                        : i === 2
                          ? "bg-purple-500/20 text-purple-300"
                          : "bg-white/5 text-slate-500"
                    }`}
                  >
                    {i + 1}
                  </div>

                  <div className="flex-1">
                    <p
                      className={`text-sm ${
                        i === 2 ? "text-purple-300" : "text-white"
                      }`}
                    >
                      {step}
                    </p>

                    <div className="mt-2 h-1.5 rounded bg-white/5">
                      <div
                        className={`h-1.5 rounded ${
                          i < 2
                            ? "w-full bg-emerald-400"
                            : i === 2
                              ? "w-1/2 bg-purple-400"
                              : "w-0"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* QUALITY REPORT */}

          <div className="rounded-[20px] border border-white/10 bg-[#0b1327] overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <div className="px-6 py-5 border-b border-white/5">
              <h2 className="font-semibold">Quality report</h2>

              <p className="text-xs text-slate-500 mt-1">
                Computed after embedding completes
              </p>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/5 p-5">
                  <p className="text-xs text-slate-500">PSNR</p>
                  <h3 className="text-[42px] leading-none font-bold mt-2">
                    95.89<span className="text-sm"> dB</span>
                  </h3>
                </div>

                <div className="rounded-xl bg-white/5 p-5">
                  <p className="text-xs text-slate-500">SNR</p>
                  <h3 className="text-[42px] leading-none font-bold mt-2">
                    76.59<span className="text-sm"> dB</span>
                  </h3>
                </div>

                <div className="rounded-xl bg-white/5 p-5">
                  <p className="text-xs text-slate-500">BER</p>
                  <h3 className="text-[42px] leading-none font-bold mt-2">
                    4.3e-7
                  </h3>
                </div>

                <div className="rounded-xl bg-white/5 p-5">
                  <p className="text-xs text-slate-500">NC</p>
                  <h3 className="text-[42px] leading-none font-bold mt-2">
                    1.000
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="text-slate-500">Robust positions</p>
                  <p className="mt-1 font-medium">184,320 bytes</p>
                </div>

                <div className="rounded-xl bg-white/5 p-3">
                  <p className="text-slate-500">Payload size</p>
                  <p className="mt-1 font-medium">248 bytes</p>
                </div>

                <div className="rounded-xl bg-white/5 p-3">
                  <p className="text-slate-500">Processing</p>
                  <p className="mt-1 font-medium">14.2s</p>
                </div>
              </div>

              {error && (
                <div className="mb-4 rounded-xl bg-red-500/10 p-4 text-red-400">
                  {error}
                </div>
              )}

              {result && (
                <div className="mb-4 rounded-xl bg-emerald-500/10 p-4 text-emerald-400">
                  <p>Status: {result.status}</p>

                  <p>Output: {result.output_file}</p>

                  {result.details && (
                    <p>Bits Embedded: {result.details.bits_embedded}</p>
                  )}
                </div>
              )}

              {result?.output_file && (
                <a
                  href={getDownloadUrl(result.output_file)}
                  target="_blank"
                  rel="noreferrer"
                  className="
      block
      w-full
      mt-5
      rounded-xl
      border
      border-teal-400
      bg-teal-500/10
      py-3
      text-center
      text-teal-300
      hover:bg-teal-500/20
      transition
    "
                >
                  Download stego audio
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
