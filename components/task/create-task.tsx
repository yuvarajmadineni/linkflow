"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export function CreateTask() {
  const router = useRouter();
  return (
    <Button onClick={() => router.push("/dashboard/task/new")}>
      New Pipeline
    </Button>
  );
}
