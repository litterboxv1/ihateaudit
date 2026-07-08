import { supabase } from "../lib/supabase";
import AuthGuard from "./AuthGuard";
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
    <AuthGuard>
      <div className="min-h-screen bg-zinc-950 pb-[76px] md:pb-0 md:pl-64">
        
        <Navigation topics={topics || []} sections={sections as string[]} />

        <main>
          {children}
        </main>
        
      </div>
    </AuthGuard>
  );
}
