"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";

export function SearchUsers() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const handleChange = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <Input
      className="border-gray-600 focus:border-background w-[320px] px-10"
      onChange={(e) => {
        handleChange(e.target.value);
      }}
      defaultValue={searchParams.get("query")?.toString()}
      placeholder="Search by user name"
    />
  );
}
