"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";

export default function ProgressToggle({ topicId }: { topicId: number | string }) {
  const [isDone, setIsDone] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);
  
  // Log & Review States
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkCloudProgress = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("topic_id", topicId)
        .single();

      if (data) setIsDone(true);
      setIsLoading(false);
    };
    checkCloudProgress();
  }, [topicId]);

  const handleRemoveLog = async () => {
    setIsLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase
        .from("user_progress")
        .delete()
        .eq("user_id", session.user.id)
        .eq("topic_id", topicId);
      setIsDone(false);
    }
    setIsLoading(false);
  };

  const handleSaveLog = async () => {
    setIsSubmitting(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      const { error } = await supabase.from("user_progress").insert({
        user_id: session.user.id,
        topic_id: topicId,
        rating: rating > 0 ? rating : null,
        review_notes: notes.trim() !== "" ? notes : null,
      });

      if (!error) {
        setIsDone(true);
        setShowLogModal(false);
      } else {
        alert("Error saving log. Please try again.");
      }
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return <div className="h-12 w-48 animate-pulse rounded-xl bg-zinc-900"></div>;
  }

  return (
    <>
      <button
        onClick={() => isDone ? handleRemoveLog() : setShowLogModal(true)}
        className={`flex items-center gap-3 rounded-xl border px-6 py-3 font-bold transition-all ${
          isDone
            ? "border-green-500/30 bg-green-500/10 text-green-500 hover:bg-green-500/20"
            : "border-zinc-800 bg-zinc-900 text-white hover:border-red-500 hover:bg-zinc-800"
        }`}
      >
        <div className={`flex h-6 w-6 items-center justify-center rounded-full border ${isDone ? "border-green-500 bg-green-500 text-black" : "border-zinc-500"}`}>
          {isDone ? "✓" : ""}
        </div>
        {isDone ? "Logged & Completed" : "Log Topic"}
      </button>

      {/* THE LOG & REVIEW MODAL */}
      {showLogModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
            <h2 className="mb-2 text-2xl font-black text-white">Log this Topic</h2>
            <p className="mb-8 text-sm text-zinc-400">Record your difficulty rating and revision notes.</p>

            {/* Star Rating System */}
            <div className="mb-6 flex flex-col items-center">
              <label className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-500">Difficulty Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setRating(star)}
                    className={`text-4xl transition-colors ${
                      (hoveredStar || rating) >= star ? "text-green-500" : "text-zinc-800"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Review Notes */}
            <div className="mb-8">
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">Revision Notes</label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g., Memorize the timeline for SA 500. Struggled with the definitions..."
                className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-white outline-none transition-colors focus:border-red-500"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button 
                onClick={() => setShowLogModal(false)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-4 font-bold text-white transition-colors hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveLog}
                disabled={isSubmitting}
                className="w-full rounded-xl bg-green-600 py-4 font-bold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Log"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
