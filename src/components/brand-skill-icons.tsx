import {
  siAngular,
  siArduino,
  siAxios,
  siBootstrap,
  siCaddy,
  siClaude,
  siCloudflare,
  siCplusplus,
  siCss,
  siDocker,
  siDotnet,
  siGit,
  siGithubactions,
  siHtml5,
  siI18next,
  siJavascript,
  siJquery,
  siKeycloak,
  siLaravel,
  siLinux,
  siMinio,
  siOllama,
  siOpenapiinitiative,
  siOpencv,
  siRos,
  siStmicroelectronics,
  siPhp,
  siPostgresql,
  siPython,
  siReact,
  siReactivex,
  siReactquery,
  siReactrouter,
  siShadcnui,
  siTailwindcss,
  siTypescript,
  siVite,
  siVitest,
  siVuedotjs,
  type SimpleIcon,
} from 'simple-icons';
import { cn } from '@/lib/utils';

/**
 * Official logos from Simple Icons (CC0) for the technologies that have one, matched by the start of the skill name. A
 * skill with no logo there (C#, SQL Server, AWS, Playwright, ...) is not listed and keeps the generic icon of `skillIcon`.
 * Order matters: the first match wins, so "React Router" is tried before "React".
 */
const brandRules: [RegExp, SimpleIcon][] = [
  [/^c\/c\+\+/i, siCplusplus],
  [/^python/i, siPython],
  [/^(asp\.net|\.net|entity framework|razor)/i, siDotnet],
  [/^(postgres|npgsql)/i, siPostgresql],
  [/^react router/i, siReactrouter],
  [/^react-i18next/i, siI18next],
  [/^react$/i, siReact],
  [/^angular/i, siAngular],
  [/^rxjs/i, siReactivex],
  [/^typescript/i, siTypescript],
  [/^javascript/i, siJavascript],
  [/^vite$/i, siVite],
  [/^tanstack/i, siReactquery],
  [/^tailwind/i, siTailwindcss],
  [/^shadcn/i, siShadcnui],
  [/^axios/i, siAxios],
  [/^html/i, siHtml5],
  [/^css/i, siCss],
  [/^bootstrap/i, siBootstrap],
  [/^jquery/i, siJquery],
  [/^keycloak/i, siKeycloak],
  [/^minio/i, siMinio],
  [/^cloudflare/i, siCloudflare],
  [/^claude/i, siClaude],
  [/^ollama/i, siOllama],
  [/^git$/i, siGit],
  [/^github actions/i, siGithubactions],
  [/^docker/i, siDocker],
  [/^caddy/i, siCaddy],
  [/^linux/i, siLinux],
  [/^vitest/i, siVitest],
  [/^vue/i, siVuedotjs],
  [/^php/i, siPhp],
  [/^laravel/i, siLaravel],
  [/^arduino/i, siArduino],
  [/^opencv/i, siOpencv],
  [/^ros$/i, siRos],
  [/^stm32/i, siStmicroelectronics],
  [/^openapi/i, siOpenapiinitiative],
];

export function skillBrand(name: string): SimpleIcon | undefined {
  return brandRules.find(([re]) => re.test(name))?.[1];
}

/** Brightness of a hex colour from 0 (black) to 1 (white). */
const luminance = (hex: string) => {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** A brand logo in its own colour; a colour too dark or too light to read on both themes uses the text colour instead. */
export function BrandIcon({ icon, className }: { icon: SimpleIcon; className?: string }) {
  const l = luminance(icon.hex);
  const own = l > 0.18 && l < 0.82;
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={cn('shrink-0', className)} fill={own ? `#${icon.hex}` : 'currentColor'}>
      <path d={icon.path} />
    </svg>
  );
}
