import Link from "next/link";
import { supabase } from "../lib/supabase";

export const dynamic = 'force-dynamic';

export default async function AuditCoursePage() {
  
  const { data: topics } = await supabase
    .from("topics")
    .select("*")
    .order("id", { ascending: true });

  return (
    <main className="min-h-screen p-6 font-sans">
      <div className="mx-auto max-w-4xl mt-10">
        
        {/* Header */}
        <div className="mb-12 border-b border-zinc-800 pb-8">
          <Link href="/" className="mb-4 inline-block text-sm font-semibold text-zinc-500 hover:text-white">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-black text-white sm:text-5xl">
            CA Final <span className="text-red-600">Audit</span>
          </h1>
          <p className="mt-4 text-lg text-zinc-400">
            Select a topic below to access video lectures and PDFs.
          </p>
        </div>

        {/* Course List */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
            <div className="bg-zinc-900 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Curriculum</h2>
            </div>
            
            <div className="flex flex-col divide-y divide-zinc-800">
              {(!topics || topics.length === 0) ? (
                <div className="p-6 text-zinc-400 font-medium">
                  No topics added yet. Add a row in your Supabase dashboard!
                </div>
              ) : (
                topics.map((topic, index) => (
                  <Link 
                    key={topic.id} 
                    href={`/audit/topic/${topic.id}`}
                    className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-zinc-800/80"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-sm font-bold text-zinc-400">
                        {index + 1}
                      </div>
                      <span className="font-medium text-zinc-300">{topic.title}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="rounded-full bg-red-600/10 px-3 py-1 text-xs font-bold text-red-500">
                        Watch
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
