"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Cpu,
  Sparkles,
  TrendingUp,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Lock
} from "lucide-react";

const featureImportance = [
  {
    title: "RMS Energy",
    description: "Measures localized signal energy. Critical for detecting flat-tone intervals where embedding alterations would stand out.",
    value: 28,
    color: "bg-cyan-400"
  },
  {
    title: "MFCC Mean",
    description: "Captures the general spectral shape and envelope, helping identify structural vocal or melodic patterns.",
    value: 24,
    color: "bg-emerald-400"
  },
  {
    title: "Spectral Centroid",
    description: "Tracks signal brightness and center of mass. Prevents inserting data in highly sensitive mid-frequency bands.",
    value: 18,
    color: "bg-purple-400"
  },
  {
    title: "MFCC Variance",
    description: "Represents dynamics and variations in spectral coefficients over short temporal frames.",
    value: 12,
    color: "bg-cyan-500"
  },
  {
    title: "Spectral Bandwidth",
    description: "Measures how spread out the spectrum frequencies are around the centroid. Indicates sound density.",
    value: 10,
    color: "bg-emerald-500"
  },
  {
    title: "Zero Crossing Rate",
    description: "Counts temporal sign changes. Helps distinguish between clear pitch lines and noise-like structures.",
    value: 8,
    color: "bg-purple-500"
  },
];

const metrics = [
  {
    title: "ROC-AUC Score",
    value: "0.9581",
    description: "Excellent capacity to separate stable carrier frames from vulnerable, transparent regions.",
    progress: 95.8
  },
  {
    title: "Precision",
    value: "92.4%",
    description: "Ensures selected carrier frames are highly stable, minimizing stego detection risks.",
    progress: 92.4
  },
  {
    title: "Recall",
    value: "91.8%",
    description: "Percentage of stable frames successfully identified for high-capacity message embedding.",
    progress: 91.8
  },
  {
    title: "F1 Score",
    value: "92.1%",
    description: "Balanced harmonic mean of precision and recall, verifying model stability.",
    progress: 92.1
  },
];

const comparison = [
  { feature: "Training Speed", rf: "Moderate", xg: "Fast", cat: "Fast", highlighted: false },
  { feature: "Parameter Tuning", rf: "More Required", xg: "Moderate", cat: "Minimal (Auto)", highlighted: false },
  { feature: "Categorical Features", rf: "One-Hot Encode", xg: "Pre-process Needed", cat: "Native Support", highlighted: true },
  { feature: "Overfitting Guard", rf: "Moderate", xg: "Very Good", cat: "Excellent (Ordered)", highlighted: true },
  { feature: "Audio Stego Accuracy", rf: "84.2%", xg: "89.5%", cat: "92.4%", highlighted: true },
];

const matrixDetails = {
  tp: {
    label: "True Positive (TP)",
    rate: "91.2%",
    description: "The model correctly classified a stable audio frame. The system successfully embedded encrypted message bits inside this frame without audible degradation.",
    impact: "Maximizes payload capacity and maintains complete audio imperceptibility.",
    icon: CheckCircle2,
    iconColor: "text-emerald-400"
  },
  fp: {
    label: "False Positive (FP)",
    rate: "4.2%",
    description: "The model classified a sensitive/unstable audio frame as stable. Message bits were written here, creating a minute risk of spectral distortion.",
    impact: "May slightly lower the PSNR quality index. Mitigated by low adaptive LSB depth.",
    icon: AlertTriangle,
    iconColor: "text-amber-400"
  },
  fn: {
    label: "False Negative (FN)",
    rate: "2.8%",
    description: "The model classified a stable audio frame as unstable, skipping it. No data was embedded in this region.",
    impact: "Slightly reduces the maximum available payload throughput, but is completely safe for quality.",
    icon: Sliders,
    iconColor: "text-blue-400"
  },
  tn: {
    label: "True Negative (TN)",
    rate: "83.5%",
    description: "The model correctly identified an unstable or highly silent audio frame. The embedding pipeline completely avoided this area.",
    impact: "Prevents distortion in highly sensitive silent periods, ensuring clean audio recovery.",
    icon: Lock,
    iconColor: "text-cyan-400"
  }
};

type MatrixCellKey = "tp" | "fp" | "fn" | "tn";

