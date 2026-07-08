"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation({ topics = [], sections = [] }: { topics: any[], sections: string[] }) {
  const pathname = usePathname();

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="fixed bottom-0 left-0 top-0 z-50 hidden w-64 flex-col border-r border-zinc-800 bg-zinc-950 md:flex">
        <div className="flex h-24 items-center px-6">
          <Link href="/audit" className="text-2xl font-black tracking-tight text-white">
            I<span className="text-red-500">Hate</span>Audit
          </Link>
        </div>
        
        <div className="flex flex-1 flex-col overflow-y-auto px-4 pb-4">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-500">Menu</div>
          <Link 
            href="/audit" 
            className={`mb-1 flex items-center rounded-xl px-4 py-3 text-sm font-bold transition-all ${
              pathname === '/audit' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
            }`}
          >
            Curriculum
          </Link>
          <Link 
            href="/audit/profile" 
            className={`mb-8 flex items-center rounded-xl px-4 py-3 text-sm font-bold transition-all ${
              pathname === '/audit/profile' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
            }`}
          >
            My Profile
          </Link>

          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-500">Syllabus</div>
          <div className="space-y-1">
            {sections.map((section, idx) => (
              <div key={idx} className="rounded-lg px-4 py-2 text-xs font-medium text-zinc-500">
                {section}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-[76px] items-center justify-around border-t border-zinc-800 bg-zinc-950/90 pb-safe pt-2 backdrop-blur-md md:hidden">
        <Link href="/audit" className={`flex w-full flex-col items-center justify-center pb-2 ${pathname === '/audit' ? 'text-white' : 'text-zinc-500'}`}>
          <span className="text-xs font-bold uppercase tracking-wider">Vault</span>
        </Link>
        <Link href="/audit/profile" className={`flex w-full flex-col items-center justify-center pb-2 ${pathname === '/audit/profile' ? 'text-white' : 'text-zinc-500'}`}>
          <span className="text-xs font-bold uppercase tracking-wider">Profile</span>
        </Link>
      </nav>
    </>
  );
}
