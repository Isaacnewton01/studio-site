import { NextResponse } from "next/server";
import { isAdmin, makeToken, passwordOk } from "@/lib/auth";

export async function GET() { return NextResponse.json({ ok: await isAdmin() }); }

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (!passwordOk(String(password || ""))) return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin", makeToken(), { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 7 * 86400 });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("admin");
  return res;
}
