import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import countryEmojis from "$lib/util/countries.json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEmoji(country: string) {
  return countryEmojis[country.toUpperCase() as keyof typeof countryEmojis];
}
