"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace("/dashboard");
      }
    }
    checkSession();
  }, [router]);

  // Password strength checks
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  async function handleRegister() {
    if (!name.trim()) {
      setRegisterError("Full Name is required.");
      return;
    }
    if (!email.trim()) {
      setRegisterError("Email is required.");
      return;
    }
    if (!hasMinLength || !hasUppercase || !hasNumber || !hasSpecial) {
      setRegisterError("Password must meet all security requirements.");
      return;
    }

    try {
      setLoading(true);
      setRegisterError("");
      setRegisterSuccess("");

      const { error } = await supabase.auth.signUp({
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

      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err) {
      console.error(err);
      setRegisterError("Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between overflow-y-auto bg-[#020817] px-6 py-12">
      <div className="absolute left-[-250px] top-[-250px] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[160px] pointer-events-none" />
      <div className="absolute right-[-250px] bottom-[-250px] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[160px] pointer-events-none" />

      {/* TOP: LOGO */}
      <Link href="/" className="relative z-10 flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-cyan-400 outline-none rounded-xl p-1 mb-8 shrink-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 transition group-hover:scale-105 shrink-0">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
          >
            <rect x="2" y="2" width="20" height="20" rx="6" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.5" className="stroke-cyan-500/25" />
            <path
              d="M5 12c1.5-4 3.5-4 5 0s3.5 4 5 0 3.5-4 5 0"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-cyan-400"
            />
            <path
              d="M7 12c1.2-2.5 2.8-2.5 4 0s2.8 2.5 4 0 2.8-2.5 4 0"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="1.5 1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-cyan-300/50"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide leading-none">SteganoML</h1>
          <p className="text-[10px] text-slate-500 mt-1">Audio Steganography Platform</p>
        </div>
      </Link>

      {/* CENTER: FORM */}
      <div className="relative z-10 w-full max-w-md my-auto">
        <div className="rounded-[32px] border border-cyan-500/20 bg-[#071122]/90 p-8 shadow-2xl">
          <h2 className="text-center text-4xl font-bold tracking-tight">Create Account</h2>
          <p className="mt-3 text-center text-slate-400">Join the secure steganography network</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
            className="mt-8 space-y-5"
          >
            <div>
              <label htmlFor="reg-name" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Full Name
              </label>
              <input
                id="reg-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1327] px-4 py-3 focus:border-cyan-500/50 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#071122] outline-none transition-all"
                placeholder="Alex Johnson"
                required
              />
            </div>

            <div>
              <label htmlFor="reg-email" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Email
              </label>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1327] px-4 py-3 focus:border-cyan-500/50 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#071122] outline-none transition-all"
                placeholder="name@domain.com"
                required
              />
            </div>

            <div>
              <label htmlFor="reg-password" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0b1327] pl-4 pr-12 py-3 focus:border-cyan-500/50 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#071122] outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition focus-visible:text-white outline-none cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* PASSWORD STRENGTH CHECKLIST */}
              {password.length > 0 && (
                <div className="mt-3 space-y-2 rounded-xl bg-white/[0.02] border border-white/5 p-3 text-xs text-slate-400">
                  <p className="font-semibold text-slate-300">Password Requirements:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className={`h-1.5 w-1.5 rounded-full transition-colors ${hasMinLength ? "bg-emerald-400" : "bg-slate-600"}`} />
                      <span className={hasMinLength ? "text-slate-200" : "text-slate-500"}>8+ characters</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`h-1.5 w-1.5 rounded-full transition-colors ${hasUppercase ? "bg-emerald-400" : "bg-slate-600"}`} />
                      <span className={hasUppercase ? "text-slate-200" : "text-slate-500"}>Uppercase letter</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`h-1.5 w-1.5 rounded-full transition-colors ${hasNumber ? "bg-emerald-400" : "bg-slate-600"}`} />
                      <span className={hasNumber ? "text-slate-200" : "text-slate-500"}>Number (0-9)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`h-1.5 w-1.5 rounded-full transition-colors ${hasSpecial ? "bg-emerald-400" : "bg-slate-600"}`} />
                      <span className={hasSpecial ? "text-slate-200" : "text-slate-500"}>Special symbol</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {registerError && (
              <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-400">
                {registerError}
              </div>
            )}

            {registerSuccess && (
              <div role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-sm text-emerald-400">
                {registerSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-500 py-3.5 font-semibold text-black flex items-center justify-center gap-2 transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#071122] outline-none cursor-pointer text-sm shadow-lg shadow-cyan-500/20 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Account...</span>
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="text-center text-sm text-slate-500 pt-2 border-t border-white/5">
              Already have an account?{" "}
              <Link href="/login" className="text-cyan-400 font-medium hover:underline hover:text-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-400 outline-none rounded px-1 py-0.5">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* BOTTOM: FOOTER */}
      <div className="relative z-10 w-full max-w-md mt-8 pt-6 border-t border-white/5 text-center shrink-0">
        <p className="text-[10.5px] text-slate-500 font-mono tracking-tight">
          © {new Date().getFullYear()} SteganoML. All Rights Reserved.
        </p>
        <p className="text-[10px] text-slate-500 mt-1">
          Developed as part of the SteganoML research project.
        </p>
      </div>
    </main>
  );
}