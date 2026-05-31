"use client";

const encodeSteps = [
  {
    title: "Upload Audio",
    description:
      "The user uploads a WAV audio file which acts as the carrier medium for the secret payload.",
  },
  {
    title: "AES Encryption",
    description:
      "The secret message is encrypted using a password-derived key before embedding.",
  },
  {
    title: "ML Frame Analysis",
    description:
      "CatBoost analyzes audio features and identifies acoustically stable regions.",
  },
  {
    title: "Adaptive Embedding",
    description:
      "Encrypted bits are embedded into selected regions using adaptive LSB techniques.",
  },
  {
    title: "Stego Audio",
    description:
      "The final audio file contains the hidden encrypted payload while preserving audio quality.",
  },
];

const decodeSteps = [
  {
    title: "Upload Stego Audio",
    description:
      "The encoded audio is uploaded for extraction.",
  },
  {
    title: "Password Verification",
    description:
      "The supplied password is used to derive the decryption key.",
  },
  {
    title: "Region Recovery",
    description:
      "The same embedding logic is used to locate hidden payload regions.",
  },
  {
    title: "Bit Extraction",
    description:
      "Embedded bits are recovered from the audio signal.",
  },
  {
    title: "Message Recovery",
    description:
      "The encrypted payload is decrypted and the original message is restored.",
  },
];

const technologies = [
  "Next.js",
  "FastAPI",
  "CatBoost",
  "Supabase",
  "Python",
  "Tailwind CSS",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#020817] text-white">

      {/* HERO */}

      <section className="mx-auto max-w-7xl px-8 py-24">

        <div className="rounded-[40px] border border-cyan-500/20 bg-gradient-to-br from-[#07111f] via-[#081528] to-[#07111f] p-16">

          <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400">
            Research Project
          </span>

          <h1 className="mt-8 text-7xl font-bold">
            SteganoML
          </h1>

          <h2 className="mt-4 max-w-5xl text-4xl font-semibold text-cyan-400">
            Adaptive Machine Learning Guided Audio Steganography Platform
          </h2>

          <p className="mt-8 max-w-4xl text-xl leading-relaxed text-slate-400">
            SteganoML combines machine learning, adaptive embedding,
            cryptography and signal processing to securely hide
            confidential information inside audio while maintaining
            imperceptibility and robustness.
          </p>

        </div>

      </section>

      {/* VISION */}

      <section className="mx-auto max-w-7xl px-8">

        <div className="rounded-[32px] border border-white/10 bg-[#07111f] p-12">

          <h2 className="mb-8 text-4xl font-bold">
            Project Vision
          </h2>

          <p className="text-lg leading-relaxed text-slate-400">
            Traditional audio steganography often relies on fixed or
            randomly selected embedding locations. SteganoML introduces
            an intelligent machine-learning-based strategy that predicts
            acoustically stable regions before payload insertion,
            improving transparency, robustness and security.
          </p>

        </div>

      </section>

      {/* ENCODING */}

      <section className="mx-auto mt-24 max-w-7xl px-8">

        <h2 className="mb-10 text-center text-4xl font-bold">
          Encoding Pipeline
        </h2>

        <div className="grid grid-cols-5 gap-5">

          {encodeSteps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-3xl border border-cyan-500/20 bg-[#07111f] p-6 transition hover:border-cyan-400"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-black font-bold">
                {index + 1}
              </div>

              <h3 className="font-semibold">
                {step.title}
              </h3>

              <p className="mt-3 text-sm text-slate-400">
                {step.description}
              </p>
            </div>
          ))}

        </div>

      </section>

      {/* DECODING */}

      <section className="mx-auto mt-24 max-w-7xl px-8">

        <h2 className="mb-10 text-center text-4xl font-bold">
          Decoding Pipeline
        </h2>

        <div className="grid grid-cols-5 gap-5">

          {decodeSteps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-3xl border border-purple-500/20 bg-[#07111f] p-6 transition hover:border-purple-400"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500 text-white font-bold">
                {index + 1}
              </div>

              <h3 className="font-semibold">
                {step.title}
              </h3>

              <p className="mt-3 text-sm text-slate-400">
                {step.description}
              </p>
            </div>
          ))}

        </div>

      </section>

      {/* METRICS */}

      <section className="mx-auto mt-24 max-w-7xl px-8">

        <h2 className="mb-10 text-center text-4xl font-bold">
          Quality Metrics
        </h2>

        <div className="grid grid-cols-2 gap-6">

          <MetricCard
            title="PSNR"
            range="Excellent > 40 dB"
            description="Measures similarity between original and stego audio. Higher values indicate lower distortion."
          />

          <MetricCard
            title="SNR"
            range="Excellent > 30 dB"
            description="Measures retained signal quality after embedding. Higher is better."
          />

          <MetricCard
            title="BER"
            range="Ideal ≈ 0"
            description="Bit Error Rate measures extraction errors. Lower values indicate more reliable recovery."
          />

          <MetricCard
            title="NC"
            range="Ideal = 1.0"
            description="Normalized Correlation measures similarity between embedded and recovered data."
          />

        </div>

      </section>

      {/* COMPARISON */}

      <section className="mx-auto mt-24 max-w-7xl px-8">

        <h2 className="mb-10 text-center text-4xl font-bold">
          Traditional vs SteganoML
        </h2>

        <div className="overflow-hidden rounded-[32px] border border-white/10">

          <table className="w-full">

            <thead className="bg-[#081528]">
              <tr>
                <th className="p-5 text-left">
                  Traditional LSB
                </th>
                <th className="p-5 text-left">
                  SteganoML
                </th>
              </tr>
            </thead>

            <tbody>

              <tr className="border-t border-white/10">
                <td className="p-5">
                  Random Locations
                </td>
                <td className="p-5">
                  ML Selected Regions
                </td>
              </tr>

              <tr className="border-t border-white/10">
                <td className="p-5">
                  Fixed Strategy
                </td>
                <td className="p-5">
                  Adaptive Strategy
                </td>
              </tr>

              <tr className="border-t border-white/10">
                <td className="p-5">
                  Lower Robustness
                </td>
                <td className="p-5">
                  Higher Robustness
                </td>
              </tr>

              <tr className="border-t border-white/10">
                <td className="p-5">
                  No Intelligence
                </td>
                <td className="p-5">
                  Machine Learning Guided
                </td>
              </tr>

            </tbody>

          </table>

        </div>

      </section>

      {/* TECH STACK */}

      <section className="mx-auto mt-24 mb-24 max-w-7xl px-8">

        <h2 className="mb-10 text-center text-4xl font-bold">
          Technology Stack
        </h2>

        <div className="grid grid-cols-3 gap-6">

          {technologies.map((tech) => (
            <div
              key={tech}
              className="rounded-3xl border border-white/10 bg-[#07111f] p-8 text-center hover:border-cyan-400"
            >
              {tech}
            </div>
          ))}

        </div>

      </section>

    </main>
  );
}

function MetricCard({
  title,
  range,
  description,
}: {
  title: string;
  range: string;
  description: string;
}) {
  return (
    <div className="rounded-[32px] border border-cyan-500/20 bg-[#07111f] p-8">

      <h3 className="text-3xl font-bold text-cyan-400">
        {title}
      </h3>

      <p className="mt-4 font-medium">
        {range}
      </p>

      <p className="mt-4 text-slate-400">
        {description}
      </p>


    </div>
  );
}

