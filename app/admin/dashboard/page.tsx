"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { logoutAdmin } from "../../actions/auth";

export default function AdminDashboard() {
  const router = useRouter();
  
  const [topics, setTopics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"module" | "mcq">("module");

  // Module Form State
  const [title, setTitle] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [pdfLink, setPdfLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // MCQ Form State
  const [mcqTopicId, setMcqTopicId] = useState("");
  const [question, setQuestion] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [optD, setOptD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("A");
  const [explanation, setExplanation] = useState("");
  const [isSubmittingMcq, setIsSubmittingMcq] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      const { data } = await supabase.from("topics").select("*").order("id", { ascending: false });
      if (data) {
        setTopics(data);
        if (data.length > 0) setMcqTopicId(data[0].id.toString()); // Default to first topic
      }
      setIsLoading(false);
    };
    fetchTopics();
  }, []);

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
      setTitle(""); setSectionName(""); setYoutubeId(""); setPdfLink("");
    } else {
      alert("Error saving module.");
    }
    setIsSubmitting(false);
  };

  const handleAddMcq = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingMcq(true);
    const newMcq = {
      topic_id: parseInt(mcqTopicId),
      question,
      option_a: optA,
      option_b: optB,
      option_c: optC,
      option_d: optD,
      correct_answer: correctAnswer,
      explanation,
    };
    const { error } = await supabase.from("mcqs").insert([newMcq]);
    if (!error) {
      alert("✅ MCQ successfully added to the database!");
      setQuestion(""); setOptA(""); setOptB(""); setOptC(""); setOptD(""); setExplanation("");
    } else {
      alert("Error saving MCQ.");
      console.error(error);
    }
    setIsSubmittingMcq(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this module? All attached MCQs will also be deleted.")) return;
    const { error } = await supabase.from("topics").delete().eq("id", id);
    if (!error) setTopics(topics.filter((t) => t.id !== id));
  };

  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/admin");
  };

  if (isLoading) return <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">Loading Vault Data...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 p-6 md:p-10">
      
      <div className="mb-10 flex flex-col gap-4 border-b border-zinc-800 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Admin <span className="text-red-600">Control Room</span></h1>
          <p className="text-zinc-400">Manage your course curriculum and testing engine.</p>
        </div>
        <button onClick={handleLogout} className="w-full rounded-lg bg-zinc-800 px-4 py-3 font-bold text-white hover:bg-zinc-700 md:w-auto">
          Lock Vault 🔒
        </button>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        
        {/* ADD CONTENT PANEL */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl">
            
            {/* Tabs */}
            <div className="flex border-b border-zinc-800">
              <button 
                onClick={() => setActiveTab("module")}
                className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === "module" ? "text-red-500 shadow-[inset_0_-2px_0_0_#ef4444]" : "text-zinc-500 hover:text-white"}`}
              >
                + Module
              </button>
              <button 
                onClick={() => setActiveTab("mcq")}
                className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === "mcq" ? "text-red-500 shadow-[inset_0_-2px_0_0_#ef4444]" : "text-zinc-500 hover:text-white"}`}
              >
                + Quiz Question
              </button>
            </div>

            <div className="p-6">
              {activeTab === "module" ? (
                <form onSubmit={handleAddTopic} className="flex flex-col gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-zinc-500">Module Title *</label>
                    <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-red-500" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-zinc-500">Section Name *</label>
                    <input required type="text" value={sectionName} onChange={(e) => setSectionName(e.target.value)} className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-red-500" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-zinc-500">YouTube ID</label>
                    <input type="text" value={youtubeId} onChange={(e) => setYoutubeId(e.target.value)} className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-red-500" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-zinc-500">PDF Drive Link</label>
                    <input type="url" value={pdfLink} onChange={(e) => setPdfLink(e.target.value)} className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-red-500" />
                  </div>
                  <button disabled={isSubmitting} type="submit" className="mt-2 w-full rounded-xl bg-zinc-800 p-4 font-bold text-white hover:bg-zinc-700">
                    {isSubmitting ? "Saving..." : "Save Module"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleAddMcq} className="flex flex-col gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-zinc-500">Select Module *</label>
                    <select required value={mcqTopicId} onChange={(e) => setMcqTopicId(e.target.value)} className="w-full appearance-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-red-500">
                      {topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-zinc-500">Question *</label>
                    <textarea required value={question} onChange={(e) => setQuestion(e.target.value)} rows={3} className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-red-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input required type="text" placeholder="Option A" value={optA} onChange={(e) => setOptA(e.target.value)} className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-red-500" />
                    <input required type="text" placeholder="Option B" value={optB} onChange={(e) => setOptB(e.target.value)} className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-red-500" />
                    <input required type="text" placeholder="Option C" value={optC} onChange={(e) => setOptC(e.target.value)} className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-red-500" />
                    <input required type="text" placeholder="Option D" value={optD} onChange={(e) => setOptD(e.target.value)} className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-red-500" />
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1/3">
                      <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-zinc-500">Answer *</label>
                      <select value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} className="w-full appearance-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-center font-bold text-white outline-none focus:border-red-500">
                        <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                      </select>
                    </div>
                    <div className="w-2/3">
                      <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-zinc-500">Explanation</label>
                      <input type="text" placeholder="Why is it correct?" value={explanation} onChange={(e) => setExplanation(e.target.value)} className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-red-500" />
                    </div>
                  </div>
                  <button disabled={isSubmittingMcq} type="submit" className="mt-2 w-full rounded-xl bg-red-600 p-4 font-bold text-white hover:bg-red-700">
                    {isSubmittingMcq ? "Saving..." : "Publish Question"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* CURRENT CURRICULUM LIST */}
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
                </div>
                <button onClick={() => handleDelete(topic.id)} className="rounded-lg border border-red-900/50 bg-red-600/10 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-600 hover:text-white sm:w-auto">
                  Delete Module
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
