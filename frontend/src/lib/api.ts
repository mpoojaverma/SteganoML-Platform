import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export const JOB_EXPORT_URL = "http://127.0.0.1:8000/api/jobs/export";

export const api = axios.create({
  baseURL: API_BASE,
});

export async function encodeAudio(formData: FormData) {
  const response = await api.post("/encode/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function decodeAudio(formData: FormData) {
  const response = await api.post("/decode/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export function getDownloadUrl(outputPath: string) {
  const filename = outputPath.split("\\").pop();

  return `${API_BASE}/encode/download/${filename}`;
}
