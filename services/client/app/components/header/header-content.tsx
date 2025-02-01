"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserSidebar } from "../user-sidebar";
import { useClient } from "@/hooks/use-client";

export function HeaderContent() {
  const client = useClient();
  if (client.isLoading) {
    throw client.waitUntilLoaded();
  }
  return (
    <>
      {client.user ? (
        <UserSidebar />
      ) : (
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
      )}
    </>
  );
}
