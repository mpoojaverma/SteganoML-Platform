"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [user, setUser] =
    useState<any>(null);

  useEffect(() => {
    async function loadUser() {
      const {
        data,
      } =
        await supabase.auth.getUser();

      setUser(data.user);
    }

    loadUser();
  }, []);

  return (
    <AppShell>

      <div className="max-w-4xl">

        <h1 className="mb-8 text-5xl font-bold">
          Profile
        </h1>

        <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-8">

          <div className="flex items-center gap-6">

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500 text-3xl font-bold text-black">
              {user?.user_metadata?.full_name
                ?.charAt(0)
                ?.toUpperCase() || "U"}
            </div>

            <div>

              <h2 className="text-3xl font-semibold">
                {
                  user?.user_metadata
                    ?.full_name
                }
              </h2>

              <p className="mt-2 text-slate-400">
                {user?.email}
              </p>

            </div>

          </div>

        </div>

      </div>

    </AppShell>
  );
}