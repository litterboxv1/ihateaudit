import Link from "next/link";
import { supabase } from "../../../../lib/supabase";

// Tell Next.js to always fetch fresh data for this page
export const dynamic = 'force-dynamic';

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Grab the ID from the URL
  const { id } = await params;

  // 2. Fetch only the specific topic that matches this ID
  const { data: topic, error } = await supabase
    .from("topics")
    .select("*")
    .eq("id", id) // This tells Supabase: "Only give me the row where the ID matches"
    .single();    // This tells Supabase: "I only want one item, not an array"

  // 3. If the topic doesn't exist or there is an error, show a fallback screen
  if (error || !topic) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-zinc-200">
        <h1 className="mb-4 text-3xl font-bold text-white">Topic Not Found</h1>
        <p className="mb-8 text-zinc-400">We couldn't find the lecture you were looking for.</p>
        <Link href="/audit" className="rounded-xl bg-zinc-800 px-6 py-3 font-bold text-white hover:bg-zinc-700">
          ← Back to Curriculum
        </Link>
      </main>
    );
  }

  // 4. If it succeeds, display the actual content!
  return (
    <main className="min-h-screen bg-zinc-950 p-6 font-sans text-zinc-200">
      <div className="mx-auto mt-4 max-w-5xl">
        
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/audit" className="inline-block text-sm font-semibold text-zinc-500 hover:text-white">
            ← Back to Curriculum
          </Link>
        </div>

        {/* Video Player Section */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl">
          <div className="relative w-full aspect-video">
            <iframe
              className="absolute left-0 top-0 h-full w-full"
              src={`https://www.youtube.com/embed/${topic.youtube_id}?rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Title and Notes Section */}
        <div className="grid gap-8 md:grid-cols-3">
          
          {/* Main Content Info */}
          <div className="md:col-span-2">
            <h1 className="mb-2 text-3xl font-bold text-white">
              {topic.title}
            </h1>
            <p className="text-zinc-400">
              Module ID: {topic.id} — Watch the lecture carefully before attempting the MCQ module.
            </p>
          </div>

          {/* Action Cards (PDFs) */}
          <div className="flex flex-col gap-4">
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
              <div className="flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 p-4 text-center font-bold text-zinc-600">
                📄 No Notes Available
              </div>
            )}
            
            {/* Future MCQ Button placeholder */}
            <button className="flex cursor-not-allowed items-center justify-center rounded-xl border border-red-900/50 bg-red-600/20 p-4 text-center font-bold text-red-500 opacity-50">
              📝 MCQs (Coming Soon)
            </button>
          </div>
          
        </div>
      </div>
    </main>
  );
}
