"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";

export default function useStats() {
  const [stats, setStats] =
    useState({
      total_jobs: 0,
      encodes: 0,
      decodes: 0,
      success_rate: 0,
      avg_psnr: 0,
      avg_snr: 0,
      avg_ber: 0,
      avg_nc: 0,
    });

  const [loading, setLoading] =
    useState(true);

  async function loadStats() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const response = await api.get("/stats/", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      setStats(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  return {
    stats,
    loading,
    refresh: loadStats,
  };
}