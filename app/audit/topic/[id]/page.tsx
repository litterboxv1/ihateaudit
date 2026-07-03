import Link from "next/link";
import { supabase } from "../../../lib/supabase";

export const dynamic = 'force-dynamic';

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Fetch the specific topic being watched
  const { data: topic, error } = await supabase
    .from("topics")
    .select("*")
    .eq("id", id)
    .single();

  // 2. Fetch ALL topics to calculate Next/Prev and build the sub-topic list
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

  // 3. Calculate Navigation Logic
  // Find where we currently are in the massive list
  const currentIndex = allTopics.findIndex((t) => t.id.toString() === id);
  
  // Grab the adjacent rows (if they exist)
  const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

  // 4. Filter only the topics that share this exact section name
  const sectionTopics = allTopics.filter((t) => t.section_name === topic.section_name);

  return (
    <div className="p-4 md:p-8 lg:p-10">
      
      <div className="mx-auto max-w-5xl">
        
        {/* Video Player Box */}
        <div className="mb-4 overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl">
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

        {/* Video Navigation Bar (Next / Prev) */}
        <div className="mb-10 flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          {prevTopic ? (
            <Link 
              href={`/audit/topic/${prevTopic.id}`}
              className="flex items-center gap-2 font-bold text-zinc-400 transition-colors hover:text-white"
            >
              <span>←</span>
              <span className="hidden sm:inline">Previous
