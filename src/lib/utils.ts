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
export type ConvertObj = {
  from: {
    currency: Country;
    fullName: string;
    amount: string;
    conversionRate: number;
    refreshDate: Date | null;
  };
  to: {
    currency: Country;
    fullName: string;
    amount: string;
    conversionRate: number;
    refreshDate: Date | null;
  };
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

export function formatCountryName(name: string): string {
  return name
    .trim()
    .split(" ")
    .map((word) =>
      word === "and" ? word : word.at(0)?.toUpperCase() + word.slice(1)
    )
    .join(" ");
}

/**
 * Fetches conversion data between one currency and all of the others.
 * @param countryCode code of the currency to fetch conversion data for.
 * @returns An object containing CurrencyRateData for each currency.
 */
export async function fetchConversionData(countryCode: Country) {
  try {
    const res = await fetch(
      `https://www.floatrates.com/daily/${countryCode.toLowerCase()}.json`
    );
    const rates: Record<string, CurrencyRateData> = await res.json();
    return rates;
  } catch (err) {
    return Promise.reject();
  }
}

// conversion utils
export function isZeroValue(value: string) {
  return value.length === 2 && value[0] === "0" && value[1] !== ".";
}

export function formatConversion(conversion: number): string {
  return conversion === 0 ? "0" : conversion.toFixed(2);
}

export function formatRate(rate: number): string {
  return rate < 0.0001 ? rate.toFixed(6) : rate.toFixed(4);
}

// load values from localStorage if any
export function loadFromLocalStorage(
  fallbackFrom: Country,
  fallbackTo: Country
): [Country, Country] {
  let localStorageFrom = window.localStorage.getItem("defaultConvertFrom");
  let localStorageTo = window.localStorage.getItem("defaultConvertTo");

  if (localStorageFrom === undefined || localStorageFrom === null) {
    localStorageFrom = fallbackFrom;
  }

  if (localStorageTo === undefined || localStorageTo === null) {
    localStorageTo = fallbackTo;
  }

  return [localStorageFrom as Country, localStorageTo as Country];
}

// display a relative time
export function relativeTime(date: Date) {
  const differenceInMs = Math.abs(Date.now() - date.getTime());

  let relativeTime = { number: 0, unit: "" };

  const threshold = {
    month: 11,
    week: 3,
    day: 6,
    hour: 23,
    minute: 59,
    second: 59,
  };

  const difference = {
    years: differenceInMs / (1000 * 60 * 60 * 24 * 7 * 4 * 12),
    months: differenceInMs / (1000 * 60 * 60 * 24 * 7 * 4),
    weeks: differenceInMs / (1000 * 60 * 60 * 24 * 7),
    days: differenceInMs / (1000 * 60 * 60 * 24),
    hours: differenceInMs / (1000 * 60 * 60),
    minutes: differenceInMs / (1000 * 60),
    seconds: differenceInMs / 1000,
  };

  if (difference.years > 0 && difference.months > threshold.month) {
    relativeTime.number = difference.years;
    relativeTime.unit = "year";
  } else if (difference.months > 0 && difference.weeks > threshold.week) {
    relativeTime.number = difference.months;
    relativeTime.unit = "month";
  } else if (difference.weeks > 0 && difference.days > threshold.day) {
    relativeTime.number = difference.weeks;
    relativeTime.unit = "week";
  } else if (difference.days > 0 && difference.hours > threshold.hour) {
    relativeTime.number = difference.days;
    relativeTime.unit = "day";
  } else if (difference.hours > 0 && difference.minutes > threshold.minute) {
    relativeTime.number = difference.hours;
    relativeTime.unit = "hour";
  } else if (difference.minutes > 0 && difference.seconds > threshold.second) {
    relativeTime.number = difference.minutes;
    relativeTime.unit = "minute";
  } else {
    relativeTime.number = difference.seconds;
    relativeTime.unit = "second";
  }

  if (relativeTime.number > 1) {
    relativeTime.unit += "s";
  }

  return `${Math.round(relativeTime.number)} ${relativeTime.unit} ago`;
}
