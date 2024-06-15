import { SettingsSideBar } from "@/components/settings/settings-side-bar";
import React from "react";
import { SettingsContent } from "@/components/settings/settings-content";

export default async function SettingsPage() {
  return (
    <div className="flex w-full h-full flex-1">
      <div className="flex w-1/4 min-w-[200px] h-full">
        <SettingsSideBar />
      </div>
      <div className="flex w-full flex-1 h-full">
        <SettingsContent />
      </div>
    </div>
  );
}
