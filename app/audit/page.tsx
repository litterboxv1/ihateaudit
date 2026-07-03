import Link from "next/link";
import { supabase } from "../lib/supabase";

export const dynamic = 'force-dynamic';

export default async function AuditCoursePage() {
  const { data: topics } = await supabase
    .from("topics")
    .select("*")
    .order("id", { ascending: true });

  const groupedTopics = topics?.reduce((acc, topic) => {
    const section = topic.section_name || "Uncategorized";
    if (!acc[section]) acc[section] = [];
    acc[section].push(topic);
    return acc;
  }, {} as Record<string, any[]>); 

  return (
    <div className="p-6 md:p-10 lg:p-12">
      <div className="mb-12 mt-4 border-b border-zinc-800 pb-8 md:mt-0">
        <h1 className="text-4xl font-black text-white sm:text-5xl">
          Course <span className="text-red-600">Curriculum</span>
        </h1>
        <p className="mt-4 text-lg text-zinc-400">Select a module below to begin your revision.</p>
      </div>

      <div className="space-y-10">
        {!groupedTopics || Object.keys(groupedTopics).length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-zinc-400">
            No topics found. Add some rows in your Admin Control Room!
          </div>
        ) : (
          (Object.entries(groupedTopics) as [string, any[]][]).map(([sectionName, sectionTopics]) => (
            <div key={sectionName} id={sectionName.replace(/\s+/g, '-')} className="scroll-mt-8">
              <h2 className="mb-4 text-2xl font-bold text-white">{sectionName}</h2>
              <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
                <div className="flex flex-col divide-y divide-zinc-800">
                  
                  {sectionTopics.map((topic, index) => {
                    // Detect if this is a PDF-only resource (No YouTube ID, but has a PDF link)
                    const isPdfOnly = !topic.youtube_id && topic.pdf_link;

                    if (isPdfOnly) {
                      return (
                        <a key={topic.id} href={topic.pdf_link} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between px-6 py-4 transition-colors hover:bg-zinc-800/80">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-bold text-zinc-400 transition-colors group-hover:bg-zinc-700 group-hover:text-white">
                              {index + 1}
                            </div>
                            <span className="font-medium text-zinc-300 group-hover:text-white">{topic.title}</span>
                          </div>
                          <div className="flex shrink-0 items-center gap-4">
                            <span className="rounded-full bg-blue-600/10 px-4 py-1.5 text-xs font-bold text-blue-500 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                              📄 Download
                            </span>
                          </div>
                        </a>
                      );
                    }

                    // Otherwise, render the standard Video Watch link
                    return (
                      <Link key={topic.id} href={`/audit/topic/${topic.id}`} className="group flex items-center justify-between px-6 py-4 transition-colors hover:bg-zinc-800/80">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-bold text-zinc-400 transition-colors group-hover:bg-zinc-700 group-hover:text-white">
                            {index + 1}
                          </div>
                          <span className="font-medium text-zinc-300 group-hover:text-white">{topic.title}</span>
                        </div>
                        <div className="flex shrink-0 items-center gap-4">
                          <span className="rounded-full bg-red-600/10 px-4 py-1.5 text-xs font-bold text-red-500 transition-colors group-hover:bg-red-600 group-hover:text-white">
                            ▶ Watch
                          </span>
                        </div>
                      </Link>
                    );
                  })}

                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
