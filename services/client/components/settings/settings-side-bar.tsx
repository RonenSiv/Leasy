"use server";
import { UserData } from "@/components/settings/user-data";
import { ProfileSettings } from "@/components/settings/profile-settings";

export const SettingsSideBar = async () => {
  return (
    <div className="flex w-full h-full flex-1 flex-col items-start justify-start gap-4 px-8">
      <UserData />
      <ProfileSettings />
    </div>
  );
};