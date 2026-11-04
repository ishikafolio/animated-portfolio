"use client";
import React, { useState } from "react";
import Image from "next/image";
import data from "../../../content/progelato.json";

export default function PackagingShelf() {
  const [index, setIndex] = useState(0);
  const [view, setView] = useState<"mockup" | "artwork">("mockup");
  const flavour = data.flavours[index];
  return <div className="packaging-shelf" style={{ "--flavour": flavour.accentColor } as React.CSSProperties}>
    <div className="shelf-stage"><span className="shelf-watermark" aria-hidden>{flavour.name.split(" ")[0]}</span>
      <div className="shelf-product" key={`${flavour.id}-${view}`}><Image src={view === "mockup" ? flavour.mockupImage : flavour.flatImage}
        alt={`${flavour.name} — ${view === "mockup" ? "pouch mockup" : "flat packaging artwork"}`} fill sizes="(max-width: 800px) 90vw, 50vw" className="object-contain" /></div>
      <span className="shelf-counter">0{index + 1} / 07</span><span className="shelf-caption">{view === "mockup" ? "On the shelf" : "Behind the packaging"}</span>
    </div>
    <div className="shelf-details"><p className="studio-eyebrow">The flavour library</p><h3 aria-live="polite">{flavour.name}</h3><p>{flavour.descriptor}</p>
      <div className="segmented" aria-label="Packaging view"><button aria-pressed={view === "mockup"} onClick={() => setView("mockup")}>View mockup</button><button aria-pressed={view === "artwork"} onClick={() => setView("artwork")}>View artwork</button></div>
      <div className="flavour-options" aria-label="Choose a flavour">{data.flavours.map((f, i) => <button key={f.id} onClick={() => setIndex(i)} aria-pressed={index === i}>
        <span style={{ background: f.accentColor }} aria-hidden />{f.name}<span aria-hidden>{index === i ? "↗" : "+"}</span></button>)}</div>
      <p className="studio-small">One shared layout. Seven ingredient cues and colour stories. Original packaging artwork is preserved.</p>
    </div>
  </div>;
}
