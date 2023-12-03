import { useAutoLayout } from "@/hooks/useAutoLayout";

export function Layout() {
  useAutoLayout({ direction: "TB" });
  return null;
}
