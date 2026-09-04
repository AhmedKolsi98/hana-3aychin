import {
  Zap, Droplets, ThermometerSun, UtensilsCrossed, Laptop,
  PhoneCall, Flame, Wind, Info, Hospital, MapPin, BookOpen,
  type LucideIcon,
} from 'lucide-react';

export interface Localized {
  ar: string;
  [lang: string]: string;
}

export interface SectionDef {
  id: string;
  order: number;
  icon: string;
  title: Localized;
  sub: Localized;
}

export interface EmergencyContact {
  id: string;
  order: number;
  number: string;
  tel: string;
  name: Localized;
}

export const ICONS: Record<string, LucideIcon | undefined> = {
  Zap, Droplets, ThermometerSun, UtensilsCrossed, Laptop,
  PhoneCall, Flame, Wind, Info, Hospital, MapPin, BookOpen,
};

export const FALLBACK_ICON = BookOpen;
