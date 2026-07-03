import Link from "next/link";
import { supabase } from "../lib/supabase";

export const dynamic = 'force-dynamic';

export default async function AuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: topics } = await supabase
    .from("topics")
    .select("section_name")
    .order("id", { ascending: true });

  const sections = Array.from(new Set(topics?.map(t => t.section_name).filter(Boolean)));

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 md:flex-row">
      <div className="border-b border-zinc-800 bg-zinc-900 md:hidden">
        <details className="group">
          <summary className="flex cursor-pointer items-center justify-between p-4 font-bold text-white outline-none">
            <span>📚 Course Menu</span>
            <span className="transition duration-300 group-open:rotate-180">▼</span>
          </summary>
          <nav className="flex flex-col gap-2 border-t border-zinc-800 p-4">
            <Link href="/audit" className="text-zinc-400 hover:text-white">🏠 Home / Curriculum</Link>
            <Link href="/audit/resources" className="text-zinc-400 hover:text-white">📄 PDF Vault</Link>
            <hr className="my-2 border-zinc-800" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Sections</span>
            {sections.map((section) => (
              <Link key={String(section)} href={`/audit#${String(section).replace(/\s+/g, '-')}`} className="text-sm text-zinc-300 hover:text-white">
                {String(section)}
              </Link>
            ))}
          </nav>
        </details>
      </div>

      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-zinc-800 bg-zinc-900 p-6 md:flex">
        <Link href="/" className="mb-8 text-2xl font-black text-white">
          CA <span className="text-red-600">Audit</span>
        </Link>
        <nav className="flex flex-col gap-4">
          <Link href="/audit" className="font-semibold text-zinc-400 transition-colors hover:text-white">🏠 Curriculum</Link>
          <Link href="/audit/resources" className="font-semibold text-zinc-400 transition-colors hover:text-white">📄 PDF Vault</Link>
          <div className="mt-8 flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Course Sections</span>
            {sections.map((section) => (
              <Link key={String(section)} href={`/audit#${String(section).replace(/\s+/g, '-')}`} className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
                {String(section)}
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
