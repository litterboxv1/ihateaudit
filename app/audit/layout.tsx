import { supabase } from "../lib/supabase";
import Navigation from "./Navigation";

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
    // pb-[76px] ensures content isn't hidden under the mobile bottom bar.
    // md:pl-64 ensures content isn't hidden under the desktop left sidebar.
    // md:pb-0 removes the bottom padding on desktop where it isn't needed.
    <div className="min-h-screen bg-zinc-950 pb-[76px] md:pb-0 md:pl-64">
      
      <Navigation topics={topics || []} sections={sections as string[]} />

      <main>
        {children}
      </main>
      
    </div>
  );
}
