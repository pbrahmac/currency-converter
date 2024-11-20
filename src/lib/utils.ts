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

/**
 *
 * @param country the country code to get the emoji for
 * @returns The flag emoji of the country associated with the country code
 */
export function getEmoji(country: string) {
  return countryEmojis[country.toUpperCase() as keyof typeof countryEmojis];
}

/**
 * Fetches conversion data between one currency and all of the others.
 * @param countryCode code of the currency to fetch conversion data for.
 * @returns An object containing CurrencyRateData for each currency.
 */
export async function fetchConversionData(countryCode: Country) {
  const res = await fetch(
    `https://www.floatrates.com/daily/${countryCode.toLowerCase()}.json`
  );
  const rates: Record<string, CurrencyRateData> = await res.json();
  return rates;
}

// conversion utils
export function isZeroValue(value: string) {
  return value.length === 2 && value[0] === "0" && value[1] !== ".";
}

export function formatConversion(conversion: number): string {
  return conversion === 0 ? "0" : conversion.toFixed(2);
}
