// utils/Utils.ts

import { useContext } from "react";
import { Context } from "../../context/Context";
import { formatDistanceToNow, parseISO, isValid } from "date-fns";

// ERROR HANDLER
export interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

export const getError = (error: ErrorResponse): string => {
  return error.response && error.response.data && error.response.data.message
    ? error.response.data.message
    : error.message;
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

// FORMAT NUMBER WITH DECIMALS
export const formatNumberShort = (value: number): string => {
  const suffixes = ["", "k", "M", "B", "T"];
  let suffixIndex = 0;

  while (value >= 1000 && suffixIndex < suffixes.length - 1) {
    value /= 1000;
    suffixIndex++;
  }

  // Format number with one decimal place
  const formattedValue = value.toFixed(1);

  // Remove trailing .0 if there is no decimal value
  const result = formattedValue.endsWith(".0")
    ? formattedValue.slice(0, -2)
    : formattedValue;

  return `${result}${suffixes[suffixIndex]}`;
};

// FORMAT NUMBER With no Decimal
export const formatNumberNoDecimalShort = (value: number): string => {
  const suffixes = ["", "k", "M", "B", "T"];
  let suffixIndex = 0;

  while (value >= 1000 && suffixIndex < suffixes.length - 1) {
    value /= 1000;
    suffixIndex++;
  }

  // Use Math.floor to remove decimal places
  return `${Math.floor(value)}${suffixes[suffixIndex]}`;
};

//FORMAT NUMBER NUMERIC with commas
// export const formatNumberWithCommas = (value: number): string => {
//   return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// };

// FORMAT NUMBER WITH 2 DECIMAL PLACES WITHOUT SUFFIXES
export const formatNumberWithTwoDecimalsNoSuffix = (
  value: number | string | null | undefined
): string => {
  // Ensure the value is a number
  const numericValue = parseFloat(value as string);

  // Check if the value is not a valid number
  if (isNaN(numericValue)) {
    return "0"; // or handle the case as needed
  }

  // Format number with two decimal places
  const formattedValue = numericValue.toFixed(2);

  // Remove trailing .00 if there are no decimal values
  return formattedValue.endsWith(".00")
    ? formattedValue.slice(0, -3)
    : formattedValue;
};

// FORMAT DATE FUNCTIONS

/**
 * Converts a date string to a Date object.
 * @param dateStr - The date string to convert
 * @returns The Date object
 */
const parseDate = (dateStr: string): Date => {
  return new Date(dateStr);
};

/**
 * Formats a date string as "DD/MM/YYYY"
 * @param dateStr - The date string to format
 * @returns The formatted date string
 */
export const formatDateSlash = (dateStr: string): string => {
  const date = parseDate(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is zero-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Formats a date string as "DD Month YYYY"
 * @param dateStr - The date string to format
 * @returns The formatted date string
 */
export const formatDateLong = (dateStr: string): string => {
  const date = parseDate(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

/**
 * Formats a date string as "DDth of Month YYYY"
 * @param dateStr - The date string to format
 * @returns The formatted date string
 */
export const formatDateOrdinal = (dateStr: string): string => {
  const date = parseDate(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  // Function to get ordinal suffix for a day
  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${getOrdinalSuffix(day)} of ${month} ${year}`;
};

/**
 * Formats a date to "X time ago" relative to now.
 * @param date - The ISO 8601 date string to format.
 * @returns A string representing the time difference.
 */
export function formatDateAgo(date: string | undefined): string {
  if (!date) {
    return "...";
  }

  // Parse the ISO date string into a Date object
  const parsedDate = parseISO(date);

  // Check if the parsed date is valid
  if (!isValid(parsedDate)) {
    return "...";
  }

  // Format the date as "X time ago"
  return formatDistanceToNow(parsedDate, { addSuffix: true });
}

//STATE
export const stateRegionMap = {
  Abia: "South East",
  Adamawa: "North East",
  "Akwa Ibom": "South South",
  Anambra: "South East",
  Bauchi: "North East",
  Bayelsa: "South South",
  Benue: "North Central",
  Borno: "North East",
  "Cross River": "South South",
  Delta: "South South",
  Ebonyi: "South East",
  Edo: "South South",
  Ekiti: "South West",
  Enugu: "South East",
  FCT: "North Central",
  Gombe: "North East",
  Imo: "South East",
  Jigawa: "North West",
  Kaduna: "North West",
  Kano: "North West",
  Katsina: "North West",
  Kebbi: "North West",
  Kogi: "North Central",
  Kwara: "North Central",
  Lagos: "South West",
  Nasarawa: "North Central",
  Niger: "North Central",
  Ogun: "South West",
  Ondo: "South West",
  Osun: "South West",
  Oyo: "South West",
  Plateau: "North Central",
  Rivers: "South South",
  Sokoto: "North West",
  Taraba: "North East",
  Yobe: "North East",
  Zamfara: "North West",
};
