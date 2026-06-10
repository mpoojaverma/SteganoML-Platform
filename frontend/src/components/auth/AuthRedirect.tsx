"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          router.replace("/dashboard");
        }
      } catch (err) {
        console.error("Auth redirect failed:", err);
      }
    }

    checkSession();
  }, [router]);

  return null;
}
