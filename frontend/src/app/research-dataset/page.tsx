"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/ui/Logo";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  FileText,
  Cpu,
  Check,
  Copy,
  ExternalLink,
  Sliders,
  Award,
  Zap
} from "lucide-react";

const features = [
  {
    title: "MFCC Features",
    category: "cepstral",
    description: "Mel-Frequency Cepstral Coefficients model perceptual human voice pitch characteristics. They capture spectral envelope peaks accurately.",
    formula: "DCT(log(FilterBank(FFT(x))))",
    descriptor: "Acoustic Feature Descriptor"
  },
  {
    title: "RMS Energy",
    category: "temporal",
    description: "Measures overall wave energy amplitude per frame, identifying silence zones or quiet sections prone to audible noise distortions.",
    formula: "sqrt(1/N * sum(x^2))",
    descriptor: "Stability Predictor Input"
  },
  {
    title: "Spectral Centroid",
    category: "spectral",
    description: "Represents the center of spectral mass, identifying whether a frame consists mostly of lower bass tones or higher treble noise.",
    formula: "sum(f * X(f)) / sum(X(f))",
    descriptor: "Classification Signal Metric"
  },
  {
    title: "Spectral Bandwidth",
    category: "spectral",
    description: "Measures the spread of frequencies around the centroid, reflecting spectral variation and frame complexity.",
    formula: "sqrt(sum((f - Centroid)^2 * X(f)) / sum(X(f)))",
    descriptor: "Training Feature Component"
  },
  {
    title: "Zero Crossing Rate",
    category: "temporal",
    description: "Measures how frequently the time-domain signal crosses zero. Higher values denote high-frequency tone lines or pure white noise.",
    formula: "1/(2N) * sum(|sign(x_n) - sign(x_n-1)|)",
    descriptor: "Acoustic Feature Descriptor"
  },
  {
    title: "Chroma Features",
    category: "chroma",
    description: "Project spectral energy onto twelve pitch classes. Helps evaluate underlying harmonic complexity and note structures.",
    formula: "12-element Pitch Class Profile",
    descriptor: "Stability Predictor Input"
  },
  {
    title: "Spectral Contrast",
    category: "spectral",
    description: "Evaluates the differences between spectral peaks and valleys across frequency sub-bands, capturing audio texture richness.",
    formula: "Peak_Energy - Valley_Energy",
    descriptor: "Classification Signal Metric"
  },
  {
    title: "Roll-off Frequency",
    category: "spectral",
    description: "The spectral threshold frequency below which 85% of total audio frame energy is concentrated. Marks frame cutoff parameters.",
    formula: "sum_{f=0}^{R} X(f) = 0.85 * sum(X(f))",
    descriptor: "Training Feature Component"
  },
];

const creationSteps = [
  {
    title: "Raw Audio Collection",
    desc: "Ingests high-fidelity lossless .WAV files representing diverse acoustic profiles (speech, music, ambient).",
    parameter: "44.1 kHz, 16-bit Mono/Stereo PCM"
  },
  {
    title: "Frame Segmentation",
    desc: "Slices audio streams into uniform 20ms frames to localize characteristics over short auditory integration intervals.",
    parameter: "Frame size: 882 samples, Overlap: 50%"
  },
  {
    title: "Feature Extraction",
    desc: "Extracts multi-dimensional feature vectors containing RMS, spectral centroids, bandwidth, and MFCCs using Librosa.",
    parameter: "34 dimensional acoustic feature vectors"
  },
  {
    title: "Feature Normalization",
    desc: "Applies z-score scaling to features to optimize model training stability and eliminate amplitude bias.",
    parameter: "Mean = 0, Std Dev = 1 scaling"
  },
  {
    title: "Label Generation",
    desc: "Calculates mathematical LSB capacity capacity scores per frame, labeling frames as 'Stable' or 'Unstable' based on masking thresholds.",
    parameter: "Binary Threshold: PSNR > 80 dB"
  },
  {
    title: "Final Dataset Compile",
    desc: "Aggregates frame samples into a structured tabular matrix ready for CatBoost tree model training.",
    parameter: "Export format: Parquet / CSV"
  }
];

