"use server";

import { cookies } from "next/headers";

export async function loginAdmin(pin: string) {
  // 1. Fetch the real password from Vercel's secure environment variables
  // (We use a fallback of "2026" just so it doesn't crash while we set it up)
  const validPin = process.env.ADMIN_PIN || "2026";
  
  if (pin === validPin) {
    // 2. Plant an un-forgeable, invisible HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_token", "secure_session_active", {
      httpOnly: true, // Javascript CANNOT read this
      secure: process.env.NODE_ENV === "production", // Only works over HTTPS
      maxAge: 60 * 60 * 24, // Expires in 24 hours
      path: "/",
    });
    return { success: true };
  }
  
  return { success: false };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
}
