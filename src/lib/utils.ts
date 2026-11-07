import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAsset(path: string): string {
  const base = import.meta.env.BASE_URL || "./";
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return base.endsWith("/") ? `${base}${clean}` : `${base}/${clean}`;
}
