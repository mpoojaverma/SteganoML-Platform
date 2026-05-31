"use client";

import { useEffect, useState } from "react";

import { getJobs } from "@/lib/jobs";

export default function useJobs() {
  const [jobs, setJobs] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function loadJobs() {
    try {
      const data =
        await getJobs();

      setJobs(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  return {
    jobs,
    loading,
    refresh: loadJobs,
  };
}