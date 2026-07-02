import Link from "next/link";

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. We grab the ID from the URL (e.g., "101")
  const { id } = await params;

  // 2. Placeholder Data (We will fetch this from Supabase in the next step based on the 'id')
  const topic = {
    title: "Second Schedule, Part I: Professional Misconduct Clauses",
    youtube_id: "dQw4w9WgXcQ", // Replace with an actual CA Final Audit video ID later
    pdf_link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" 
  };

  return (
    <main className="min-h-screen bg-zinc-950 p-6 font-sans text-zinc-200">
      <div className="mx-auto max-w-5xl">
        
        {/* Navigation */}
        <div className="mb-8 mt-4">
          <Link href="/audit" className="inline-block text-sm font-semibold text-zinc-500 hover:text-white">
            ← Back to Curriculum
          </Link>
        </div>

        {/* Video Player Section */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl">
          <div className="relative aspect-video w-full">
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
              Topic ID: {id} — Watch the lecture carefully before attempting the MCQ module below.
            </p>
          </div>

          {/* Action Cards (PDFs) */}
          <div className="flex flex-col gap-4">
            <a 
              href={topic.pdf_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-xl bg-zinc-800 p-4 text-center font-bold text-white transition-colors hover:bg-zinc-700 active:scale-95"
            >
              📄 Download ICAI Study Notes
            </a>
            
            {/* Future MCQ Button placeholder */}
            <button className="flex items-center justify-center rounded-xl bg-red-600/20 p-4 text-center font-bold text-red-500 border border-red-900/50 cursor-not-allowed opacity-50">
              📝 MCQs (Coming Soon)
            </button>
          </div>
          
        </div>
      </div>
    </main>
  );
}
