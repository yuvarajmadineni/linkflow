import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { users } from "./schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type User = typeof users.$inferSelect;
