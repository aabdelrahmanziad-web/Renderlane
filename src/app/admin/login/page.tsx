"use client";

import { useActionState } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { login, type LoginState } from "../actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-violet/25 blur-[120px]" aria-hidden="true" />
      <form action={action} className="relative w-full max-w-sm rounded-3xl border border-line bg-ink-2/80 p-8 backdrop-blur">
        <LogoMark className="h-10 w-auto text-paper" />
        <h1 className="mt-6 font-display text-2xl font-light uppercase tracking-wide">Studio admin</h1>
        <p className="mt-1 text-sm text-mist">Sign in to see project inquiries.</p>

        <label htmlFor="password" className="mt-8 block text-sm text-paper/90">
          Password
        </label>
        <input id="password" name="password" type="password" required autoFocus autoComplete="current-password" className="field mt-2" />

        {state.error && (
          <p role="alert" className="mt-3 text-sm text-red-400">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-full bg-violet py-3 text-sm font-medium text-paper transition-colors hover:bg-paper hover:text-ink disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
