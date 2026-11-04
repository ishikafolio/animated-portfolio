"use client";
import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Copy, Mail, ArrowLeft } from "lucide-react";
export default function ContactSection() {
 const [data, setData] = useState({ name: "", email: "", category: "Brand identity", message: "" });
 const [prepared, setPrepared] = useState(false);
 const [copyStatus, setCopyStatus] = useState("");
 const [error, setError] = useState("");
 const briefHeading = useRef<HTMLHeadingElement>(null);
 useEffect(() => { if (prepared) briefHeading.current?.focus(); }, [prepared]);
 const body = `Hello Ishika,\n\n${data.message}\n\nProject interest: ${data.category}\n\nFrom: ${data.name}\nReply to: ${data.email}`;
 const href = `mailto:ishikashrivastav@gmail.com?subject=${encodeURIComponent("Project inquiry — " + data.category)}&body=${encodeURIComponent(body)}`;
 async function copy() {
  try { await navigator.clipboard.writeText(body); setCopyStatus("Brief copied. Paste it into your email."); }
  catch { setCopyStatus("Select and copy the brief below, then email Ishika directly."); }
 }
 return <section id="contact" className="studio-section contact-studio" aria-labelledby="contact-title">
  <div><p className="studio-eyebrow">An idea starts with a conversation</p><h2 id="contact-title">Let’s make<br />something<br /><em>feel right.</em></h2>
    <p>Have a brand to build, a product to untangle or packaging to bring to life? Tell me what you have in mind.</p>
    <a className="contact-email" href="mailto:ishikashrivastav@gmail.com" data-character-mood="Happy">ishikashrivastav@gmail.com <ArrowUpRight size={18} /></a>
    <a className="text-action" href="tel:+917777958649">+91 77779 58649 ↗</a><p className="studio-small">Based in India / Open to remote collaboration</p>
  </div>
  <div className="contact-card">{prepared ? <div className="prepared-brief">
    <p className="studio-eyebrow">Your brief is ready</p><h3 ref={briefHeading} tabIndex={-1}>One more step:<br />send it from your email.</h3><p>This website has not sent your message. Open your email app with the brief filled in, then review and send it.</p>
    <a className="studio-button" href={href}><Mail size={17} /> Open email app</a>
    <button className="text-action" onClick={copy}><Copy size={15} /> Copy the brief</button><p role="status">{copyStatus}</p>
    <label htmlFor="prepared-brief">Your message<textarea id="prepared-brief" readOnly value={body} rows={8} /></label>
    <button className="text-action" onClick={()=>{setPrepared(false);setCopyStatus("");}}><ArrowLeft size={15} /> Edit your brief</button>
  </div> : <form onSubmit={e=>{e.preventDefault();if (!data.name.trim() || !data.message.trim()) {setError("Please add your name and a short project description.");return;}setError("");setData({...data,name:data.name.trim(),email:data.email.trim(),message:data.message.trim()});setPrepared(true);}} className="studio-form">
    <h3>A few details to get started.</h3><p className="studio-small">Prepare a brief, then send it through your email app.</p>
    <label htmlFor="name">Your name<input id="name" name="name" autoComplete="name" required maxLength={100} value={data.name} onChange={e=>setData({...data,name:e.target.value})} placeholder="What should I call you?" /></label>
    <label htmlFor="email">Your email<input id="email" name="email" type="email" autoComplete="email" required maxLength={160} value={data.email} onChange={e=>setData({...data,email:e.target.value})} placeholder="you@company.com" /></label>
    <label htmlFor="category">I’m interested in<select id="category" value={data.category} onChange={e=>setData({...data,category:e.target.value})}>{["Brand identity","UI/UX design","Packaging design","Design systems","Collaboration"].map(c=><option key={c}>{c}</option>)}</select></label>
    <label htmlFor="message">A little about the project<textarea id="message" required maxLength={2000} rows={4} value={data.message} onChange={e=>setData({...data,message:e.target.value})} placeholder="Your idea, scope, timeline…" /></label>
    <button className="studio-button" type="submit" data-character-mood="Happy">Prepare email <ArrowUpRight size={17} /></button>
    {error && <p role="alert">{error}</p>}
  </form>}</div>
 </section>;
}