export default function ModelInsightsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeCell, setActiveCell] = useState<MatrixCellKey>("tp");
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
      }
    }
    checkSession();
  }, []);

  return (
    <main className="min-h-screen bg-[#020817] text-white relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute left-[-200px] top-[-200px] h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute right-[-200px] top-[100px] h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute left-[25%] bottom-[-150px] h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none" />

      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* NAVBAR */}
      <nav className="relative z-30 border-b border-white/5 bg-[#020817]/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3 group outline-none">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 transition group-hover:scale-105 shrink-0">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                <rect x="2" y="2" width="20" height="20" rx="6" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.5" className="stroke-cyan-500/25" />
                <path d="M5 12c1.5-4 3.5-4 5 0s3.5 4 5 0 3.5-4 5 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-cyan-400" />
                <path d="M7 12c1.2-2.5 2.8-2.5 4 0s2.8 2.5 4 0 2.8-2.5 4 0" stroke="currentColor" strokeWidth="1" strokeDasharray="1.5 1.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-cyan-300/50" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">SteganoML</h1>
              <p className="text-[10px] text-slate-500 mt-1">Secure Audio Steganography</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-semibold text-black transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] focus-visible:ring-2 focus-visible:ring-cyan-400 outline-none cursor-pointer"
            >
              {isLoggedIn ? "Go to Dashboard" : "Launch App"}
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-20 mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <div className="rounded-[40px] border border-cyan-500/20 bg-gradient-to-br from-[#07111f] via-[#081528] to-[#07111f] p-8 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 px-4 py-2 text-xs font-medium text-cyan-300">
            <Cpu size={12} className="animate-pulse" />
            Machine Learning Engine
          </span>
          <h1 className="mt-8 text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none">
            Model Insights
          </h1>
          <h2 className="mt-5 text-xl sm:text-3xl font-semibold text-cyan-400/90 leading-tight">
            Understanding the Machine Learning Architecture Behind SteganoML
          </h2>
          <p className="mt-8 max-w-4xl text-base sm:text-lg leading-relaxed text-slate-300">
            SteganoML relies on a highly optimized CatBoost tree ensemble binary classifier.
            Instead of raw statistical rules, our model adapts dynamically to the audio features
            to find embedding paths with minimal signal impact.
          </p>
        </div>
      </section>

      {/* MODEL OVERVIEW */}
      <section className="relative z-20 mx-auto max-w-7xl px-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center">Model Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="rounded-2xl border border-white/5 bg-[#07111f]/60 p-6 text-center hover:border-cyan-500/10 transition-colors">
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Algorithm</span>
            <h3 className="text-xl font-bold text-cyan-400 mt-2">CatBoost Regressor</h3>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#07111f]/60 p-6 text-center hover:border-cyan-500/10 transition-colors">
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Learning Type</span>
            <h3 className="text-xl font-bold text-cyan-400 mt-2">Supervised Pass</h3>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#07111f]/60 p-6 text-center hover:border-cyan-500/10 transition-colors">
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Task Objective</span>
            <h3 className="text-xl font-bold text-cyan-400 mt-2">Binary Capacity</h3>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#07111f]/60 p-6 text-center hover:border-cyan-500/10 transition-colors">
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Classification</span>
            <h3 className="text-xl font-bold text-cyan-400 mt-2">Stable / Unstable</h3>
          </div>
        </div>
      </section>

      {/* INTERACTIVE FEATURE IMPORTANCE CHART */}
      <section className="relative z-20 mx-auto mt-28 max-w-7xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase tracking-widest text-cyan-400 font-bold">Model Metrics</h2>
          <h3 className="text-3xl sm:text-4xl font-bold mt-2">Feature Importance</h3>
          <p className="text-slate-400 mt-3 max-w-md mx-auto text-sm">
            Hover over each feature bar to explore how different acoustic properties influence the frame selection model.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-start max-w-6xl mx-auto">
          {/* Custom HTML/CSS Bar Chart (Left 7 Columns) */}
          <div className="lg:col-span-7 bg-[#050b16]/60 border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center text-xs text-slate-500 border-b border-white/5 pb-3">
              <span>Acoustic Parameter</span>
              <span>Relative Importance (%)</span>
            </div>

            <div className="space-y-4">
              {featureImportance.map((feat, idx) => (
                <div
                  key={feat.title}
                  onMouseEnter={() => setHoveredFeature(idx)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className="space-y-2 cursor-pointer group"
                >
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-slate-300 group-hover:text-white transition-colors">
                      {feat.title}
                    </span>
                    <span className="font-mono text-slate-400 group-hover:text-cyan-400 transition-colors">
                      {feat.value}%
                    </span>
                  </div>
                  <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 shadow-md ${feat.color} ${
                        hoveredFeature === idx ? "scale-y-110 brightness-110" : ""
                      }`}
                      style={{ width: `${feat.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details Tooltip / Card (Right 5 Columns) */}
          <div className="lg:col-span-5 rounded-3xl border border-cyan-500/20 bg-[#071329]/80 p-8 shadow-xl shadow-cyan-950/10 min-h-[360px] flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400">Parameter Analysis</span>
              <h4 className="text-2xl font-bold text-white mt-3">
                {hoveredFeature !== null ? featureImportance[hoveredFeature].title : "RMS Energy"}
              </h4>
              <p className="text-slate-300 mt-4 text-sm leading-relaxed">
                {hoveredFeature !== null ? featureImportance[hoveredFeature].description : featureImportance[0].description}
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <TrendingUp size={14} className="text-cyan-400" />
                <span>Feature rank: #{hoveredFeature !== null ? hoveredFeature + 1 : 1} of 6</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EVALUATION METRICS */}
      <section className="relative z-20 mx-auto mt-28 max-w-7xl px-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center">Model Performance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {metrics.map((metric) => (
            <div
              key={metric.title}
              className="rounded-3xl border border-cyan-500/10 bg-[#07111f]/40 p-6 flex flex-col justify-between hover:border-cyan-500/35 transition-colors"
            >
              <div>
                <span className="text-slate-500 text-xs font-semibold">{metric.title}</span>
                <p className="text-3xl font-black text-cyan-400 mt-2">{metric.value}</p>
                <p className="text-slate-400 text-xs mt-3 leading-relaxed">{metric.description}</p>
              </div>
              <div className="mt-6 h-1 w-full bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400" style={{ width: `${metric.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CLICKABLE CONFUSION MATRIX */}
      <section className="relative z-20 mx-auto mt-28 max-w-7xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase tracking-widest text-cyan-400 font-bold">Classification Diagnostics</h2>
          <h3 className="text-3xl sm:text-4xl font-bold mt-2">Interactive Confusion Matrix</h3>
          <p className="text-slate-400 mt-3 max-w-md mx-auto text-sm">
            Select a quadrant in the matrix to view its diagnostic definitions, exact accuracy rates, and impact.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-start max-w-5xl mx-auto">
          {/* 2x2 Matrix Selector (Left 6 Columns) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* True Positive */}
              <button
                onClick={() => setActiveCell("tp")}
                className={`aspect-auto sm:aspect-video min-h-[120px] sm:min-h-0 rounded-3xl border p-4 sm:p-6 text-left transition-all outline-none cursor-pointer flex flex-col justify-between ${
                  activeCell === "tp"
                    ? "border-emerald-500 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                    : "border-white/5 bg-[#050b16]/60 hover:border-white/15"
                }`}
              >
                <span className="text-xs font-semibold text-slate-500">Actual: Stable / Pred: Stable</span>
                <div className="flex justify-between items-baseline mt-4">
                  <h4 className="text-lg font-bold text-white">True Positive</h4>
                  <span className="text-2xl font-black text-emerald-400">{matrixDetails.tp.rate}</span>
                </div>
              </button>

              {/* False Positive */}
              <button
                onClick={() => setActiveCell("fp")}
                className={`aspect-auto sm:aspect-video min-h-[120px] sm:min-h-0 rounded-3xl border p-4 sm:p-6 text-left transition-all outline-none cursor-pointer flex flex-col justify-between ${
                  activeCell === "fp"
                    ? "border-amber-500 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                    : "border-white/5 bg-[#050b16]/60 hover:border-white/15"
                }`}
              >
                <span className="text-xs font-semibold text-slate-500">Actual: Unstable / Pred: Stable</span>
                <div className="flex justify-between items-baseline mt-4">
                  <h4 className="text-lg font-bold text-white">False Positive</h4>
                  <span className="text-2xl font-black text-amber-400">{matrixDetails.fp.rate}</span>
                </div>
              </button>

              {/* False Negative */}
              <button
                onClick={() => setActiveCell("fn")}
                className={`aspect-auto sm:aspect-video min-h-[120px] sm:min-h-0 rounded-3xl border p-4 sm:p-6 text-left transition-all outline-none cursor-pointer flex flex-col justify-between ${
                  activeCell === "fn"
                    ? "border-blue-500 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                    : "border-white/5 bg-[#050b16]/60 hover:border-white/15"
                }`}
              >
                <span className="text-xs font-semibold text-slate-500">Actual: Stable / Pred: Unstable</span>
                <div className="flex justify-between items-baseline mt-4">
                  <h4 className="text-lg font-bold text-white">False Negative</h4>
                  <span className="text-2xl font-black text-blue-400">{matrixDetails.fn.rate}</span>
                </div>
              </button>

              {/* True Negative */}
              <button
                onClick={() => setActiveCell("tn")}
                className={`aspect-auto sm:aspect-video min-h-[120px] sm:min-h-0 rounded-3xl border p-4 sm:p-6 text-left transition-all outline-none cursor-pointer flex flex-col justify-between ${
                  activeCell === "tn"
                    ? "border-cyan-500 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                    : "border-white/5 bg-[#050b16]/60 hover:border-white/15"
                }`}
              >
                <span className="text-xs font-semibold text-slate-500">Actual: Unstable / Pred: Unstable</span>
                <div className="flex justify-between items-baseline mt-4">
                  <h4 className="text-lg font-bold text-white">True Negative</h4>
                  <span className="text-2xl font-black text-cyan-400">{matrixDetails.tn.rate}</span>
                </div>
              </button>
            </div>
          </div>

          {/* Details view (Right 6 Columns) */}
          <div className="lg:col-span-6 rounded-3xl border border-white/10 bg-[#07111f]/60 p-8 min-h-[260px] flex flex-col justify-between backdrop-blur-md">
            <div>
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = matrixDetails[activeCell].icon;
                  return <Icon className={matrixDetails[activeCell].iconColor} size={24} />;
                })()}
                <h4 className="text-xl font-bold text-white">{matrixDetails[activeCell].label}</h4>
              </div>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                {matrixDetails[activeCell].description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-semibold">Stego Impact:</span>
              <span className="text-cyan-400 font-semibold">{matrixDetails[activeCell].impact}</span>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CATBOOST PERFORMANCE HIGHLIGHTS */}
      <section className="relative z-20 mx-auto mt-28 max-w-7xl px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight">Why CatBoost?</h2>
        <p className="text-slate-400 text-sm mt-3 text-center max-w-md mx-auto">
          Comparative framework analysis highlighting tree ensemble performance across steganographic parameters.
        </p>

        <div className="overflow-hidden rounded-[32px] border border-white/5 bg-[#050b16]/60 mt-10 max-w-5xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-950 border-b border-white/5">
                <tr>
                  <th className="p-5 text-left font-semibold text-slate-400">Model Metric</th>
                  <th className="p-5 text-left font-semibold text-slate-400">Random Forest</th>
                  <th className="p-5 text-left font-semibold text-slate-400">XGBoost</th>
                  <th className="p-5 text-left font-semibold text-cyan-400">CatBoost (SteganoML)</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-white/5 hover:bg-white/[0.01] transition-colors ${
                      row.highlighted ? "bg-cyan-500/[0.02]" : ""
                    }`}
                  >
                    <td className="p-5 font-semibold text-slate-300">{row.feature}</td>
                    <td className="p-5 text-slate-400">{row.rf}</td>
                    <td className="p-5 text-slate-400">{row.xg}</td>
                    <td className="p-5 font-bold text-cyan-400">{row.cat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* RESEARCH CONTRIBUTION */}
      <section className="relative z-20 mx-auto mt-28 mb-24 max-w-7xl px-6">
        <div className="rounded-[40px] border border-cyan-500/20 bg-gradient-to-br from-[#07111f] to-[#081528] p-8 md:p-12 shadow-xl hover:border-cyan-500/30 transition-colors">
          <h2 className="text-3xl font-extrabold text-white">Research Contribution</h2>
          <p className="mt-6 text-sm sm:text-base leading-relaxed text-slate-300 max-w-5xl">
            SteganoML delivers a robust alternative to legacy stego-systems by proving that categorical tree boosting
            methods can effectively analyze carrier audio frames. Rather than running a static mathematical formula, the
            platform learns sample variance thresholds over multiple datasets. This guarantees that hidden packets remain mathematically secure and auditory-undetectable.
          </p>
        </div>
      </section>

      {/* MINIMAL FOOTER */}
      <footer className="relative z-30 border-t border-white/5 bg-[#020817] py-8">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <span>© 2026 SteganoML. All Rights Reserved.</span>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-cyan-400 transition">Home</Link>
            <Link href="/about" className="hover:text-cyan-400 transition">About</Link>
            <Link href="/research-dataset" className="hover:text-cyan-400 transition">Dataset</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
