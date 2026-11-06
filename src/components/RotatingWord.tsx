import { useEffect, useRef } from 'react';

const START_DELAY = 2500; // let the page finish loading and painting before anything moves
const HOLD = 1800;
const TYPE = 70;
const ERASE = 35;

/**
 * A short word that is typed, held, erased and replaced by the next one, in a loop.
 *
 * The first word is rendered in the HTML and stays put until the animation starts, so the line is complete without
 * JavaScript and never hides anything while the page loads (hiding the hero text for an effect once cost the home
 * page about two seconds of Largest Contentful Paint). Only the characters of one small, non-largest element change.
 * The width is reserved for the longest word by the parent, so nothing moves. Nothing runs for visitors who prefer
 * reduced motion, and the loop pauses while the tab is hidden. The parent hides this from screen readers and offers
 * the full list as text instead.
 */
export function RotatingWord({ words }: { words: string[] }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const text = ref.current?.firstChild as Text | null;
    if (!text || words.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;
    const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
    const run = async () => {
      let i = 0;
      await sleep(START_DELAY);
      while (!cancelled) {
        await sleep(HOLD);
        while (document.hidden && !cancelled) await sleep(300);
        const current = words[i];
        for (let n = current.length - 1; n >= 0 && !cancelled; n--) {
          text.nodeValue = current.slice(0, n);
          await sleep(ERASE);
        }
        i = (i + 1) % words.length;
        const next = words[i];
        for (let n = 1; n <= next.length && !cancelled; n++) {
          text.nodeValue = next.slice(0, n);
          await sleep(TYPE);
        }
      }
    };
    void run();
    return () => {
      cancelled = true;
      text.nodeValue = words[0];
    };
  }, [words]);

  return (
    <>
      <span ref={ref}>{words[0]}</span>
      <span className="typed-caret" aria-hidden="true" />
    </>
  );
}
