"use client";
import CreateOrganisation from "@/components/create-organisation";
import { useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { organization, isLoaded } = useOrganization();
  const router = useRouter();

  useEffect(() => {
    const getOrCreateOrganization = async () => {
      const res = await fetch(
        `/api/organization?organizationId=${organization?.id}`
      );
      if (res.status === 404) {
        const response = await fetch("api/organization", {
          method: "POST",
          body: JSON.stringify({
            organizationId: organization?.id,
            name: organization?.name,
          }),
        });
        return response;
      }
      return res;
    };
    if (organization) {
      getOrCreateOrganization().then((res) => {
        if (res.ok) router.replace("/dashboard");
      });
    }
  }, [organization, router]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <main className="min-h-screen w-full flex items-center justify-center">
      <CreateOrganisation />
    </main>
  );
}
