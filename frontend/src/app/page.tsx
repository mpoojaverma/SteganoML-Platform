import Link from "next/link";
import AuthRedirect from "@/components/auth/AuthRedirect";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020817]">
      <AuthRedirect />
      {/* BACKGROUND GLOW */}

      <div className="absolute left-[-200px] top-[-200px] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="absolute right-[-200px] top-[100px] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[140px]" />

      {/* NAVBAR */}

      <nav className="relative z-20 border-b border-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
              <span className="font-bold text-cyan-400">S</span>
            </div>

            <div>
              <h1 className="font-semibold">SteganoML</h1>

              <p className="text-xs text-slate-500">
                Secure Audio Steganography Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl bg-cyan-500 px-5 py-2 text-sm font-semibold text-black"
            >
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}

      <section className="relative z-20 mx-auto max-w-7xl px-8 pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* LEFT */}

          <div>
            <div className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
              Published • Research Validated
            </div>

            <h1 className="mt-8 text-6xl font-black leading-tight">
              Adaptive
              <span className="text-cyan-400"> ML-guided</span>
              <br />
              Audio Steganography
            </h1>

            <p className="mt-6 max-w-xl text-lg text-slate-400">
              Securely embed encrypted messages inside audio files using
              adaptive machine-learning-based steganography. Designed for
              research, education, and secure communication workflows.
            </p>

            <div className="mt-10 flex gap-4">
              <Link
                href="/login"
                className="rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-black transition hover:brightness-110"
              >
                Start Encoding
              </Link>

              <Link
                href="/about"
                className="rounded-xl border border-white/10 px-7 py-4 text-white"
              >
                About SteganoML
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-400">
              <div>
                ROC-AUC <span className="text-cyan-400">0.9581</span>
              </div>

              <div>
                AES-256 <span className="text-cyan-400">Active</span>
              </div>

              <div>
                PSNR <span className="text-cyan-400">94.69 dB</span>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="relative">
            <div className="absolute inset-0 rounded-[36px] bg-cyan-500/10 blur-3xl" />

            <div className="relative rounded-[36px] border border-cyan-500/20 bg-[#071122]/90 p-8 backdrop-blur-xl">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Live Encode Pipeline</h2>

                <span className="text-emerald-400">● LIVE</span>
              </div>

              {[
                "Audio Validation",
                "AES-256 Encryption",
                "ML Frame Analysis",
                "Adaptive Embedding",
                "Quality Metrics",
              ].map((item, index) => (
                <div
                  key={item}
                  className="mb-6 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        index < 2
                          ? "bg-emerald-500/20 text-emerald-400"
                          : index === 2
                            ? "bg-purple-500/20 text-purple-300"
                            : "bg-white/5 text-slate-500"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <span>{item}</span>
                  </div>

                  <div className="w-28 rounded-full bg-white/5">
                    <div
                      className={`h-2 rounded-full ${
                        index < 2
                          ? "w-full bg-emerald-400"
                          : index === 2
                            ? "w-1/2 bg-purple-400"
                            : "w-0"
                      }`}
                    />
                  </div>
                </div>
              ))}

              <div className="mt-10 grid grid-cols-4 gap-3">
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs text-slate-500">PSNR</p>

                  <p className="mt-2 text-2xl font-bold text-cyan-400">94.69</p>
                </div>

                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs text-slate-500">SNR</p>

                  <p className="mt-2 text-2xl font-bold text-cyan-400">72.03</p>
                </div>

                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs text-slate-500">BER</p>

                  <p className="mt-2 text-2xl font-bold text-purple-400">
                    1e-6
                  </p>
                </div>

                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs text-slate-500">NC</p>

                  <p className="mt-2 text-2xl font-bold text-emerald-400">
                    1.000
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS */}

      <section className="mx-auto mt-24 max-w-7xl px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            ["94.69", "Average PSNR"],
            ["72.03", "Average SNR"],
            ["1e−6", "BER"],
            ["0.9581", "ROC-AUC"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-3xl border border-white/10 bg-[#071122] p-6 text-center"
            >
              <h3 className="text-4xl font-bold text-cyan-400">{value}</h3>

              <p className="mt-2 text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}

      <section className="mx-auto mt-24 max-w-7xl px-8 pb-8">
        <h2 className="mb-12 text-center text-4xl font-bold">
          Core Research Powered Features
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "ML-guided Frame Selection",
              description:
                "Uses machine learning to identify optimal audio regions for secure message embedding.",
            },
            {
              title: "Adaptive LSB Embedding",
              description:
                "Dynamically embeds encrypted data while minimizing perceptible audio distortion.",
            },
            {
              title: "AES-256 Encryption",
              description:
                "Encrypts message payloads before embedding to provide an additional security layer.",
            },
            {
              title: "Live Quality Analytics",
              description:
                "Tracks PSNR, SNR, BER and other quality metrics during encoding and decoding.",
            },
            {
              title: "Real-time Pipeline Monitoring",
              description:
                "Visualizes each processing stage from audio validation to message extraction.",
            },
            {
              title: "Noise Robustness Testing",
              description:
                "Evaluates resilience against compression, noise injection and audio modifications.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-white/10 bg-[#071122] p-6 transition hover:border-cyan-500/20"
            >
              <h3 className="font-semibold">{feature.title}</h3>

              <p className="mt-3 text-sm text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* RESEARCH RESOURCES */}

      <section className="mx-auto mt-8 max-w-7xl px-8 pb-24">
        <h2 className="mb-12 text-center text-4xl font-bold">
          Research Resources
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <Link
            href="/about"
            className="rounded-3xl border border-white/10 bg-[#071122] p-8 transition hover:border-cyan-500/30"
          >
            <h3 className="text-xl font-semibold">About SteganoML</h3>

            <p className="mt-4 text-slate-400">
              Complete project overview, encoding pipeline, decoding workflow,
              IEEE publication and quality metrics.
            </p>
          </Link>

          <Link
            href="/model-insights"
            className="rounded-3xl border border-white/10 bg-[#071122] p-8 transition hover:border-cyan-500/30"
          >
            <h3 className="text-xl font-semibold">Model Insights</h3>

            <p className="mt-4 text-slate-400">
              CatBoost performance, ROC-AUC evaluation, confusion matrix and
              feature importance analysis.
            </p>
          </Link>

          <Link
            href="/research-dataset"
            className="rounded-3xl border border-white/10 bg-[#071122] p-8 transition hover:border-cyan-500/30"
          >
            <h3 className="text-xl font-semibold">Research Dataset</h3>

            <p className="mt-4 text-slate-400">
              Dataset construction, audio feature extraction, preprocessing and
              training workflow.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
