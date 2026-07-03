"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "../actions/auth";

export default function AdminLogin() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    
    // Send the PIN securely to the server action
    startTransition(async () => {
      const result = await loginAdmin(pin);
      
      if (result.success) {
        router.push("/admin/dashboard");
      } else {
        setError(true);
        setPin("");
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 text-2xl">
            🔒
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          <p className="mt-2 text-sm text-zinc-400">Enter your master PIN to access the CMS.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <input
              type="password"
              inputMode="text" // Changed to text so you can use complex passwords!
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter Admin Password"
              className={`w-full rounded-xl border bg-zinc-950 p-4 text-center text-xl tracking-widest text-white outline-none transition-colors focus:border-red-500 ${
                error ? "border-red-500" : "border-zinc-800"
              }`}
              autoFocus
            />
            {error && <p className="mt-2 text-center text-sm font-bold text-red-500">Access Denied.</p>}
          </div>

          <button
            disabled={isPending}
            type="submit"
            className="mt-2 rounded-xl bg-red-600 p-4 font-bold text-white transition-colors hover:bg-red-700 active:scale-95 disabled:opacity-50"
          >
            {isPending ? "Authenticating..." : "Unlock Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
