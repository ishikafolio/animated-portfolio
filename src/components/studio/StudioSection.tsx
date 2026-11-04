"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Layers, BookOpen, Palette, Package } from "lucide-react";

const DESK = [
  { name: "Colour cards", icon: Palette, image: "/projects/aara/aara-cover.webp", title: "A palette with a purpose.", text: "Aara brings forest, olive and parchment together across different objects. Colour creates continuity without making every surface identical.", link: "/work/aara", cta: "Explore the tea identity" },
  { name: "The layout", icon: Layers, image: "/projects/progelato/mastana-mango-flat.png", title: "A system that leaves room to play.", text: "The Progelato range repeats its hierarchy, then lets flavour colour and ingredient cues do the differentiating. Compare the surfaces with their pouch mockups.", link: "/work/no-cheat-progelato#artwork", cta: "Explore the artwork" },
  { name: "Field notes", icon: BookOpen, image: "/projects/careconnect/style-guide.webp", title: "Clarity is a design material.", text: "CareConnect pairs legible type with a gentle visual direction. The parent and caregiver flows separate daily actions from the wider overview.", link: "/work/careconnect#try-demo", cta: "Try the interaction" },
  { name: "Small objects", icon: Package, image: "/projects/aara/aara-stationery-crop.webp", title: "The identity lives in the details.", text: "A card, a carton and a tin each have a different scale. A coordinated type and colour language connects these touchpoints.", link: "/work/aara#ritual", cta: "Explore the details" },
];

export default function StudioSection() {
  const [object, setObject] = useState(0);
  const [text, setText] = useState("MAKE IT FEEL.");
  const [spacing, setSpacing] = useState(0);
  const [tilt, setTilt] = useState(-5);
  const [mode, setMode] = useState(0);
  const item = DESK[object];
  return <>
    <section id="studio" className="studio-section studio-desk" aria-labelledby="studio-title">
      <div className="studio-heading"><div><p className="studio-eyebrow">Away from the final frame</p><h2 id="studio-title">Inside the studio.</h2></div><p>A few objects. A few observations. Pick something from the desk to look a little closer.</p></div>
      <div className="desk-layout"><div className="desk-surface"><span className="desk-label">Ishika’s working table / explore</span>
        {DESK.map((d, i) => <button key={d.name} className={`desk-object desk-object-${i}`} aria-pressed={object === i} onClick={() => setObject(i)} data-character-mood="Curious"><d.icon size={30} strokeWidth={1.3} aria-hidden /><span>{d.name}</span><span className="desk-object-number">0{i + 1}</span></button>)}
        <span className="desk-doodle" aria-hidden>curiosity<br />belongs here ↗</span>
      </div><div className="desk-detail"><div className="desk-preview"><Image src={item.image} alt={`${item.name} — project detail`} fill sizes="(max-width: 800px) 90vw, 35vw" className="object-contain" /></div>
        <div aria-live="polite"><p className="studio-eyebrow">Notes on the work / 0{object + 1}</p><h3>{item.title}</h3><p>{item.text}</p><Link className="text-action" href={item.link}>{item.cta} ↗</Link></div></div></div>
    </section>
    <section id="experiments" className="studio-section experiments" aria-labelledby="experiments-title"><div className="studio-heading"><div><p className="studio-eyebrow">No brief. Just curiosity.</p><h2 id="experiments-title">A little room to play.</h2></div><p>Two small experiments made for this studio. Change a rule and see what happens.</p></div>
      <div className="experiment-grid"><article className="type-experiment"><div className="experiment-label"><span>01 / Type playground</span><span aria-hidden>↗</span></div>
        <div className="type-preview"><span style={{ letterSpacing: `${spacing / 100}em`, transform: `rotate(${tilt}deg)` }}>{text || "MAKE IT FEEL."}</span></div>
        <div className="experiment-controls"><label htmlFor="experiment-text">Your words<input id="experiment-text" value={text} onChange={e => setText(e.target.value)} maxLength={28} /></label>
          <label htmlFor="type-spacing">Letter spacing <output>{spacing}</output><input id="type-spacing" type="range" min="-6" max="18" value={spacing} onChange={e => setSpacing(Number(e.target.value))} /></label>
          <label htmlFor="type-tilt">A little attitude <output>{tilt}°</output><input id="type-tilt" type="range" min="-12" max="12" value={tilt} onChange={e => setTilt(Number(e.target.value))} /></label></div>
      </article><article className={`mark-experiment mark-mode-${mode}`}><div className="experiment-label"><span>02 / Initial studies</span><span aria-hidden>✳</span></div>
        <div className="mark-preview" aria-label={`IS initials in ${["stacked", "outlined", "offset"][mode]} composition`}><span>I</span><span>S</span><i aria-hidden /></div>
        <div className="mark-controls"><h3>Same letters. Different energy.</h3><p>A live composition study using the studio’s display type.</p><div className="segmented" aria-label="Initial composition">{["Stacked", "Outlined", "Offset"].map((m, i) => <button key={m} aria-pressed={mode === i} onClick={() => setMode(i)}>{m}</button>)}</div></div>
      </article></div>
    </section>
  </>;
}
