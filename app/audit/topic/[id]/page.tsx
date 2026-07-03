import Link from "next/link";
import { supabase } from "../../../lib/supabase";

export const dynamic = 'force-dynamic';

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: topic, error } = await supabase
    .from("topics")
    .select("*")
    .eq("id", id)
    .single();

  const { data: allTopics } = await supabase
    .from("topics")
    .select("*")
    .order("id", { ascending: true });

  if (error || !topic || !allTopics) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
        <h1 className="mb-4 text-3xl font-bold text-white">Topic Not Found</h1>
        <Link href="/audit" className="rounded-xl bg-zinc-800 px-6 py-3 font-bold text-white hover:bg-zinc-700">
          ← Back to Curriculum
        </Link>
      </div>
    );
  }

  const currentIndex = allTopics.findIndex((t) => t.id.toString() === id);
  const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

  const sectionTopics = allTopics.filter((t) => t.section_name === topic.section_name);

  return (
    <div className="p-4 md:p-8 lg:p-10">
      
      <div className="mx-auto max-w-5xl">
        
        {/* Video Player Box with Clean URL Parameters */}
        <div className="mb-4 overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl">
          <div className="relative aspect-video w-full">
            <iframe
              className="absolute left-0 top-0 h-full w-full"
              src={`https://www.youtube.com/embed/${topic.youtube_id}?rel=0&modestbranding=1&iv_load_policy=3&color=white`}
              title="Course Video Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Video Navigation Bar */}
        <div className="mb-10 flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          {prevTopic ? (
            <Link 
              href={`/audit/topic/${prevTopic.id}`}
              className="flex items-center gap-2 font-bold text-zinc-400 transition-colors hover:text-white"
            >
              <span>←</span>
              <span className="hidden sm:inline">Previous Lecture</span>
              <span className="sm:hidden">Prev</span>
            </Link>
          ) : (
            <div className="font-bold text-zinc-700">← First Lecture</div>
          )}

          <div className="hidden text-sm font-medium text-zinc-500 md:block">
            {topic.section_name}
          </div>

          {nextTopic ? (
            <Link 
              href={`/audit/topic/${nextTopic.id}`}
              className="flex items-center gap-2 rounded-lg bg-red-600/10 px-4 py-2 font-bold text-red-500 transition-colors hover:bg-red-600 hover:text-white"
            >
              <span className="hidden sm:inline">Next Lecture</span>
              <span className="sm:hidden">Next</span>
              <span>→</span>
            </Link>
          ) : (
            <div className="font-bold text-zinc-700">Course Complete 🎉</div>
          )}
        </div>

        {/* Info & Notes Section */}
        <div className="mb-12 grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <h1 className="mb-2 text-3xl font-bold text-white">
              {topic.title}
            </h1>
            <p className="text-zinc-400">
              Module ID: {topic.id} — Ensure you review the attached study materials before moving on.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {topic.pdf_link ? (
              <a 
                href={topic.pdf_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-xl bg-zinc-800 p-4 text-center font-bold text-white transition-colors hover:bg-zinc-700 active:scale-95"
              >
                📄 Download Study Notes
              </a>
            ) : (
              <div className="flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center font-bold text-zinc-600">
                📄 No Notes Available
              </div>
            )}
          </div>
        </div>

        {/* Section Sub-Topics */}
        <div className="mt-16">
          <h3 className="mb-6 text-xl font-bold text-white">
            More in <span className="text-red-500">{topic.section_name}</span>
          </h3>
          
          <div className="flex flex-col divide-y divide-zinc-800 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
            {sectionTopics.map((secTopic, index) => {
              const isCurrentlyWatching = secTopic.id.toString() === id;
              
              return (
                <Link 
                  key={secTopic.id} 
                  href={`/audit/topic/${secTopic.id}`}
                  className={`group flex items-center justify-between px-6 py-4 transition-colors ${
                    isCurrentlyWatching ? "bg-zinc-800/80" : "hover:bg-zinc-800/40"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                      isCurrentlyWatching 
                        ? "bg-red-600 text-white" 
                        : "bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-white"
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`font-medium ${isCurrentlyWatching ? "text-white" : "text-zinc-300 group-hover:text-white"}`}>
                      {secTopic.title}
                    </span>
                  </div>
                  
                  {isCurrentlyWatching && (
                    <span className="hidden rounded-full bg-red-600/20 px-3 py-1 text-xs font-bold text-red-500 sm:inline-block">
                      Playing
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
