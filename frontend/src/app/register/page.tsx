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

  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

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
        setRegisterError(error.message);
        return;
      }

      setRegisterSuccess(
        "Account created. Verify your email before logging in."
      );

      router.push("/login");
    } catch (err) {
      console.error(err);
      setRegisterError(
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

            <label htmlFor="reg-name">
              Full Name
            </label>

            <input
              id="reg-name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1327] px-4 py-3 focus:border-cyan-500/50 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#071122] outline-none transition-all"
            />

          </div>

          <div className="mt-5">

            <label htmlFor="reg-email">
              Email
            </label>

            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1327] px-4 py-3 focus:border-cyan-500/50 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#071122] outline-none transition-all"
            />

          </div>

          <div className="mt-5">

            <label htmlFor="reg-password">
              Password
            </label>

            <input
              id="reg-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1327] px-4 py-3 focus:border-cyan-500/50 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#071122] outline-none transition-all"
            />

          </div>

          {registerError && (
            <div role="alert" className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {registerError}
            </div>
          )}

          {registerSuccess && (
            <div role="status" className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
              {registerSuccess}
            </div>
          )}

          <button
            onClick={handleRegister}
            disabled={loading}
            className="mt-8 w-full rounded-xl bg-cyan-500 py-3 font-semibold text-black flex items-center justify-center gap-2 transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#071122] outline-none cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating...</span>
              </>
            ) : (
              "Create Account"
            )}
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