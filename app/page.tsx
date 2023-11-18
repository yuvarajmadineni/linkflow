"use client";
import CreateOrganisation from "@/components/create-organisation";
import { useOrganization } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Home() {
  const { organization, isLoaded } = useOrganization();

  if (!isLoaded) return <div> Loading ...</div>;

  // if (organization?.id) {
  //   return redirect("/dashboard");
  // }

  return (
    <main className="min-h-screen w-full flex items-center justify-center">
      <CreateOrganisation />
    </main>
  );
}
