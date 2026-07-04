import { supabase } from "../lib/supabase";
import Navigation from "./Navigation";
import Topbar from "./Topbar";

export const dynamic = 'force-dynamic';

export default async function AuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: topics } = await supabase
    .from("topics")
    .select("*")
    .order("id", { ascending: true });

  const sections = Array.from(new Set(topics?.map(t => t.section_name).filter(Boolean)));

  return (
    <div className="min-h-screen bg-zinc-950 pb-[76px] md:pb-0 md:pl-64">
      <Navigation topics={topics || []} sections={sections as string[]} />
      <Topbar />
      <main>
        {children}
      </main>
    </div>
  );
}