const trainingWorkflow = [
  {
    stage: "Data Partitioning",
    desc: "Splits compile datasets into training, evaluation, and test blocks, ensuring no frame overlaps between partitions.",
    metric: "80% Train, 10% Eval, 10% Test split"
  },
  {
    stage: "Hyperparameter Config",
    desc: "Sets tree depths, learning rates, and L2 regularization criteria. CatBoost automatically handles feature parameter scoring.",
    metric: "Depth: 6, LR: 0.05, Iterations: 1200"
  },
  {
    stage: "CatBoost Model Run",
    desc: "Trains tree ensembles, tracking objective logs and loss convergence rates using early stopping rules.",
    metric: "LogLoss Optimization criteria"
  },
  {
    stage: "Validation Pass",
    desc: "Evaluates classification accuracy metrics against holdout stego samples, testing ROC-AUC thresholds.",
    metric: "ROC-AUC Target > 0.95"
  },
  {
    stage: "Platform Integration",
    desc: "Compiles weight matrices into JSON model files, deploying to the SaaS FastAPI prediction endpoint.",
    metric: "SaaS Inference Latency: < 4ms"
  }
];

const bibtexCitation = `@inproceedings{steganoml2026,
  author={Verma, Pooja and others},
  booktitle={2026 International Conference on Wireless Communications, Signal Processing and Networking (WiSPNET)}, 
  title={SteganoML: An Adaptive ML-Driven Audio Steganography for Robust Secure Communication}, 
  year={2026},
  pages={104-109},
  doi={10.1109/WiSPNET69615.2026.11489464}
}`;

