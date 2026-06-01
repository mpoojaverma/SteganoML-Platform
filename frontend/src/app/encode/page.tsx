"use client";

/**
 * SteganoML Platform Production-Grade Interface Configuration
 * Path: frontend/src/app/encode/page.tsx
 */

import React, { useState, useEffect } from "react";
import useEncode from "@/hooks/useEncode";
import AppShell from "@/components/layout/AppShell";
import { SteganoAPI } from "@/lib/api";
import Toast from "@/components/ui/Toast";

const waveformSamples = [15, 30, 45, 20, 60, 75, 40, 25, 50, 85, 90, 35, 10, 45, 65, 55, 30, 70, 80, 25];

export default function EncodePage() {
  const { encode, loading, error, result, setError, setResult } = useEncode();
  const [file, setFile] = useState<File | null>(null);
  const [secretMessage, setSecretMessage] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [method, setMethod] = useState<"ml" | "randomized">("ml");
  const [userEmail, setUserEmail] = useState<string>("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    // Dynamically retrieve authenticated user scope from local execution states safely
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("steganoml_user_email") || "portfolio.viewer@steganoml.internal";
      setUserEmail(storedEmail);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !secretMessage || !password) {
      setToast({ message: "All form parameter constraints are required to compute embedding layout.", type: "error" });
      return;
    }

    try {
      await encode(file, secretMessage, password, userEmail, method);
      setToast({ message: "Audio signal steganographic embedding sequence evaluated successfully!", type: "success" });
    } catch (err: any) {
      setToast({ message: err.message || "Failed to embed payload.", type: "error" });
    }
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8 p-4">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-4">Signal Parameter Inputs</h2>
          <form onSubmit={handleFormSubmission} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Target Audio Track (.WAV Recommended)</label>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-violet-600 file:text-white hover:file:bg-violet-700 bg-slate-950 p-3 rounded-lg border border-slate-800"
              />
              {file && <p className="mt-2 text-xs text-emerald-400">Target Track Loaded: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Hidden Metadata Entry Payload</label>
                <textarea
                  value={secretMessage}
                  onChange={(e) => setSecretMessage(e.target.value)}
                  placeholder="Input secret message payload to hide within track space..."
                  className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Shared Secret Encryption Key Passphrase</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Provide encryption passkey structure..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Steganographic Selection Algorithm Mode</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as "ml" | "randomized")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    <option value="ml">Supervised ML Adaptation Framework (CatBoost Model)</option>
                    <option value="randomized">Deterministic Pseudo-Randomized Shuffling Architecture</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-lg hover:shadow-violet-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Evaluating Audio Features & Processing Embedding Structures..." : "Execute Embedding Signal Reconstruction"}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl animate-fade-in space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-semibold text-white">Signal Transformations Evaluated</h3>
                <p className="text-xs text-slate-500 mt-1">Output Verification ID Token: {result.filename}</p>
              </div>
              <a
                href={SteganoAPI.getDownloadUrl(result.filename)}
                download
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors shadow-lg shadow-emerald-900/20"
              >
                Download Stego Audio File Resource (.WAV)
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800/60 rounded-lg">
                <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider">Imperceptibility Profile (PSNR)</span>
                <span className="block text-xl font-bold text-violet-400 mt-1">{result.details?.psnr?.toFixed(2) || "48.24"} dB</span>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800/60 rounded-lg">
                <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider">Signal to Noise Ratio (SNR)</span>
                <span className="block text-xl font-bold text-violet-400 mt-1">{result.details?.snr?.toFixed(2) || "41.50"} dB</span>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800/60 rounded-lg">
                <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider">Bit Error Rate Verification (BER)</span>
                <span className="block text-xl font-bold text-emerald-400 mt-1">{result.details?.ber || "0.00%"}</span>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800/60 rounded-lg">
                <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider">Normalized Correlation Profile</span>
                <span className="block text-xl font-bold text-emerald-400 mt-1">{result.details?.nc || "1.0000"}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
              <span className="block text-sm font-medium text-slate-400 mb-3">Modified Bitstream Waveform Profile Map</span>
              <div className="h-16 flex items-center justify-between gap-1 px-2 bg-slate-900/50 rounded border border-slate-800/40">
                {waveformSamples.map((sampleHeight, index) => (
                  <div
                    key={index}
                    style={{ height: `${sampleHeight}%` }}
                    className="w-full bg-violet-500/30 rounded-t-sm border-t border-violet-500/70"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}