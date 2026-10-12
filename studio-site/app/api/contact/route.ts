import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const d = await req.json().catch(() => null);
  if (!d) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  // spam protection: honeypot + minimum fill time
  if (d.website || Number(d.elapsed) < 3000) return NextResponse.json({ error: "Blocked as spam" }, { status: 400 });
  const s = (k: string, max = 2000) => String(d[k] ?? "").trim().slice(0, max);
  const name = s("name", 120), email = s("email", 200), desc = s("desc");
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || desc.length < 20 || !s("service") || !s("budget"))
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  const key = process.env.RESEND_API_KEY, to = process.env.CONTACT_TO;
  if (!key || !to) return NextResponse.json({ error: "Email is not configured on the server." }, { status: 500 });

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || "onboarding@resend.dev",
      to: [to], reply_to: email,
      subject: `Project inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nCompany: ${s("company")}\nService: ${s("service")}\nBudget: ${s("budget")}\nTimeline: ${s("timeline")}\n\n${desc}`,
    }),
  });
  if (!r.ok) return NextResponse.json({ error: "Could not send your message. Please try WhatsApp or email." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
