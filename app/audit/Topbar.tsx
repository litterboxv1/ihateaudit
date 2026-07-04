"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-4 backdrop-blur-md md:px-8">
      <Link href="/audit" className="text-xl font-black tracking-tight text-white md:hidden">
        CA <span className="text-red-500">Vault</span>
      </Link>
      
      <div className="hidden md:block"></div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="hidden text-sm font-medium text-zinc-500 sm:block">{user.email}</span>
            <button onClick={handleSignOut} className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-zinc-800">
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm font-bold text-zinc-400 transition-colors hover:text-white">
              Sign In
            </Link>
            <Link href="/login" className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-zinc-200">
              Create Account
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
