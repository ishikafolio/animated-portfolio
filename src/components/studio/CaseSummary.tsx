import React from "react";

type Kind = "logo" | "care" | "gelato" | "aara";
const SUMMARIES: Record<Kind, { problem: string; focus: string; constraint: string; decision: string; learning: string }> = {
  logo: { problem: "Explore how different industries can express a distinct personality through identity.", focus: "Visual concept exploration, typography direction and application studies.", constraint: "Six fictional brands; image-based and AI-assisted, without verified client or production outcomes.", decision: "Give each concept its own typographic character and application context.", learning: "The collection demonstrates visual range across six independent concepts." },
  care: { problem: "Bring daily reminders and family updates into a calmer, clearer mobile experience.", focus: "Parent and caregiver interface flows, visual hierarchy and an interactive concept prototype.", constraint: "A speculative ten-screen demo; no live healthcare services or measured clinical outcomes.", decision: "Separate everyday parent actions from caregiver oversight and keep sharing choices visible.", learning: "The prototype makes key interactions reviewable. Formal user validation remains a next step." },
  gelato: { problem: "Make seven flavours recognizable as individuals and as one packaging family.", focus: "Packaging artwork, colour differentiation and product presentation.", constraint: "Supplied artwork and mockups; no verified launch, sales or print-validation results.", decision: "Repeat the hierarchy while changing ingredient cues and flavour colour blocks.", learning: "The artwork and pouch views show how a common layout holds a varied range together." },
  aara: { problem: "Express a quieter everyday tea ritual through a coordinated visual identity.", focus: "A brand and packaging concept spanning cartons, a tin and printed touchpoints.", constraint: "An imagined brand with one supplied presentation image; detail views are crops.", decision: "Use forest, olive and parchment tones with restrained typography and botanical detail.", learning: "The presentation explores consistency across different objects and materials." },
};
export default function CaseSummary({ kind }: { kind: Kind }) {
  const s = SUMMARIES[kind];
  return <section className="case-summary" aria-label="Project at a glance">{[["The question", s.problem], ["Design focus", s.focus], ["The boundaries", s.constraint], ["Key decision", s.decision], ["What it demonstrates", s.learning]].map(([label, value]) => <div key={label}><h2>{label}</h2><p>{value}</p></div>)}</section>;
}
