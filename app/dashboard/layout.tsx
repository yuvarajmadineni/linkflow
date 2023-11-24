import Logo from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import NavigationSidebar from "@/components/navigation-sidebar";
import { UserAvatar } from "@/components/user-avatar";
import { getUserProfile } from "@/lib/organization";
import { ChevronDownIcon } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserProfile();
  return (
    <div className="h-[100vh]">
      <div className="bg-secondary py-4 px-4 w-full flex justify-between items-center">
        <div className="flex gap-4">
          <Logo />
          <h1>Linkflow</h1>
        </div>
        <div className="flex gap-3 px-4 items-center">
          <UserAvatar src={user?.imageUrl as string} name={user?.fullName} />
          <div>
            <h2 className="text-base font-semibold">{user?.fullName}</h2>
            <span className="text-sm text-muted-foreground font-normal">
              Admin
            </span>
          </div>
          <ChevronDownIcon className="text-muted-foreground h-5 w-5" />
          <ModeToggle />
        </div>
      </div>
      <div className="hidden md:flex h-full text-foreground">
        <NavigationSidebar />
        <div className="flex-1 bg-background">{children}</div>
      </div>
    </div>
  );
}
