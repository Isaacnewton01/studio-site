import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const sign = (e: string) => createHmac("sha256", process.env.SESSION_SECRET || "").update(e).digest("hex");

export function makeToken() {
  const exp = String(Date.now() + 7 * 864e5);
  return `${exp}.${sign(exp)}`;
}
export async function isAdmin() {
  if (!process.env.SESSION_SECRET) return false;
  const v = (await cookies()).get("admin")?.value;
  const [exp, sig] = (v || "").split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const a = Buffer.from(sig), b = Buffer.from(sign(exp));
  return a.length === b.length && timingSafeEqual(a, b);
}
export function passwordOk(input: string) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  const h = (s: string) => createHmac("sha256", "pw").update(s).digest();
  return timingSafeEqual(h(input), h(pw));
}
