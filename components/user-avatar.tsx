import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function UserAvatar({
  src,
  className,
  name,
}: {
  src?: string;
  className?: string;
  name?: string | null;
}) {
  return (
    <Avatar className={cn("h-8 w-8 md:h-10 md:w-10")}>
      <AvatarImage src={src} />
      <AvatarFallback>{name}</AvatarFallback>
    </Avatar>
  );
}
