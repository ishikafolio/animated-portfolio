"use client";
import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, RotateCcw } from "lucide-react";

const TASKS = [
  { title: "A gentle reminder", screen: 3, label: "Try marking a medicine taken", note: "A single primary action keeps the next step clear. A confirmation explains what is shared, with an option to undo.", action: "taken" },
  { title: "Choose what to share", screen: 5, label: "Try changing a sharing permission", note: "Separate controls make the scope of family updates visible. Consent is a choice in the flow, not a hidden assumption.", action: "toggle:" },
  { title: "A family overview", screen: 7, label: "Explore a parent’s update", note: "The caregiver sees a summary first. A pending confirmation is distinguished from a confirmed missed dose.", action: "go:8" },
];

export default function CareDemo() {
  const [task, setTask] = useState(0);
  const [attempted, setAttempted] = useState(false);
  const [reset, setReset] = useState(0);
  const frame = useRef<HTMLIFrameElement>(null);
  const current = TASKS[task];
  useEffect(() => {
    const observe = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow || event.data?.type !== "careconnect-action") return;
      if (typeof event.data.action === "string" && event.data.action.startsWith(TASKS[task].action)) setAttempted(true);
    };
    window.addEventListener("message", observe);
    return () => window.removeEventListener("message", observe);
  }, [task]);
  return <section className="care-demo" aria-labelledby="care-demo-title">
    <div className="care-notes"><p className="studio-eyebrow">A little care, in action</p><h2 id="care-demo-title">Try the thinking.</h2>
      <p>Three small moments from the CareConnect concept. Choose a task, then interact with the phone.</p>
      <div className="care-tasks" aria-label="Prototype tasks">{TASKS.map((t, i) => <button key={t.title} aria-pressed={task === i} onClick={() => { setTask(i); setAttempted(false); }}><span>0{i + 1}</span>{t.title}<span aria-hidden>↗</span></button>)}</div>
      <div className="care-annotation" aria-live="polite"><span className="studio-eyebrow">{attempted ? "Interaction explored ✓" : "Your next step"}</span><h3>{current.label}</h3><p>{current.note}</p></div>
      <button className="text-action" onClick={() => { setReset(v => v + 1); setAttempted(false); }}><RotateCcw size={15} /> Reset this task</button>
      <a className="text-action" href="/projects/careconnect/prototype/index.html" target="_blank" rel="noopener noreferrer">Open full prototype <ArrowUpRight size={15} /></a>
      <p className="studio-small">Concept demo. Calls, alerts, medicine records and sharing are simulated. Use sample details only.</p>
    </div>
    <div className="care-phone-wrap"><div className="care-phone"><iframe ref={frame} key={`${task}-${reset}`} title={`CareConnect demo: ${current.title}`} src={`/projects/careconnect/prototype/index.html?embed=1&screen=${current.screen}`} loading="lazy" sandbox="allow-scripts allow-same-origin" /></div><span className="care-phone-caption">Interactive prototype · tap or use your keyboard</span></div>
  </section>;
}
