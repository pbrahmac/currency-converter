import countryEmojis from "$lib/util/countries.json";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type Country = keyof typeof countryEmojis;
export type CurrencyRateData = {
  code: string;
  alphaCode: string;
  numericCode: string;
  name: string;
  rate: number;
  date: string;
  inverseRate: number;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEmoji(country: string) {
  return countryEmojis[country.toUpperCase() as keyof typeof countryEmojis];
}

export async function fetchConversionData(countryCode: Country) {
  const res = await fetch(
    `https://www.floatrates.com/daily/${countryCode.toLowerCase()}.json`
  );
  const rates: Record<string, CurrencyRateData> = await res.json();
}
