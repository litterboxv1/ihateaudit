"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Kick them out to the login screen
        router.push("/login");
      } else {
        // Let them in
        setIsAuthenticated(true);
      }
    };

    checkAuth();

    // This listens for if they sign out while already on the page
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // Show a sleek loading state while checking credentials
  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-800 border-t-red-500"></div>
        <p className="mt-4 text-sm font-bold tracking-widest text-zinc-500 uppercase">Securing Vault...</p>
      </div>
    );
  }

  // If authenticated, render the actual page content
  return <>{children}</>;
}
