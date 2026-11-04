export interface BrandConcept {
  name: string;
  slug: string;
  category: string;
  tagline: string;
  concept: string;
  panelImage: string;
  heroImage: string;
}

export interface FlavourItem {
  id: string;
  name: string;
  descriptor: string;
  accentColor: string;
  flavourCue: string;
  ingredients: string;
  mockupImage: string;
  flatImage: string;
}

export interface DetailCrop {
  id: string;
  title: string;
  src: string;
  alt: string;
  kind: string;
  description?: string;
}

export interface ScreenItem {
  title: string;
  user: "Parent" | "Caregiver" | "Shared";
  src: string;
  description?: string;
}

export interface ProjectEntry {
  id: string;
  number: string;
  section: "logo-identity" | "ui-ux" | "packaging";
  orderWithinSection: number;
  globalProjectOrder: number;
  title: string;
  displayTitle?: string;
  category: string;
  discipline: string;
  subtitle: string;
  eyebrow?: string;
  year?: string;
  summary: string;
  projectType: string;
  coverImage: string;
  coverAlt: string;
  overviewImage?: string;
  styleGuideImage?: string;
  prototypeUrl?: string;
  familyShotImage?: string;
  originalImage?: string;
  route: string;
  ctaText?: string;
  status?: string;
  brands?: BrandConcept[];
}

export interface NavLink {
  label: string;
  href: string;
}

export interface ServiceItem {
  number: string;
  title: string;
  description: string;
  tags: string[];
}

export interface ProcessStep {
  step: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
}

