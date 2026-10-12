"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Content } from "@/lib/content";

const SERVICES: [string, string, string][] = [
  ["Brand Identity Design", "Logos, visual systems, typography, colour systems, brand guidelines, and complete identity development.", "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5"],
  ["Graphic Design", "Campaign visuals, social media designs, advertisements, posters, marketing materials, and promotional graphics.", "M4 4h16v16H4zM4 14l5-5 4 4 3-3 4 4"],
  ["Motion Design", "Animated ads, motion graphics, kinetic typography, logo animation, promo videos, and branded video content.", "M5 3l14 9-14 9V3z"],
  ["UI/UX Design", "Website interfaces, landing pages, mobile app interfaces, wireframes, prototypes, and user-centred experiences.", "M3 5h18v14H3zM3 9h18M7 14h5"],
  ["Web Design", "Modern websites, portfolio sites, agency sites, business landing pages, and conversion-focused experiences.", "M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"],
  ["Social Media and Content Design", "Social creatives, digital campaigns, content visuals, thumbnails, and visual storytelling.", "M4 5h16v11H9l-5 4V5z"],
];
const STEPS = [["Discovery", "Understand the client's goals, audience, and requirements."], ["Strategy", "Develop the creative direction and visual approach."], ["Design", "Explore concepts, create designs, and refine the strongest direction."], ["Refinement", "Incorporate feedback and polish the final deliverables."], ["Delivery", "Provide final files, assets, and agreed deliverables."]];
const WORDS = ["BRAND IDENTITY", "GRAPHIC DESIGN", "MOTION DESIGN", "UI/UX", "DIGITAL EXPERIENCES"];
const bg = (g: [string, string], img?: string) => ({ backgroundImage: `${img ? `url(${img}),` : ""}linear-gradient(135deg,${g[0]},${g[1]})` });

