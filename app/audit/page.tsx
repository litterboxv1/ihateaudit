import Link from "next/link";
import { supabase } from "../lib/supabase";

export const dynamic = 'force-dynamic';

export default async function AuditCoursePage() {
  
  const { data: topics, error } = await supabase
    .from("topics")
    .select("*")
    .order("id", { ascending: true });

  return (
    <main className="min-h-screen bg-zinc-950 p-6 font-sans text-zinc-200">
      <div className="mx-auto max-w-4xl mt-10">
        
        {/* DEBUGGING BOX - This will print exactly what is going wrong */}
        {error && (
          <div className="bg-red-900 border-2 border-red-500 p-6 rounded-xl mb-8 text-white">
            <h2 className="text-2xl font-bold mb-2">Database Error Details:</h2>
            <p className="font-mono">{error.message}</p>
            <p className="font-mono mt-2">Details: {error.details || "None"}</p>
            <p className="font-mono mt-2">Hint: {error.hint || "None"}</p>
          </div>
        )}

        <h1 className="text-4xl font-black text-white mb-8">CA Final Audit</h1>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
            <div className="bg-zinc-900 px-6 py-4">
              <h2 className="text-xl font-bold text-white">All Topics</h2>
            </div>
            
            <div className="flex flex-col divide-y divide-zinc-800">
              {/* If no error, but also no topics */}
              {!error && (!topics || topics.length === 0) ? (
                <div className="p-6 text-yellow-400 font-bold border border-yellow-600 bg-yellow-900/20">
                  CONNECTION SUCCESSFUL, BUT 0 ROWS RETURNED. 
                  (Check if RLS is truly disabled, or if you added the row to the wrong project/table).
                </div>
              ) : (
                topics?.map((topic, index) => (
                  <div key={topic.id} className="p-6 text-green-400 font-bold border border-green-600 bg-green-900/20">
                    SUCCESS! Found topic: {topic.title}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
