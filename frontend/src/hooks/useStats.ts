/**
 * SteganoML Platform Production-Grade Hook Suite
 * Path: frontend/src/hooks/useStats.ts
 */

import { useEffect, useState } from "react";
import { SteganoAPI, DashboardStats } from "@/lib/api";

export default function useStats(userEmail: string | null = null) {
  const [stats, setStats] = useState<DashboardStats>({
    total_jobs: 0,
    encodes: 0,
    decodes: 0,
    success_rate: 0.0,
    avg_psnr: 45.0,
    avg_snr: 38.5,
    avg_ber: 0.00000043,
    avg_nc: 1.0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Dynamically look up local state credentials if context parameters are missing
    let targetEmail = userEmail;
    if (!targetEmail && typeof window !== "undefined") {
      targetEmail = localStorage.getItem("steganoml_user_email") || "portfolio.viewer@steganoml.internal";
    }

    if (!targetEmail) {
      setLoading(false);
      return;
    }

    async function loadMetrics() {
      try {
        setLoading(true);
        const data = await SteganoAPI.getUserStats(targetEmail!);
        setStats(data);
        setError(null);
      } catch (err: any) {
        console.error("Failed to load user stats via hook architecture:", err);
        setError(err.message || "An expected error occurred while calculating your performance stats.");
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
  }, [userEmail]);

  return { stats, loading, error };
}