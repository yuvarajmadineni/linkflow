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
    <nav className="flex flex-col gap-6 text-base">
      {items.map((item, index) => (
        <Link
          href={item.href}
          key={index}
          className={cn(
            navigationMenuTriggerStyle(),
            "w-full  text-base font-medium text-gray-400 focus:bg-gray-700 bg-inherit  justify-start space-x-2 items-center",
            item.href === pathname && "bg-gray-700 text-foreground"
          )}
        >
          <span>{item.icon}</span>
          <span>{item.name}</span>
        </Link>
      ))}
    </nav>
  );
}
