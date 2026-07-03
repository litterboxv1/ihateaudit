"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { logoutAdmin } from "../../actions/auth";

export default function AdminDashboard() {
  const router = useRouter();
  
  const [topics, setTopics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [pdfLink, setPdfLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Data on Load (We removed the old, broken auth check here!)
  useEffect(() => {
    const fetchTopics = async () => {
      const { data } = await supabase.from("topics").select("*").order("id", { ascending: false });
      if (data) setTopics(data);
      setIsLoading(false);
    };

    fetchTopics();
  }, []);

  // 2. Handle Adding New Content
  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newTopic = {
      title,
      section_name: sectionName,
      youtube_id: youtubeId.trim() === "" ? null : youtubeId.trim(),
      pdf_link: pdfLink.trim() === "" ? null : pdfLink.trim(),
    };

    const { data, error } = await supabase.from("topics").insert([newTopic]).select();

    if (!error && data) {
      setTopics([data[0], ...topics]);
      setTitle("");
      setSectionName("");
      setYoutubeId("");
      setPdfLink("");
    } else {
      alert("Error saving to database. Check the console.");
      console.error(error);
    }
    setIsSubmitting(false);
  };

  // 3. Handle Deleting Content
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this module? This cannot be undone.")) return;

    const { error } = await supabase.from("topics").delete().eq("id", id);
    if (!error) {
      setTopics(topics.filter((t) => t.id !== id));
    }
  };

  // 4. Secure Logout (Updated to use our Server Action)
  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/admin");
  };

  if (isLoading) return <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">Loading Vault Data...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 p-6 md:p-10">
      
      <div className="mb-10 flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white">Admin <span className="text-red-600">Control Room</span></h1>
          <p className="text-zinc-400">Manage your course curriculum and PDFs.</p>
        </div>
        <button onClick={handleLogout} className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-bold text-white hover:bg-zinc-700">
          Lock Vault 🔒
        </button>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
            <h2 className="mb-6 text-xl font-bold text-white">Add New Resource</h2>
            
            <form onSubmit={handleAddTopic} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-zinc-500">Module Title *</label>
                <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Ind AS 36 Impairment" className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-red-500" />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-zinc-500">Section Name *</label>
                <input required type="text" value={sectionName} onChange={(e) => setSectionName(e.target.value)} placeholder="e.g. Financial Reporting" className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-red-500" />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-zinc-500">YouTube ID (Optional)</label>
                <input type="text" value={youtubeId} onChange={(e) => setYoutubeId(e.target.value)} placeholder="e.g. dQw4w9WgXcQ" className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-red-500" />
                <p className="mt-1 text-[10px] text-zinc-500">Leave blank for PDF-only modules.</p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-zinc-500">PDF Drive Link (Optional)</label>
                <input type="url" value={pdfLink} onChange={(e) => setPdfLink(e.target.value)} placeholder="https://drive.google.com/..." className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-red-500" />
              </div>

              <button disabled={isSubmitting} type="submit" className="mt-4 w-full rounded-xl bg-red-600 p-4 font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50">
                {isSubmitting ? "Saving..." : "Publish to Curriculum"}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="mb-6 text-xl font-bold text-white">Live Database</h2>
          
          <div className="flex flex-col gap-3">
            {topics.map((topic) => (
              <div key={topic.id} className="flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:flex-row sm:items-center">
                
                <div className="mb-4 sm:mb-0">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs font-bold text-zinc-400">ID: {topic.id}</span>
                    <span className="text-xs font-bold uppercase tracking-wide text-red-500">{topic.section_name}</span>
                  </div>
                  <h3 className="font-bold text-white">{topic.title}</h3>
                  <div className="mt-1 flex gap-3 text-xs font-medium text-zinc-500">
                    {topic.youtube_id ? <span>📺 Video Attached</span> : <span className="text-zinc-600">No Video</span>}
                    {topic.pdf_link ? <span>📄 PDF Attached</span> : <span className="text-zinc-600">No PDF</span>}
                  </div>
                </div>

                <button onClick={() => handleDelete(topic.id)} className="rounded-lg border border-red-900/50 bg-red-600/10 px-4 py-2 text-sm font-bold text-red-500 transition-colors hover:bg-red-600 hover:text-white sm:w-auto">
                  Delete
                </button>
                
              </div>
            ))}
            
            {topics.length === 0 && (
              <div className="rounded-xl border border-zinc-800 p-10 text-center text-zinc-500">
                Database is currently empty.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
