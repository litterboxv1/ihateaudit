import Link from "next/link";
import { supabase } from "../lib/supabase";

export const dynamic = 'force-dynamic';

export default async function AuditCoursePage() {
  // 1. Fetch all topics
  const { data: topics } = await supabase
    .from("topics")
    .select("*")
    .order("id", { ascending: true });

  // 2. Group the topics by section_name
  // This turns a flat list into: { "Ind AS": [topic1, topic2], "Ethics": [topic3] }
  const groupedTopics = topics?.reduce((acc, topic) => {
    const section = topic.section_name || "Uncategorized";
    if (!acc[section]) acc[section] = [];
    acc[section].push(topic);
    return acc;
  }, {} as Record<string, typeof topics>);

  return (
    <div className="p-6 md:p-10 lg:p-12">
      
      {/* Header */}
      <div className="mb-12 mt-4 border-b border-zinc-800 pb-8 md:mt-0">
        <h1 className="text-4xl font-black text-white sm:text-5xl">
          Course <span className="text-red-600">Curriculum</span>
        </h1>
        <p className="mt-4 text-lg text-zinc-400">
          Select a module below to begin your revision.
        </p>
      </div>

      {/* Grouped Curriculum Sections */}
      <div className="space-y-10">
        {!groupedTopics || Object.keys(groupedTopics).length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-zinc-400">
            No topics found. Add some rows in your Supabase dashboard!
          </div>
        ) : (
          Object.entries(groupedTopics).map(([sectionName, sectionTopics]) => (
            
            /* The 'id' here allows the sidebar links to scroll directly to this section */
            <div 
              key={sectionName} 
              id={sectionName.replace(/\s+/g, '-')} 
              className="scroll-mt-8"
            >
              
              {/* Section Title */}
              <h2 className="mb-4 text-2xl font-bold text-white">
                {sectionName}
              </h2>
              
              {/* Topics List for this Section */}
              <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
                <div className="flex flex-col divide-y divide-zinc-800">
                  {sectionTopics.map((topic, index) => (
                    <Link 
                      key={topic.id} 
                      href={`/audit/topic/${topic.id}`}
                      className="group flex items-center justify-between px-6 py-4 transition-colors hover:bg-zinc-800/80"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-bold text-zinc-400 transition-colors group-hover:bg-zinc-700 group-hover:text-white">
                          {index + 1}
                        </div>
                        <span className="font-medium text-zinc-300 group-hover:text-white">
                          {topic.title}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-4">
                        <span className="rounded-full bg-red-600/10 px-4 py-1.5 text-xs font-bold text-red-500 transition-colors group-hover:bg-red-600 group-hover:text-white">
                          Watch
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
