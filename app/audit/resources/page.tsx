import Link from "next/link";
import { supabase } from "../../lib/supabase";

export const dynamic = 'force-dynamic';

export default async function ResourcesPage() {
  const { data: topics } = await supabase
    .from("topics")
    .select("*")
    .not("pdf_link", "is", null)
    .neq("pdf_link", "")
    .order("id", { ascending: true });

  const groupedPdfs = topics?.reduce((acc, topic) => {
    const section = topic.section_name || "Uncategorized";
    if (!acc[section]) acc[section] = [];
    acc[section].push(topic);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="p-6 md:p-10 lg:p-12">
      <div className="mb-12 mt-4 border-b border-zinc-800 pb-8 md:mt-0">
        <h1 className="text-4xl font-black text-white sm:text-5xl">
          PDF <span className="text-red-600">Vault</span>
        </h1>
        <p className="mt-4 text-lg text-zinc-400">All study notes, summaries, and revision materials in one place.</p>
      </div>

      <div className="space-y-12">
        {!groupedPdfs || Object.keys(groupedPdfs).length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-zinc-400">
            No PDF resources found. Add some links to your database!
          </div>
        ) : (
          Object.entries(groupedPdfs).map(([sectionName, sectionTopics]: [string, any[]]) => (
            <div key={sectionName}>
              <h2 className="mb-6 border-l-4 border-red-600 pl-4 text-2xl font-bold text-white">{sectionName}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sectionTopics.map((topic: any) => (
                  <div key={topic.id} className="flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-700">
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
                        <span>Module {topic.id}</span>
                      </div>
                      <h3 className="mb-4 font-bold text-white line-clamp-2">{topic.title}</h3>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <a href={topic.pdf_link} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center rounded-lg bg-red-600/10 py-2.5 text-sm font-bold text-red-500 transition-colors hover:bg-red-600 hover:text-white">
                        Download PDF
                      </a>
                      <Link href={`/audit/topic/${topic.id}`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white" title="Go to Video Lecture">
                        ▶
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
