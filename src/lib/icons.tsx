import {
  Building2,
  ClipboardList,
  Droplets,
  Flame,
  Home,
  Leaf,
  ShieldCheck,
  Sun,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  sun: Sun,
  wrench: Wrench,
  home: Home,
  building: Building2,
  clipboard: ClipboardList,
  tools: Wrench,
  droplets: Droplets,
  flame: Flame,
  leaf: Leaf,
  shield: ShieldCheck,
};

export const ICON_OPTIONS = Object.keys(ICONS);

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Sun;
  return <Icon className={className} aria-hidden="true" />;
}
