"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalTopics, setTotalTopics] = useState(0);
  const [logs, setLogs] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        router.push("/login");
        return;
      }
      setUser(session.user);

      // 1. Fetch all topics to get titles and the total curriculum count
      const { data: topicsData } = await supabase.from("topics").select("id, title");
      setTotalTopics(topicsData?.length || 0);

      // 2. Fetch the user's progress logs
      const { data: progressData } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", session.user.id)
        .order("completed_at", { ascending: false });

      // 3. Merge the data so we have topic titles attached to the ratings
      if (progressData && topicsData) {
        const enrichedLogs = progressData.map((log) => {
          const matchedTopic = topicsData.find((t) => t.id.toString() === log.topic_id.toString());
          return {
            ...log,
            topic_title: matchedTopic?.title || "Unknown Topic",
          };
        });
        setLogs(enrichedLogs);
      }
      setIsLoading(false);
    };

    fetchDashboardData();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-red-500"></div>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Loading Insights...</p>
      </div>
    );
  }

  // --- ANALYTICS CALCULATIONS ---
  const completedCount = logs.length;
  const completionPercentage = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
  
  // Isolate topics rated 4 or 5 stars for the revision list
  const hardTopics = logs.filter(log => log.rating >= 4);
  
  // Isolate topics that have written notes
  const notedTopics = logs.filter(log => log.review_notes && log.review_notes.trim() !== "");

  return (
    <div className="min-h-screen bg-zinc-950 p-6 text-white md:p-10">
      <div className="mx-auto max-w-5xl">
        
        {/* HEADER & ACCOUNT STRIP */}
        <div className="mb-8 flex flex-col justify-between gap-6 border-b border-zinc-800 pb-8 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Insights & Analytics</h1>
            <p className="mt-2 text-zinc-400">Track your curriculum velocity and target weak areas.</p>
          </div>
          
          <div className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-2 pr-4 backdrop-blur-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-lg font-black uppercase text-white">
              {user?.email?.charAt(0) || "?"}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Account</span>
              <span className="truncate text-sm font-bold">{user?.email}</span>
            </div>
            <button 
              onClick={handleSignOut}
              className="ml-4 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* HIGH-LEVEL STAT CARDS */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
            <div className="mb-1 text-sm font-bold uppercase tracking-widest text-zinc-500">Modules Conquered</div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">{completedCount}</span>
              <span className="text-lg font-bold text-zinc-600">/ {totalTopics}</span>
            </div>
          </div>
          
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
            <div className="mb-1 text-sm font-bold uppercase tracking-widest text-zinc-500">Vault Completion</div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-red-500">{completionPercentage}%</span>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
            <div className="mb-1 text-sm font-bold uppercase tracking-widest text-zinc-500">Critical Topics</div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-orange-500">{hardTopics.length}</span>
              <span className="text-sm font-medium text-zinc-500">Need Revision</span>
            </div>
          </div>
        </div>

        {/* DUAL-COLUMN DASHBOARD */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          
          {/* LEFT COL: RED ZONE (Hard Topics) */}
          <div className="flex flex-col">
            <h2 className="mb-4 text-xl font-black tracking-tight text-white flex items-center gap-2">
              <span className="text-orange-500">⚠️</span> The Red Zone
            </h2>
            <div className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6">
              {hardTopics.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-zinc-500">
                  <span className="mb-2 text-3xl">🎯</span>
                  <p className="text-sm font-bold">You haven't flagged any topics as difficult yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {hardTopics.map((log) => (
                    <div key={log.id} className="flex items-start justify-between rounded-xl border border-orange-900/30 bg-orange-950/10 p-4">
                      <div>
                        <div className="mb-1 text-sm font-bold text-white">{log.topic_title}</div>
                        <div className="text-xs font-medium text-zinc-500">
                          Logged on {new Date(log.completed_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center rounded-lg bg-orange-500/10 px-2 py-1 text-sm font-bold text-orange-500">
                        {log.rating} ★
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COL: STUDY JOURNAL (Notes) */}
          <div className="flex flex-col">
            <h2 className="mb-4 text-xl font-black tracking-tight text-white flex items-center gap-2">
              <span className="text-blue-500">📝</span> Study Journal
            </h2>
            <div className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6">
              {notedTopics.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-zinc-500">
                  <span className="mb-2 text-3xl">✍️</span>
                  <p className="text-sm font-bold">No revision notes captured yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notedTopics.map((log) => (
                    <div key={log.id} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                      <div className="mb-2 border-b border-zinc-800 pb-2 text-sm font-bold text-zinc-300">
                        {log.topic_title}
                      </div>
                      <p className="text-sm italic leading-relaxed text-zinc-400">
                        "{log.review_notes}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
