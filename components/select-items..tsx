"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SelectItem = {
  label: string;
  value: string;
};

type SelectProps = {
  items: SelectItem[];
};

export function SelectItems({ items }: SelectProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const role = searchParams.get("role") || items[0].value;
  const handleChange = (role: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("role", role);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  return (
    <Select defaultValue={role} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px] border-gray-600 focus:border-background">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem value={item.value} key={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
