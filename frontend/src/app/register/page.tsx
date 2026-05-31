"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleRegister() {
    try {
      setLoading(true);

      const {
        error,
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert(
        "Account created. Verify your email before logging in."
      );

      router.push("/login");
    } catch (err) {
      console.error(err);

      alert(
        "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020817] px-6">

      <div className="absolute left-[-250px] top-[-250px] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[160px]" />

      <div className="absolute right-[-250px] bottom-[-250px] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[160px]" />

      <div className="relative z-10 w-full max-w-md">

        <div className="rounded-[32px] border border-cyan-500/20 bg-[#071122]/90 p-8">

          <h1 className="text-center text-4xl font-bold">
            Create Account
          </h1>

          <p className="mt-3 text-center text-slate-400">
            Join SteganoML
          </p>

          <div className="mt-8">

            <label>
              Full Name
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1327] px-4 py-3"
            />

          </div>

          <div className="mt-5">

            <label>
              Email
            </label>

            <input
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1327] px-4 py-3"
            />

          </div>

          <div className="mt-5">

            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1327] px-4 py-3"
            />

          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="mt-8 w-full rounded-xl bg-cyan-500 py-3 font-semibold text-black"
          >
            {loading
              ? "Creating..."
              : "Create Account"}
          </button>

          <div className="mt-6 text-center text-sm text-slate-500">

            Already have an account?

            <Link
              href="/login"
              className="ml-2 text-cyan-400"
            >
              Login
            </Link>

          </div>

        </div>

      </div>

    </main>
  );
}