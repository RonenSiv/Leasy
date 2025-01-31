"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClient } from "@/hooks/use-client";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const client = useClient();

  useEffect(() => {
    if (!client.isLoading && !client.user) {
      console.log("User not found, redirecting to login page");
      router.push("/login");
    }
  }, [client.user, client.isLoading, router]);

  if (client.isLoading) {
    return <div>Loading user data...</div>;
  }

  if (!client.user) {
    return null;
  }

  return <>{children}</>;
}
