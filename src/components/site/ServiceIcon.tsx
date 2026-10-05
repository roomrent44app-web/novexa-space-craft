import {
  Map, Plane, Hotel, Bus, Stamp, Compass, Wallet, Headphones, ShieldCheck,
  Sparkles, Star, Sun, Ship, Mountain, Camera, Users, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const map: Record<string, LucideIcon> = {
  Map, Plane, Hotel, Bus, Stamp, Compass, Wallet, Headphones, ShieldCheck,
  Sparkles, Star, Sun, Ship, Mountain, Camera, Users,
};

export default function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = map[name] ?? Sparkles;
  return <Icon className={cn("h-6 w-6", className)} aria-hidden="true" />;
}
