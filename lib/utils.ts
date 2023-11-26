import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { groups, userToGroups, users } from "./schema";
import { md5 } from "js-md5";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type User = typeof users.$inferSelect;
export type Group = typeof groups.$inferSelect;
export type UserGroup = typeof userToGroups.$inferSelect;

export function getUserAvatar(email: string) {
  return `http://www.gravatar.com/avatar/${md5(email)}.jpg?d=retro`;
}
