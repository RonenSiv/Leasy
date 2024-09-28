"use client";

import { useSettings } from "@/providers/settings-provider";

export const SettingsContent = () => {
  const { contentOfSelectedOption } = useSettings();
  return (
    <div className="flex flex-1 w-full h-full px-4">
      {contentOfSelectedOption() || <div>Settings content</div>}
    </div>
  );
};
