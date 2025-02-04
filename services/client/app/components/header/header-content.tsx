"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserSidebar } from "../user-sidebar";
import { useUser } from "@/hooks/use-user";
import { Spinner } from "@/app/components/spinner";

export function HeaderContent() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-9 w-9">
        <Spinner className="h-5 w-5" />
      </div>
    );
  }

  return (
    <>
      {user ? (
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
