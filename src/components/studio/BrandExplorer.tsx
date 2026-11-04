"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import data from "../../../content/logo-folio.json";

const PALETTES = [["#513528", "#E7D7BA", "#72815E"], ["#203B31", "#E7E4D6", "#8F9C7C"], ["#211C1C", "#F2EDE6", "#9E4145"], ["#314F60", "#E8D9C2", "#A3B5BB"], ["#AE3728", "#F0C994", "#668041"], ["#292334", "#B29ADD", "#82CFDC"]];
const TYPE_NOTES = ["Expressive serif forms and an organic symbol give the coffee concept a tactile character.", "Elegant lettering and botanical symbolism support a quiet wellness direction.", "High-contrast letterforms and unexpected accents create an editorial fashion voice.", "Refined lettering and a horizon motif connect the hospitality concept to place.", "A hand-drawn character and illustrated food cue communicate warmth.", "Chunky contemporary forms and fluid graphics suit an experimental digital studio."];

export default function BrandExplorer() {
  const [index, setIndex] = useState(0);
  const [view, setView] = useState<"scene" | "board">("scene");
  useEffect(() => {
    function sync() {
      const slug = window.location.hash.replace("#brand-", "");
      const next = data.brands.findIndex(b => b.slug === slug);
      if (next >= 0) setIndex(next);
    }
    sync(); window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  const brand = data.brands[index];
  function select(i: number) { setIndex(i); window.history.replaceState(null, "", `#brand-${data.brands[i].slug}`); }
  return <section className="brand-explorer" id="brand-explorer" aria-labelledby="brand-explorer-title">
    <div className="studio-heading"><div><p className="studio-eyebrow">The identity room</p><h2 id="brand-explorer-title">Six distinct points of view.</h2></div><p>Choose a concept to explore its visual language and applications.</p></div>
    <div className="brand-choices" aria-label="Choose a brand">{data.brands.map((b, i) => <button key={b.slug} aria-pressed={index === i} onClick={() => select(i)}><span>0{i + 1}</span>{b.name}</button>)}</div>
    <div className="brand-focus"><div className="brand-visual" key={`${brand.slug}-${view}`}><Image src={view === "scene" ? brand.heroImage : brand.panelImage} alt={`${brand.name} — ${view === "scene" ? "application preview" : "concept presentation board"}`} fill sizes="(max-width: 800px) 90vw, 55vw" className="object-contain" /></div>
      <div className="brand-story" aria-live="polite"><p className="studio-eyebrow">{brand.category}</p><h3>{brand.name}</h3><p className="brand-tagline">{brand.tagline}</p><p>{brand.concept}</p>
        <div className="segmented"><button aria-pressed={view === "scene"} onClick={() => setView("scene")}>Application</button><button aria-pressed={view === "board"} onClick={() => setView("board")}>Concept board</button></div>
        <h4>Type & character</h4><p>{TYPE_NOTES[index]}</p><h4>Palette study</h4><div className="brand-swatches">{PALETTES[index].map(hex => <span key={hex}><i style={{ background: hex }} /><code>{hex}</code></span>)}</div>
        <p className="studio-small">Palette swatches are presentation interpretations, not extracted production specifications. Image-based, AI-assisted concept exploration; no finalized vector construction is claimed.</p>
      </div></div>
  </section>;
}
