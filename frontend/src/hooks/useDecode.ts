"use client";

import { useState } from "react";
import { decodeAudio } from "@/lib/api";
import { supabase } from "@/lib/supabase";

export default function useDecode() {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [result, setResult] =
    useState<any>(null);

  async function runDecode(
    audioFile: File,
    password: string,
    method: "ml" | "random"
  ) {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        throw new Error(
          "User not logged in"
        );
      }

      const formData =
        new FormData();

      formData.append(
        "audio_file",
        audioFile
      );

      formData.append(
        "password",
        password
      );

      formData.append(
        "method",
        method
      );

      formData.append(
        "user_email",
        user.email || ""
      );

      const data =
        await decodeAudio(
          formData
        );

      setResult(data);

      return data;
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data
          ?.detail ||
          err?.message ||
          "Decode failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    runDecode,
    loading,
    error,
    result,
  };
}