export default function ResearchDatasetPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeCreationStep, setActiveCreationStep] = useState(0);
  const [activeWorkflowStage, setActiveWorkflowStage] = useState(0);
  const [copied, setCopied] = useState(false);
  const [expandedFormulas, setExpandedFormulas] = useState<Record<string, boolean>>({});

  const toggleFormula = (title: string) => {
    setExpandedFormulas(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
      }
    }
    checkSession();
  }, []);

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(bibtexCitation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredFeatures = selectedCategory === "all"
    ? features
    : features.filter(f => f.category === selectedCategory);

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
          <Logo size="md" showSubText={true} href="/" />
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
            <Database size={12} />
            Research Dataset & Preprocessing
          </span>
          <h1 className="mt-8 text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none">
            Research Dataset
          </h1>
          <h2 className="mt-5 text-xl sm:text-3xl font-semibold text-cyan-400/90 leading-tight">
            Audio Dataset Construction and Feature Engineering
          </h2>
          <p className="mt-8 max-w-5xl text-base sm:text-lg leading-relaxed text-slate-300">
            The SteganoML dataset consists of parameterized audio sample points designed to train classifiers.
            By extracting z-scaled cepstral, temporal, and spectral features, the model precisely identifies
            stegano masking capacities.
          </p>
        </div>
      </section>

      {/* DATASET OVERVIEW */}
      <section className="relative z-20 mx-auto max-w-7xl px-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center">Dataset Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="rounded-2xl border border-white/5 bg-[#07111f]/60 p-6 text-center hover:border-cyan-500/10 transition-colors">
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Audio Format</span>
            <h3 className="text-xl font-bold text-cyan-400 mt-2">Lossless WAV</h3>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#07111f]/60 p-6 text-center hover:border-cyan-500/10 transition-colors">
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Feature Count</span>
            <h3 className="text-xl font-bold text-cyan-400 mt-2">34 Properties</h3>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#07111f]/60 p-6 text-center hover:border-cyan-500/10 transition-colors">
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Dataset Style</span>
            <h3 className="text-xl font-bold text-cyan-400 mt-2">Tabular Parquet</h3>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#07111f]/60 p-6 text-center hover:border-cyan-500/10 transition-colors">
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">ML Target</span>
            <h3 className="text-xl font-bold text-cyan-400 mt-2">Frame Capacity</h3>
          </div>
        </div>
      </section>

      {/* DATASET CREATION TIMELINE */}
      <section className="relative z-20 mx-auto mt-28 max-w-6xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase tracking-widest text-cyan-400 font-bold">Preparation Workflow</h2>
          <h3 className="text-3xl sm:text-4xl font-bold mt-2">Dataset Creation Pipeline</h3>
          <p className="text-slate-400 mt-3 max-w-md mx-auto text-sm">
            Select a timeline block below to explore the data engineering steps required to compile the training set.
          </p>
        </div>

        {/* Stepper Grid Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {creationSteps.map((step, idx) => (
            <button
              key={step.title}
              onClick={() => setActiveCreationStep(idx)}
              className={`p-4 rounded-2xl border text-center transition-all outline-none cursor-pointer ${
                activeCreationStep === idx
                  ? "border-cyan-500 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                  : "border-white/5 bg-[#050b16]/60 hover:border-white/10"
              }`}
            >
              <span className={`text-[10px] font-mono font-bold ${
                activeCreationStep === idx ? "text-cyan-400" : "text-slate-500"
              }`}>Step 0{idx + 1}</span>
              <h4 className="text-xs sm:text-sm font-bold text-white mt-1 break-words lg:break-normal lg:truncate max-w-full lg:max-w-none">{step.title}</h4>
            </button>
          ))}
        </div>

        {/* Display Active Creation Step Details */}
        <div className="rounded-3xl border border-cyan-500/20 bg-[#071329]/80 p-8 mt-6 shadow-xl relative min-h-[160px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-2 max-w-3xl">
            <h4 className="text-lg font-bold text-cyan-400">
              0{activeCreationStep + 1} / {creationSteps[activeCreationStep].title}
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              {creationSteps[activeCreationStep].desc}
            </p>
          </div>
          <div className="shrink-0 font-mono text-xs bg-slate-950 border border-white/5 px-4 py-2.5 rounded-xl text-slate-400">
            <span className="text-cyan-400 font-bold block mb-1">DATA VARIABLE</span>
            {creationSteps[activeCreationStep].parameter}
          </div>
        </div>
      </section>

      {/* FEATURE ENGINEERING COMPONENTS WITH DYNAMIC FILTER */}
      <section className="relative z-20 mx-auto mt-28 max-w-7xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase tracking-widest text-cyan-400 font-bold">Feature Engineering</h2>
          <h3 className="text-3xl sm:text-4xl font-bold mt-2">Feature Engineering Components</h3>
          <p className="text-slate-400 mt-3 max-w-md mx-auto text-sm">
            Filter the parameters below to explore the properties compiled during frame analysis.
          </p>

          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {["all", "temporal", "spectral", "cepstral", "chroma"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all outline-none cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/15"
                    : "bg-[#050b16]/85 text-slate-400 border border-white/5 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {filteredFeatures.map((feat) => (
            <motion.div
              key={feat.title}
              whileHover={{
                y: -8,
                borderColor: "rgba(34, 211, 238, 0.4)",
                boxShadow: "0 10px 30px -10px rgba(34, 211, 238, 0.15)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="rounded-3xl border border-white/10 bg-[#07111f]/60 p-6 flex flex-col justify-between relative overflow-hidden group min-h-[320px]"
            >
              <div>
                <span className="text-[9px] uppercase font-mono tracking-widest text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                  {feat.category}
                </span>
                <h4 className="text-lg font-bold text-white mt-4">{feat.title}</h4>
                <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
                  {feat.description}
                </p>
              </div>
              
              <div className="mt-6 border-t border-white/5 pt-4 space-y-3">
                {/* Reveal Descriptor on Hover */}
                <div className="flex flex-col gap-1 max-h-0 opacity-0 group-hover:max-h-12 group-hover:opacity-100 transition-all duration-300 overflow-hidden">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    Classification Role
                  </span>
                  <span className="text-xs font-semibold text-cyan-400/90">
                    {feat.descriptor}
                  </span>
                </div>
                
                {/* Mathematical Formula Accordion with Height/Fade/Blur Animations */}
                <div className="border border-white/5 bg-slate-950/40 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleFormula(feat.title)}
                    className="w-full flex items-center justify-between p-2.5 text-[11px] font-mono font-bold text-slate-400 hover:text-white cursor-pointer select-none outline-none"
                  >
                    <span>Mathematical Definition</span>
                    <motion.svg
                      className="h-3 w-3 text-cyan-500/80"
                      animate={{ rotate: expandedFormulas[feat.title] ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {expandedFormulas[feat.title] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, filter: "blur(6px)" }}
                        animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
                        exit={{ height: 0, opacity: 0, filter: "blur(4px)" }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 border-t border-cyan-500/10 bg-slate-950/90 rounded-b-xl shadow-inner font-mono text-[10px] text-cyan-300/80 break-words leading-relaxed select-all">
                          {feat.formula}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRE-PROCESSING DETAILS */}
      <section className="relative z-20 mx-auto mt-28 max-w-7xl px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight">Audio Pre-Processing Standards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          <div className="rounded-2xl border border-cyan-500/10 bg-[#07111f]/40 p-6 text-center hover:border-cyan-500/30 transition-colors">
            <h3 className="text-lg font-bold text-white">Audio Normalization</h3>
            <p className="text-slate-400 text-xs mt-3 leading-relaxed">Peak scaling waveform amplitudes to -1.0 to +1.0 thresholds, stabilizing energy checks.</p>
          </div>
          <div className="rounded-2xl border border-cyan-500/10 bg-[#07111f]/40 p-6 text-center hover:border-cyan-500/30 transition-colors">
            <h3 className="text-lg font-bold text-white">Frame Segmentation</h3>
            <p className="text-slate-400 text-xs mt-3 leading-relaxed">Splitting continuous audio into overlapping 20ms frames to prevent spectral leakage.</p>
          </div>
          <div className="rounded-2xl border border-cyan-500/10 bg-[#07111f]/40 p-6 text-center hover:border-cyan-500/30 transition-colors">
            <h3 className="text-lg font-bold text-white">Feature Scaling</h3>
            <p className="text-slate-400 text-xs mt-3 leading-relaxed">Standardizing variable data inputs via Z-Score scaling, stabilizing regression coefficients.</p>
          </div>
          <div className="rounded-2xl border border-cyan-500/10 bg-[#07111f]/40 p-6 text-center hover:border-cyan-500/30 transition-colors">
            <h3 className="text-lg font-bold text-white">Label Generation</h3>
            <p className="text-slate-400 text-xs mt-3 leading-relaxed">Calculating localized auditory limits to define frame capacities automatically.</p>
          </div>
        </div>
      </section>

      {/* TRAINING WORKFLOW TIMELINE */}
      <section className="relative z-20 mx-auto mt-28 max-w-6xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase tracking-widest text-purple-400 font-bold">Model Optimization</h2>
          <h3 className="text-3xl sm:text-4xl font-bold mt-2">Training Workflow</h3>
          <p className="text-slate-400 mt-3 max-w-md mx-auto text-sm">
            Select a training block to inspect the parameters and algorithms involved in model optimization.
          </p>
        </div>

        {/* Stepper Grid Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {trainingWorkflow.map((stage, idx) => (
            <button
              key={stage.stage}
              onClick={() => setActiveWorkflowStage(idx)}
              className={`p-4 rounded-2xl border text-center transition-all outline-none cursor-pointer ${
                activeWorkflowStage === idx
                  ? "border-purple-500 bg-purple-500/5 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                  : "border-white/5 bg-[#050b16]/60 hover:border-white/10"
              }`}
            >
              <span className={`text-[10px] font-mono font-bold ${
                activeWorkflowStage === idx ? "text-purple-400" : "text-slate-500"
              }`}>Stage 0{idx + 1}</span>
              <h4 className="text-xs sm:text-sm font-bold text-white mt-1 break-words lg:break-normal lg:truncate max-w-full lg:max-w-none">{stage.stage}</h4>
            </button>
          ))}
        </div>

        {/* Display Active Workflow Details */}
        <div className="rounded-3xl border border-purple-500/20 bg-[#071329]/80 p-8 mt-6 shadow-xl relative min-h-[160px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-2 max-w-3xl">
            <h4 className="text-lg font-bold text-purple-400">
              0{activeWorkflowStage + 1} / {trainingWorkflow[activeWorkflowStage].stage}
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              {trainingWorkflow[activeWorkflowStage].desc}
            </p>
          </div>
          <div className="shrink-0 font-mono text-xs bg-slate-950 border border-white/5 px-4 py-2.5 rounded-xl text-slate-400">
            <span className="text-purple-400 font-bold block mb-1">METRIC METRICS</span>
            {trainingWorkflow[activeWorkflowStage].metric}
          </div>
        </div>
      </section>

      {/* RESEARCH PUBLICATION SHOWCASE CARD WITH BIBTEX COPY */}
      <section id="publication" className="relative z-20 mx-auto mt-28 mb-24 max-w-7xl px-6">
        <div className="rounded-[40px] border border-cyan-500/20 bg-gradient-to-br from-[#07111f] to-[#081528] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-cyan-500/5 blur-[80px] pointer-events-none" />

          <div className="grid gap-12 lg:grid-cols-12 items-start">
            {/* Citation Metadata (Left 7 Columns) */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 px-4 py-2 text-xs font-semibold text-cyan-300">
                <Award size={12} />
                IEEE Publication 2026
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                SteganoML Research Publication
              </h2>
              <h3 className="text-xl font-bold text-cyan-400/90 leading-snug">
                SteganoML: An Adaptive ML-Driven Audio Steganography for Robust Secure Communication
              </h3>
              
              <div className="space-y-2 text-slate-400 text-sm">
                <p className="font-semibold text-slate-300">Published in IEEE WiSPNET 2026</p>
                <p>International Conference on Wireless Communications, Signal Processing and Networking</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center text-xs">
                <motion.a
                  href="https://doi.org/10.1109/WiSPNET69615.2026.11489464"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group bg-cyan-500/5 border border-cyan-500/20 px-3 py-2 rounded-xl text-cyan-400 flex items-center gap-2 font-mono outline-none cursor-pointer overflow-hidden"
                  initial="initial"
                  whileHover="hover"
                  animate="initial"
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    DOI: 10.1109/WiSPNET69615.2026.11489464
                    <ExternalLink size={12} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                    <motion.span
                      className="absolute bottom-[-1px] left-0 h-[1.5px] bg-cyan-400"
                      variants={{
                        initial: { width: 0 },
                        hover: { width: "100%" }
                      }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </span>
                  <motion.span
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    variants={{
                      initial: { boxShadow: "0 0 0px rgba(6, 182, 212, 0)" },
                      hover: { boxShadow: "0 0 15px rgba(6, 182, 212, 0.4)" }
                    }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                </motion.a>
                <a
                  href="https://ieeexplore.ieee.org/document/11489464/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-cyan-400 hover:text-cyan-300 transition focus-visible:ring-1 focus-visible:ring-cyan-400 outline-none rounded p-1"
                >
                  <span>View on IEEE Xplore</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Interactive Copy BibTeX Codeblock (Right 5 Columns) */}
            <div className="lg:col-span-5 bg-slate-950/90 border border-white/5 rounded-3xl p-6 relative flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold">BibTeX Citation</span>
                  <button
                    onClick={handleCopyCitation}
                    className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition font-semibold outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded px-1.5 py-0.5 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-[10px] sm:text-xs font-mono text-slate-400 overflow-x-auto select-all leading-relaxed whitespace-pre-wrap relative">
                  {bibtexCitation}
                  <motion.span
                    className="inline-block w-1.5 h-3.5 bg-cyan-400/85 ml-1 align-middle"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </pre>
              </div>
              <div className="text-[10px] text-slate-500 mt-6 font-mono">
                SteganoML Research Archive
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MINIMAL FOOTER */}
      <footer className="relative z-30 border-t border-white/5 bg-[#020817] py-8">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <span>© 2026 SteganoML. All Rights Reserved.</span>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-cyan-400 transition">Home</Link>
            <Link href="/about" className="hover:text-cyan-400 transition">About</Link>
            <Link href="/model-insights" className="hover:text-cyan-400 transition">Model Insights</Link>
            <Link href="/research-dataset" className="hover:text-cyan-400 transition">Research Dataset</Link>
            <Link href="/research-dataset#publication" className="hover:text-cyan-400 transition">Publication</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}