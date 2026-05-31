"use client";

import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface Props {
  jobs: any[];
}

export default function SNRScatter({
  jobs,
}: Props) {
  const data = jobs
    .filter(
      (job) =>
        job.type === "encode" &&
        job.psnr &&
        job.snr
    )
    .map((job: any) => ({
      psnr: Number(
        job.psnr
      ),
      snr: Number(
        job.snr
      ),
    }));

  return (
    <ResponsiveContainer
      width="100%"
      height={320}
    >
      <ScatterChart>

        <XAxis dataKey="psnr" />

        <YAxis dataKey="snr" />

        <Tooltip />

        <Scatter
          data={data}
          fill="#22d3ee"
        />

      </ScatterChart>
    </ResponsiveContainer>
  );
}