"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
      } else {
        router.push("/login");
      }
      setIsLoading(false);
    };

    fetchUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6 text-white md:p-10">
      <div className="mx-auto max-w-2xl">
        
        <div className="mb-10 border-b border-zinc-800 pb-8">
          <h1 className="text-4xl font-black tracking-tight">My Profile</h1>
          <p className="mt-2 text-zinc-400">Manage your account and authentication settings.</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur-sm">
          
          {/* USER INFO CARD */}
          <div className="mb-8 flex items-center gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-red-600 text-3xl font-black uppercase text-white shadow-lg">
              {user?.email?.charAt(0) || "?"}
            </div>
            <div className="overflow-hidden">
              <div className="mb-1 text-sm font-bold uppercase tracking-widest text-zinc-500">Authenticated As</div>
              <div className="truncate text-xl font-bold text-white">
                {user?.email || "Unknown User"}
              </div>
            </div>
          </div>
          
          {/* ACCOUNT ACTIONS */}
          <div className="border-t border-zinc-800 pt-8">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-500">Security</h2>
            <button 
              onClick={handleSignOut}
              className="w-full rounded-xl bg-zinc-800 px-6 py-4 font-bold text-white transition-colors hover:bg-red-600 sm:w-auto"
            >
              Sign Out of Vault
            </button>
            <p className="mt-4 text-xs text-zinc-500">
              Signing out will securely clear your session from this device.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

