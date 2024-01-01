import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  branchNode,
  condition,
  groups,
  pageNode,
  userToGroups,
  users,
  workflows,
} from "./schema";
import { md5 } from "js-md5";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type User = typeof users.$inferSelect;
export type Group = typeof groups.$inferSelect;
export type UserGroup = typeof userToGroups.$inferSelect;
export type Workflow = typeof workflows.$inferSelect;
export type PageNode = typeof pageNode.$inferSelect;
export type Condition = typeof condition.$inferSelect;
export type BranchNode = typeof branchNode.$inferSelect;

export function getUserAvatar(email: string) {
  return `http://www.gravatar.com/avatar/${md5(email)}.jpg?d=retro`;
}

export const getInitialWorkflow = () => {
  const initialNodes = [
    {
      id: "1",
      position: { x: 0, y: 0 },
      data: { label: "Start" },
      type: "startNode",
    },
    {
      id: "2",
      position: { x: 0, y: 100 },
      data: { label: "Placeholder" },
      type: "placeholderNode",
    },
  ];

  const initialEdges = [{ id: "e-1", source: "1", target: "2" }];

  return { initialNodes, initialEdges };
};

export function idGenerator() {
  return Math.floor(Math.random() * 10001).toString();
}
