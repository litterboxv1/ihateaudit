"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function CurriculumPage() {
  const [topics, setTopics] = useState < any[] > ([]);
  const [completedIds, setCompletedIds] = useState < string[] > ([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      // 1. Grab all lectures from the database
      const { data } = await supabase.from("topics").select("*").order("id", { ascending: true });
      if (data) setTopics(data);
      
      // 2. Grab completion states from localStorage
      const savedProgress = JSON.parse(localStorage.getItem("ca_audit_progress") || "[]");
      setCompletedIds(savedProgress);
      
      setIsLoading(false);
    };
    fetchData();
  }, []);
  
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
    <div className="min-h-screen bg-zinc-950 p-6 md:p-10 text-white">
      <div className="mx-auto max-w-4xl">
        
        {/* HEADER SECTION */}
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-zinc-800 pb-8 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight">CA Audit <span className="text-red-500">Vault</span></h1>
            <p className="mt-2 text-zinc-400">Mastering Standards on Auditing & Professional Conduct.</p>
          </div>
          
          {/* Admin Dashboard Entry link */}
          <Link href="/admin/dashboard" className="text-xs font-semibold text-zinc-600 hover:text-zinc-400 self-start sm:self-auto">
            Admin Access 🔐
          </Link>
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
                    <p className="text-xs font-medium text-zinc-500 mt-0.5">{sectionCompleted} / {sectionTotal} Lessons Finished</p>
                  </div>
                  
                  {/* Micro Chapter Progress Bar */}
                  <div className="flex items-center gap-3 sm:w-48">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                      <div 
                        className="h-full bg-zinc-400 transition-all duration-500" 
                        style={{ width: `${sectionPercentage}%` }} 
                      />
                    </div>
                    <span className="text-xs font-bold text-zinc-400 w-8 text-right">{sectionPercentage}%</span>
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
                          <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold border transition-colors ${
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