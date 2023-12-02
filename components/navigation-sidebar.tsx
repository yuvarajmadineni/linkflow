"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { navigationMenuTriggerStyle } from "./ui/navigation-menu";
import { ClipboardList, GitBranch, User } from "lucide-react";
import { usePathname } from "next/navigation";

const items = [
  {
    name: "Workflow",
    href: "/dashboard/workflow",
    icon: <GitBranch className="h-6 w-6" />,
  },
  {
    name: "Usermanagement",
    href: "/dashboard/manage-users",
    icon: <User className="h-6 w-6" />,
  },
  {
    name: "Task",
    href: "/dashboard/task",
    icon: <ClipboardList className="h-6 w-6" />,
  },
];

export default function NavigationSidebar() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-2 text-base h-full bg-secondary px-2">
      {items.map((item, index) => (
        <Link
          href={item.href}
          key={index}
          className={cn(
            navigationMenuTriggerStyle(),
            "w-full text-base font-medium dark:text-gray-400 dark:focus:bg-gray-700 bg-inherit  justify-start focus:bg-zinc-400",
            item.href === pathname &&
              "dark:bg-gray-700 dark:text-foreground bg-zinc-400"
          )}
        >
          <div className="flex items-center gap-4 ">
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </div>
        </Link>
      ))}
    </nav>
  );
}
