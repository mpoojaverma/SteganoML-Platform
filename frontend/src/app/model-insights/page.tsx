"use client";

const featureImportance = [
  {
    title: "RMS Energy",
    description:
      "Measures signal energy and helps identify acoustically stable regions suitable for embedding.",
  },
  {
    title: "MFCC Mean",
    description:
      "Captures perceptual characteristics of audio and contributes strongly to frame classification.",
  },
  {
    title: "MFCC Variance",
    description: "Represents variation in cepstral coefficients across frames.",
  },
  {
    title: "Spectral Centroid",
    description:
      "Indicates the brightness of an audio signal and assists in stability prediction.",
  },
  {
    title: "Spectral Bandwidth",
    description:
      "Measures spectral spread and helps characterize frame complexity.",
  },
  {
    title: "Zero Crossing Rate",
    description:
      "Tracks signal sign changes and provides temporal information about audio activity.",
  },
];

const metrics = [
  {
    title: "ROC-AUC",
    value: "> 0.85",
    description:
      "Excellent classifiers generally achieve ROC-AUC scores above 0.85.",
  },
  {
    title: "Precision",
    value: "High",
    description:
      "Measures how many predicted stable frames are actually stable.",
  },
  {
    title: "Recall",
    value: "High",
    description: "Measures how effectively stable frames are detected.",
  },
  {
    title: "F1 Score",
    value: "Balanced",
    description: "Provides a balance between precision and recall.",
  },
];

const comparison = [
  ["Feature", "Random Forest", "XGBoost", "CatBoost"],
  ["Training", "Moderate", "Fast", "Fast"],
  ["Tuning", "More Required", "Moderate", "Minimal"],
  ["Robustness", "Good", "Very Good", "Excellent"],
  ["Research Usage", "Common", "Popular", "Preferred"],
];

export default function ModelInsightsPage() {
  return (
    <main className="min-h-screen bg-[#020817] text-white">
      {/* Background Glow */}

      <div className="absolute left-[-200px] top-[-200px] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[150px]" />

      <div className="absolute right-[-200px] top-[100px] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[150px]" />

      {/* Hero */}

      <section className="relative z-10 mx-auto max-w-7xl px-8 py-24">
        <div className="rounded-[40px] border border-cyan-500/20 bg-gradient-to-br from-[#07111f] via-[#081528] to-[#07111f] p-16">
          <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400">
            Machine Learning Research
          </span>

          <h1 className="mt-8 text-7xl font-bold">Model Insights</h1>

          <h2 className="mt-5 text-4xl font-semibold text-cyan-400">
            Understanding the Machine Learning Engine Behind SteganoML
          </h2>

          <p className="mt-8 max-w-5xl text-xl leading-relaxed text-slate-400">
            SteganoML uses a CatBoost-based classification model to identify
            acoustically stable audio frames before payload insertion. The model
            helps improve robustness, transparency and embedding quality by
            selecting optimal embedding locations.
          </p>
        </div>
      </section>

      {/* Model Overview */}

      <section className="mx-auto max-w-7xl px-8">
        <h2 className="mb-10 text-center text-4xl font-bold">Model Overview</h2>

        <div className="grid grid-cols-4 gap-6">
          <InfoCard title="Algorithm" value="CatBoost" />

          <InfoCard title="Learning Type" value="Supervised" />

          <InfoCard title="Task" value="Binary Classification" />

          <InfoCard title="Output" value="Stable / Unstable" />
        </div>
      </section>

      {/* Feature Importance */}

      <section className="mx-auto mt-24 max-w-7xl px-8">
        <h2 className="mb-10 text-center text-4xl font-bold">
          Feature Importance
        </h2>

        <div className="grid grid-cols-3 gap-6">
          {featureImportance.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-white/10 bg-[#07111f] p-8"
            >
              <h3 className="text-xl font-semibold text-cyan-400">
                {feature.title}
              </h3>

              <p className="mt-4 text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Evaluation Metrics */}

      <section className="mx-auto mt-24 max-w-7xl px-8">
        <h2 className="mb-10 text-center text-4xl font-bold">
          Evaluation Metrics
        </h2>

        <div className="grid grid-cols-2 gap-6">
          {metrics.map((metric) => (
            <div
              key={metric.title}
              className="rounded-3xl border border-cyan-500/20 bg-[#07111f] p-8"
            >
              <h3 className="text-3xl font-bold text-cyan-400">
                {metric.title}
              </h3>

              <p className="mt-4 text-lg font-medium">{metric.value}</p>

              <p className="mt-4 text-slate-400">{metric.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Confusion Matrix */}

      <section className="mx-auto mt-24 max-w-5xl px-8">
        <h2 className="mb-10 text-center text-4xl font-bold">
          Confusion Matrix Concept
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <MatrixCard title="True Positive" />
          <MatrixCard title="False Positive" />
          <MatrixCard title="False Negative" />
          <MatrixCard title="True Negative" />
        </div>
      </section>

      {/* Comparison */}

      <section className="mx-auto mt-24 max-w-7xl px-8">
        <h2 className="mb-10 text-center text-4xl font-bold">Why CatBoost?</h2>

        <div className="overflow-hidden rounded-[32px] border border-white/10">
          <table className="w-full">
            <tbody>
              {comparison.map((row, idx) => (
                <tr key={idx} className="border-b border-white/10">
                  {row.map((item, cellIndex) => (
                    <td
                        key={`${idx}-${cellIndex}`}
                        className="p-5">
                      {item}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Research Contribution */}

      <section className="mx-auto mt-24 mb-24 max-w-7xl px-8">
        <div className="rounded-[40px] border border-cyan-500/20 bg-[#07111f] p-12">
          <h2 className="text-4xl font-bold">Research Contribution</h2>

          <p className="mt-6 text-lg leading-relaxed text-slate-400">
            SteganoML introduces machine-learning-guided frame selection for
            audio steganography. Instead of embedding data randomly, the system
            predicts acoustically stable regions before insertion, improving
            robustness while preserving audio quality.
          </p>
        </div>
      </section>
    </main>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#07111f] p-8 text-center">
      <p className="text-sm text-slate-500">{title}</p>

      <h3 className="mt-3 text-2xl font-bold text-cyan-400">{value}</h3>
    </div>
  );
}

function MatrixCard({ title }: { title: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#07111f] p-10 text-center">
      <h3 className="text-2xl font-semibold text-cyan-400">{title}</h3>
    </div>
  );
}
