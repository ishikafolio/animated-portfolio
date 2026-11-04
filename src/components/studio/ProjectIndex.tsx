import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/projects";

export default function ProjectIndex() {
  return <section id="work" className="studio-section project-index" aria-labelledby="work-heading">
    <div className="studio-heading"><div><p className="studio-eyebrow">Selected work / 2026</p><h2 id="work-heading">Four worlds.<br />One curious mind.</h2></div>
      <p>Identity, digital care and things you can hold. Pick a project, or wander through the studio.</p></div>
    <div className="project-index-grid">{projects.map((p, i) => <Link href={p.route} key={p.id} className="index-card" data-character-mood="Curious">
      <div className={`index-image index-image-${i}`}><Image src={p.coverImage} alt={p.coverAlt} fill sizes="(max-width: 650px) 90vw, (max-width: 1100px) 45vw, 23vw" />
        <span className="index-number">0{i + 1}</span><span className="index-arrow"><ArrowUpRight size={20} /></span></div>
      <p>{p.category}</p><h3>{p.title}</h3><span className="index-caption">{p.subtitle}</span>
    </Link>)}</div>
    <div className="studio-link-row"><a href="#portfolio">Explore the exhibitions <span aria-hidden>↓</span></a><a href="#studio">Inside the studio <span aria-hidden>↗</span></a></div>
  </section>;
}
