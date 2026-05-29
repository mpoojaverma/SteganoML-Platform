"use client";

import { useState } from "react";
import { encodeAudio } from "@/lib/api";

export default function useEncode() {
  const [loading, setLoading] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [result, setResult] =
    useState<any>(null);

  async function runEncode(
    audioFile: File,
    message: string,
    password: string,
    method: "ml" | "random"
  ) {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();

      formData.append(
        "audio_file",
        audioFile
      );

      formData.append(
        "secret_message",
        message
      );

      formData.append(
        "password",
        password
      );

      formData.append(
        "method",
        method
      );

      const data =
        await encodeAudio(formData);

      setResult(data);

      return data;
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Encoding failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    runEncode,
    loading,
    error,
    result,
  };
}