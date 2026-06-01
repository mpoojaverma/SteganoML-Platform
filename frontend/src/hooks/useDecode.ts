/**
 * SteganoML Platform Production-Grade Hook Suite
 * Path: frontend/src/hooks/useDecode.ts
 */

import { useState } from "react";
import { SteganoAPI, DecodeResponse } from "@/lib/api";

export default function useDecode() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DecodeResponse | null>(null);

  const decode = async (file: File, password: string, userEmail: string, method: "ml" | "randomized" = "ml") => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await SteganoAPI.decodeAudio(file, password, userEmail, method);
      setResult(response);
      return response;
    } catch (err: any) {
      const msg = err.message || "Extraction procedure defaulted out due to data validation flags.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { decode, loading, error, result, setError, setResult };
}