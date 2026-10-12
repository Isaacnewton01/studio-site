import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getContent, saveContent, type Content } from "@/lib/content";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() { return NextResponse.json(await getContent()); }

export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const c = (await req.json().catch(() => null)) as Content | null;
  if (!c?.brand || !Array.isArray(c.projects) || !Array.isArray(c.stats) || !Array.isArray(c.testimonials) || !Array.isArray(c.budgets))
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  try { await saveContent(c); } catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 500 }); }
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
