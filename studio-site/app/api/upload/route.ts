import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { isAdmin } from "@/lib/auth";

const OK = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.BLOB_READ_WRITE_TOKEN)
    return NextResponse.json({ error: "Image storage is not set up. Add a Blob store in Vercel (Storage tab) and redeploy." }, { status: 500 });
  const f = (await req.formData().catch(() => null))?.get("file");
  if (!(f instanceof File) || !OK.includes(f.type)) return NextResponse.json({ error: "Upload a JPG, PNG, WebP or GIF image." }, { status: 400 });
  if (f.size > 4 * 1024 * 1024) return NextResponse.json({ error: "Image is over 4MB." }, { status: 413 });
  const name = f.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").slice(-60);
  try {
    const b = await put(`designs/${name}`, f, { access: "public", addRandomSuffix: true });
    return NextResponse.json({ url: b.url });
  } catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 500 }); }
}
