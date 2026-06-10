"use client";

import { useState, useEffect } from "react";
import useEncode from "@/hooks/useEncode";
import AppShell from "@/components/layout/AppShell";
import { getDownloadUrl } from "@/lib/api";
import Toast from "@/components/ui/Toast";
import { UploadCloud, FileAudio, CheckCircle2, Eye, EyeOff } from "lucide-react";

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
  const [audioFile, setAudioFile] = useState<File | { name: string; size?: number; fake: boolean } | null>(null);

  const [message, setMessage] = useState(
    "Confidential: Protocol Alpha — rendezvous at 0300 UTC.",
  );

  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [localResult, setLocalResult] = useState<any>(null);
  const [activeWaveform, setActiveWaveform] = useState<number[]>(waveform);
  const [progressStep, setProgressStep] = useState(-1);
  const [showPassword, setShowPassword] = useState(false);

  const { runEncode, loading, error, result } = useEncode();

  useEffect(() => {
    const savedAudio = sessionStorage.getItem("steganoml_encode_audio");
    if (savedAudio) {
      try {
        setAudioFile(JSON.parse(savedAudio));
      } catch (e) {}
    }

    const savedMessage = sessionStorage.getItem("steganoml_encode_message");
    if (savedMessage !== null) {
      setMessage(savedMessage);
    }

    const savedPassword = sessionStorage.getItem("steganoml_encode_password");
    if (savedPassword !== null) {
      setPassword(savedPassword);
    }

    const savedResult = sessionStorage.getItem("steganoml_encode_result");
    if (savedResult) {
      try {
        setLocalResult(JSON.parse(savedResult));
      } catch (e) {}
    }

    const savedWaveform = sessionStorage.getItem("steganoml_encode_waveform");
    if (savedWaveform) {
      try {
        setActiveWaveform(JSON.parse(savedWaveform));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (loading) {
      setProgressStep(0);
      const interval = setInterval(() => {
        setProgressStep((prev) => {
          if (prev < 5) return prev + 1;
          return prev;
        });
      }, 1500);
      return () => clearInterval(interval);
    } else {
      if (localResult) {
        setProgressStep(6);
      } else {
        setProgressStep(-1);
      }
    }
  }, [loading, localResult]);

  const handleMessageChange = (val: string) => {
    setMessage(val);
    sessionStorage.setItem("steganoml_encode_message", val);
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    sessionStorage.setItem("steganoml_encode_password", val);
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
      sessionStorage.setItem("steganoml_encode_audio", JSON.stringify(meta));
      
      const newWave = Array.from({ length: 110 }, () => Math.floor(Math.random() * 70) + 12);
      setActiveWaveform(newWave);
      sessionStorage.setItem("steganoml_encode_waveform", JSON.stringify(newWave));
    } else {
      setAudioFile(null);
      sessionStorage.removeItem("steganoml_encode_audio");
      setActiveWaveform(waveform);
      sessionStorage.removeItem("steganoml_encode_waveform");
    }
  };
  return (
    <AppShell>
      <Toast show={showToast} message="✓ Encoding completed" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN */}

        <div className="lg:col-span-8 space-y-6">
          {/* AUDIO SOURCE */}

          <div className="rounded-[20px] border border-white/10 bg-[#0b1327] p-6 space-y-6">
            <div>
              <h2 className="font-semibold text-white">Audio source</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                WAV, MP3, FLAC, M4A — max 50 MB
              </p>
            </div>

            {/* HIDDEN INPUT */}
            <input
              id="encode-audio"
              type="file"
              accept=".wav,.mp3,.flac,.m4a"
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
              <label htmlFor="encode-audio" className="absolute inset-0 cursor-pointer z-0" />

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
                    ? "Drop file to upload"
                    : audioFile
                      ? audioFile.name
                      : "Drag & drop audio here or click to browse"}
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
                        ✓ Success: Ready to encode
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 mt-2">
                    Supports WAV, MP3, FLAC, M4A up to 50MB
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
                      htmlFor="encode-audio"
                      className="rounded-lg bg-[#1bd6d1] px-3 py-1.5 text-xs font-semibold text-black hover:brightness-110 transition cursor-pointer flex items-center justify-center min-h-[36px] focus-visible:ring-2 focus-visible:ring-cyan-400 outline-none"
                    >
                      Change File
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* WAVEFORM */}
            <div className="rounded-xl bg-white/5 px-4 py-4 border border-white/5">
              <div className="h-20 w-full flex items-center justify-between overflow-hidden">
                {activeWaveform.map((h, i) => (
                  <div
                    key={i}
                    className="w-[3px] rounded-full bg-[#18d5d0] shrink-0"
                    style={{
                      height: `${h}px`,
                    }}
                  />
                ))}
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
                <label htmlFor="secret-message" className="text-xs text-slate-500">Secret message</label>

                <textarea
                  id="secret-message"
                  rows={4}
                  value={message}
                  onChange={(e) => handleMessageChange(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/5 bg-white/5 p-4 outline-none focus:border-cyan-500/50 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1327] transition-all"
                />
              </div>

              <div>
                <label htmlFor="encode-password" className="text-xs text-slate-500">
                  Shared password (PBKDF2 key derivation)
                </label>

                <div className="relative mt-2">
                  <input
                    id="encode-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="off"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className="w-full rounded-xl border border-white/5 bg-white/5 pl-4 pr-12 py-4 outline-none focus:border-cyan-500/50 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1327] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition focus-visible:text-white outline-none cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
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
              <div className="rounded-2xl border border-teal-400 bg-teal-500/10 shadow-[0_0_25px_rgba(20,184,166,0.15)] p-4 relative transition duration-200 hover:brightness-110">
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

              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 transition duration-200 hover:border-white/10 hover:bg-white/[0.07] cursor-pointer hover:shadow-[0_4px_20px_rgba(255,255,255,0.02)]">
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
            <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
              {localError}
            </div>
          )}
          <button
            onClick={async () => {
              if (!audioFile) {
                setLocalError("Please select an audio file before encoding.");
                return;
              }

              if ('fake' in audioFile) {
                setLocalError("Please re-upload the audio file to run encode again.");
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
                audioFile as File,
                message,
                password,
                "ml",
              );

              if (response?.status === "success") {
                setLocalResult(response);
                sessionStorage.setItem("steganoml_encode_result", JSON.stringify(response));
                setShowToast(true);

                setTimeout(() => {
                  setShowToast(false);
                }, 3000);
              }
            }}
            disabled={loading}
            className="w-full rounded-xl bg-[#1bd6d1] py-5 text-base font-semibold text-black transition hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#040816] outline-none cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Encoding...</span>
              </>
            ) : (
              "Run ML-guided encode"
            )}
          </button>
        </div>

        {/* RIGHT COLUMN */}

        <div className="lg:col-span-4 space-y-5">
          {/* PIPELINE */}

          <div className="rounded-[20px] border border-white/10 bg-[#0b1327] overflow-hidden">
            <div className="px-6 py-5 flex justify-between border-b border-white/5">
              <h2 className="font-semibold">Pipeline</h2>
              {loading && <span className="text-cyan-400 text-sm animate-pulse">● Processing</span>}
            </div>

            <div className="p-6 space-y-7">
              {[
                "Preparing Audio",
                "Encrypting Payload",
                "Selecting Embedding Locations",
                "Embedding Payload",
                "Generating Metrics",
                "Uploading Result"
              ].map((step, i) => {
                const isActive = i === progressStep;
                const isCompleted = i < progressStep;

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

          {/* QUALITY REPORT */}

          <div className="rounded-[20px] border border-white/10 bg-[#0b1327] overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <div className="px-6 py-5 border-b border-white/5">
              <h2 className="font-semibold">
                Quality Report
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Live metrics from the latest encode operation
              </p>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/5 p-5">
                  <p className="text-xs text-slate-500">
                    PSNR
                  </p>

                  <h3 className="text-[42px] leading-none font-bold mt-2">
                    {localResult?.details?.psnr
                      ? Number(localResult.details.psnr).toFixed(2)
                      : "--"}
                  </h3>
                </div>

                <div className="rounded-xl bg-white/5 p-5">
                  <p className="text-xs text-slate-500">
                    SNR
                  </p>

                  <h3 className="text-[42px] leading-none font-bold mt-2">
                    {localResult?.details?.snr
                      ? Number(localResult.details.snr).toFixed(2)
                      : "--"}
                  </h3>
                </div>

                <div className="rounded-xl bg-white/5 p-5">
                  <p className="text-xs text-slate-500">
                    BER
                  </p>

                  <h3 className="text-[28px] font-bold mt-2">
                    {localResult?.details?.ber ?? "--"}
                  </h3>
                </div>

                <div className="rounded-xl bg-white/5 p-5">
                  <p className="text-xs text-slate-500">
                    NC
                  </p>

                  <h3 className="text-[28px] font-bold mt-2">
                    {localResult?.details?.nc ?? "--"}
                  </h3>
                </div>
              </div>

              {error && (
                <div role="alert" className="mt-4 rounded-xl bg-red-500/10 p-4 text-red-400">
                  {error}
                </div>
              )}

              {localResult && (
                <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <h3 className="font-semibold text-emerald-400">
                    Encoding Successful
                  </h3>

                  <p className="mt-2 text-sm text-slate-300">
                    Status: {localResult.status}
                  </p>

                  <p className="mt-1 text-sm text-slate-300 break-all">
                    Output: {localResult.output_file}
                  </p>

                  <p className="mt-1 text-sm text-slate-300">
                    Bits Embedded: {localResult?.details?.bits_embedded}
                  </p>
                </div>
              )}

              {localResult?.output_file && (
                <div className="mt-4 space-y-3">
                  <a
                    href={getDownloadUrl(
                      localResult.storage_url,
                      localResult.output_file
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full rounded-xl border border-teal-400 bg-teal-500/10 py-3 text-center text-teal-300 hover:bg-teal-500/20 transition"
                  >
                    Download Stego Audio
                  </a>

                  {localResult?.storage_url && (
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          localResult.storage_url
                        )
                      }
                      className="w-full rounded-xl border border-cyan-400 bg-cyan-500/10 py-3 text-cyan-300 hover:bg-cyan-500/20 transition"
                    >
                      Copy Cloud URL
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}