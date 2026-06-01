/**
 * SteganoML Platform Production-Grade Hook Suite
 * Path: frontend/src/hooks/useEncode.ts
 */

import { useState } from "react";
import { SteganoAPI, EncodeResponse } from "@/lib/api";

export default function useEncode() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EncodeResponse | null>(null);

  const encode = async (
    file: File,
    secretMessage: string,
    password: string,
    userEmail: string,
    method: "ml" | "randomized" = "ml"
  ) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await SteganoAPI.encodeAudio(file, secretMessage, password, userEmail, method);
      setResult(response);
      return response;
    } catch (err: any) {
      const msg = err.message || "Embedding process halted due to capacity constraints or server exceptions.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { encode, loading, error, result, setError, setResult };
}