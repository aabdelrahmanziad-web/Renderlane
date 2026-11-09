import { getSupabaseAdmin } from "@/lib/supabase";
import type { Inquiry } from "@/lib/validation";
import { AdminDashboard } from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let inquiries: Inquiry[] = [];
  let loadError: string | null = null;

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) throw error;
    inquiries = (data ?? []) as Inquiry[];
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Could not load inquiries.";
  }

  return <AdminDashboard initial={inquiries} loadError={loadError} />;
}
