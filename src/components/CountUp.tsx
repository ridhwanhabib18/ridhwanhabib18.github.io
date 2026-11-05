import { useEffect, useRef } from 'react';

/** Split a value such as "about 86% faster" around its first number. `null` when it has no number. */
export function splitNumber(text: string): { before: string; value: number; after: string } | null {
  const m = text.match(/^(\D*)(\d+)(.*)$/s);
  return m ? { before: m[1], value: Number(m[2]), after: m[3] } : null;
}

const DURATION = 900;
const easeOut = (t: number) => 1 - (1 - t) ** 3;

/**
 * Shows `text` and, the first time it scrolls into view, counts its first number up from 0.
 * The final text is in the pre-rendered HTML and is what screen readers and search engines get; the count only
 * changes the digits on screen. It does nothing for visitors who prefer reduced motion. The number keeps its final
 * width while counting (tabular digits are all 1ch wide), so the layout never shifts.
 */
export function CountUp({ text }: { text: string }) {
  const parts = splitNumber(text);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = numRef.current;
    if (!parts || !el || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

    const final = String(parts.value);
    el.textContent = '0';
    let frame = 0;
    const play = () => {
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, Math.max(0, (now - start) / DURATION));
        el.textContent = t === 1 ? final : String(Math.round(parts.value * easeOut(t)));
        if (t < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        play();
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = final;
    };
  }, [text]);

  if (!parts) return <>{text}</>;
  return (
    <>
      {parts.before}
      <span ref={numRef} className="inline-block text-right tabular-nums" style={{ minWidth: `${String(parts.value).length}ch` }}>
        {parts.value}
      </span>
      {parts.after}
    </>
  );
}
