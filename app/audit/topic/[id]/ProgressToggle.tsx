"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";

export default function ProgressToggle({ topicId }: { topicId: string }) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        // Cloud Check
        const { data } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", session.user.id)
          .eq("topic_id", topicId)
          .single();
        
        if (data) setIsCompleted(true);
      } else {
        // Local Memory Check
        const savedProgress = JSON.parse(localStorage.getItem("ca_audit_progress") || "[]");
        if (savedProgress.includes(topicId)) setIsCompleted(true);
      }
      setIsLoaded(true);
    };
    checkStatus();
  }, [topicId]);

  const toggleProgress = async () => {
    const newState = !isCompleted;
    setIsCompleted(newState); // Optimistic UI update so it feels instantly fast

    if (user) {
      // Save to Supabase Cloud
      if (newState) {
        await supabase.from("user_progress").insert([{ user_id: user.id, topic_id: topicId }]);
      } else {
        await supabase.from("user_progress").delete().eq("user_id", user.id).eq("topic_id", topicId);
      }
    } else {
      // Save to Local iPad Memory
      let savedProgress = JSON.parse(localStorage.getItem("ca_audit_progress") || "[]");
      if (newState) {
        savedProgress.push(topicId);
      } else {
        savedProgress = savedProgress.filter((id: string) => id !== topicId);
      }
      localStorage.setItem("ca_audit_progress", JSON.stringify(savedProgress));
    }
  };

  if (!isLoaded) {
    return <div className="h-12 w-full animate-pulse rounded-xl bg-zinc-800 sm:w-48"></div>;
  }

  return (
    <button 
      onClick={toggleProgress}
      className={`flex w-full items-center justify-center gap-3 rounded-xl px-6 py-3 font-bold transition-all sm:w-auto sm:shrink-0 ${
        isCompleted 
          ? "border border-green-500/50 bg-green-500/10 text-green-400 hover:bg-green-500/20" 
          : "border border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
      }`}
    >
      {isCompleted ? (
        <>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-black">✓</span>
          Completed
        </>
      ) : (
        <>
          <span className="h-5 w-5 rounded-full border-2 border-zinc-500 transition-colors group-hover:border-white"></span>
          Mark as Complete
        </>
      )}
    </button>
  );
}
