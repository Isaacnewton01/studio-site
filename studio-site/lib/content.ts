import { Redis } from "@upstash/redis";

export type Project = { t: string; c: string; y: string; d: string; o: string; p: string; dl: string; r: string; img: string; gallery: string[]; g: [string, string] };
export type Content = {
  brand: { name: string; email: string; whatsapp: string; social: { n: string; u: string }[] };
  stats: { v: string; l: string }[];
  testimonials: { q: string; n: string; c: string }[];
  budgets: string[];
  portrait: string;
  projects: Project[];
};

export const defaults: Content = {
  brand: { name: "Your Studio", email: "hello@example.com", whatsapp: "2340000000000",
    social: [{ n: "Instagram", u: "" }, { n: "Behance", u: "" }, { n: "LinkedIn", u: "" }, { n: "X", u: "" }] },
  stats: [{ v: "", l: "Years of experience" }, { v: "", l: "Projects completed" }, { v: "", l: "Clients served" }],
  testimonials: [{ q: "[Placeholder] Add a real client quote in /admin.", n: "Client name", c: "Company" }],
  portrait: "",
  budgets: ["Under ₦500,000", "₦500,000 – ₦1,500,000", "₦1,500,000 – ₦5,000,000", "₦5,000,000+", "Under $1,000", "$1,000 – $5,000", "$5,000 – $15,000", "$15,000+", "Not sure yet"],
  projects: [
    { t: "Sample Brand Identity", c: "Brand Identity", y: "2025", d: "A placeholder identity system.", o: "Describe the brief.", p: "Describe your process.", dl: "Logo, colour system, guidelines", r: "Add verified results.", img: "", gallery: [], g: ["#1769FF", "#7B61FF"] },
    { t: "Sample Ad Campaign", c: "Advertising Campaigns", y: "2025", d: "A placeholder campaign.", o: "Describe the campaign.", p: "Describe your process.", dl: "Posters, social ads", r: "Add verified results.", img: "", gallery: [], g: ["#07152F", "#1769FF"] },
    { t: "Sample Motion Reel", c: "Motion Graphics", y: "2024", d: "A placeholder motion piece.", o: "Describe the piece.", p: "Describe your process.", dl: "Logo animation, promo", r: "Add verified results.", img: "", gallery: [], g: ["#7B61FF", "#DCEBFF"] },
    { t: "Sample Social Kit", c: "Social Media Design", y: "2024", d: "A placeholder content system.", o: "Describe the kit.", p: "Describe your process.", dl: "Post and story templates", r: "Add verified results.", img: "", gallery: [], g: ["#1769FF", "#9bb9ff"] },
    { t: "Sample Web App UI", c: "UI/UX and Web Design", y: "2025", d: "A placeholder interface.", o: "Describe the product.", p: "Describe your process.", dl: "Wireframes, prototype", r: "Add verified results.", img: "", gallery: [], g: ["#07152F", "#7B61FF"] },
    { t: "Sample Type Experiment", c: "Experimental Design", y: "2024", d: "A placeholder experiment.", o: "Describe the idea.", p: "Describe the exploration.", dl: "Poster series", r: "Add notes.", img: "", gallery: [], g: ["#7B61FF", "#1769FF"] },
  ],
};

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const redis = () => (url && token ? new Redis({ url, token }) : null);

export async function getContent(): Promise<Content> {
  try {
    const stored = await redis()?.get<Content>("content");
    if (!stored) return defaults;
    return { ...defaults, ...stored, projects: stored.projects.map(p => ({ ...p, img: p.img ?? "", gallery: p.gallery ?? [] })) };
  } catch { return defaults; }
}
export async function saveContent(c: Content) {
  const r = redis();
  if (!r) throw new Error("Redis is not configured");
  await r.set("content", c);
}
