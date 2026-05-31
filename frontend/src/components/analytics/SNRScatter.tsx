"use client";

import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { psnr: 95.89, snr: 76.59 },
  { psnr: 95.7, snr: 76.4 },
  { psnr: 98.57, snr: 79.96 },
  { psnr: 97.17, snr: 78.55 },
  { psnr: 92.01, snr: 57.88 },
];

export default function SNRScatter() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ScatterChart>
        <XAxis dataKey="psnr" />
        <YAxis dataKey="snr" />
        <Tooltip />
        <Scatter data={data} fill="#22d3ee" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}