"use client";

const features = [
  {
    title: "MFCC",
    description:
      "Mel Frequency Cepstral Coefficients capture perceptual characteristics of audio and are widely used in speech and audio analysis.",
  },
  {
    title: "RMS Energy",
    description:
      "Measures signal energy and helps identify acoustically stable regions.",
  },
  {
    title: "Spectral Centroid",
    description:
      "Represents the center of mass of the spectrum and reflects audio brightness.",
  },
  {
    title: "Spectral Bandwidth",
    description:
      "Measures the spread of frequencies around the spectral centroid.",
  },
  {
    title: "Zero Crossing Rate",
    description:
      "Counts sign changes in the waveform and provides temporal characteristics.",
  },
  {
    title: "Chroma Features",
    description:
      "Represent pitch class information and capture harmonic characteristics.",
  },
  {
    title: "Spectral Contrast",
    description:
      "Measures differences between spectral peaks and valleys.",
  },
  {
    title: "Roll-off Frequency",
    description:
      "Frequency below which most signal energy is concentrated.",
  },
];

export default function ResearchDatasetPage() {
  return (
    <main className="min-h-screen bg-[#020817] text-white">

      {/* BACKGROUND */}

      <div className="absolute left-[-200px] top-[-200px] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[150px]" />

      <div className="absolute right-[-200px] top-[100px] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[150px]" />

      {/* HERO */}

      <section className="relative z-10 mx-auto max-w-7xl px-8 py-24">

        <div className="rounded-[40px] border border-cyan-500/20 bg-gradient-to-br from-[#07111f] via-[#081528] to-[#07111f] p-16">

          <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400">
            Research Dataset
          </span>

          <h1 className="mt-8 text-7xl font-bold">
            Research Dataset
          </h1>

          <h2 className="mt-5 text-4xl font-semibold text-cyan-400">
            Audio Dataset Construction and Feature Engineering
          </h2>

          <p className="mt-8 max-w-5xl text-xl leading-relaxed text-slate-400">
            The SteganoML dataset was designed to support machine-learning-guided
            audio steganography. Audio features are extracted, engineered and
            transformed into a structured dataset used for training the
            CatBoost classification model.
          </p>

        </div>

      </section>

      {/* DATASET OVERVIEW */}

      <section className="mx-auto max-w-7xl px-8">

        <h2 className="mb-10 text-center text-4xl font-bold">
          Dataset Overview
        </h2>

        <div className="grid grid-cols-4 gap-6">

          <InfoCard
            title="Audio Samples"
            value="WAV Files"
          />

          <InfoCard
            title="Feature Extraction"
            value="Audio Features"
          />

          <InfoCard
            title="Dataset Type"
            value="Structured ML Data"
          />

          <InfoCard
            title="Purpose"
            value="Frame Classification"
          />

        </div>

      </section>

      {/* PIPELINE */}

      <section className="mx-auto mt-24 max-w-5xl px-8">

        <h2 className="mb-12 text-center text-4xl font-bold">
          Dataset Creation Pipeline
        </h2>

        <div className="space-y-6">

          {[
            "Raw Audio",
            "Frame Segmentation",
            "Feature Extraction",
            "Feature Engineering",
            "Dataset Creation",
            "Model Training",
          ].map((step, index) => (
            <div
              key={step}
              className="rounded-3xl border border-cyan-500/20 bg-[#07111f] p-6 text-center"
            >
              <div className="mb-3 text-cyan-400">
                Step {index + 1}
              </div>

              <h3 className="text-2xl font-semibold">
                {step}
              </h3>
            </div>
          ))}

        </div>

      </section>

      {/* FEATURES */}

      <section className="mx-auto mt-24 max-w-7xl px-8">

        <h2 className="mb-12 text-center text-4xl font-bold">
          Extracted Audio Features
        </h2>

        <div className="grid grid-cols-4 gap-6">

          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-white/10 bg-[#07111f] p-6"
            >
              <h3 className="text-xl font-semibold text-cyan-400">
                {feature.title}
              </h3>

              <p className="mt-4 text-sm text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}

        </div>

      </section>

      {/* FEATURE CATEGORIES */}

      <section className="mx-auto mt-24 max-w-7xl px-8">

        <h2 className="mb-12 text-center text-4xl font-bold">
          Feature Categories
        </h2>

        <div className="grid grid-cols-3 gap-6">

          <CategoryCard
            title="Temporal Features"
            items={[
              "RMS Energy",
              "Zero Crossing Rate",
            ]}
          />

          <CategoryCard
            title="Spectral Features"
            items={[
              "Centroid",
              "Bandwidth",
              "Contrast",
              "Roll-off",
            ]}
          />

          <CategoryCard
            title="Cepstral Features"
            items={[
              "MFCC Features",
            ]}
          />

        </div>

      </section>

      {/* PREPROCESSING */}

      <section className="mx-auto mt-24 max-w-7xl px-8">

        <h2 className="mb-12 text-center text-4xl font-bold">
          Dataset Preparation
        </h2>

        <div className="grid grid-cols-4 gap-6">

          <PrepCard title="Audio Normalization" />
          <PrepCard title="Frame Segmentation" />
          <PrepCard title="Feature Scaling" />
          <PrepCard title="Label Generation" />

        </div>

      </section>

      {/* TRAINING WORKFLOW */}

      <section className="mx-auto mt-24 max-w-5xl px-8">

        <h2 className="mb-12 text-center text-4xl font-bold">
          Training Workflow
        </h2>

        <div className="space-y-6">

          {[
            "Dataset",
            "Train-Test Split",
            "CatBoost Training",
            "Evaluation",
            "Deployment",
          ].map((step, index) => (
            <div
              key={step}
              className="rounded-3xl border border-purple-500/20 bg-[#07111f] p-6 text-center"
            >
              <div className="mb-3 text-purple-400">
                Stage {index + 1}
              </div>

              <h3 className="text-2xl font-semibold">
                {step}
              </h3>
            </div>
          ))}

        </div>

      </section>

      {/* RESEARCH PUBLICATION */}

      <section className="mx-auto mt-24 mb-24 max-w-7xl px-8">

        <div className="rounded-[40px] border border-cyan-500/20 bg-[#07111f] p-12">

          <h2 className="text-4xl font-bold">
            Research Publication
          </h2>

          <h3 className="mt-8 text-2xl font-semibold text-cyan-400">
            SteganoML: An Adaptive ML-Driven Audio Steganography
            for Robust Secure Communication
          </h3>

          <p className="mt-6 text-lg text-slate-400">
            Published in IEEE WiSPNET 2026
          </p>

          <p className="mt-4 text-lg text-slate-400">
            International Conference on Wireless Communications,
            Signal Processing and Networking
          </p>

          <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">

            <p className="text-sm uppercase text-slate-500">
              DOI
            </p>

            <a
              href="https://ieeexplore.ieee.org/document/11489464/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-lg text-cyan-400 hover:text-cyan-300"
            >
              10.1109/WiSPNET69615.2026.11489464
            </a>

          </div>

        </div>

      </section>

    </main>
  );
}

function InfoCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#07111f] p-8 text-center">
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <h3 className="mt-3 text-2xl font-bold text-cyan-400">
        {value}
      </h3>
    </div>
  );
}

function CategoryCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#07111f] p-8">
      <h3 className="text-2xl font-semibold text-cyan-400">
        {title}
      </h3>

      <ul className="mt-6 space-y-3 text-slate-300">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function PrepCard({
  title,
}: {
  title: string;
}) {
  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-[#07111f] p-8 text-center">
      <h3 className="text-xl font-semibold">
        {title}
      </h3>
    </div>
  );
}