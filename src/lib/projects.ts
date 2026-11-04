import projectsData from "../../content/projects.json";
import logoFolioData from "../../content/logo-folio.json";
import careconnectData from "../../content/careconnect.json";
import progelatoData from "../../content/progelato.json";
import aaraData from "../../content/aara.json";
import type { ProjectEntry } from "@/types";

export const projects: ProjectEntry[] = projectsData as ProjectEntry[];

export function getProjectBySlug(slug: string): ProjectEntry | undefined {
  return projects.find((p) => p.id === slug || p.route.endsWith(`/${slug}`));
}

export function getLogoFolioData() {
  return logoFolioData;
}

export function getCareConnectData() {
  return careconnectData;
}

export function getProgelatoData() {
  return progelatoData;
}

export function getAaraData() {
  return aaraData;
}

