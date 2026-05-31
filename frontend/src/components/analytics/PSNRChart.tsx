"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { file: "file_1", ml: 95.89, rand: 95.7 },
  { file: "file_9", ml: 95.89, rand: 95.7 },
  { file: "file_14", ml: 98.57, rand: 97.17 },
  { file: "file_11", ml: 92.09, rand: 91.59 },
  { file: "file_16", ml: 92.01, rand: 90.99 },
];

export default function PSNRChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data}>
        <XAxis dataKey="file" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="ml" fill="#22d3ee" />
        <Bar dataKey="rand" fill="#a855f7" />
      </BarChart>
    </ResponsiveContainer>
  );
}