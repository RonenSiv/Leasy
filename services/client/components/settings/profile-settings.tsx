"use client";

import React from "react";
import { SettingsCard } from "@/components/settings/settings-card";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/context/settings-provider";

export const ProfileSettings = () => {
  const {
    profileSettingsOptions,
    studySettingsOptions,
    privacySettingsOptions,
    supportSettingsOptions,
    currentSelectedSettingOption,
    handleSelectOption,
  } = useSettings();

  return (
    <div>
      {profileSettingsOptions().map((option, index) => (
        <SettingsCard
          key={option.title}
          prefix={option.icon}
          title={option.title}
          isSelected={currentSelectedSettingOption().title === option.title}
          onClick={() => handleSelectOption(option.title)}
        />
      ))}
      <Separator className={"mt-4"} />
      <p className={"text-sm opacity-30 mt-4"}>Study</p>
      {studySettingsOptions().map((option) => (
        <SettingsCard
          key={option.title}
          prefix={option.icon}
          title={option.title}
          isSelected={currentSelectedSettingOption().title === option.title}
          onClick={() => handleSelectOption(option.title)}
        />
      ))}
      <Separator className={"mt-4"} />
      <p className={"text-sm opacity-30 mt-4"}>Privacy</p>
      {privacySettingsOptions().map((option) => (
        <SettingsCard
          key={option.title}
          prefix={option.icon}
          title={option.title}
          isSelected={currentSelectedSettingOption().title === option.title}
          onClick={() => handleSelectOption(option.title)}
        />
      ))}
      <Separator className={"mt-4"} />
      <p className={"text-sm opacity-30 mt-4"}>Support</p>
      {supportSettingsOptions().map((option) => (
        <SettingsCard
          key={option.title}
          prefix={option.icon}
          title={option.title}
          isSelected={currentSelectedSettingOption().title === option.title}
          onClick={() => handleSelectOption(option.title)}
        />
      ))}
    </div>
  );
};
