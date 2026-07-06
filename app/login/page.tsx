"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else {
        alert("Account created! Check your email to verify, or sign in directly depending on your Supabase settings.");
        router.push("/audit");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert("Invalid login credentials.");
      else router.push("/audit");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-white">
            CA Audit <span className="text-red-500">Vault</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            {isSignUp ? "Create an account to track your progress." : "Sign in to pick up where you left off."}
          </p>
        </div>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-zinc-500">Email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-white outline-none transition-colors focus:border-red-500" 
              placeholder="student@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-zinc-500">Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-white outline-none transition-colors focus:border-red-500" 
              placeholder="••••••••"
            />
          </div>
          
          <button 
            disabled={isLoading} 
            type="submit" 
            className="mt-4 w-full rounded-xl bg-red-600 p-4 font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Authenticating..." : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        <button 
          onClick={() => setIsSignUp(!isSignUp)}
          className="mt-6 w-full text-center text-sm font-medium text-zinc-500 hover:text-white"
        >
          {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}
