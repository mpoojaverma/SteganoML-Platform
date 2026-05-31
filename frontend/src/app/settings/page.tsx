"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [name, setName] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setEmail(
        user.email || ""
      );

      setName(
        user.user_metadata
          ?.full_name || ""
      );

      setLoading(false);
    }

    loadUser();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/login");
  }

  return (
    <AppShell>
      <div className="space-y-6">

        <div>
          <h1 className="text-5xl font-bold">
            Settings
          </h1>

          <p className="mt-2 text-slate-400">
            Manage account and
            application preferences.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-6">

          <h2 className="mb-5 text-xl font-semibold">
            Account Information
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-5">

              <div>
                <label className="text-sm text-slate-400">
                  Full Name
                </label>

                <input
                  value={name}
                  disabled
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#07111f] px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400">
                  Email Address
                </label>

                <input
                  value={email}
                  disabled
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#07111f] px-4 py-3 text-white"
                />
              </div>

            </div>
          )}

        </div>

        <div className="rounded-3xl border border-red-500/20 bg-[#0b1327] p-6">

          <h2 className="mb-5 text-xl font-semibold text-red-400">
            Danger Zone
          </h2>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-500 px-5 py-3 font-medium text-white transition hover:bg-red-600"
          >
            Logout
          </button>

        </div>

      </div>
    </AppShell>
  );
}