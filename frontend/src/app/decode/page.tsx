"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import useDecode from "@/hooks/useDecode";
import Toast from "@/components/ui/Toast";
import { UploadCloud, FileAudio, CheckCircle2 } from "lucide-react";

export default function DecodePage() {
  const [audioFile, setAudioFile] = useState<File | { name: string; size?: number; fake: boolean } | null>(null);
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

  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      const meta = { name: file.name, size: file.size, fake: false };
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

          <div className="rounded-[20px] border border-white/10 bg-[#0b1327] p-6 space-y-6">
            <div>
              <h2 className="font-semibold text-white">Stego audio file</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                WAV formats only — max 50 MB
              </p>
            </div>

            {/* HIDDEN INPUT */}
            <input
              id="decode-audio"
              type="file"
              accept=".wav"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
              className="sr-only"
            />

            {/* UNIFIED SINGLE UPLOAD CARD */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 transition-all duration-200 text-center ${
                isDragOver
                  ? "border-teal-400 bg-teal-500/10 shadow-[0_0_20px_rgba(20,184,166,0.15)] scale-[1.01]"
                  : audioFile
                    ? audioFile && 'fake' in audioFile
                      ? "border-orange-500/30 bg-orange-500/5 hover:border-orange-500/50 hover:bg-orange-500/10"
                      : "border-teal-500/30 bg-teal-500/5 hover:border-teal-500/50 hover:bg-teal-500/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
              } focus-within:ring-2 focus-within:ring-cyan-400 focus-within:ring-offset-2 focus-within:ring-offset-[#0b1327]`}
            >
              <label htmlFor="decode-audio" className="absolute inset-0 cursor-pointer z-0" />

              <div className="relative z-10 flex flex-col items-center">
                {/* Upload Icon */}
                <div
                  className={`p-4 rounded-full mb-4 transition-all duration-300 ${
                    isDragOver
                      ? "bg-teal-500/20 text-teal-400 scale-110 animate-pulse"
                      : audioFile
                        ? audioFile && 'fake' in audioFile
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-teal-500/20 text-teal-400"
                        : "bg-white/5 text-slate-500"
                  }`}
                >
                  {audioFile ? <FileAudio size={32} /> : <UploadCloud size={32} />}
                </div>

                {/* Selected filename / Drag message */}
                <p className="text-sm font-semibold text-white max-w-[280px] truncate">
                  {isDragOver
                    ? "Drop stego WAV to upload"
                    : audioFile
                      ? audioFile.name
                      : "Drag & drop stego WAV here or click to browse"}
                </p>

                {/* Subtext info */}
                {audioFile ? (
                  <div className="mt-2 flex flex-col items-center gap-1">
                    <p className="text-xs text-slate-400">
                      {audioFile.size ? `${(audioFile.size / (1024 * 1024)).toFixed(1)} MB` : "Size unknown"} · 44.1 kHz · Mono
                    </p>
                    {audioFile && 'fake' in audioFile ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 mt-1">
                        ⚠️ Needs re-upload (session restored)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20 mt-1">
                        ✓ Success: Ready to extract
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 mt-2">
                    Supports WAV files up to 50MB
                  </p>
                )}

                {/* Action buttons inside the card */}
                {audioFile && (
                  <div className="mt-5 flex items-center gap-3 relative z-20">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleFileChange(null);
                      }}
                      className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition focus-visible:ring-2 focus-visible:ring-red-400 outline-none min-h-[36px]"
                    >
                      Remove
                    </button>
                    <label
                      htmlFor="decode-audio"
                      className="rounded-lg bg-[#1bd6d1] px-3 py-1.5 text-xs font-semibold text-black hover:brightness-110 transition cursor-pointer flex items-center justify-center min-h-[36px] focus-visible:ring-2 focus-visible:ring-cyan-400 outline-none"
                    >
                      Change File
                    </label>
                  </div>
                )}
              </div>
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
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none focus:border-cyan-500/50 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1327] transition-all"
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
                    size: 'size' in audioFile ? audioFile.size : undefined,
                    fake: true
                  }));
                  setShowToast(true);

                  setTimeout(() => {
                    setShowToast(false);
                  }, 3000);
                }
              }}
              className="h-16 w-full rounded-2xl bg-cyan-400 text-lg font-semibold text-black disabled:opacity-50 flex items-center justify-center gap-2 transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#040816] outline-none cursor-pointer"
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
