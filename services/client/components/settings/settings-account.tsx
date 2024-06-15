import React from "react";
import { Header } from "@/components/ui/header";
import { Text } from "@/components/ui/text";
import { SettingsAccountImage } from "@/components/settings/settings-account-image";

export const SettingsAccount = () => {
  return (
    <div className={"flex flex-col w-full h-full gap-2"}>
      <Header size={"lg"}>Account settings</Header>
      <div className={"flex flex-row gap-2"}>
        <div className={"flex-1"}>content</div>
        <div className="flex w-1/4 min-w-[200px] h-full flex-col gap-2 ">
          <Text>Profile picture</Text>
          <SettingsAccountImage />
        </div>
      </div>
    </div>
  );
};
