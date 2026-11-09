import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { inquirySchema } from "@/lib/validation";

export const runtime = "nodejs";

// Best-effort spam guard: max 5 submissions per IP per 10 minutes (per server instance).
const hits = new Map<string, number[]>();
const WINDOW = 10 * 60 * 1000;
const LIMIT = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again in a few minutes." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again.", fields: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { website, ...data } = parsed.data;
  // Honeypot filled: pretend success, store nothing.
  if (website) return NextResponse.json({ ok: true });

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("inquiries").insert({
      name: data.name,
      company: data.company || null,
      email: data.email.toLowerCase(),
      phone: data.phone,
      project_name: data.project_name,
      requirements: data.requirements,
      budget: data.budget || null,
      timeline: data.timeline || null,
      services: data.services && data.services.length ? data.services : null,
    });
    if (error) throw error;
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[inquiries] insert failed:", err);
    return NextResponse.json(
      { error: "We couldn't send your inquiry right now. Please email us directly." },
      { status: 500 },
    );
  }
}
