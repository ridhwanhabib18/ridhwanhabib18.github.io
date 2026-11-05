export const MARK: string;
export const STROKE: number;
export const HEIGHT: number;
export function markGeometry(text?: string): { d: string; width: number; height: number };
export function markSvg(options?: { color?: string; size?: number; text?: string }): string;
export function iconSvg(options: { size: number; fraction: number; background?: string; color?: string; rounded?: number; text?: string }): string;
