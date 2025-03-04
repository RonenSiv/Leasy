"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserSidebar } from "../user-sidebar";
import { Spinner } from "@/app/components/spinner";
import useSWR from "swr";
import { fetcher } from "@/app/actions/fetcher";

export function HeaderContent() {
  const { data: user, isLoading } = useSWR("/user", fetcher.get, {
    revalidateOnFocus: true,
  });

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
