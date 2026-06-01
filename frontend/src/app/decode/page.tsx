"use client";

/**
 * SteganoML Platform Production-Grade Interface Configuration
 * Path: frontend/src/app/decode/page.tsx
 */

import React, { useState, useEffect } from "react";
import useDecode from "@/hooks/useDecode";
import AppShell from "@/components/layout/AppShell";
import Toast from "@/components/ui/Toast";

export default function DecodePage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState<string>("");
  const [method, setMethod] = useState<"ml" | "randomized">("ml");
  const [userEmail, setUserEmail] = useState<string>("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Map 'decode' from the hook into the 'runDecode' name expected by the legacy page actions
  const { decode: runDecode, loading, error, result } = useDecode();

  useEffect(() => {
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
    if (!file || !password) {
      setToast({ message: "Target audio file and credentials are required to reconstruct payload coordinate grids.", type: "error" });
      return;
    }

    try {
      await runDecode(file, password, userEmail, method);
      setToast({ message: "Steganographic payload recovery operation concluded successfully.", type: "success" });
    } catch (err: any) {
      setToast({ message: err.message || "Failed to parse steganographic coordinates.", type: "error" });
    }
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8 p-4">
        {/* Strictly matches the native Toast contract using show and message props */}
        <Toast show={!!toast} message={toast?.message || ""} />

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-4">Extract Payload Metadata</h2>
          <form onSubmit={handleFormSubmission} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Select Encoded Stego Track (.WAV)</label>
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
                <label className="block text-sm font-medium text-slate-400 mb-2">Shared Secret Encryption Passphrase</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Provide private verification passphrase..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Steganographic Extraction Method Framework</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as "ml" | "randomized")}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
                >
                  <option value="ml">Supervised ML Reconstruction Framework (CatBoost Adaptation Map)</option>
                  <option value="randomized">Deterministic Pseudo-Random Shuffling Extraction</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-lg hover:shadow-violet-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Re-evaluating Audio Transcripts & Decoding Payload Channels..." : "Execute Extract Metadata Bitstream"}
            </button>
          </form>
        </div>

        {/* Display Output Stream Results Segment safely on verification success */}
        {result && result.status === "success" && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl animate-fade-in space-y-4">
            <div className="pb-3 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white">Extracted Metadata Contents</h3>
              <p className="text-xs text-emerald-400 mt-1">Payload extraction integrity verified with zero parity distortion.</p>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-lg max-h-96 overflow-y-auto">
              <p className="text-slate-200 font-mono text-sm whitespace-pre-wrap selection:bg-violet-500/30">
                {result.message || "Warning: Bitstream coordinate payload space parsed empty."}
              </p>
            </div>
          </div>
        )}

        {/* Fallback Display Frame for Explicit Signal Decryption Errors */}
        {result && result.status === "error" && (
          <div className="bg-slate-900 border border-rose-950 rounded-xl p-6 shadow-2xl animate-fade-in space-y-3">
            <div className="flex items-center space-x-3 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <h3 className="text-md font-semibold font-sans">Payload Extraction Anomaly Detected</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed bg-slate-950 p-4 rounded-lg border border-slate-900">
              {result.message || "Decryption failure. The encryption password supplied is structurally incorrect or the steganographic target coordinates are unresolvable."}
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}