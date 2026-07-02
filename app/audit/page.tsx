import Link from "next/link";
import { supabase } from "../lib/supabase"; // This imports your secure connection!
export const dynamic = 'force-dynamic';


// The "async" here allows us to fetch data directly on the server
export default async function AuditCoursePage() {
  
  // 1. Fetch all rows from your 'topics' table, ordered by their ID
  const { data: topics, error } = await supabase
    .from("topics")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching topics:", error);
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-6 font-sans text-zinc-200">
      <div className="mx-auto max-w-4xl">
        
        {/* Header Section */}
        <div className="mb-12 mt-10 border-b border-zinc-800 pb-8">
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

        {/* Curriculum Section */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
            <div className="bg-zinc-900 px-6 py-4">
              <h2 className="text-xl font-bold text-white">
                All Topics
              </h2>
            </div>
            
            {/* Live Topics List from Database */}
            <div className="flex flex-col divide-y divide-zinc-800">
              
              {/* If no topics exist, show a message */}
              {!topics || topics.length === 0 ? (
                <div className="p-6 text-zinc-400">
                  No topics added yet. Add a row in Supabase!
                </div>
              ) : (
                /* Loop through the live topics and create a button for each */
                topics.map((topic, index) => (
                  <Link 
                    key={topic.id} 
                    href={`/audit/topic/${topic.id}`}
                    className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-zinc-800/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-sm font-bold text-zinc-400">
                        {index + 1}
                      </div>
                      <span className="font-medium text-zinc-300">{topic.title}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="rounded-full bg-red-600/10 px-3 py-1 text-xs font-bold text-red-500">
                        Start
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
