"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) { setError("Email is required."); return; }
    if (!password.trim()) { setError("Password is required."); return; }
    if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 700));
      setLoading(false);
      setError("We couldn't sign you in. Please check your email and password and try again.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    login(email);
    router.replace("/dashboard");
  }

  function fillDemo() {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError("");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--primary)]">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)] leading-none">DispatchOS</h1>
            <p className="text-xs text-[var(--muted)] mt-0.5">Logistics Operations Platform</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-xl)] p-7 shadow-[var(--shadow-md)]">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-1">Sign in</h2>
          <p className="text-sm text-[var(--muted)] mb-6">Enter your credentials to access the dashboard.</p>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 p-3 rounded-[var(--radius-md)] bg-[var(--danger-bg)] text-[var(--danger-text)] text-sm mb-5"
            >
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-[var(--foreground)]">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full h-9 bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] text-sm px-3 pr-10 placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full mt-2">
              Sign in
            </Button>
          </form>
        </div>

        {/* Demo credentials */}
        <div className="mt-4 p-4 bg-[var(--primary-muted)] rounded-[var(--radius-lg)] border border-[var(--primary)]/20">
          <p className="text-xs font-semibold text-[var(--primary)] mb-2">Demo credentials</p>
          <div className="text-xs text-[var(--foreground)] space-y-1 font-mono">
            <p><span className="text-[var(--muted)]">Email:</span> {DEMO_EMAIL}</p>
            <p><span className="text-[var(--muted)]">Password:</span> {DEMO_PASSWORD}</p>
          </div>
          <button
            onClick={fillDemo}
            className="mt-3 text-xs font-medium text-[var(--primary)] hover:underline"
          >
            Fill in demo credentials →
          </button>
        </div>
      </div>
    </div>
  );
}
