import Link from "next/link";

export default function AuditCoursePage() {
  // Placeholder data: We will replace this with real Supabase data later!
  const chapters = [
    {
      id: 1,
      title: "Professional Ethics",
      topics: [
        { id: 101, title: "Second Schedule, Part I: Professional Misconduct Clauses", duration: "45 mins" },
        { id: 102, title: "First Schedule: General Guidelines", duration: "30 mins" }
      ]
    },
    {
      id: 2,
      title: "Audit of Consolidated Financial Statements",
      topics: [
        { id: 201, title: "Ind AS 36: Impairment of Assets - Audit Procedures", duration: "50 mins" },
        { id: 202, title: "Ind AS 19 & 105 Overview", duration: "40 mins" }
      ]
    }
  ];

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
            Select a chapter below to access video lectures, PDFs, and MCQs.
          </p>
        </div>

        {/* Curriculum Section */}
        <div className="space-y-6">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
              {/* Chapter Header */}
              <div className="bg-zinc-900 px-6 py-4">
                <h2 className="text-xl font-bold text-white">
                  Chapter {chapter.id}: {chapter.title}
                </h2>
              </div>
              
              {/* Topics List */}
              <div className="flex flex-col divide-y divide-zinc-800">
                {chapter.topics.map((topic, index) => (
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
                      <span className="text-sm text-zinc-500">{topic.duration}</span>
                      <span className="rounded-full bg-red-600/10 px-3 py-1 text-xs font-bold text-red-500">
                        Start
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
