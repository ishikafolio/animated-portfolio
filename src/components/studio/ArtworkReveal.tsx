"use client";
import React, { useState } from "react";
import Image from "next/image";
import data from "../../../content/progelato.json";

export default function ArtworkReveal() {
  const [value, setValue] = useState(50);
  const [index, setIndex] = useState(0);
  const f = data.flavours[index];
  return <section className="artwork-reveal" aria-labelledby="reveal-title">
    <div className="studio-heading"><div><p className="studio-eyebrow">From surface to shelf</p><h2 id="reveal-title">A different dimension.</h2></div><p>Move the divider to compare the flat artwork with its pouch presentation.</p></div>
    <div className="reveal-toolbar"><label htmlFor="reveal-flavour">Explore a flavour</label><select id="reveal-flavour" value={index} onChange={e => setIndex(Number(e.target.value))}>{data.flavours.map((v, i) => <option key={v.id} value={i}>{v.name}</option>)}</select></div>
    <div className="reveal-stage"><Image src={f.mockupImage} alt={`${f.name} pouch presentation`} fill sizes="(max-width: 800px) 90vw, 75vw" className="object-contain" />
      <div className="reveal-top" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}><Image src={f.flatImage} alt={`${f.name} flat artwork`} fill sizes="(max-width: 800px) 90vw, 75vw" className="object-contain" /></div>
      <span className="reveal-line" style={{ left: `${value}%` }} aria-hidden><span>↔</span></span><span className="reveal-label left">Flat artwork</span><span className="reveal-label right">Pouch mockup</span>
    </div>
    <label className="reveal-slider" htmlFor="artwork-divider">Artwork reveal <span>{value}%</span><input id="artwork-divider" type="range" min="0" max="100" value={value} onChange={e => setValue(Number(e.target.value))} /></label>
    <p className="studio-small">A comparison of the supplied artwork and mockups. This is not a reconstruction of early sketches or a production-print test.</p>
  </section>;
}
