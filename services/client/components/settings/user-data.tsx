"use client";
import { useClient } from "@/providers/client-provider";
import { Spinner } from "@/components/ui/spinner";
import { ClientAvatar } from "@/components/client-avatar";

export const UserData = () => {
  const { name, isLoading } = useClient();
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={"flex items-start gap-4"}>
      <ClientAvatar width="50px" height="50px" />
      <div className={"flex flex-col"}>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {name}
        </h3>
        <p className="scroll-m-20 text-gray-500 dark:text-gray-400">
          Your personal data
        </p>
      </div>
    </div>
  );
};
