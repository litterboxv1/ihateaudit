"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function CurriculumPage() {
  const [topics, setTopics] = useState < any[] > ([]);
  const [completedIds, setCompletedIds] = useState < string[] > ([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState < any > (null);
  const router = useRouter();
  
    useEffect(() => {
    const fetchData = async () => {
      // 0. Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      // 1. Grab all lectures from the database
      const { data: topicsData } = await supabase.from("topics").select("*").order("id", { ascending: true });
      if (topicsData) setTopics(topicsData);
      
      // 2. Fetch authenticated cloud progress
      if (session?.user) {
        const { data: progressData } = await supabase
          .from("user_progress")
          .select("topic_id")
          .eq("user_id", session.user.id);
          
        if (progressData) {
          // Convert database integers back to strings for your state array
          const cloudCompletedIds = progressData.map(log => log.topic_id.toString());
          setCompletedIds(cloudCompletedIds);
        }
      }
      
      setIsLoading(false);
    };
    fetchData();
    
    // Listen for login/logout events in real-time
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };
  
  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">Loading Curriculum Engine...</div>;
  }
  
  // --- PROGRESS MATHEMATICS ---
  const totalLectures = topics.length;
  const completedLecturesCount = topics.filter((t) => completedIds.includes(t.id.toString())).length;
  const overallPercentage = totalLectures > 0 ? Math.round((completedLecturesCount / totalLectures) * 100) : 0;
  
  // Group topics by their Section Name
  const sectionsMap: {
    [key: string]: any[] } = {};
  topics.forEach((topic) => {
    if (!sectionsMap[topic.section_name]) {
      sectionsMap[topic.section_name] = [];
    }
    sectionsMap[topic.section_name].push(topic);
  });
  
  return (
    <div className="min-h-screen bg-zinc-950 p-6 text-white md:p-10">
      <div className="mx-auto max-w-4xl">
        
        {/* HEADER SECTION */}
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-zinc-800 pb-8 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight">
              I<span className="text-red-500">Hate</span>Audit
            </h1>
            <p className="mt-2 text-zinc-400">Mastering Standards on Auditing & Professional Conduct.</p>
          </div>
          
          {/* Dynamic Auth Buttons */}
          <div className="self-start sm:self-auto">
            {user ? (
              <button 
                onClick={handleSignOut} 
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-zinc-800"
              >
                Sign Out
              </button>
            ) : (
              <Link 
                href="/login" 
                className="rounded-lg bg-white px-4 py-2 text-xs font-bold text-black transition-colors hover:bg-zinc-200"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* MASTER COURSE PROGRESS WIDGET */}
        <div className="mb-12 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Course Progression</h2>
              <p className="text-sm text-zinc-400">{completedLecturesCount} of {totalLectures} modules conquered</p>
            </div>
            <span className="text-3xl font-black text-red-500">{overallPercentage}%</span>
          </div>
          
          {/* Progress Bar Track */}
          <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-800">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-500 ease-out"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>

        {/* CHAPTERS & TOPICS CURRICULUM */}
        <div className="space-y-12">
          {Object.entries(sectionsMap).map(([sectionName, sectionTopics]) => {
            
            // Calculate calculations per individual chapter segment
            const sectionTotal = sectionTopics.length;
            const sectionCompleted = sectionTopics.filter((t) => completedIds.includes(t.id.toString())).length;
            const sectionPercentage = Math.round((sectionCompleted / sectionTotal) * 100);

            return (
              <div key={sectionName} className="rounded-2xl border border-zinc-900 bg-zinc-900/20 p-6">
                
                {/* Chapter Heading with inline math status */}
                <div className="mb-6 flex flex-col justify-between gap-2 border-b border-zinc-800/60 pb-4 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-white">{sectionName}</h3>
                    <p className="mt-0.5 text-xs font-medium text-zinc-500">{sectionCompleted} / {sectionTotal} Lessons Finished</p>
                  </div>
                  
                  {/* Micro Chapter Progress Bar */}
                  <div className="flex items-center gap-3 sm:w-48">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                      <div 
                        className="h-full bg-zinc-400 transition-all duration-500" 
                        style={{ width: `${sectionPercentage}%` }} 
                      />
                    </div>
                    <span className="w-8 text-right text-xs font-bold text-zinc-400">{sectionPercentage}%</span>
                  </div>
                </div>

                {/* Individual Lecture Row Cards */}
                <div className="space-y-3">
                  {sectionTopics.map((topic) => {
                    const isDone = completedIds.includes(topic.id.toString());
                    
                    return (
                      <Link 
                        key={topic.id}
                        href={`/audit/topic/${topic.id}`}
                        className={`group flex items-center justify-between rounded-xl border px-5 py-4 transition-all ${
                          isDone 
                            ? "border-green-900/30 bg-green-950/5 hover:bg-green-950/10" 
                            : "border-zinc-800/60 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/60"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Left Icon status indicator */}
                          <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors ${
                            isDone 
                              ? "border-green-500 bg-green-500 text-black" 
                              : "border-zinc-700 bg-zinc-950 text-zinc-500 group-hover:border-zinc-500 group-hover:text-white"
                          }`}>
                            {isDone ? "✓" : ""}
                          </div>
                          
                          <span className={`font-medium transition-colors ${isDone ? "text-zinc-400 line-through decoration-zinc-700" : "text-zinc-200 group-hover:text-white"}`}>
                            {topic.title}
                          </span>
                        </div>
                        
                        {/* Play Action tag arrow */}
                        <div className="text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-zinc-400">
                          →
                        </div>
                      </Link>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}