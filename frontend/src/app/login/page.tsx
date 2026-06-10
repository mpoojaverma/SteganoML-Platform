"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  async function handleLogin() {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoginError(error.message);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setLoginError("Login Failed");
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
          <h1 className="text-center text-4xl font-bold">Welcome Back</h1>

          <p className="mt-3 text-center text-slate-400">
            Sign in to SteganoML
          </p>

          <div className="mt-8">
            <label htmlFor="login-email">Email</label>

            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1327] px-4 py-3"
            />
          </div>

          <div className="mt-5">
            <label htmlFor="login-password">Password</label>

            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1327] px-4 py-3"
            />
          </div>

          {loginError && (
            <div role="alert" className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {loginError}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-8 w-full rounded-xl bg-cyan-500 py-3 font-semibold text-black"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="mt-6 text-center text-sm text-slate-500">
            New here?
            <Link href="/register" className="ml-2 text-cyan-400">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
