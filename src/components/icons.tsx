import {
  Atom,
  Award,
  BookOpen,
  Briefcase,
  CalendarDays,
  ChartColumn,
  CircleCheck,
  CircleDashed,
  ClipboardCheck,
  ClipboardList,
  Coins,
  Database,
  FileText,
  FlaskConical,
  GitMerge,
  Globe,
  GraduationCap,
  HardDrive,
  Image,
  KeyRound,
  LayoutGrid,
  Lock,
  Megaphone,
  Monitor,
  PackageCheck,
  Play,
  Plug,
  Presentation,
  Puzzle,
  QrCode,
  Radio,
  Rocket,
  Scale,
  School,
  ScrollText,
  Server,
  ShieldCheck,
  Sparkles,
  Target,
  Terminal,
  User,
  UserPlus,
  Users,
  Workflow,
  Wrench,
  Zap,
  MapPin,
  Activity,
  Cable,
  Cpu,
  FileSpreadsheet,
  Flame,
  Gauge,
  ShieldAlert,
  Thermometer,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * The icon system of the site. One library (lucide, drawn with one stroke width, see globals.css) plus the two brand marks in
 * BrandIcons. Icons are decorations: they are hidden from assistive technology and never carry meaning alone. Sizes:
 * 16 px inside text, buttons and badges; 14 px for the "opens elsewhere" mark; an IconTile (a soft tinted square) for cards
 * that describe a thing (a feature, a role, a goal, a contact way).
 */
export const icons = {
  workflow: Workflow,
  shield: ShieldCheck,
  plug: Plug,
  users: Users,
  check: CircleCheck,
  progress: CircleDashed,
  target: Target,
  delivered: PackageCheck,
  contributed: GitMerge,
  user: User,
  'user-plus': UserPlus,
  calendar: CalendarDays,
  pin: MapPin,
  briefcase: Briefcase,
  grid: LayoutGrid,
  server: Server,
  atom: Atom,
  radio: Radio,
  database: Database,
  school: School,
  presentation: Presentation,
  graduation: GraduationCap,
  clipboard: ClipboardList,
  'clipboard-check': ClipboardCheck,
  globe: Globe,
  qr: QrCode,
  book: BookOpen,
  file: FileText,
  megaphone: Megaphone,
  chart: ChartColumn,
  sparkles: Sparkles,
  scroll: ScrollText,
  key: KeyRound,
  zap: Zap,
  lock: Lock,
  flask: FlaskConical,
  wrench: Wrench,
  coins: Coins,
  puzzle: Puzzle,
  drive: HardDrive,
  scale: Scale,
  terminal: Terminal,
  image: Image,
  play: Play,
  monitor: Monitor,
  rocket: Rocket,
  award: Award,
  activity: Activity,
  cable: Cable,
  cpu: Cpu,
  sheet: FileSpreadsheet,
  flame: Flame,
  gauge: Gauge,
  alert: ShieldAlert,
  thermometer: Thermometer,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

/** A decorative icon at the standard inline size (16 px). */
export function AppIcon({ name, className }: { name: IconName; className?: string }) {
  const Glyph = icons[name];
  return <Glyph className={cn('size-4 shrink-0', className)} aria-hidden="true" />;
}

/** A decorative icon in a soft tinted square, for cards that describe a thing. `sm` is 36 px, `md` 40 px. */
export function IconTile({ name, size = 'md', className }: { name: IconName; size?: 'sm' | 'md'; className?: string }) {
  return (
    <span className={cn('flex shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20', size === 'md' ? 'size-10' : 'size-9', className)} aria-hidden="true">
      <AppIcon name={name} className="size-5" />
    </span>
  );
}

/** Icons for the topic filters on the Projects page. */
export const tagIcons = { aspnet: 'server', react: 'atom', realtime: 'radio', integration: 'plug', data: 'database', embedded: 'cpu', desktop: 'monitor' } as const satisfies Record<string, IconName>;

/** Icons of the personal project pages, by the identifier of what they decorate (a test checks that every one is covered). */
export const personalIcons = {
  features: { 'F-01': 'database', 'F-02': 'key', 'F-03': 'qr', 'F-04': 'book', 'F-05': 'file', 'F-06': 'megaphone', 'F-07': 'user-plus', 'F-08': 'clipboard-check', 'F-09': 'chart', 'F-10': 'sparkles', 'F-11': 'scroll', 'FR-1': 'cable', 'FR-4': 'chart', 'FR-6': 'zap', 'FR-8': 'flame', 'FR-9': 'gauge', 'FR-14': 'sheet', 'FR-16': 'activity' },
  roles: { Principal: 'school', Teacher: 'presentation', Student: 'graduation', Parent: 'users', 'Admin staff': 'clipboard', Applicant: 'user-plus', Guest: 'globe', Operator: 'user' },
  quality: { Responsiveness: 'zap', 'Security and privacy': 'lock', Testability: 'flask', Operability: 'wrench', Cost: 'coins', Evolvability: 'puzzle', Safety: 'alert', 'Control quality': 'gauge', Robustness: 'shield', Simplicity: 'user', Maintainability: 'wrench' },
  design: { 'Security and authorization': 'shield', 'Real-time events and background jobs': 'radio', 'File storage': 'drive', 'Control loop (PID on the Arduino)': 'gauge', 'Serial protocol and threading': 'cable', 'Temperature measurement': 'thermometer', 'Testing without a roaster': 'flask', 'Known limitations': 'alert' },
  stack: { Backend: 'server', 'Data and files': 'database', 'Identity, real time and jobs': 'key', Frontend: 'monitor', Testing: 'flask', Delivery: 'rocket', AI: 'sparkles', 'Desktop app': 'monitor', 'Files and Excel': 'sheet', 'Firmware and hardware': 'cpu' },
} as const satisfies Record<string, Record<string, IconName>>;
