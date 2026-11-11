import {
  Bug,
  Heart,
  HeartHandshake,
  House,
  Microscope,
  PawPrint,
  Pill,
  Rabbit,
  Receipt,
  ShieldCheck,
  Snowflake,
  Stethoscope,
  Syringe,
  Thermometer,
  Utensils,
  type LucideIcon,
} from "lucide-react";

/** Icon names usable in /content JSON (keeps CMS editors to a known list). */
export const contentIcons: Record<string, LucideIcon> = {
  bug: Bug,
  heart: Heart,
  "heart-handshake": HeartHandshake,
  house: House,
  microscope: Microscope,
  "paw-print": PawPrint,
  pill: Pill,
  rabbit: Rabbit,
  receipt: Receipt,
  "shield-check": ShieldCheck,
  snowflake: Snowflake,
  stethoscope: Stethoscope,
  syringe: Syringe,
  thermometer: Thermometer,
  utensils: Utensils,
};

export const contentIcon = (name: string): LucideIcon => contentIcons[name] ?? PawPrint;
