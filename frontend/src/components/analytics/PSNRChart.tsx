"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface Props {
  jobs: any[];
}

export default function PSNRChart({
  jobs,
}: Props) {
  const data = jobs
    .filter(
      (job) =>
        job.type === "encode" &&
        job.psnr
    )
    .slice(0, 10)
    .map(
      (
        job: any,
        index: number
      ) => ({
        file: `J${index + 1}`,
        psnr: Number(
          job.psnr
        ),
      })
    );

  return (
    <ResponsiveContainer
      width="100%"
      height={320}
    >
      <BarChart data={data}>
        <XAxis dataKey="file" />
        <YAxis />
        <Tooltip />

        <Bar
          dataKey="psnr"
          fill="#22d3ee"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}