import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check for the secure cookie BEFORE rendering the dashboard
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  // If the cookie is missing or fake, kick them to the login screen
  if (!token || token.value !== "secure_session_active") {
    redirect("/admin");
  }

  // If they have the VIP pass, let them in
  return <>{children}</>;
}
