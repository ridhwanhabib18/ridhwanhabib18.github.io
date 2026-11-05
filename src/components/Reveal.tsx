import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Fade-and-rise as the element scrolls into view. Pure CSS (a scroll-driven animation, see globals.css), so content is
 * visible in the pre-rendered HTML and never waits for JavaScript; browsers without support, and visitors who prefer
 * reduced motion, simply see the content. `delay` is accepted for older call sites and ignored.
 */
export function Reveal({ children, as: Tag = 'div', className }: { children: ReactNode; delay?: number; as?: 'div' | 'li' | 'section'; className?: string }) {
  return <Tag className={cn('reveal', className)}>{children}</Tag>;
}
