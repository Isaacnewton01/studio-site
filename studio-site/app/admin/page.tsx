"use client";
import { useEffect, useState } from "react";
import type { Content, Project } from "@/lib/content";

const blank: Project = { t: "New project", c: "Brand Identity", y: String(new Date().getFullYear()), d: "", o: "", p: "", dl: "", r: "", img: "", g: ["#1769FF", "#7B61FF"] };

function In({ l, v, on, area }: { l: string; v: string; on: (s: string) => void; area?: boolean }) {
  return <label>{l}{area ? <textarea rows={3} value={v} onChange={e => on(e.target.value)} /> : <input value={v} onChange={e => on(e.target.value)} />}</label>;
}

export default function Admin() {
  const [auth, setAuth] = useState<boolean | null>(null), [pw, setPw] = useState(""), [c, setC] = useState<Content | null>(null);
  const [msg, setMsg] = useState(""), [busy, setBusy] = useState(false);

  async function load() { setC(await (await fetch("/api/content")).json()); }
  useEffect(() => { fetch("/api/login").then(r => r.json()).then(j => { setAuth(j.ok); if (j.ok) load(); }); }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault(); setMsg("");
    const r = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    if (r.ok) { setAuth(true); load(); } else setMsg("Wrong password.");
  }
  async function save() {
    setBusy(true); setMsg("");
    const r = await fetch("/api/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(c) });
    const j = await r.json().catch(() => ({}));
    setMsg(r.ok ? "Saved. The live site is updated." : j.error || "Save failed."); setBusy(false);
    if (r.status === 401) setAuth(false);
  }
  const set = (fn: (d: Content) => void) => { const d = structuredClone(c!); fn(d); setC(d); };

  if (auth === null) return <div className="adm">Loading…</div>;
  if (!auth) return (
    <form className="adm" onSubmit={login} style={{ maxWidth: 420, marginTop: 80 }}>
      <h2>Admin sign in</h2>
      <label>Password<input type="password" value={pw} onChange={e => setPw(e.target.value)} autoFocus /></label>
      <button className="btn p">Sign in</button>{msg && <div className="msg bad">{msg}</div>}
    </form>);
  if (!c) return <div className="adm">Loading…</div>;

  return (
    <div className="adm">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h2>Edit your site</h2>
        <div className="row"><a className="btn s" href="/" target="_blank">View site</a>
          <button className="btn s" onClick={async () => { await fetch("/api/login", { method: "DELETE" }); setAuth(false); }}>Sign out</button></div>
      </div>

      <div className="panel"><h2>Brand and contact</h2>
        <In l="Studio name" v={c.brand.name} on={v => set(d => { d.brand.name = v; })} />
        <div className="r2"><In l="Public email" v={c.brand.email} on={v => set(d => { d.brand.email = v; })} />
          <In l="WhatsApp (country code + number, digits only)" v={c.brand.whatsapp} on={v => set(d => { d.brand.whatsapp = v.replace(/\D/g, ""); })} /></div>
        {c.brand.social.map((s, i) => <div className="r2" key={i}><In l="Social name" v={s.n} on={v => set(d => { d.brand.social[i].n = v; })} /><In l="Social URL (blank hides it)" v={s.u} on={v => set(d => { d.brand.social[i].u = v; })} /></div>)}
      </div>

      <div className="panel"><h2>Stats (blank value hides it)</h2>
        {c.stats.map((s, i) => <div className="r2" key={i}><In l="Value" v={s.v} on={v => set(d => { d.stats[i].v = v; })} /><In l="Label" v={s.l} on={v => set(d => { d.stats[i].l = v; })} /></div>)}
      </div>

      <div className="panel"><h2>Budget options (one per line)</h2>
        <textarea rows={8} value={c.budgets.join("\n")} onChange={e => set(d => { d.budgets = e.target.value.split("\n").filter(x => x.trim()); })} />
      </div>

      <div className="panel"><h2>Testimonials</h2>
        {c.testimonials.map((t, i) => <div className="sub" key={i}>
          <In area l="Quote" v={t.q} on={v => set(d => { d.testimonials[i].q = v; })} />
          <div className="r2"><In l="Client name" v={t.n} on={v => set(d => { d.testimonials[i].n = v; })} /><In l="Company" v={t.c} on={v => set(d => { d.testimonials[i].c = v; })} /></div>
          <button className="btn s" onClick={() => set(d => { d.testimonials.splice(i, 1); })}>Remove</button></div>)}
        <button className="btn s" onClick={() => set(d => { d.testimonials.push({ q: "", n: "", c: "" }); })}>Add testimonial</button>
      </div>

      <div className="panel"><h2>Projects</h2>
        {c.projects.map((p, i) => <div className="sub" key={i}>
          <div className="r2"><In l="Title" v={p.t} on={v => set(d => { d.projects[i].t = v; })} />
            <label>Category<input list="cats" value={p.c} onChange={e => set(d => { d.projects[i].c = e.target.value; })} /></label></div>
          <div className="r2"><In l="Year" v={p.y} on={v => set(d => { d.projects[i].y = v; })} /><In l="Cover image URL (optional)" v={p.img} on={v => set(d => { d.projects[i].img = v; })} /></div>
          <In l="Short description" v={p.d} on={v => set(d => { d.projects[i].d = v; })} />
          <In area l="Overview" v={p.o} on={v => set(d => { d.projects[i].o = v; })} />
          <In area l="Creative process" v={p.p} on={v => set(d => { d.projects[i].p = v; })} />
          <In l="Deliverables" v={p.dl} on={v => set(d => { d.projects[i].dl = v; })} />
          <In l="Results (verified only)" v={p.r} on={v => set(d => { d.projects[i].r = v; })} />
          <div className="row"><button className="btn s" disabled={i === 0} onClick={() => set(d => { [d.projects[i - 1], d.projects[i]] = [d.projects[i], d.projects[i - 1]]; })}>Move up</button>
            <button className="btn s" onClick={() => set(d => { d.projects.splice(i, 1); })}>Remove</button></div></div>)}
        <button className="btn s" onClick={() => set(d => { d.projects.push({ ...blank }); })}>Add project</button>
        <datalist id="cats">{["Brand Identity", "Advertising Campaigns", "Motion Graphics", "Social Media Design", "UI/UX and Web Design", "Experimental Design"].map(x => <option key={x} value={x} />)}</datalist>
      </div>

      <div className="bar-fix"><button className="btn p" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save changes"}</button>{msg && <span role="status">{msg}</span>}</div>
    </div>);
}