export default function Site({ c }: { c: Content }) {
  const [scrolled, setScrolled] = useState(false), [menu, setMenu] = useState(false);
  const [cat, setCat] = useState("All"), [open, setOpen] = useState<number | null>(null);
  const [prog, setProg] = useState(0);
  const dlg = useRef<HTMLDialogElement>(null), stage = useRef<HTMLDivElement>(null), tl = useRef<HTMLDivElement>(null), drag = useRef<HTMLDivElement>(null);
  const t0 = useRef(Date.now());
  const rm = () => matchMedia("(prefers-reduced-motion:reduce)").matches;
  const cats = ["All", ...Array.from(new Set(c.projects.map(p => p.c)))];

  useEffect(() => {
    const on = () => {
      setScrolled(scrollY > 20);
      if (tl.current) { const r = tl.current.getBoundingClientRect(); setProg(rm() ? 1 : Math.min(1, Math.max(0, (innerHeight * .75 - r.top) / (r.height + innerHeight * .2)))); }
    };
    on(); addEventListener("scroll", on, { passive: true });
    const mv = (e: MouseEvent) => {
      if (rm() || !stage.current) return;
      const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      stage.current.querySelectorAll<HTMLElement>("[data-d]").forEach(el => { const d = +(el.dataset.d || 0); el.style.translate = `${x * d}px ${y * d}px`; });
    };
    if (matchMedia("(pointer:fine)").matches) addEventListener("mousemove", mv);
    return () => { removeEventListener("scroll", on); removeEventListener("mousemove", mv); };
  }, []);
  useEffect(() => { if (open !== null) dlg.current?.showModal(); }, [open]);

  // draggable gallery
  const dr = useRef({ down: false, x: 0, l: 0 });
  const p = open !== null ? c.projects[open] : null;
  const soc = c.brand.social.filter(s => s.u);

  // contact form
  const [st, setSt] = useState<"idle" | "sending" | "ok" | "bad">("idle"), [errs, setErrs] = useState<Record<string, string>>({}), [note, setNote] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget), v = Object.fromEntries(fd) as Record<string, string>, er: Record<string, string> = {};
    if (!v.name?.trim()) er.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(v.email || "")) er.email = "Enter a valid email address.";
    if (!v.service) er.service = "Choose a service.";
    if (!v.budget) er.budget = "Choose a budget.";
    if ((v.desc || "").trim().length < 20) er.desc = "Describe your project in at least 20 characters.";
    setErrs(er);
    if (Object.keys(er).length) { setSt("bad"); setNote("Fix the highlighted fields and send again."); return; }
    setSt("sending"); setNote("");
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...v, elapsed: Date.now() - t0.current }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setSt("ok"); setNote("Thanks. Your inquiry was sent and we'll reply within two working days."); (e.target as HTMLFormElement).reset();
    } catch (x) { setSt("bad"); setNote((x as Error).message || "Something went wrong. Try again."); }
  }
  const Err = ({ k }: { k: string }) => <span className="err">{errs[k]}</span>;

  return (<>
    <svg width="0" height="0" style={{ position: "absolute" }}><defs><linearGradient id="gr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1769FF" /><stop offset="1" stopColor="#7B61FF" /></linearGradient></defs></svg>
    <nav className={`top${scrolled ? " sc" : ""}`}><div className="wrap nv">
      <a className="logo" href="#home">{c.brand.name}</a>
      <button className="burger" aria-label="Toggle menu" aria-expanded={menu} onClick={() => setMenu(!menu)}><span /><span /><span /></button>
      <div className={`links${menu ? " open" : ""}`} onClick={() => setMenu(false)}>
        <a href="#home">Home</a><a href="#services">Services</a><a href="#work">Projects</a><a href="#about">About</a><a href="#contact">Contact</a>
        <a className="btn p" href="#contact">Start a Project</a>
      </div></div></nav>

    <main>
      <section className="hero" id="home"><div className="wrap hg">
        <div>
          <div className="avail"><span className="dot" />Available for select projects</div>
          <h1>We turn bold ideas into <span className="g">unforgettable</span> visuals.</h1>
          <p className="lead">We build distinctive visual identities, compelling digital experiences, and motion-driven content that help brands stand out and connect with their audience.</p>
          <div className="cta"><a className="btn p" href="#contact">Let&apos;s Work Together</a><a className="btn s" href="#work">Explore Our Work</a></div>
        </div>
        <div className="stage" ref={stage} aria-hidden="true">
          <div data-d="30" className="sph fl" />
          <div data-d="14" className="c1 fl"><b>Brand system</b><div className="bar b" /><div className="bar" /></div>
          <div data-d="-18" className="c2 fl"><b>Landing page</b><div className="bar b" style={{ width: "80%" }} /><div className="bar" /></div>
          <div data-d="-8" className="c3 fl"><b style={{ font: "700 2rem var(--f-d)" }}>Aa</b><div style={{ color: "#9bb9ff", fontSize: ".8rem" }}>Space Grotesk</div></div>
        </div></div></section>

      <div className="mq" aria-hidden="true"><div>{[0, 1, 2, 3].flatMap(i => WORDS.map(w => <span key={i + w}>{w} <span className="g">/</span></span>))}</div></div>

      <section id="services"><div className="wrap">
        <div className="head"><h2>What we <span className="g">make</span></h2><p style={{ color: "var(--grey)" }}>Six disciplines, one connected visual language.</p></div>
        <div className="sv">{SERVICES.map(([t, d, path]) => <article key={t}><svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d={path} /></svg><h3>{t}</h3><p>{d}</p></article>)}</div>
      </div></section>

      <section id="work" style={{ background: "var(--surface)" }}><div className="wrap">
        <div className="head"><h2>Selected work</h2></div>
        <div className="flt" role="group" aria-label="Filter projects">{cats.map(k => <button key={k} type="button" aria-pressed={k === cat} onClick={() => setCat(k)}>{k}</button>)}</div>
        <div className="grid">{c.projects.map((q, i) => (cat === "All" || q.c === cat) && (
          <button key={i} className="pj" type="button" onClick={() => setOpen(i)}>
            <div className="art" style={bg(q.g, q.img)} />
            <div className="meta"><small>{q.c} · {q.y}</small><h3>{q.t}</h3><div className="more">{q.d} Open case study.</div></div>
          </button>))}</div>
      </div></section>

      <dialog ref={dlg} onClose={() => setOpen(null)} onClick={e => { if (e.target === dlg.current) dlg.current?.close(); }} aria-labelledby="dt">
        {p && <><div className="dh" style={bg(p.g, p.img)} /><button className="x" aria-label="Close" onClick={() => dlg.current?.close()}>&times;</button>
          <div className="db"><small style={{ color: "var(--grey)" }}>{p.c} · {p.y}</small><h3 id="dt">{p.t}</h3><p>{p.d}</p>
            <dl><dt>Overview</dt><dd>{p.o}</dd><dt>Process</dt><dd>{p.p}</dd><dt>Deliverables</dt><dd>{p.dl}</dd><dt>Results</dt><dd>{p.r}</dd></dl></div></>}
      </dialog>

      <section className="show"><div className="wrap">
        <div className="kin" aria-label="Design is a decision.">{"Design is a decision.".split(" ").map((w, i) => <span key={i} aria-hidden="true">{[...w].map((ch, j) => <span key={j}>{ch}</span>)}{" "}</span>)}</div>
        <div className="drag" ref={drag} tabIndex={0} aria-label="Creative gallery, drag or scroll sideways"
          onPointerDown={e => { dr.current = { down: true, x: e.clientX, l: drag.current!.scrollLeft }; drag.current!.classList.add("on"); }}
          onPointerMove={e => { if (dr.current.down) drag.current!.scrollLeft = dr.current.l - (e.clientX - dr.current.x); }}
          onPointerUp={() => { dr.current.down = false; drag.current!.classList.remove("on"); }}
          onPointerLeave={() => { dr.current.down = false; drag.current!.classList.remove("on"); }}>
          {["Type", "Colour", "Form", "Motion", "Space"].map((t, i) => <div key={t} style={bg(c.projects[i % c.projects.length]?.g || ["#1769FF", "#7B61FF"])}>{t}</div>)}
        </div></div></section>

      <section id="about"><div className="wrap ab">
        <div className="portrait"><b>Add your portrait or studio photo</b></div>
        <div>
          <h2>Good design gets attention. <span className="g">Great design builds recognition.</span></h2>
          <p style={{ marginTop: 20, color: "var(--grey)" }}>We combine strategic thinking, visual storytelling, and contemporary design to create work that gives brands a stronger identity and a more memorable presence.</p>
          <div className="stats">{c.stats.filter(s => s.v.trim()).map(s => <div key={s.l}><b>{s.v}</b><span>{s.l}</span></div>)}</div>
        </div></div></section>

      <section style={{ background: "var(--surface)" }}><div className="wrap">
        <div className="head"><h2>From idea to delivery</h2></div>
        <div className="tl" ref={tl} style={{ ["--p" as string]: `${prog * 100}%` }}><i />
          {STEPS.map(([t, d], i) => <div key={t} className={`st${prog >= i / STEPS.length + .02 ? " on" : ""}`}><small className="g" style={{ fontWeight: 700 }}>0{i + 1}</small><h3>{t}</h3><p>{d}</p></div>)}
        </div></div></section>

      <section><div className="wrap">
        <div className="head"><h2>Client words</h2></div>
        <div className="tm">{c.testimonials.map((t, i) => <blockquote key={i}><p>{t.q}</p><cite>{t.n}, {t.c}</cite></blockquote>)}</div>
      </div></section>

      <section id="contact" style={{ background: "var(--surface)" }}><div className="wrap ct">
        <div>
          <h2>Have an idea? Let&apos;s make it <span className="g">impossible to ignore.</span></h2>
          <p style={{ marginTop: 20, color: "var(--grey)" }}>Tell us what you&apos;re building. You&apos;ll get a reply within two working days.</p>
          <div className="ci"><a href={`mailto:${c.brand.email}`}>{c.brand.email}</a>
            <a className="btn s" style={{ justifySelf: "start" }} target="_blank" rel="noopener" href={`https://wa.me/${c.brand.whatsapp}?text=${encodeURIComponent("Hi, I'd like to discuss a project.")}`}>Chat on WhatsApp</a></div>
        </div>
        <form onSubmit={submit} noValidate>
          <div className="r2"><label>Full name<input name="name" autoComplete="name" /><Err k="name" /></label><label>Email address<input name="email" type="email" autoComplete="email" /><Err k="email" /></label></div>
          <div className="r2"><label>Company or brand<input name="company" autoComplete="organization" /></label>
            <label>Service required<select name="service" defaultValue=""><option value="">Choose one</option>{SERVICES.map(s => <option key={s[0]}>{s[0]}</option>)}</select><Err k="service" /></label></div>
          <div className="r2"><label>Budget<select name="budget" defaultValue=""><option value="">Choose one</option>{c.budgets.map(b => <option key={b}>{b}</option>)}</select><Err k="budget" /></label>
            <label>Timeline<select name="timeline"><option>Flexible</option><option>Under 2 weeks</option><option>1 month</option><option>2-3 months</option></select></label></div>
          <label>Project description<textarea name="desc" rows={5} /><Err k="desc" /></label>
          <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <button className="btn p" disabled={st === "sending"}>{st === "sending" ? "Sending…" : "Send inquiry"}</button>
          {note && <div className={`msg ${st === "ok" ? "ok" : "bad"}`} role="status">{note}</div>}
        </form>
      </div></section>
    </main>

    <footer><div className="wrap">
      <h2 style={{ position: "relative" }}>Let&apos;s create something <span className="g" style={{ filter: "brightness(1.4)" }}>remarkable.</span></h2>
      <div className="fg">
        <div><b className="logo">{c.brand.name}</b><p style={{ color: "#b8c4dc", marginTop: 10 }}>Visual identities, motion and digital experiences for ambitious brands.</p></div>
        <div><b>Navigate</b><ul><li><a href="#home">Home</a></li><li><a href="#work">Projects</a></li><li><a href="#about">About</a></li><li><a href="#contact">Contact</a></li></ul></div>
        <div><b>Services</b><ul>{SERVICES.map(s => <li key={s[0]}><a href="#services">{s[0]}</a></li>)}</ul></div>
        <div><b>Connect</b><ul><li><a href={`mailto:${c.brand.email}`}>Email</a></li>{soc.map(s => <li key={s.n}><a href={s.u} target="_blank" rel="noopener">{s.n}</a></li>)}</ul></div>
      </div>
      <div className="cp">&copy; {new Date().getFullYear()} {c.brand.name}. All rights reserved.</div>
    </div></footer>
  </>);
}
