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

export type Tag = 'aspnet' | 'react' | 'realtime' | 'integration' | 'devops' | 'data';

export interface Project {
  slug: string;
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
  summary: L10n;
  responsibilities: L10n<string[]>;
  stack: string[];
  projectSlugs: string[];
}
