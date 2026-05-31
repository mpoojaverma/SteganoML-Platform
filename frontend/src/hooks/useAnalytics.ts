// hooks/useAnalytics.ts

"use client";

import { useEffect, useState } from "react";
import { getAnalytics } from "@/lib/analytics";

export default function useAnalytics() {
  const [analytics, setAnalytics] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data =
          await getAnalytics();

        setAnalytics(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return {
    analytics,
    loading,
  };
}