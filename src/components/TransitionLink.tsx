import { forwardRef, type MouseEvent } from 'react';
import { flushSync } from 'react-dom';
import { Link as RouterLink, NavLink as RouterNavLink, useNavigate, type LinkProps, type NavLinkProps, type To } from 'react-router-dom';

/**
 * `Link` and `NavLink` that cross-fade between pages with the View Transitions API.
 *
 * Progressive enhancement: where the API is missing, or the visitor prefers reduced motion, or the click is a
 * new-tab / modified click, the link behaves exactly like the plain React Router one. The page content is updated
 * synchronously inside the transition callback (flushSync), so scroll-to-top and the other effects have run before the
 * new page is captured.
 */
function useTransitionClick(to: To, replace: boolean | undefined, target: string | undefined, onClick: ((e: MouseEvent<HTMLAnchorElement>) => void) | undefined) {
  const navigate = useNavigate();
  return (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (target && target !== '_self') return;
    if (!('startViewTransition' in document) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();
    document.startViewTransition(() => {
      flushSync(() => navigate(to, { replace }));
    });
  };
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ to, replace, target, onClick, ...rest }, ref) {
  const handleClick = useTransitionClick(to, replace, target, onClick);
  return <RouterLink ref={ref} to={to} replace={replace} target={target} onClick={handleClick} {...rest} />;
});

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink({ to, replace, target, onClick, ...rest }, ref) {
  const handleClick = useTransitionClick(to, replace, target, onClick);
  return <RouterNavLink ref={ref} to={to} replace={replace} target={target} onClick={handleClick} {...rest} />;
});
