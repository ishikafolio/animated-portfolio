import React from "react";
import Link from "next/link";
const AREAS = [
 { title: "Identity with character", category: "Brand / Visual exploration", text: "Six fictional identities exploring typography, symbols and applications across different industries.", link: "/work/logo-folio", cta: "Explore Logo Folio" },
 { title: "Care through clarity", category: "UI/UX / Interactive concept", text: "A ten-screen mobile concept connecting everyday parent tasks with permission-based family updates.", link: "/work/careconnect", cta: "Explore CareConnect" },
 { title: "Systems you can hold", category: "Packaging / Product presentation", text: "A seven-flavour pouch family and an imagined tea identity, each with its own visual language.", link: "/work/no-cheat-progelato", cta: "Explore Progelato" },
];
export default function ExperienceSection() {
 return <section id="experience" className="studio-section practice-section" aria-labelledby="practice-title">
  <div className="studio-heading"><div><p className="studio-eyebrow">Practice / Selected explorations</p><h2 id="practice-title">A practice across<br />different scales.</h2></div><p>From a small daily action to a whole visual family. The work connects expressive form with a consistent system.</p></div>
  <div className="practice-grid">{AREAS.map((a,i)=><article key={a.title}><span className="practice-number">0{i+1}</span><p className="studio-eyebrow">{a.category}</p><h3>{a.title}</h3><p>{a.text}</p><Link href={a.link} className="text-action">{a.cta} ↗</Link></article>)}</div>
 </section>;
}

