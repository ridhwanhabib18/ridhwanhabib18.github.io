export type Lang = 'en' | 'id';
export type L10n<T = string> = { en: T; id: T };

export type MetricType = 'actual' | 'target';
export interface Metric {
  label: L10n;
  /** Percentage or qualitative value. Never a currency or an absolute hour count. */
  value: L10n;
  type: MetricType;
}

export type DiagramNode = { id: string; label: string; col: number; row: number; kind?: 'client' | 'service' | 'data' | 'external' };
export type DiagramEdge = { from: string; to: string; label?: string };
export interface DiagramDef {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface Sections {
  context: L10n;
  problem: L10n;
  approach: L10n<string[]>;
  decisions?: L10n<string[]>;
  result: L10n<string[]>;
  lookback?: L10n<string[]>;
}

export type Tag = 'aspnet' | 'react' | 'realtime' | 'integration' | 'devops' | 'data' | 'embedded' | 'desktop';

export interface Project {
  slug: string;
  /** Title of the matching bullet in the Typst resume source (the source of truth for this system). */
  resumeBullet: string;
  /** Details the case study states that the resume source does not. Declared on purpose; a test checks them. */
  beyondResume?: string[];
  kind: 'delivered' | 'contributed';
  title: L10n;
  summary: L10n;
  role: L10n;
  year?: string;
  tags: Tag[];
  stack: string[];
  metrics: Metric[];
  sections: Sections;
  diagram?: DiagramDef;
}

export interface Role {
  id: string;
  title: L10n;
  company: string;
  location: string;
  start: string;
  end: string | null;
  /** Bullets come from the Typst resume source. */
  bullets: { title?: L10n; text: L10n }[];
  stack: string[];
  projectSlugs: string[];
}
