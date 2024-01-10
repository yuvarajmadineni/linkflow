"use client";
import CreateOrganisation from "@/components/create-organisation";
import { useOrganization } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { organization, isLoaded } = useOrganization();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getOrCreateOrganization = async () => {
      setIsLoading(true);
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
        if (res.ok) {
          setIsLoading(false);
          router.replace("/dashboard");
        }
      });
    }
  }, [organization, router]);

  if (!isLoaded || isLoading || organization)
    return (
      <div className="flex h-[100vh] justify-center items-center">
        <Loader className="animate-spin" />
      </div>
    );

  return (
    <main className="min-h-screen w-full flex items-center justify-center">
      <CreateOrganisation />
    </main>
  );
}
