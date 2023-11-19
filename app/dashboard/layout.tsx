import Logo from "@/components/logo";
import NavigationSidebar from "@/components/navigation-sidebar";
import { UserAvatar } from "@/components/user-avatar";
import { currentUser } from "@clerk/nextjs";
import { ChevronDownIcon } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  return (
    <div>
      <div className="bg-secondary py-4 px-4 w-full flex justify-between items-center">
        <div className="flex gap-4">
          <Logo />
          <h1>Linkflow</h1>
        </div>
        <div className="flex gap-3 px-4 items-center">
          <UserAvatar
            src={user?.imageUrl}
            name={user?.firstName + "" + user?.lastName}
          />
          <div>
            <h2 className="text-base font-semibold">{user?.firstName}</h2>
            <span className="text-sm text-muted-foreground font-normal">
              Admin
            </span>
          </div>
          <ChevronDownIcon className="text-muted-foreground h-5 w-5" />
        </div>
      </div>
      <div className="hidden md:flex flex-col w-64 mt-[72px] h-full fixed  inset-y-0 z-30 text-foreground bg-secondary py-4 px-4">
        <NavigationSidebar />
      </div>
      <div className="md:pl-64">{children}</div>
    </div>
  );
}
