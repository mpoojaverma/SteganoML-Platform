"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import useDecode from "@/hooks/useDecode";
import Toast from "@/components/ui/Toast";

export default function DecodePage() {
  const [audioFile, setAudioFile] = useState<File | { name: string; fake: boolean } | null>(null);
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [localResult, setLocalResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [decodeStep, setDecodeStep] = useState(-1);

  const { runDecode, loading, error, result } = useDecode();

  useEffect(() => {
    const savedAudio = sessionStorage.getItem("steganoml_decode_audio");
    if (savedAudio) {
      try {
        setAudioFile(JSON.parse(savedAudio));
      } catch (e) {}
    }

    const savedPassword = sessionStorage.getItem("steganoml_decode_password");
    if (savedPassword !== null) {
      setPassword(savedPassword);
    }

    const savedResult = sessionStorage.getItem("steganoml_decode_result");
    if (savedResult) {
      try {
        setLocalResult(JSON.parse(savedResult));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (loading) {
      setDecodeStep(0);
      const interval = setInterval(() => {
        setDecodeStep((prev) => {
          if (prev < 4) return prev + 1;
          return prev;
        });
      }, 1200);
      return () => clearInterval(interval);
    } else {
      if (localResult) {
        setDecodeStep(5);
      } else {
        setDecodeStep(-1);
      }
    }
  }, [loading, localResult]);

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    sessionStorage.setItem("steganoml_decode_password", val);
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      const meta = { name: file.name, fake: false };
      setAudioFile(file);
      sessionStorage.setItem("steganoml_decode_audio", JSON.stringify(meta));
    } else {
      setAudioFile(null);
      sessionStorage.removeItem("steganoml_decode_audio");
    }
  };

  return (
    <AppShell>
      <Toast show={showToast} message="✓ Decode successful" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold">Decode studio</h1>

            <p className="mt-3 text-slate-400">
              Extract hidden payload from stego audio
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* LEFT COLUMN */}

          <div className="lg:col-span-8 space-y-6">
            {/* AUDIO FILE */}

            <div className="rounded-3xl border border-white/10 bg-[#0b1327] overflow-hidden">
              <div className="border-b border-white/10 px-8 py-6">
                <label htmlFor="decode-audio" className="sr-only">Upload stego audio file</label>
                <input
                  id="decode-audio"
                  type="file"
                  accept=".wav"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                  className="mb-5 w-full rounded-xl border border-white/10 bg-white/5 p-3"
                />

                <h2 className="text-3xl font-semibold">Stego audio file</h2>

                <p className="mt-2 text-slate-500">Upload encoded WAV</p>
              </div>

              <div className="p-6 space-y-4">
                <div className="rounded-2xl bg-white/5 p-6">
                  <p className="font-semibold">
                    {audioFile ? audioFile.name : "No file selected"}
                  </p>
                </div>

                {audioFile && 'fake' in audioFile && (
                  <div className="rounded-xl bg-orange-500/10 border border-orange-500/20 px-4 py-3 text-xs text-orange-400">
                    Previous file: <strong className="font-semibold">{audioFile.name}</strong>. Please re-upload the file before running decode extraction.
                  </div>
                )}
              </div>
            </div>

            {/* PASSWORD */}

            <div className="rounded-3xl border border-white/10 bg-[#0b1327] overflow-hidden">
              <div className="border-b border-white/10 px-8 py-6">
                <h2 className="text-3xl font-semibold">Authentication</h2>
              </div>

              <div className="p-6">
                <label htmlFor="decode-password" className="sr-only">Password</label>
                <input
                  id="decode-password"
                  type="password"
                  autoComplete="off"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Password"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none"
                />
              </div>
            </div>

            {/* LOCAL VALIDATION ERRORS */}

            {localError && (
              <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
                {localError}
              </div>
            )}

            {/* DECODE BUTTON */}

            <button
              disabled={loading}
              onClick={async () => {
                if (!audioFile) {
                  setLocalError("Please select a stego audio file.");
                  return;
                }

                if ('fake' in audioFile) {
                  setLocalError("Please re-upload the stego audio file to run decode again.");
                  return;
                }

                if (!password.trim()) {
                  setLocalError("Password is required.");
                  return;
                }

                setLocalError("");

                const response = await runDecode(audioFile as File, password, "ml");

                if (response?.status === "success") {
                  setLocalResult(response);
                  sessionStorage.setItem("steganoml_decode_result", JSON.stringify(response));
                  sessionStorage.setItem("steganoml_decode_audio", JSON.stringify({
                    name: audioFile.name,
                    fake: true
                  }));
                  setShowToast(true);

                  setTimeout(() => {
                    setShowToast(false);
                  }, 3000);
                }
              }}
              className="h-16 w-full rounded-2xl bg-cyan-400 text-lg font-semibold text-black disabled:opacity-50 flex items-center justify-center gap-2 transition hover:brightness-110"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Decoding...</span>
                </>
              ) : (
                "Run decode extraction"
              )}
            </button>
          </div>

          {/* RIGHT COLUMN */}

          <div className="lg:col-span-4 space-y-6">
            {/* PIPELINE */}
            <div className="rounded-3xl border border-white/10 bg-[#0b1327] overflow-hidden">
              <div className="border-b border-white/10 px-6 py-5 flex justify-between">
                <h2 className="font-semibold text-white">Pipeline</h2>
                {loading && <span className="text-cyan-400 text-sm animate-pulse">● Extracting</span>}
              </div>
              <div className="p-6 space-y-5">
                {[
                  "Loading Audio",
                  "Extracting Bitstream",
                  "Reconstructing Payload",
                  "Decrypting Message",
                  "Validating Integrity",
                ].map((step, i) => {
                  const isActive = i === decodeStep;
                  const isCompleted = i < decodeStep;
                  return (
                    <div key={step} className="flex gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors duration-300 ${
                          isCompleted
                            ? "bg-emerald-500/20 text-emerald-400 font-bold"
                            : isActive
                              ? "bg-purple-500/20 text-purple-300 animate-pulse font-bold"
                              : "bg-white/5 text-slate-500"
                        }`}
                      >
                        {isCompleted ? "✓" : i + 1}
                      </div>

                      <div className="flex-1">
                        <p
                          className={`text-sm transition-colors duration-300 ${
                            isActive ? "text-purple-300 font-medium" : isCompleted ? "text-slate-300" : "text-slate-500"
                          }`}
                        >
                          {step}
                        </p>

                        <div className="mt-2 h-1.5 rounded bg-white/5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded transition-all duration-500 ${
                              isCompleted
                                ? "w-full bg-emerald-400"
                                : isActive
                                  ? "w-1/2 bg-purple-400 animate-pulse"
                                  : "w-0"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-6">
              <h2 className="mb-5 text-xl font-semibold">Extracted payload</h2>

              {/* BACKEND ERRORS */}

              {error && (
                <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
                  {error}
                </div>
              )}

              {/* SUCCESS */}

              {localResult && (
                <div className="space-y-4">
                  <div className="rounded-xl bg-emerald-500/10 p-4 text-emerald-400">
                    Decode successful
                  </div>

                  <div className="rounded-xl bg-white/5 p-4 relative">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-slate-400">Secret Message</p>
                      
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(localResult?.message || "");
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="rounded-lg bg-white/10 px-3 py-1 text-xs text-slate-300 transition hover:bg-white/20 hover:text-white"
                      >
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>

                    <p className="mt-2 text-lg break-words pr-2">{localResult.message}</p>
                  </div>

                  <div className="rounded-xl bg-white/5 p-4">
                    <p>Status: {localResult.status}</p>
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
