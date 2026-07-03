"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation({ topics, sections }: { topics: any[], sections: string[] }) {
  const pathname = usePathname();

  const currentTopicId = pathname?.includes("/audit/topic/") ? pathname.split("/").pop() : null;
  const currentTopic = currentTopicId ? topics.find((t: any) => t.id.toString() === currentTopicId) : null;

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-zinc-800 bg-zinc-900 md:flex">
        <div className="flex-1 overflow-y-auto p-6">
          <Link href="/" className="mb-8 block text-2xl font-black text-white">
            CA <span className="text-red-600">Audit</span>
          </Link>
          <nav className="flex flex-col gap-4">
            <Link href="/audit" className="font-semibold text-zinc-400 transition-colors hover:text-white">Curriculum</Link>
            <Link href="/audit/resources" className="font-semibold text-zinc-400 transition-colors hover:text-white">All Notes</Link>
            
            <div className="mt-8 flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Course Sections</span>
              
              {sections.map((section) => {
                // Find the very first topic that belongs to this specific section
                const firstTopic = topics.find((t: any) => t.section_name === section);
                const targetUrl = firstTopic ? `/audit/topic/${firstTopic.id}` : "/audit";
                
                return (
                  <Link key={String(section)} href={targetUrl} className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
                    {String(section)}
                  </Link>
                );
              })}
              
            </div>
          </nav>
        </div>
        
        {/* Desktop "Now Playing" Indicator */}
        {currentTopic && (
          <div className="border-t border-zinc-800 bg-zinc-900/50 p-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">Currently Playing</span>
            <p className="mt-1 text-sm font-medium text-white line-clamp-2">{currentTopic.title}</p>
          </div>
        )}
      </aside>

      {/* MOBILE MENU */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-900 md:hidden">
        <details className="group relative">
          <summary className="flex cursor-pointer items-center justify-between p-4 outline-none">
            <div className="flex flex-col">
              <span className="font-bold text-white">Course Menu</span>
              {currentTopic && (
                <span className="mt-1 max-w-[250px] truncate text-xs font-medium text-red-400">
                  Playing: {currentTopic.title}
                </span>
              )}
            </div>
            <span className="text-white transition duration-300 group-open:rotate-180">▲</span>
          </summary>
          
          <nav className="absolute bottom-full left-0 flex max-h-[60vh] w-full flex-col gap-2 overflow-y-auto border-t border-zinc-800 bg-zinc-900 p-4 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
            <Link href="/audit" className="text-zinc-400 hover:text-white">Table of Contents</Link>
            <Link href="/audit/resources" className="text-zinc-400 hover:text-white">Notes</Link>
            <hr className="my-2 border-zinc-800" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Sections</span>
            
            {sections.map((section) => {
              // Same logic for the mobile menu links
              const firstTopic = topics.find((t: any) => t.section_name === section);
              const targetUrl = firstTopic ? `/audit/topic/${firstTopic.id}` : "/audit";
              
              return (
                <Link key={String(section)} href={targetUrl} className="text-sm text-zinc-300 hover:text-white">
                  {String(section)}
                </Link>
              );
            })}
            
          </nav>
        </details>
      </div>
    </>
  );
}
