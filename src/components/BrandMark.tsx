import { markGeometry, STROKE } from '../../scripts/brand-mark.mjs';

const mark = markGeometry();

/** The site mark, the owner's initials as a code tag (<RH/>). Drawn from the same shapes as the favicon and app icons. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox={`0 0 ${mark.width} ${mark.height}`} fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d={mark.d} />
    </svg>
  );
}
