import { NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { STATUSES } from "@/lib/validation";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  status: z.enum(STATUSES).optional(),
  notes: z.string().max(5000).nullable().optional(),
});

// Middleware already protects /api/admin, this is a second check.
async function authorized(req: Request) {
  const cookie = req.headers.get("cookie") ?? "";
  const token = cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${ADMIN_COOKIE}=`))
    ?.slice(ADMIN_COOKIE.length + 1);
  return verifySessionToken(token ? decodeURIComponent(token) : null);
}

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await authorized(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid update" }, { status: 400 });

  const { data, error } = await getSupabaseAdmin().from("inquiries").update(parsed.data).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ inquiry: data });
}

export async function DELETE(req: Request, { params }: Ctx) {
  if (!(await authorized(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { error } = await getSupabaseAdmin().from("inquiries").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
