"use client";

import { useState, useEffect } from "react";

export default function ProgressToggle({ topicId }: { topicId: string }) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // Prevents server/client hydration crashing

  // On mount, check if this lesson is already in the student's local memory
  useEffect(() => {
    const savedProgress = JSON.parse(localStorage.getItem("ca_audit_progress") || "[]");
    if (savedProgress.includes(topicId)) {
      setIsCompleted(true);
    }
    setIsLoaded(true);
  }, [topicId]);

  const toggleProgress = () => {
    let savedProgress = JSON.parse(localStorage.getItem("ca_audit_progress") || "[]");
    
    if (isCompleted) {
      // Uncheck it: Remove this ID from the array
      savedProgress = savedProgress.filter((id: string) => id !== topicId);
      setIsCompleted(false);
    } else {
      // Check it: Add this ID to the array
      savedProgress.push(topicId);
      setIsCompleted(true);
    }
    
    // Save the updated array back to the iPad/Browser memory
    localStorage.setItem("ca_audit_progress", JSON.stringify(savedProgress));
  };

  // Show a blank skeleton box for a split second while it reads the local memory
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
